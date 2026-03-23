import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

// Validation sonuçlarını kontrol et
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createError(
      errors.array()[0].msg,
      400,
      'VALIDATION_ERROR'
    );
    return next(error);
  }
  next();
};

// User validasyonları
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('İsim en az 2 karakter olmalıdır'),
  validate,
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .notEmpty()
    .withMessage('Şifre gereklidir'),
  validate,
];

// Chat validasyonları
export const chatMessageValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID gereklidir'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Mesaj 1-500 karakter arasında olmalıdır'),
  validate,
];

// Plan validasyonları
export const generatePlanValidation = [
  body('userProfile.age')
    .isInt({ min: 10, max: 120 })
    .withMessage('Yaş 10-120 arasında olmalıdır'),
  body('userProfile.weight')
    .isFloat({ min: 20, max: 300 })
    .withMessage('Kilo 20-300 kg arasında olmalıdır'),
  body('userProfile.height')
    .isInt({ min: 100, max: 250 })
    .withMessage('Boy 100-250 cm arasında olmalıdır'),
  body('userProfile.goal')
    .isIn(['weight_loss', 'weight_gain', 'muscle_building', 'maintenance'])
    .withMessage('Geçersiz hedef'),
  body('userProfile.allergies')
    .optional()
    .isArray()
    .withMessage('Alerjiler bir dizi olmalıdır'),
  body('userProfile.injuries')
    .optional()
    .isArray()
    .withMessage('Sakatlıklar bir dizi olmalıdır'),
  validate,
];

export const planIdValidation = [
  param('planId')
    .notEmpty()
    .withMessage('Plan ID gereklidir'),
  validate,
];
