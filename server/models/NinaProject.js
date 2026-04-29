import mongoose from 'mongoose';

const ninaProjectSchema = new mongoose.Schema({
  projectId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sheetId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['cluster', 'campaign', 'combined', 'system'],
    default: 'cluster'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  columnConfig: {
    phone: { type: Number, default: 5 },
    mobile: { type: Number, default: 7 },
    secondary: { type: Number, default: 8 },
    name: { type: Number, default: 1 },
    cluster: { type: Number, default: 2 },
    unit: { type: Number, default: 3 }
  },
  stats: {
    lastSynced: Date,
    totalRows: { type: Number, default: 0 },
    validNumbers: { type: Number, default: 0 },
    invalidNumbers: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ninaProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

ninaProjectSchema.statics.getBlocklist = function() {
  return this.findOne({ category: 'system', name: 'Blocklist' });
};

ninaProjectSchema.statics.getClusters = function() {
  return this.find({ category: 'cluster', isActive: true });
};

ninaProjectSchema.statics.getCampaigns = function() {
  return this.find({ category: 'campaign', isActive: true });
};

export default mongoose.model('NinaProject', ninaProjectSchema);
