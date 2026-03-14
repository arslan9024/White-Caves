import mongoose from 'mongoose';

const savedSearchSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true },
  filters: {
    search: String,
    minPrice: Number,
    maxPrice: Number,
    beds: Number,
    baths: Number,
    propertyTypes: [String],
    locations: [String],
    amenities: [String],
    minSqft: Number,
    maxSqft: Number,
    sortBy: String
  },
  alertEnabled: { type: Boolean, default: false },
  alertFrequency: { 
    type: String, 
    enum: ['immediate', 'daily', 'weekly'], 
    default: 'daily' 
  },
  lastAlertSent: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

savedSearchSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('SavedSearch', savedSearchSchema);
