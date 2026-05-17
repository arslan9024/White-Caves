import mongoose from 'mongoose';

const commissionSplitSchema = new mongoose.Schema({
  recipientType: {
    type: String,
    enum: ['company', 'agent', 'team_lead', 'broker', 'referral', 'external_agent'],
    required: true
  },
  recipientId: mongoose.Schema.Types.ObjectId,
  recipientName: String,
  percentage: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'disputed'],
    default: 'pending'
  },
  paidAt: Date,
  paymentReference: String
});

const commissionSchema = new mongoose.Schema({
  commissionId: { type: String, required: true, unique: true },
  transactionType: {
    type: String,
    enum: ['sale', 'purchase', 'rental', 'referral', 'off_plan'],
    required: true
  },
  dealId: mongoose.Schema.Types.ObjectId,
  dealNumber: String,
  propertyId: mongoose.Schema.Types.ObjectId,
  propertyDetails: {
    title: String,
    location: String,
    community: String,
    propertyType: String
  },
  transactionValue: { type: Number, required: true },
  currency: { type: String, default: 'AED' },
  commissionStructure: {
    baseRate: { type: Number, default: 2 },
    tier: {
      type: String,
      enum: ['standard', 'premium', 'luxury', 'ultra_prime'],
      default: 'standard'
    },
    adjustments: [{
      reason: String,
      percentage: Number
    }]
  },
  grossCommission: { type: Number, required: true },
  vatAmount: { type: Number, default: 0 },
  vatRate: { type: Number, default: 5 },
  netCommission: { type: Number, required: true },
  splits: [commissionSplitSchema],
  companySplit: {
    percentage: { type: Number, default: 50 },
    amount: Number
  },
  agentSplit: {
    percentage: { type: Number, default: 50 },
    amount: Number,
    agentId: mongoose.Schema.Types.ObjectId,
    agentName: String
  },
  bonuses: [{
    bonusType: String,
    amount: Number,
    recipientId: mongoose.Schema.Types.ObjectId,
    recipientName: String,
    reason: String
  }],
  deductions: [{
    deductionType: String,
    amount: Number,
    reason: String
  }],
  paymentSchedule: [{
    installmentNumber: Number,
    amount: Number,
    dueDate: Date,
    status: { type: String, enum: ['pending', 'paid', 'overdue'] },
    paidAt: Date,
    paymentMethod: String,
    paymentReference: String
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_approval', 'approved', 'partially_paid', 'fully_paid', 'disputed', 'cancelled'],
    default: 'draft'
  },
  approvedBy: mongoose.Schema.Types.ObjectId,
  approvedAt: Date,
  notes: String,
  invoiceNumber: String,
  invoiceDate: Date
}, { timestamps: true });

commissionSchema.methods.calculateCommission = function() {
  const baseRate = this.commissionStructure.baseRate / 100;
  let adjustedRate = baseRate;
  
  this.commissionStructure.adjustments.forEach(adj => {
    adjustedRate += (adj.percentage / 100);
  });
  
  this.grossCommission = this.transactionValue * adjustedRate;
  this.vatAmount = this.grossCommission * (this.vatRate / 100);
  this.netCommission = this.grossCommission + this.vatAmount;
  
  this.companySplit.amount = this.grossCommission * (this.companySplit.percentage / 100);
  this.agentSplit.amount = this.grossCommission * (this.agentSplit.percentage / 100);
  
  return {
    gross: this.grossCommission,
    vat: this.vatAmount,
    net: this.netCommission,
    company: this.companySplit.amount,
    agent: this.agentSplit.amount
  };
};

commissionSchema.statics.calculateQuickCommission = function(transactionValue, agentSharePercent = 50, baseRate = 2) {
  const companyCommission = transactionValue * (baseRate / 100);
  const agentCommission = companyCommission * (agentSharePercent / 100);
  const vatAmount = companyCommission * 0.05;
  
  return {
    transactionValue,
    baseRate,
    grossCommission: companyCommission,
    vatAmount,
    netCommission: companyCommission + vatAmount,
    companyShare: companyCommission - agentCommission,
    agentShare: agentCommission
  };
};

export default mongoose.model('Commission', commissionSchema);
