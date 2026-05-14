import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    queue: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true },
    branchId: { type: String, default: 'main' },
    date: { type: Date, required: true },
    hour: { type: Number, min: 0, max: 23, required: true },
    tokensServed: { type: Number, default: 0 },
    averageWaitTime: { type: Number, default: 0 },
    noShows: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    emergencyTokens: { type: Number, default: 0 }
  },
  { timestamps: true }
);

analyticsSchema.index({ queue: 1, date: 1, hour: 1 }, { unique: true });

export default mongoose.model('Analytics', analyticsSchema);
