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
      const { email, password, name } = req.body;

      // E-posta kontrolü
      const existingUser = await collections.users.where('email', '==', email).get();
      if (!existingUser.empty) {
        throw createError('Bu e-posta adresi zaten kullanılıyor', 400, 'EMAIL_EXISTS');
      }

      // Şifreyi hashle
      const passwordHash = await bcrypt.hash(password, 10);

      // Kullanıcı oluştur
      const user: User = {
        id: uuidv4(),
        email,
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
      const { email, password } = req.body;

      // Kullanıcıyı bul
      const snapshot = await collections.users.where('email', '==', email).get();
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
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        throw createError('E-posta veya şifre hatalı', 401, 'INVALID_CREDENTIALS');
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
