import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['passport', 'emirates_id', 'visa', 'proof_of_address', 'source_of_funds', 'bank_statements', 'income_proof', 'company_documents'],
    required: true
  },
  fileUrl: String,
  fileName: String,
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
  verifiedBy: String,
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'expired'],
    default: 'pending'
  },
  expiryDate: Date,
  ocrData: mongoose.Schema.Types.Mixed,
  rejectionReason: String,
  ocrConfidence: Number
});

const riskAssessmentSchema = new mongoose.Schema({
  assessedAt: { type: Date, default: Date.now },
  assessedBy: String,
  score: { type: Number, min: 0, max: 100 },
  category: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'PROHIBITED'] },
  factors: {
    customerType: { value: String, score: Number },
    nationality: { value: String, score: Number },
    transactionValue: { value: Number, score: Number },
    transactionType: { value: String, score: Number },
    sourceOfFunds: { value: String, score: Number },
    occupation: { value: String, score: Number }
  },
  notes: String,
  nextReviewDate: Date
});

const pepScreeningSchema = new mongoose.Schema({
  screenedAt: { type: Date, default: Date.now },
  isPEP: { type: Boolean, default: false },
  pepCategory: String,
  pepPosition: String,
  pepCountry: String,
  isFamilyAssociate: { type: Boolean, default: false },
  relationshipToPEP: String,
  matchConfidence: Number,
  source: String,
  notes: String,
  reviewedBy: String,
  reviewedAt: Date
});

const sanctionsCheckSchema = new mongoose.Schema({
  checkedAt: { type: Date, default: Date.now },
  listsChecked: [String],
  hasMatch: { type: Boolean, default: false },
  matches: [{
    listId: String,
    listName: String,
    matchType: String,
    matchScore: Number,
    matchedName: String,
    matchedEntity: mongoose.Schema.Types.Mixed,
    confirmedMatch: Boolean,
    reviewedBy: String,
    reviewedAt: Date
  }],
  clearanceStatus: {
    type: String,
    enum: ['pending', 'cleared', 'matched', 'under_review'],
    default: 'pending'
  }
});

const kycProfileSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  
  customerType: {
    type: String,
    enum: ['individual_resident', 'individual_non_resident', 'corporate_local', 'corporate_foreign', 'trust_foundation'],
    required: true
  },
  
  personalInfo: {
    fullNameEn: { type: String, required: true },
    fullNameAr: String,
    dateOfBirth: Date,
    nationality: { type: String, required: true },
    countryOfResidence: String,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    emiratesIdNumber: String,
    passportNumber: String,
    passportExpiry: Date,
    visaType: String,
    visaExpiry: Date
  },
  
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: String,
    address: {
      street: String,
      building: String,
      apartment: String,
      area: String,
      city: String,
      emirate: String,
      country: { type: String, default: 'UAE' },
      poBox: String
    }
  },
  
  employmentInfo: {
    occupation: String,
    employer: String,
    position: String,
    industry: String,
    annualIncome: Number,
    incomeSource: {
      type: String,
      enum: ['salary', 'business_income', 'investment_returns', 'property_sale', 'inheritance', 'gift', 'crypto', 'unknown']
    }
  },
  
  corporateInfo: {
    companyName: String,
    tradeLicenseNumber: String,
    tradeLicenseExpiry: Date,
    registrationCountry: String,
    legalForm: String,
    businessActivity: String,
    authorizedSignatories: [{
      name: String,
      position: String,
      emiratesId: String,
      passportNumber: String
    }],
    ubos: [{
      name: String,
      nationality: String,
      ownershipPercentage: Number,
      emiratesId: String,
      isPEP: Boolean
    }]
  },
  
  documents: [documentSchema],
  
  riskAssessment: riskAssessmentSchema,
  riskHistory: [riskAssessmentSchema],
  
  pepScreening: pepScreeningSchema,
  pepScreeningHistory: [pepScreeningSchema],
  
  sanctionsCheck: sanctionsCheckSchema,
  sanctionsCheckHistory: [sanctionsCheckSchema],
  
  kycStatus: {
    type: String,
    enum: ['pending', 'documents_required', 'under_review', 'edd_required', 'approved', 'rejected', 'suspended', 'expired'],
    default: 'pending',
    index: true
  },
  
  dueDiligenceLevel: {
    type: String,
    enum: ['CDD', 'EDD'],
    default: 'CDD'
  },
  
  verificationWorkflow: {
    currentStep: { type: String, default: 'document_collection' },
    completedSteps: [String],
    stepHistory: [{
      step: String,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'failed', 'skipped'] },
      startedAt: Date,
      completedAt: Date,
      processedBy: String,
      notes: String
    }]
  },
  
  approvalInfo: {
    approvedBy: String,
    approvedAt: Date,
    approvalLevel: String,
    approvalNotes: String,
    expiryDate: Date
  },
  
  rejectionInfo: {
    rejectedBy: String,
    rejectedAt: Date,
    rejectionReason: String,
    rejectionDetails: String
  },
  
  assignedTo: { type: String, index: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  tags: [String],
  notes: [{
    content: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: true }
  }],
  
  transactionProfile: {
    expectedTransactionTypes: [String],
    expectedTransactionVolume: String,
    expectedTransactionValue: Number,
    primaryPurpose: String
  },
  
  lastActivityAt: { type: Date, default: Date.now },
  nextReviewDate: Date,
  reviewReminders: [{
    reminderDate: Date,
    reminderType: String,
    sent: Boolean,
    sentAt: Date
  }]
}, {
  timestamps: true
});

kycProfileSchema.index({ 'personalInfo.fullNameEn': 'text', 'personalInfo.emiratesIdNumber': 1, 'personalInfo.passportNumber': 1 });
kycProfileSchema.index({ kycStatus: 1, priority: -1, createdAt: -1 });
kycProfileSchema.index({ 'riskAssessment.category': 1 });
kycProfileSchema.index({ nextReviewDate: 1 });

kycProfileSchema.methods.calculateRiskScore = function() {
  const factors = {
    customerType: this.customerType,
    nationality: this.personalInfo?.nationality?.toLowerCase().includes('gcc') ? 'gcc' : 'low_risk_country',
    transactionValue: this.transactionProfile?.expectedTransactionValue || 0,
    transactionType: this.transactionProfile?.primaryPurpose || 'residential_rental',
    sourceOfFunds: this.employmentInfo?.incomeSource || 'unknown',
    occupation: this.employmentInfo?.occupation?.includes('business') ? 'business_owner' : 'employed'
  };
  
  return factors;
};

kycProfileSchema.statics.getPendingVerifications = function(limit = 50) {
  return this.find({
    kycStatus: { $in: ['pending', 'documents_required', 'under_review'] }
  })
  .sort({ priority: -1, createdAt: 1 })
  .limit(limit);
};

kycProfileSchema.statics.getUpcomingReviews = function(daysAhead = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  return this.find({
    nextReviewDate: { $lte: futureDate },
    kycStatus: 'approved'
  }).sort({ nextReviewDate: 1 });
};

kycProfileSchema.statics.getStatsByStatus = function() {
  return this.aggregate([
    { $group: { _id: '$kycStatus', count: { $sum: 1 } } }
  ]);
};

kycProfileSchema.statics.getStatsByRiskCategory = function() {
  return this.aggregate([
    { $match: { kycStatus: 'approved' } },
    { $group: { _id: '$riskAssessment.category', count: { $sum: 1 } } }
  ]);
};

export default mongoose.model('KYCProfile', kycProfileSchema);
