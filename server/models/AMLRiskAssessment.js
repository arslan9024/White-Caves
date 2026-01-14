import mongoose from 'mongoose';

const riskFactorSchema = new mongoose.Schema({
  factorName: { type: String, required: true },
  factorCode: String,
  score: { type: Number, required: true },
  weight: { type: Number, default: 1 },
  triggered: { type: Boolean, default: false },
  details: String,
  evidence: String
});

const amlRiskAssessmentSchema = new mongoose.Schema({
  assessmentId: { type: String, required: true, unique: true },
  entityType: {
    type: String,
    enum: ['individual', 'company', 'trust', 'partnership'],
    required: true
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  entityName: String,
  transactionId: mongoose.Schema.Types.ObjectId,
  transactionType: {
    type: String,
    enum: ['sale', 'purchase', 'rental', 'investment', 'transfer']
  },
  transactionValue: Number,
  currency: { type: String, default: 'AED' },
  riskScore: { type: Number, min: 0, max: 100 },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  riskFactors: [riskFactorSchema],
  dubaiSpecificChecks: {
    cashTransactionCheck: {
      amount: Number,
      threshold: { type: Number, default: 55000 },
      exceeded: Boolean,
      score: Number
    },
    pepCheck: {
      isPEP: Boolean,
      pepType: String,
      pepCountry: String,
      score: Number
    },
    sanctionsCheck: {
      screened: Boolean,
      matchFound: Boolean,
      matchDetails: String,
      score: Number
    },
    sourceOfFundsCheck: {
      verified: Boolean,
      source: String,
      documents: [String],
      score: Number
    },
    highRiskCountryCheck: {
      nationality: String,
      residency: String,
      isHighRisk: Boolean,
      countries: [String],
      score: Number
    },
    propertyFlippingCheck: {
      previousPurchaseDate: Date,
      monthsSincePurchase: Number,
      isFlipping: Boolean,
      score: Number
    },
    priceDeviationCheck: {
      transactionPrice: Number,
      marketValue: Number,
      deviationPercent: Number,
      isSignificant: Boolean,
      score: Number
    },
    structuringCheck: {
      multipleTransactions: Boolean,
      totalAmount: Number,
      transactionCount: Number,
      score: Number
    }
  },
  emiratesIdVerification: {
    verified: Boolean,
    idNumber: String,
    expiryDate: Date,
    verificationMethod: String
  },
  visaStatusCheck: {
    hasValidVisa: Boolean,
    visaType: String,
    visaExpiry: Date,
    isResident: Boolean
  },
  enhancedDueDiligence: {
    required: Boolean,
    completedAt: Date,
    completedBy: String,
    findings: String,
    documents: [String]
  },
  goAMLReporting: {
    reportRequired: Boolean,
    reportSubmitted: Boolean,
    reportId: String,
    reportDate: Date,
    reportType: String
  },
  reviewStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'escalated'],
    default: 'pending'
  },
  reviewedBy: mongoose.Schema.Types.ObjectId,
  reviewedAt: Date,
  reviewNotes: String,
  autoApproved: Boolean,
  expiresAt: Date
}, { timestamps: true });

amlRiskAssessmentSchema.methods.calculateRiskScore = function() {
  let totalScore = 0;
  const checks = this.dubaiSpecificChecks;
  
  if (checks.cashTransactionCheck?.exceeded) totalScore += 40;
  if (checks.pepCheck?.isPEP) totalScore += 25;
  if (checks.sanctionsCheck?.matchFound) totalScore += 50;
  if (checks.highRiskCountryCheck?.isHighRisk) totalScore += 35;
  if (checks.propertyFlippingCheck?.isFlipping) totalScore += 20;
  if (checks.priceDeviationCheck?.isSignificant) totalScore += 20;
  if (checks.structuringCheck?.multipleTransactions) totalScore += 30;
  if (!checks.sourceOfFundsCheck?.verified) totalScore += 25;
  
  this.riskScore = Math.min(100, totalScore);
  
  if (this.riskScore >= 70) this.riskLevel = 'critical';
  else if (this.riskScore >= 50) this.riskLevel = 'high';
  else if (this.riskScore >= 25) this.riskLevel = 'medium';
  else this.riskLevel = 'low';
  
  return this.riskScore;
};

export default mongoose.model('AMLRiskAssessment', amlRiskAssessmentSchema);
