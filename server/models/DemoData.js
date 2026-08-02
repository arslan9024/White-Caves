/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const demoDataSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['landlord', 'tenant', 'buyer', 'seller', 'broker', 'property', 'tenancy_deal', 'sales_deal', 'kyc_case'],
    required: true
  },
  category: {
    type: String,
    enum: ['leasing', 'sales_offplan', 'sales_secondary', 'kyc_aml', 'marketing'],
    required: true
  },
  name: String,
  description: String,
  data: mongoose.Schema.Types.Mixed,
  linkedEntities: [{
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    relationship: String
  }],
  learningScenario: {
    title: String,
    steps: [String],
    bestPractices: [String],
    commonMistakes: [String]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DemoData = mongoose.model('DemoData', demoDataSchema);
export default DemoData;
