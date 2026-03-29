import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { collections } from '../config/firebase';
import { config } from '../config';
import { AuthRequest, createError } from '../middleware';
import { User, toUserProfile } from '../models/User';

export const userController = {
  // Kullanıcı kaydı
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, name } = req.body;
      const rawEmail = String(req.body.email || '').trim();
      const normalizedEmail = rawEmail.toLowerCase();

      if (!normalizedEmail) {
        throw createError('Geçerli bir e-posta adresi giriniz', 400, 'VALIDATION_ERROR');
      }

      // E-posta kontrolü
      const existingByLower = await collections.users
        .where('emailLower', '==', normalizedEmail)
        .limit(1)
        .get();

      let existingByEmail = existingByLower;
      if (existingByEmail.empty) {
        existingByEmail = await collections.users
          .where('email', '==', normalizedEmail)
          .limit(1)
          .get();
      }

      if (existingByEmail.empty && rawEmail !== normalizedEmail) {
        existingByEmail = await collections.users
          .where('email', '==', rawEmail)
          .limit(1)
          .get();
      }

      if (!existingByEmail.empty) {
        throw createError('Bu e-posta adresi zaten kullanılıyor', 400, 'EMAIL_EXISTS');
      }

      // Şifreyi hashle
      const passwordHash = await bcrypt.hash(password, 10);

      // Kullanıcı oluştur
      const user: User = {
        id: uuidv4(),
        email: normalizedEmail,
        emailLower: normalizedEmail,
        name,
        passwordHash,
        allergies: [],
        injuries: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await collections.users.doc(user.id).set(user);

      // Token oluştur
      const token = jwt.sign(
        { userId: user.id }, 
        config.jwt.secret as string, {

        expiresIn: config.jwt.expiresIn as any,
      });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: toUserProfile(user),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Kullanıcı girişi
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;
      const rawEmail = String(req.body.email || '').trim();
      const normalizedEmail = rawEmail.toLowerCase();

      // Kullanıcıyı bul
      let snapshot = await collections.users
        .where('emailLower', '==', normalizedEmail)
        .limit(1)
        .get();

      if (snapshot.empty) {
        snapshot = await collections.users
          .where('email', '==', normalizedEmail)
          .limit(1)
          .get();
      }

      if (snapshot.empty && rawEmail !== normalizedEmail) {
        snapshot = await collections.users
          .where('email', '==', rawEmail)
          .limit(1)
          .get();
      }

      if (snapshot.empty) {
        throw createError('E-posta veya şifre hatalı', 401, 'INVALID_CREDENTIALS');
      }

      const userData = snapshot.docs[0].data();
      const user: User = {
        ...userData,
        createdAt: userData.createdAt?.toDate(),
        updatedAt: userData.updatedAt?.toDate(),
      } as User;

      // Şifre kontrolü
      let isValidPassword = false;
      const passwordHash = (userData as any).passwordHash;
      const legacyPassword = (userData as any).password;

      if (typeof passwordHash === 'string' && passwordHash.length > 0) {
        isValidPassword = await bcrypt.compare(password, passwordHash);
      } else if (typeof legacyPassword === 'string' && legacyPassword.length > 0) {
        // Legacy düz metin şifreli kayıtlarla geriye dönük uyumluluk
        isValidPassword = password === legacyPassword;
      }

      if (!isValidPassword) {
        throw createError('E-posta veya şifre hatalı', 401, 'INVALID_CREDENTIALS');
      }

      // Legacy kullanıcıyı başarılı girişte şifre hash + emailLower alanına taşı
      if (!(typeof passwordHash === 'string' && passwordHash.length > 0)) {
        const migratedHash = await bcrypt.hash(password, 10);
        await collections.users.doc(user.id).update({
          passwordHash: migratedHash,
          email: normalizedEmail,
          emailLower: normalizedEmail,
          updatedAt: new Date(),
        });
        user.passwordHash = migratedHash;
        user.email = normalizedEmail;
      }

      // Token oluştur
      const token = jwt.sign({ userId: user.id }, config.jwt.secret as string, {
        expiresIn: config.jwt.expiresIn as any,
      });

      res.json({
        success: true,
        data: {
          token,
          user: toUserProfile(user),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Profil getir
  getProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw createError('Kullanıcı bulunamadı', 401, 'UNAUTHORIZED');
      }

      const doc = await collections.users.doc(userId).get();
      if (!doc.exists) {
        throw createError('Kullanıcı bulunamadı', 404, 'NOT_FOUND');
      }

      const userData = doc.data();
      const user: User = {
        ...userData,
        createdAt: userData?.createdAt?.toDate(),
        updatedAt: userData?.updatedAt?.toDate(),
      } as User;

      res.json({
        success: true,
        data: toUserProfile(user),
      });
    } catch (error) {
      next(error);
    }
  },

  // Profil güncelle
  updateProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw createError('Kullanıcı bulunamadı', 401, 'UNAUTHORIZED');
      }

      const { age, weight, height, goal, allergies, injuries } = req.body;

      const updateData: Partial<User> = {
        updatedAt: new Date(),
      };

      if (age !== undefined) updateData.age = age;
      if (weight !== undefined) updateData.weight = weight;
      if (height !== undefined) updateData.height = height;
      if (goal !== undefined) updateData.goal = goal;
      if (allergies !== undefined) updateData.allergies = allergies;
      if (injuries !== undefined) updateData.injuries = injuries;

      await collections.users.doc(userId).update(updateData);

      // Güncellenmiş profili getir
      const doc = await collections.users.doc(userId).get();
      const userData = doc.data();
      const user: User = {
        ...userData,
        createdAt: userData?.createdAt?.toDate(),
        updatedAt: userData?.updatedAt?.toDate(),
      } as User;

      res.json({
        success: true,
        data: toUserProfile(user),
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
