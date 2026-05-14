import { Router } from 'express';
import { analyticsOverview, queueAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/overview', protect, analyticsOverview);
router.get('/queues/:queueId', protect, queueAnalytics);

export default router;
