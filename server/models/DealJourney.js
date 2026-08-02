/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
const mongoose = require('mongoose');

const DealJourneySchema = new mongoose.Schema(
  {
    // Parties
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

    // Related Documents
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
    },

    // Deal Stages
    stages: [
      {
        stageId: String, // unique identifier for stage
        stageName: String, // e.g., 'offer_creation', 'tenant_approval', 'landlord_approval', 'contract_generation', 'signature'
        stageOrder: Number,
        status: {
          type: String,
          enum: ['pending', 'in_progress', 'completed', 'blocked'],
          default: 'pending',
        },
        startDate: Date,
        endDate: Date,
        completedAt: Date,
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        notes: String,
        activities: [
          {
            type: String,
            activityType: {
              type: String,
              enum: [
                'email_sent',
                'whatsapp_sent',
                'document_sent',
                'signature_requested',
                'signature_received',
                'approval_given',
                'approval_denied',
                'document_generated',
                'status_changed',
              ],
            },
            description: String,
            timestamp: Date,
            performedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
          },
        ],
      },
    ],

    // Overall Status
    overallStatus: {
      type: String,
      enum: [
        'initiated',
        'offer_stage',
        'approval_stage',
        'contract_stage',
        'signature_stage',
        'completed',
        'failed',
        'cancelled',
      ],
      default: 'initiated',
    },

    // Timeline
    expectedCompletionDate: Date,
    actualCompletionDate: Date,

    // Communication Channels
    communicationLinks: [
      {
        type: {
          type: String,
          enum: ['email', 'whatsapp', 'secure_link'],
        },
        recipient: String,
        recipientRole: {
          type: String,
          enum: ['landlord', 'tenant', 'agent'],
        },
        link: String,
        expiresAt: Date,
        clickedAt: Date,
        status: {
          type: String,
          enum: ['pending', 'sent', 'delivered', 'opened', 'expired'],
        },
      },
    ],

    // Notifications
    notifications: [
      {
        recipientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        type: {
          type: String,
          enum: [
            'action_required',
            'approval_needed',
            'signature_pending',
            'status_update',
            'deal_completed',
          ],
        },
        title: String,
        message: String,
        isRead: {
          type: Boolean,
          default: false,
        },
        readAt: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Metadata
    dealNotes: String,
    internalNotes: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
DealJourneySchema.index({ propertyId: 1 });
DealJourneySchema.index({ tenantId: 1 });
DealJourneySchema.index({ landlordId: 1 });
DealJourneySchema.index({ agentId: 1 });
DealJourneySchema.index({ overallStatus: 1 });
DealJourneySchema.index({ createdAt: -1 });

module.exports = mongoose.model('DealJourney', DealJourneySchema);
