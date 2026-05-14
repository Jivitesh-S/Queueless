import Token from '../models/Token.js';

export const calculateEtaForToken = async (queue, token) => {
  const statuses = ['waiting', 'held', 'called', 'serving'];
  const aheadQuery = {
    queue: queue._id,
    _id: { $ne: token._id },
    status: { $in: statuses },
    $or: [
      { priorityRank: { $lt: token.priorityRank } },
      { priorityRank: token.priorityRank, sequence: { $lt: token.sequence } }
    ]
  };

  const ahead = await Token.countDocuments(aheadQuery);
  const serviceTime = queue.averageServiceTime || 8;
  const delayFactor = token.priority === 'emergency' ? 0.35 : 1;
  const etaMinutes = Math.max(0, Math.round(ahead * serviceTime * delayFactor));
  const confidence = Math.max(0.62, Math.min(0.94, 0.9 - ahead * 0.01));

  token.etaMinutes = etaMinutes;
  token.confidence = Number(confidence.toFixed(2));
  await token.save();
  return { etaMinutes, confidence: token.confidence };
};

export const recalculateQueueEtas = async (queue) => {
  const tokens = await Token.find({ queue: queue._id, status: { $in: ['waiting', 'held'] } }).sort({
    priorityRank: 1,
    sequence: 1
  });

  await Promise.all(tokens.map((token) => calculateEtaForToken(queue, token)));
};

export const buildQueueSnapshot = async (queue) => {
  const [current, waiting, held, recent] = await Promise.all([
    Token.findById(queue.currentToken),
    Token.find({ queue: queue._id, status: 'waiting' }).sort({ priorityRank: 1, sequence: 1 }).limit(12),
    Token.countDocuments({ queue: queue._id, status: 'held' }),
    Token.find({ queue: queue._id }).sort({ updatedAt: -1 }).limit(8)
  ]);

  return {
    queue,
    current,
    waiting,
    held,
    recent,
    waitingCount: await Token.countDocuments({ queue: queue._id, status: 'waiting' })
  };
};
