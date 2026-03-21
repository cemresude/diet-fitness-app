import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services';
import { AuthRequest } from '../middleware/auth';
import { toChatSessionResponse } from '../models/ChatSession';

export const chatController = {
  // Yeni oturum başlat
  startSession: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const session = await chatService.createSession(req.userId);
      
      res.status(201).json({
        success: true,
        data: {
          sessionId: session.id,
          message: session.messages[0]?.content || '',
          currentStep: session.currentStep,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Mesaj gönder
  sendMessage: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { sessionId, message } = req.body;

      const result = await chatService.processMessage(sessionId, message);

      res.json({
        success: true,
        data: {
          message: result.response,
          nextStep: result.nextStep,
          isComplete: result.isComplete,
          extractedData: result.collectedData,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Sohbet geçmişini getir
  getHistory: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;

      const session = await chatService.getSession(sessionId);

      if (!session) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Oturum bulunamadı',
          },
        });
      }

      res.json({
        success: true,
        data: toChatSessionResponse(session),
      });
    } catch (error) {
      next(error);
    }
  },

  // Oturumu sonlandır
  endSession: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;

      await chatService.endSession(sessionId);

      res.json({
        success: true,
        data: {
          message: 'Oturum sonlandırıldı',
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default chatController;
