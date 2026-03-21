import { Router } from 'express';
import { userController } from '../controllers';
import { authMiddleware, registerValidation, loginValidation } from '../middleware';

const router = Router();

// Kayıt
router.post('/register', registerValidation, userController.register);

// Giriş
router.post('/login', loginValidation, userController.login);

// Profil getir
router.get('/profile', authMiddleware, userController.getProfile);

// Profil güncelle
router.put('/profile', authMiddleware, userController.updateProfile);

export default router;
