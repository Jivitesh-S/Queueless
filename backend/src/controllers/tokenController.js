import Token from '../models/Token.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { callNextToken, joinQueue, recallToken, updateTokenStatus } from '../services/queueService.js';
import Queue from '../models/Queue.js';
import { sendNotification } from '../services/notificationService.js';

export const join = asyncHandler(async (req, res) => {
  const token = await joinQueue(req.body);
  res.status(201).json({ token });
});

export const getToken = asyncHandler(async (req, res) => {
  const token = await Token.findById(req.params.id).populate('queue department');
  if (!token) throw new AppError('Token not found', 404);
  res.json({ token });
});

export const next = asyncHandler(async (req, res) => {
  const token = await callNextToken(req.params.queueId);
  res.json({ token });
});

export const setStatus = asyncHandler(async (req, res) => {
  const token = await updateTokenStatus(req.params.queueId, req.params.tokenId, req.body.status);
  res.json({ token });
});

export const recall = asyncHandler(async (req, res) => {
  const token = await recallToken(req.params.queueId, req.params.tokenId);
  res.json({ token });
});

export const notify = asyncHandler(async (req, res) => {
  const [queue, token] = await Promise.all([
    Queue.findById(req.params.queueId),
    Token.findById(req.params.tokenId)
  ]);
  if (!queue || !token) throw new AppError('Queue or token not found', 404);
  const type = req.body.type || 'five-away';
  const notification = await sendNotification({
    queue,
    token,
    type,
    channel: req.body.channel || 'sms',
    message: req.body.message || `QueueLess: ${token.tokenNumber}, your turn is coming soon. Please be ready near ${queue.name}.`
  });
  res.status(201).json({ notification });
});
