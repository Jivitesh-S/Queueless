import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    queue: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    tokenNumber: { type: String, required: true },
    sequence: { type: Number, required: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    purpose: { type: String, trim: true, default: 'General visit' },
    joinType: { type: String, enum: ['walk-in', 'appointment', 'qr'], default: 'walk-in' },
    appointmentAt: Date,
    status: {
      type: String,
      enum: ['waiting', 'called', 'serving', 'served', 'skipped', 'held', 'cancelled', 'no-show'],
      default: 'waiting'
    },
    priority: { type: String, enum: ['normal', 'emergency'], default: 'normal' },
    priorityRank: { type: Number, default: 1 },
    etaMinutes: { type: Number, default: 0 },
    confidence: { type: Number, default: 0.82 },
    calledAt: Date,
    servedAt: Date,
    heldAt: Date,
    skippedAt: Date
  },
  { timestamps: true }
);

tokenSchema.pre('validate', function setPriorityRank(next) {
  this.priorityRank = this.priority === 'emergency' ? 0 : 1;
  next();
});

tokenSchema.index({ queue: 1, status: 1, sequence: 1 });
tokenSchema.index({ tokenNumber: 1, queue: 1 }, { unique: true });

export default mongoose.model('Token', tokenSchema);
