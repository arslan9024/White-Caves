import mongoose from 'mongoose';

const HomepageFeatureSchema = new mongoose.Schema({
  dateActive: {
    type: Date,
    required: true
  },
  featuredProperties: [{
    propertyRef: String,
    pNumber: String,
    title: String,
    propertyType: String,
    area: String,
    project: String,
    askingPrice: Number,
    currency: { type: String, default: 'AED' },
    rooms: Number,
    actualArea: Number,
    status: String,
    purpose: String,
    images: [String],
    score: Number,
    scoreBreakdown: {
      inquiriesScore: Number,
      viewsScore: Number,
      qualityScore: Number,
      newListingBonus: Number
    }
  }],
  totalAvailable: Number,
  selectionMethod: {
    type: String,
    enum: ['random', 'scored', 'manual'],
    default: 'scored'
  },
  generatedBy: {
    type: String,
    default: 'Olivia_AI_Assistant'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

HomepageFeatureSchema.index({ dateActive: 1 }, { unique: true });
HomepageFeatureSchema.index({ isActive: 1, dateActive: -1 });

HomepageFeatureSchema.statics.getTodaysFeatured = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.findOne({
    dateActive: { $gte: today, $lt: tomorrow },
    isActive: true
  });
};

HomepageFeatureSchema.statics.getMostRecent = async function() {
  return this.findOne({ isActive: true }).sort({ dateActive: -1 });
};

const HomepageFeature = mongoose.model('HomepageFeature', HomepageFeatureSchema);
export default HomepageFeature;
