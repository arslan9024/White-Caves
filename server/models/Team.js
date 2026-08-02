/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  description: {
    type: String
  },
  lead: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    title: String
  },
  members: [{
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    role: String,
    joinedAt: Date
  }],
  aiAssistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIAssistant',
    default: null
  },
  responsibilities: [String],
  projects: [{
    name: String,
    status: {
      type: String,
      enum: ['planning', 'active', 'on_hold', 'completed'],
      default: 'planning'
    },
    startDate: Date,
    endDate: Date
  }],
  kpis: [{
    name: String,
    target: Number,
    current: Number,
    unit: String
  }],
  status: {
    type: String,
    enum: ['active', 'forming', 'disbanded'],
    default: 'active'
  },
  size: {
    current: { type: Number, default: 0 },
    capacity: { type: Number, default: 10 }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

TeamSchema.index({ name: 'text', description: 'text' });
TeamSchema.index({ department: 1 });
TeamSchema.index({ status: 1 });

export default mongoose.model('Team', TeamSchema);
