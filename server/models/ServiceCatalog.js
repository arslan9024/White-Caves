/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const workflowStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  stepName: { type: String, required: true },
  description: String,
  durationDays: Number,
  aiAssistant: String,
  requiredDocuments: [String],
  automationLevel: { type: String, enum: ['full', 'partial', 'manual'], default: 'partial' },
  dependencies: [Number]
});

const workflowPhaseSchema = new mongoose.Schema({
  phaseName: { type: String, required: true },
  phaseNumber: { type: Number, required: true },
  durationDays: { min: Number, max: Number },
  steps: [workflowStepSchema]
});

const serviceCatalogSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true },
  serviceName: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'transaction_agency',
      'property_management',
      'legal_compliance',
      'financial_services',
      'marketing_media',
      'technology_ai',
      'concierge_lifestyle',
      'investment_advisory'
    ],
    required: true
  },
  subcategory: String,
  description: String,
  department: String,
  pricing: {
    type: { type: String, enum: ['fixed', 'percentage', 'hourly', 'on_request'] },
    amount: Number,
    percentageRate: Number,
    minimumFee: Number,
    maximumFee: Number,
    currency: { type: String, default: 'AED' },
    priceRange: { min: Number, max: Number }
  },
  duration: {
    minDays: Number,
    maxDays: Number,
    averageDays: Number
  },
  eligibility: {
    userTypes: [String],
    minimumTier: { type: String, enum: ['uhnwi', 'hnwi', 'premium', 'standard', 'basic'] },
    propertyValueMin: Number,
    requiresVerification: { type: Boolean, default: true }
  },
  aiAssistants: [{
    assistantId: String,
    assistantName: String,
    role: String
  }],
  workflow: [workflowPhaseSchema],
  requiredDocuments: [{
    documentName: String,
    documentType: String,
    mandatory: Boolean,
    validityPeriod: Number
  }],
  dubaiCompliance: {
    reraRequired: Boolean,
    dldIntegration: Boolean,
    ejariRequired: Boolean,
    amlCheckRequired: Boolean,
    uaePassRequired: Boolean
  },
  deliverables: [String],
  sla: {
    responseTimeHours: Number,
    resolutionTimeDays: Number,
    escalationPath: [String]
  },
  competitorComparison: {
    propertyFinder: String,
    bayut: String,
    emaarServices: String
  },
  seasonalVariations: {
    ramadanAdjustment: String,
    summerAdjustment: String,
    dsfAdjustment: String
  },
  isActive: { type: Boolean, default: true },
  displayOrder: Number
}, { timestamps: true });

export default mongoose.model('ServiceCatalog', serviceCatalogSchema);
