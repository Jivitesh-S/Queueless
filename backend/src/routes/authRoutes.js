import { Router } from 'express';
import { login, me, signup } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.post('/signup', authLimiter, requireFields('name', 'email', 'password'), signup);
router.post('/login', authLimiter, requireFields('email', 'password'), login);
router.get('/me', protect, me);

export default router;
