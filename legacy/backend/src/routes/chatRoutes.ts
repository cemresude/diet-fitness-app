import { Router } from 'express';
import { chatController } from '../controllers';
import { optionalAuthMiddleware, chatMessageValidation } from '../middleware';

const router = Router();

// Yeni oturum başlat
router.post('/start', optionalAuthMiddleware, chatController.startSession);

// Mesaj gönder
router.post('/message', optionalAuthMiddleware, chatMessageValidation, chatController.sendMessage);

// Sohbet geçmişi
router.get('/history/:sessionId', optionalAuthMiddleware, chatController.getHistory);

// Oturumu sonlandır
router.post('/end/:sessionId', optionalAuthMiddleware, chatController.endSession);

export default router;
