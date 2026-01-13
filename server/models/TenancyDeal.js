import mongoose from 'mongoose';

const tenancyDealSchema = new mongoose.Schema({
  dealNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['inquiry', 'viewing_scheduled', 'viewing_completed', 'offer_submitted', 'landlord_review', 'offer_accepted', 'offer_rejected', 'counter_offer', 'contract_preparation', 'pending_signatures', 'signed', 'ejari_submitted', 'ejari_registered', 'completed', 'cancelled'],
    default: 'inquiry'
  },
  property: {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryProperty' },
    address: String,
    area: String,
    type: String,
    bedrooms: Number,
    bathrooms: Number,
    size: Number,
    annualRent: Number,
    securityDeposit: Number
  },
  landlord: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    phone: String,
    emiratesId: String,
    type: { type: String, enum: ['individual', 'company'], default: 'individual' }
  },
  tenant: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    phone: String,
    emiratesId: String,
    employer: String,
    monthlyIncome: Number,
    kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }
  },
  broker: {
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    name: String,
    email: String,
    phone: String,
    brnNumber: String,
    assignedBy: { type: String, default: 'Daisy AI' },
    assignedAt: Date
  },
  offer: {
    monthlyRent: Number,
    securityDeposit: Number,
    agencyFee: Number,
    paymentSchedule: { type: String, enum: ['1_cheque', '2_cheques', '4_cheques', '6_cheques', '12_cheques'], default: '1_cheque' },
    startDate: Date,
    endDate: Date,
    duration: { type: Number, default: 12 },
    specialConditions: [String],
    submittedAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    rejectionReason: String
  },
  contract: {
    contractNumber: String,
    generatedAt: Date,
    documentUrl: String,
    landlordSignedAt: Date,
    tenantSignedAt: Date,
    landlordSignatureUrl: String,
    tenantSignatureUrl: String
  },
  ejari: {
    ejariNumber: String,
    submittedAt: Date,
    registeredAt: Date,
    expiryDate: Date,
    certificateUrl: String
  },
  timeline: [{
    stage: String,
    status: String,
    timestamp: { type: Date, default: Date.now },
    actor: String,
    notes: String
  }],
  kycVerification: {
    landlordVerified: { type: Boolean, default: false },
    tenantVerified: { type: Boolean, default: false },
    riskScore: Number,
    verifiedAt: Date,
    verifiedBy: String
  },
  financials: {
    totalContractValue: Number,
    commissionAmount: Number,
    commissionPaid: { type: Boolean, default: false },
    paymentsReceived: [{
      type: String,
      amount: Number,
      date: Date,
      reference: String
    }]
  },
  notifications: [{
    type: String,
    channel: String,
    recipient: String,
    sentAt: Date,
    status: String
  }],
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

tenancyDealSchema.index({ status: 1 });
tenancyDealSchema.index({ 'broker.agentId': 1 });
tenancyDealSchema.index({ 'landlord.userId': 1 });
tenancyDealSchema.index({ 'tenant.userId': 1 });

tenancyDealSchema.statics.generateDealNumber = async function() {
  const count = await this.countDocuments();
  const year = new Date().getFullYear();
  return `TD-${year}-${String(count + 1).padStart(5, '0')}`;
};

const TenancyDeal = mongoose.model('TenancyDeal', tenancyDealSchema);
export default TenancyDeal;
