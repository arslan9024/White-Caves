/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const salesDealSchema = new mongoose.Schema({
  dealNumber: {
    type: String,
    required: true,
    unique: true
  },
  dealType: {
    type: String,
    enum: ['off_plan', 'secondary', 'resale'],
    required: true
  },
  status: {
    type: String,
    enum: ['lead', 'qualified', 'viewing_scheduled', 'viewing_completed', 'offer_submitted', 'negotiation', 'offer_accepted', 'spa_preparation', 'spa_signed', 'noc_applied', 'noc_received', 'dld_transfer', 'completed', 'cancelled'],
    default: 'lead'
  },
  property: {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryProperty' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'OffPlanProject' },
    address: { type: String },
    area: { type: String },
    project: { type: String },
    developer: { type: String },
    propertyType: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    size: { type: Number },
    askingPrice: { type: Number },
    isOffPlan: { type: Boolean, default: false }
  },
  seller: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    emiratesId: { type: String },
    sellerType: { type: String, enum: ['individual', 'developer', 'company'], default: 'individual' }
  },
  buyer: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    phone: String,
    emiratesId: String,
    nationality: String,
    kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }
  },
  broker: {
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    name: String,
    email: String,
    phone: String,
    brnNumber: String,
    specialization: { type: String, enum: ['off_plan', 'secondary', 'both'], default: 'both' },
    assignedBy: String,
    assignedAt: Date
  },
  leadSource: {
    source: { type: String, enum: ['website', 'whatsapp', 'referral', 'portal', 'social_media', 'walk_in', 'cold_call'], default: 'website' },
    campaign: String,
    leadScore: { type: Number, min: 0, max: 100, default: 50 },
    qualification: { type: String, enum: ['hot', 'warm', 'cold'], default: 'warm' }
  },
  offer: {
    offerPrice: Number,
    counterPrice: Number,
    agreedPrice: Number,
    depositAmount: Number,
    paymentPlan: String,
    submittedAt: Date,
    acceptedAt: Date,
    validUntil: Date
  },
  spa: {
    spaNumber: String,
    generatedAt: Date,
    documentUrl: String,
    sellerSignedAt: Date,
    buyerSignedAt: Date,
    witnessedBy: String
  },
  noc: {
    nocNumber: String,
    appliedAt: Date,
    receivedAt: Date,
    documentUrl: String,
    developerName: String
  },
  dld: {
    dldTransactionNumber: String,
    transferDate: Date,
    titleDeedNumber: String,
    registrationFee: Number,
    transferFee: Number,
    completedAt: Date
  },
  timeline: [{
    stage: String,
    status: String,
    timestamp: { type: Date, default: Date.now },
    actor: String,
    notes: String
  }],
  kycVerification: {
    sellerVerified: { type: Boolean, default: false },
    buyerVerified: { type: Boolean, default: false },
    riskScore: Number,
    amlCleared: { type: Boolean, default: false },
    verifiedAt: Date
  },
  financials: {
    totalTransactionValue: Number,
    commissionPercentage: { type: Number, default: 2 },
    commissionAmount: Number,
    commissionPaid: { type: Boolean, default: false },
    paymentsReceived: [{
      type: String,
      amount: Number,
      date: Date,
      reference: String
    }]
  },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

salesDealSchema.index({ status: 1 });
salesDealSchema.index({ dealType: 1 });
salesDealSchema.index({ 'broker.agentId': 1 });

salesDealSchema.statics.generateDealNumber = async function(type) {
  const count = await this.countDocuments({ dealType: type });
  const year = new Date().getFullYear();
  const prefix = type === 'off_plan' ? 'OP' : type === 'secondary' ? 'SC' : 'RS';
  return `${prefix}-${year}-${String(count + 1).padStart(5, '0')}`;
};

const SalesDeal = mongoose.model('SalesDeal', salesDealSchema);
export default SalesDeal;
