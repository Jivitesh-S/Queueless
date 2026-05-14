import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token', required: true },
    queue: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true },
    channel: { type: String, enum: ['sms', 'whatsapp'], default: 'sms' },
    recipient: { type: String, required: true },
    type: { type: String, enum: ['five-away', 'turn-arrived', 'delay', 'recall'], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['queued', 'sent', 'failed'], default: 'queued' },
    providerResponse: Object
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
