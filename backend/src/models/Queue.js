import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    branchId: { type: String, default: 'main' },
    prefix: { type: String, default: 'QL', uppercase: true },
    status: { type: String, enum: ['active', 'paused', 'closed'], default: 'active' },
    currentToken: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
    nextSequence: { type: Number, default: 1 },
    averageServiceTime: { type: Number, default: 8 },
    serviceWindows: [{ name: String, staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }]
  },
  { timestamps: true }
);

export default mongoose.model('Queue', queueSchema);
