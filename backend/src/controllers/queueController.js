import Department from '../models/Department.js';
import Queue from '../models/Queue.js';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';
import { buildQueueSnapshot } from '../services/etaService.js';
import { createQueue } from '../services/queueService.js';

export const listQueues = asyncHandler(async (_req, res) => {
  const queues = await Queue.find({ status: { $ne: 'closed' } }).populate('department').sort({ createdAt: -1 });
  res.json({ queues });
});

export const getQueue = asyncHandler(async (req, res) => {
  const queue = await Queue.findById(req.params.id).populate('department');
  if (!queue) throw new AppError('Queue not found', 404);
  res.json(await buildQueueSnapshot(queue));
});

export const addQueue = asyncHandler(async (req, res) => {
  const queue = await createQueue(req.body);
  await queue.populate('department');
  res.status(201).json({ queue });
});

export const listDepartments = asyncHandler(async (_req, res) => {
  const departments = await Department.find({ isActive: true }).sort({ name: 1 });
  res.json({ departments });
});

export const addDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ department });
});
