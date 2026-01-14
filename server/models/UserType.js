import mongoose from 'mongoose';

const journeyStageSchema = new mongoose.Schema({
  stageName: { type: String, required: true },
  description: String,
  duration: String,
  aiAssistants: [String],
  completedAt: Date,
  notes: String
});

const userTypeSchema = new mongoose.Schema({
  typeCode: { type: String, required: true, unique: true },
  typeName: { type: String, required: true },
  category: {
    type: String,
    enum: ['investor', 'buyer', 'tenant', 'owner', 'developer', 'agent', 'staff', 'corporate'],
    required: true
  },
  tier: {
    type: String,
    enum: ['uhnwi', 'hnwi', 'premium', 'standard', 'basic'],
    default: 'standard'
  },
  profile: {
    netWorthRange: { min: Number, max: Number },
    incomeRange: { min: Number, max: Number },
    propertyPortfolioSize: { min: Number, max: Number },
    transactionFrequency: String,
    averageTransactionValue: Number,
    typicalProperties: [String],
    decisionTimeWeeks: { min: Number, max: Number },
    financingRequired: Boolean,
    financingPercentage: Number
  },
  serviceExpectations: {
    level: { type: String, enum: ['white-glove', 'premium', 'personalized', 'standard', 'self-service'] },
    responseTimeSLA: Number,
    dedicatedSupport: Boolean,
    availability: String
  },
  securityRequirements: {
    encryptionLevel: { type: String, enum: ['military', 'enterprise', 'standard'] },
    authenticationMethod: [String],
    dataSovereignty: String
  },
  journeyPhases: [{
    phaseName: String,
    phaseNumber: Number,
    duration: String,
    stages: [journeyStageSchema]
  }],
  aiAssistantAllocation: [{
    assistantId: String,
    assistantName: String,
    role: { type: String, enum: ['primary', 'secondary', 'specialist'] }
  }],
  requiredIntegrations: [String],
  dubaiSpecificFeatures: {
    uaePassRequired: { type: Boolean, default: true },
    reraComplianceLevel: String,
    visaEligibility: [String],
    preferredCommunities: [String]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('UserType', userTypeSchema);
