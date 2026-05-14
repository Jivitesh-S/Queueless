import { Router } from 'express';
import { addDepartment, addQueue, getQueue, listDepartments, listQueues } from '../controllers/queueController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.get('/', listQueues);
router.post('/', protect, authorize('admin'), requireFields('name', 'department'), addQueue);
router.get('/departments', protect, listDepartments);
router.post('/departments', protect, authorize('admin'), requireFields('name', 'code'), addDepartment);
router.get('/:id', getQueue);

export default router;
