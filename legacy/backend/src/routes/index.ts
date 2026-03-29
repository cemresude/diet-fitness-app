import { Router } from 'express';
import chatRoutes from './chatRoutes';
import userRoutes from './userRoutes';
import planRoutes from './planRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// API routes
router.use('/chat', chatRoutes);
router.use('/users', userRoutes);
router.use('/plan', planRoutes);
router.use('/plans', planRoutes);

export default router;
