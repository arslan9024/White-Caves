/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema(
  {
    // Property and Parties
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryProperty',
      required: true,
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Offer Terms
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    leaseDuration: {
      type: Number, // in months
      default: 12,
    },
    chequeFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual'],
      default: 'monthly',
    },
    noOfCheques: {
      type: Number,
      default: 12,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    rentIncreasePercentage: {
      type: Number,
      default: 0,
    },
    maintenanceResponsibility: {
      type: String,
      enum: ['landlord', 'tenant', 'shared'],
      default: 'landlord',
    },
    utilities: {
      type: String,
      default: '',
    },
    specialTerms: {
      type: String,
      default: '',
    },

    // Approvals
    tenantApproved: {
      type: Boolean,
      default: false,
    },
    tenantApprovedAt: Date,
    tenantApprovalNotes: String,

    landlordApproved: {
      type: Boolean,
      default: false,
    },
    landlordApprovedAt: Date,
    landlordApprovalNotes: String,

    // Status
    status: {
      type: String,
      enum: [
        'draft',
        'sent_to_tenant',
        'tenant_approved',
        'tenant_rejected',
        'sent_to_landlord',
        'landlord_approved',
        'landlord_rejected',
        'both_approved',
        'ready_for_contract',
        'contract_generated',
        'completed',
        'cancelled',
      ],
      default: 'draft',
    },

    // Timeline
    sentToTenantAt: Date,
    sentToLandlordAt: Date,
    completedAt: Date,

    // Communication
    tenantSignLink: String,
    landlordSignLink: String,
    communicationHistory: [
      {
        type: {
          type: String,
          enum: ['email', 'whatsapp', 'in_app', 'call'],
        },
        recipient: String,
        subject: String,
        message: String,
        sentAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
        },
      },
    ],

    // Reference to contract if generated
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
    },

    // Metadata
    notes: String,
    internalNotes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
OfferSchema.index({ propertyId: 1 });
OfferSchema.index({ landlordId: 1 });
OfferSchema.index({ tenantId: 1 });
OfferSchema.index({ agentId: 1 });
OfferSchema.index({ status: 1 });
OfferSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Offer', OfferSchema);
