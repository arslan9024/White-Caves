/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const paymentPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  downPayment: { type: Number, required: true },
  duringConstruction: { type: Number, required: true },
  onHandover: { type: Number, required: true },
  postHandover: { type: Number, default: 0 },
  postHandoverMonths: { type: Number, default: 0 },
  notes: String
});

const constructionProgressSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  phase: { type: String },
  description: String,
  images: [String],
  verified: { type: Boolean, default: false }
});

const offPlanProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  developer: { type: String, required: true },
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
  
  location: {
    area: { type: String, required: true },
    community: String,
    subCommunity: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  reraPermitNumber: { type: String, required: true },
  reraExpiryDate: Date,
  oqoodId: String,
  escrowAccountNumber: String,
  escrowBankName: String,
  
  projectType: {
    type: String,
    enum: ['residential', 'commercial', 'mixed-use', 'hotel-apartment'],
    required: true
  },
  
  propertyTypes: [{
    type: String,
    enum: ['apartment', 'villa', 'townhouse', 'penthouse', 'duplex', 'studio', 'office', 'retail']
  }],
  
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, default: 0 },
  soldUnits: { type: Number, default: 0 },
  reservedUnits: { type: Number, default: 0 },
  
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'AED' }
  },
  
  sizeRange: {
    min: { type: Number },
    max: { type: Number },
    unit: { type: String, default: 'sqft' }
  },
  
  bedrooms: {
    min: { type: Number, default: 0 },
    max: { type: Number }
  },
  
  launchDate: Date,
  estimatedHandover: Date,
  actualHandover: Date,
  
  constructionStatus: {
    type: String,
    enum: ['announced', 'pre-launch', 'under-construction', 'near-completion', 'completed', 'handed-over'],
    default: 'announced'
  },
  
  constructionProgress: [constructionProgressSchema],
  currentProgress: { type: Number, default: 0, min: 0, max: 100 },
  
  paymentPlans: [paymentPlanSchema],
  
  amenities: [String],
  features: [String],
  
  brochureUrl: String,
  floorPlansUrl: String,
  virtualTourUrl: String,
  websiteUrl: String,
  
  images: [{
    url: String,
    caption: String,
    type: { type: String, enum: ['exterior', 'interior', 'amenity', 'floor-plan', 'render'] }
  }],
  
  description: String,
  descriptionAr: String,
  highlights: [String],
  
  serviceChargePerSqft: Number,
  
  isFreehold: { type: Boolean, default: true },
  
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
  
  status: {
    type: String,
    enum: ['draft', 'pending-review', 'active', 'sold-out', 'on-hold', 'archived'],
    default: 'draft'
  },
  
  featured: { type: Boolean, default: false },
  priority: { type: Number, default: 0 },
  
  seoTitle: String,
  seoDescription: String,
  slug: String,
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
}, { timestamps: true });

offPlanProjectSchema.index({ 'location.area': 1, constructionStatus: 1 });
offPlanProjectSchema.index({ developer: 1 });
offPlanProjectSchema.index({ reraPermitNumber: 1 });
offPlanProjectSchema.index({ priceRange: 1 });
offPlanProjectSchema.index({ status: 1, featured: -1, priority: -1 });

offPlanProjectSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  this.availableUnits = this.totalUnits - this.soldUnits - this.reservedUnits;
  
  next();
});

export default mongoose.model('OffPlanProject', offPlanProjectSchema);
