import Queue from '../models/Queue.js';
import Token from '../models/Token.js';
import { AppError } from '../utils/errors.js';
import { buildTokenNumber } from '../utils/tokens.js';
import { buildQueueSnapshot, calculateEtaForToken, recalculateQueueEtas } from './etaService.js';
import { notifyNearbyTokens, notifyTurnArrived } from './notificationService.js';
import { recordTokenOutcome } from './analyticsService.js';
import { emitQueueUpdate } from './socketBus.js';

export const createQueue = async (payload) => Queue.create(payload);

export const joinQueue = async ({ queueId, customerName, phone, purpose = 'General visit', joinType = 'walk-in', appointmentAt, priority = 'normal' }) => {
  const queue = await Queue.findById(queueId).populate('department');
  if (!queue || queue.status !== 'active') throw new AppError('Queue is not available', 404);

  const sequence = queue.nextSequence;
  queue.nextSequence += 1;
  await queue.save();

  const token = await Token.create({
    queue: queue._id,
    department: queue.department._id,
    tokenNumber: buildTokenNumber(queue.prefix, sequence),
    sequence,
    customerName,
    phone,
    purpose,
    joinType,
    appointmentAt,
    priority
  });

  await calculateEtaForToken(queue, token);
  await recalculateQueueEtas(queue);
  emitQueueUpdate(queue._id.toString(), await buildQueueSnapshot(queue));
  return token;
};

export const callNextToken = async (queueId) => {
  const queue = await Queue.findById(queueId);
  if (!queue) throw new AppError('Queue not found', 404);

  const token = await Token.findOne({ queue: queue._id, status: 'waiting' }).sort({ priorityRank: 1, sequence: 1 });
  if (!token) throw new AppError('No waiting tokens', 400);

  token.status = 'called';
  token.calledAt = new Date();
  await token.save();
  queue.currentToken = token._id;
  await queue.save();

  await notifyTurnArrived(queue, token);
  await notifyNearbyTokens(queue);
  await recalculateQueueEtas(queue);
  emitQueueUpdate(queue._id.toString(), await buildQueueSnapshot(queue));
  return token;
};

export const updateTokenStatus = async (queueId, tokenId, status) => {
  const queue = await Queue.findById(queueId);
  const token = await Token.findById(tokenId);
  if (!queue || !token) throw new AppError('Queue or token not found', 404);
  const terminalStatuses = ['served', 'skipped', 'no-show', 'cancelled'];

  token.status = status;
  if (status === 'served') token.servedAt = new Date();
  if (status === 'skipped') token.skippedAt = new Date();
  if (status === 'held') token.heldAt = new Date();
  if (status === 'called') token.calledAt = new Date();
  await token.save();

  if (['served', 'skipped', 'no-show'].includes(status)) await recordTokenOutcome(queue, token, status);
  if (status === 'called') queue.currentToken = token._id;
  if (terminalStatuses.includes(status) && queue.currentToken?.toString() === token._id.toString()) {
    queue.currentToken = null;
  }
  await queue.save();

  if (terminalStatuses.includes(status)) {
    await Token.deleteOne({ _id: token._id });
  }

  await recalculateQueueEtas(queue);
  emitQueueUpdate(queue._id.toString(), await buildQueueSnapshot(queue));
  return token;
};

export const recallToken = (queueId, tokenId) => updateTokenStatus(queueId, tokenId, 'called');
