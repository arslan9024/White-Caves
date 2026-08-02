/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const OwnerContactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['mobile', 'phone', 'email', 'whatsapp', 'other'],
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const OwnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    nationality: {
      type: String,
      trim: true,
      default: null,
    },
    emiratesId: {
      type: String,
      trim: true,
      default: null,
      index: true,
      sparse: true,
    },
    passportNumber: {
      type: String,
      trim: true,
      default: null,
      index: true,
      sparse: true,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    contacts: {
      type: [OwnerContactSchema],
      default: [],
    },
    source: {
      type: String,
      default: 'manual',
    },
    importSessionId: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

OwnerSchema.index({ 'contacts.value': 1 });

export default mongoose.models.Owner || mongoose.model('Owner', OwnerSchema);
