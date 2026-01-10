import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'referral', 'walk-in', 'social-media', 'property-finder', 'bayut', 'dubizzle', 'other'],
    default: 'website'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'],
    default: 'new',
    index: true
  },
  stage: {
    type: String,
    enum: ['inquiry', 'viewing-scheduled', 'viewing-completed', 'offer-made', 'negotiation', 'documentation', 'closed'],
    default: 'inquiry'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  propertyInterest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryProperty'
  },
  propertyType: {
    type: String,
    enum: ['villa', 'townhouse', 'apartment', 'plot', 'penthouse', 'duplex', 'studio', 'any'],
    default: 'any'
  },
  budget: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'AED' }
  },
  preferredLocations: [String],
  assignedAgent: {
    id: String,
    name: String
  },
  notes: String,
  lastContactDate: Date,
  nextFollowUp: Date,
  tags: [String],
  interactions: [{
    type: { type: String, enum: ['call', 'email', 'whatsapp', 'meeting', 'viewing', 'note'] },
    summary: String,
    outcome: String,
    date: { type: Date, default: Date.now },
    agentId: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  convertedAt: Date,
  lostReason: String
}, {
  timestamps: true
});

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ score: -1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ 'assignedAgent.id': 1 });

LeadSchema.statics.getLeadsByStatus = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
};

LeadSchema.statics.getLeadsBySource = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$source', count: { $sum: 1 } } }
  ]);
};

LeadSchema.statics.getConversionRate = async function() {
  const total = await this.countDocuments({ isActive: true });
  const converted = await this.countDocuments({ status: 'converted', isActive: true });
  return total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
};

LeadSchema.statics.getAverageScore = function() {
  return this.aggregate([
    { $match: { isActive: true, score: { $gt: 0 } } },
    { $group: { _id: null, avgScore: { $avg: '$score' } } }
  ]);
};

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;
