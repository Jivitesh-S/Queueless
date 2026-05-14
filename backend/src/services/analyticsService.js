import Analytics from '../models/Analytics.js';

export const recordTokenOutcome = async (queue, token, outcome) => {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  const waitMinutes = token.calledAt ? Math.max(0, Math.round((token.calledAt - token.createdAt) / 60000)) : 0;

  const update = {
    $inc: {
      tokensServed: outcome === 'served' ? 1 : 0,
      noShows: outcome === 'no-show' ? 1 : 0,
      skipped: outcome === 'skipped' ? 1 : 0,
      emergencyTokens: token.priority === 'emergency' ? 1 : 0
    },
    $set: { branchId: queue.branchId }
  };

  const doc = await Analytics.findOneAndUpdate(
    { queue: queue._id, date, hour: date.getHours() },
    update,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (outcome === 'served') {
    const servedCount = Math.max(1, doc.tokensServed);
    doc.averageWaitTime = Math.round((doc.averageWaitTime * (servedCount - 1) + waitMinutes) / servedCount);
    await doc.save();
  }
};

export const getQueueAnalytics = async (queueId) => {
  const rows = await Analytics.find({ queue: queueId }).sort({ date: -1, hour: 1 }).limit(72);
  const totals = rows.reduce(
    (acc, row) => {
      acc.tokensServed += row.tokensServed;
      acc.noShows += row.noShows;
      acc.skipped += row.skipped;
      acc.averageWaitTime += row.averageWaitTime;
      return acc;
    },
    { tokensServed: 0, noShows: 0, skipped: 0, averageWaitTime: 0 }
  );

  totals.averageWaitTime = rows.length ? Math.round(totals.averageWaitTime / rows.length) : 0;
  return { rows, totals };
};
