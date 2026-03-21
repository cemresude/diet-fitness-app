import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { createError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Token bulunamadı', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      throw createError('Geçersiz token', 401, 'UNAUTHORIZED');
    }
  } catch (error) {
    next(error);
  }
};

// Opsiyonel auth - token varsa kullan, yoksa devam et
export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        req.userId = decoded.userId;
      } catch (jwtError) {
        // Token geçersiz ama opsiyonel olduğu için devam et
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
