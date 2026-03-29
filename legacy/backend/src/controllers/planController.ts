import { Response, NextFunction } from 'express';
import { planGenerator } from '../services';
import { AuthRequest, createError } from '../middleware';
import { toPlanResponse } from '../models/Plan';

export const planController = {
  // Plan oluştur
  generatePlan: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw createError('Kullanıcı bulunamadı', 401, 'UNAUTHORIZED');
      }

      const { userProfile } = req.body;

      const plan = await planGenerator.generatePlan(userId, {
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
        goal: userProfile.goal,
        allergies: userProfile.allergies || [],
        injuries: userProfile.injuries || [],
      });

      res.status(201).json({
        success: true,
        data: toPlanResponse(plan),
      });
    } catch (error) {
      console.error('[PLAN_CONTROLLER][generatePlan] failed', {
        userId: req.userId,
        body: req.body,
        error,
      });
      next(error);
    }
  },

  // Plan getir
  getPlan: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;

      const plan = await planGenerator.getPlan(planId);

      if (!plan) {
        throw createError('Plan bulunamadı', 404, 'NOT_FOUND');
      }

      res.json({
        success: true,
        data: toPlanResponse(plan),
      });
    } catch (error) {
      next(error);
    }
  },

  // Plan geçmişi
  getPlanHistory: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw createError('Kullanıcı bulunamadı', 401, 'UNAUTHORIZED');
      }

      const plans = await planGenerator.getUserPlans(userId);

      res.json({
        success: true,
        data: plans.map(toPlanResponse),
      });
    } catch (error) {
      next(error);
    }
  },

  // PDF olarak indir (placeholder)
  downloadPDF: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;

      // TODO: PDF oluşturma implementasyonu
      res.json({
        success: true,
        data: {
          message: 'PDF indirme özelliği yakında eklenecek',
          planId,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Takvime aktar (placeholder)
  exportToCalendar: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { planId } = req.params;

      // TODO: ICS dosyası oluşturma implementasyonu
      res.json({
        success: true,
        data: {
          message: 'Takvim aktarma özelliği yakında eklenecek',
          planId,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

export default planController;
