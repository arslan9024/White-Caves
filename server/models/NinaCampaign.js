import mongoose from 'mongoose';

const ninaCampaignSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  projectId: {
    type: Number,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'ready', 'running', 'paused', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true
  },
  settings: {
    minDelay: { type: Number, default: 120000 },
    maxDelay: { type: Number, default: 300000 },
    shiftStart: { type: Number, default: 8 },
    shiftEnd: { type: Number, default: 19 },
    speed: { type: Number, default: 1 },
    skipExistingChats: { type: Boolean, default: true },
    respectBlocklist: { type: Boolean, default: true }
  },
  stats: {
    total: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
    blocked: { type: Number, default: 0 }
  },
  numbersCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startedAt: Date,
  completedAt: Date,
  lastActivity: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ninaCampaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

ninaCampaignSchema.statics.getActive = function() {
  return this.find({ status: { $in: ['pending', 'ready', 'running', 'paused'] } })
    .sort({ createdAt: -1 });
};

ninaCampaignSchema.statics.getHistory = function(limit = 50) {
  return this.find({ status: { $in: ['completed', 'cancelled'] } })
    .sort({ completedAt: -1 })
    .limit(limit);
};

ninaCampaignSchema.statics.getStats = async function() {
  const active = await this.countDocuments({ status: { $in: ['pending', 'ready', 'running', 'paused'] } });
  const completed = await this.countDocuments({ status: 'completed' });
  
  const aggregated = await this.aggregate([
    { $match: { status: 'completed' } },
    { $group: {
      _id: null,
      totalSent: { $sum: '$stats.sent' },
      totalFailed: { $sum: '$stats.failed' },
      totalSkipped: { $sum: '$stats.skipped' }
    }}
  ]);

  const totals = aggregated[0] || { totalSent: 0, totalFailed: 0, totalSkipped: 0 };

  return {
    activeCampaigns: active,
    completedCampaigns: completed,
    ...totals
  };
};

export default mongoose.model('NinaCampaign', ninaCampaignSchema);
