import { Router } from 'express';
import { planController } from '../controllers';
import { authMiddleware, optionalAuthMiddleware, generatePlanValidation, planIdValidation } from '../middleware';

const router = Router();

// Plan oluştur
router.post('/', authMiddleware, generatePlanValidation, planController.generatePlan);
router.post('/generate', authMiddleware, generatePlanValidation, planController.generatePlan);

// Plan geçmişi
router.get('/', authMiddleware, planController.getPlanHistory);
router.get('/history', authMiddleware, planController.getPlanHistory);

// Plan getir
router.get('/:planId', authMiddleware, planIdValidation, planController.getPlan);

// PDF indir
router.get('/:planId/pdf', authMiddleware, planIdValidation, planController.downloadPDF);

// Takvime aktar
router.post('/:planId/export-calendar', authMiddleware, planIdValidation, planController.exportToCalendar);

export default router;
