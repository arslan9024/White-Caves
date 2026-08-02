/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const PropertyInventorySchema = new mongoose.Schema(
  {
    // Property Reference
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryProperty',
      required: true,
      unique: true,
    },

    // Status for Tenancy Cycle
    status: {
      type: String,
      enum: [
        'available',
        'offer_in_progress',
        'offer_approved',
        'contract_generation',
        'contract_signature',
        'signed',
        'occupied',
        'maintenance',
        'inspection',
        'ready_for_leasing',
        'archived',
      ],
      default: 'available',
    },

    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availableFrom: Date,
    availableUntil: Date,

    // Current Offer/Deal
    currentOfferId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    currentContractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
    },
    currentTenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Assigned Agents
    assignedAgents: [
      {
        agentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        accessLevel: {
          type: String,
          enum: ['view_only', 'edit', 'full_control'],
          default: 'view_only',
        },
        grantedAt: {
          type: Date,
          default: Date.now,
        },
        grantedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],

    // Viewing & Interest
    viewings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Viewing',
      },
    ],
    interestedTenants: [
      {
        tenantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        expressedInterestAt: Date,
        notes: String,
      },
    ],

    // Offer History
    offerHistory: [
      {
        offerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Offer',
        },
        status: String,
        createdAt: Date,
        completedAt: Date,
        result: {
          type: String,
          enum: ['approved', 'rejected', 'cancelled'],
        },
      },
    ],

    // Tenancy Cycle Visibility
    visibleTo: {
      mary: {
        type: Boolean,
        default: true, // Mary can see property status in inventory
      },
      lucy: Boolean,
      nina: Boolean,
      linda: Boolean,
      agents: Boolean,
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
PropertyInventorySchema.index({ status: 1 });
PropertyInventorySchema.index({ currentOfferId: 1 });
PropertyInventorySchema.index({ currentContractId: 1 });
PropertyInventorySchema.index({ 'assignedAgents.agentId': 1 });

const PropertyInventory =
  mongoose.models.PropertyInventory || mongoose.model('PropertyInventory', PropertyInventorySchema);

export default PropertyInventory;
