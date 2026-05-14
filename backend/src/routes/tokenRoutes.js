import { Router } from 'express';
import { getToken, join, next, notify, recall, setStatus } from '../controllers/tokenController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.post('/join', requireFields('queueId', 'customerName', 'phone'), join);
router.get('/:id', getToken);
router.post('/:queueId/next', protect, authorize('admin', 'staff'), next);
router.patch('/:queueId/:tokenId/status', protect, authorize('admin', 'staff'), requireFields('status'), setStatus);
router.post('/:queueId/:tokenId/recall', protect, authorize('admin', 'staff'), recall);
router.post('/:queueId/:tokenId/notify', protect, authorize('admin', 'staff'), notify);

export default router;
