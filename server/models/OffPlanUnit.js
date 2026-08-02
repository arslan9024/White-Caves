/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const offPlanUnitSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'OffPlanProject',
    required: true 
  },
  
  unitNumber: { type: String, required: true },
  plotNumber: String,
  buildingName: String,
  floor: { type: Number },
  
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'townhouse', 'penthouse', 'duplex', 'studio', 'office', 'retail'],
    required: true
  },
  
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number },
  parkingSpaces: { type: Number, default: 0 },
  
  size: {
    builtUp: { type: Number, required: true },
    balcony: { type: Number, default: 0 },
    terrace: { type: Number, default: 0 },
    garden: { type: Number, default: 0 },
    total: { type: Number }
  },
  
  price: { type: Number, required: true },
  pricePerSqft: Number,
  
  view: String,
  aspects: [String],
  
  floorPlanUrl: String,
  images: [String],
  
  oqoodId: String,
  escrowReceiptNumber: String,
  titleDeedNumber: String,
  
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold', 'blocked', 'handed-over'],
    default: 'available'
  },
  
  reservationDate: Date,
  reservationExpiry: Date,
  saleDate: Date,
  handoverDate: Date,
  
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: String,
  buyerEmail: String,
  buyerPhone: String,
  
  paymentPlan: {
    planId: String,
    downPaymentAmount: Number,
    downPaymentPaid: { type: Boolean, default: false },
    downPaymentDate: Date,
    constructionPayments: [{
      amount: Number,
      dueDate: Date,
      paidDate: Date,
      status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
    }],
    handoverPaymentAmount: Number,
    handoverPaymentPaid: { type: Boolean, default: false },
    postHandoverPayments: [{
      amount: Number,
      dueDate: Date,
      paidDate: Date,
      status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' }
    }]
  },
  
  totalPaid: { type: Number, default: 0 },
  outstandingBalance: { type: Number },
  
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  notes: String,
  internalNotes: String,
  
  featured: { type: Boolean, default: false },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
}, { timestamps: true });

offPlanUnitSchema.index({ projectId: 1, status: 1 });
offPlanUnitSchema.index({ unitNumber: 1 });
offPlanUnitSchema.index({ propertyType: 1, bedrooms: 1 });
offPlanUnitSchema.index({ price: 1 });
offPlanUnitSchema.index({ buyer: 1 });

offPlanUnitSchema.pre('save', function(next) {
  if (this.size.builtUp) {
    this.size.total = this.size.builtUp + (this.size.balcony || 0) + 
                      (this.size.terrace || 0) + (this.size.garden || 0);
  }
  
  if (this.price && this.size.builtUp) {
    this.pricePerSqft = Math.round(this.price / this.size.builtUp);
  }
  
  this.outstandingBalance = this.price - (this.totalPaid || 0);
  
  next();
});

export default mongoose.model('OffPlanUnit', offPlanUnitSchema);
