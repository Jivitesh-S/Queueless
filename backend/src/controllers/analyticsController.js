import Queue from '../models/Queue.js';
import Token from '../models/Token.js';
import { asyncHandler } from '../utils/errors.js';
import { getQueueAnalytics } from '../services/analyticsService.js';

export const analyticsOverview = asyncHandler(async (_req, res) => {
  const [activeQueues, waitingCount, servedToday, noShows] = await Promise.all([
    Queue.countDocuments({ status: 'active' }),
    Token.countDocuments({ status: 'waiting' }),
    Token.countDocuments({ status: 'served', updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    Token.countDocuments({ status: 'no-show' })
  ]);

  res.json({ activeQueues, waitingCount, servedToday, noShows });
});

export const queueAnalytics = asyncHandler(async (req, res) => {
  res.json(await getQueueAnalytics(req.params.queueId));
});
