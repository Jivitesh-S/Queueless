import Notification from '../models/Notification.js';
import Token from '../models/Token.js';

const mockProvider = async ({ recipient, message, channel }) => ({
  id: `mock_${Date.now()}`,
  recipient,
  channel,
  message,
  accepted: true
});

export const sendNotification = async ({ token, queue, type, message, channel = 'sms' }) => {
  const notification = await Notification.create({
    token: token._id,
    queue: queue._id,
    channel,
    recipient: token.phone,
    type,
    message
  });

  const providerResponse = await mockProvider({ recipient: token.phone, message, channel });
  notification.status = 'sent';
  notification.providerResponse = providerResponse;
  await notification.save();
  return notification;
};

export const notifyNearbyTokens = async (queue) => {
  const waiting = await Token.find({ queue: queue._id, status: 'waiting' }).sort({ priorityRank: 1, sequence: 1 }).limit(6);
  const fiveAway = waiting[5];
  if (fiveAway) {
    await sendNotification({
      token: fiveAway,
      queue,
      type: 'five-away',
      message: `QueueLess: ${fiveAway.tokenNumber}, you are about 5 tokens away. Please stay nearby.`
    });
  }
};

export const notifyTurnArrived = (queue, token) =>
  sendNotification({
    token,
    queue,
    type: 'turn-arrived',
    channel: 'whatsapp',
    message: `QueueLess: ${token.tokenNumber}, it is your turn at ${queue.name}.`
  });
