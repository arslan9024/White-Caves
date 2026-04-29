import mongoose from 'mongoose';

const OwnerPropertyMappingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryProperty',
      required: true,
    },
    // Ownership details
    ownershipType: {
      type: String,
      enum: ['sole', 'joint', 'partnership', 'company'],
      default: 'sole',
    },
    ownershipPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    // Relationship
    relationshipType: {
      type: String,
      enum: ['owner', 'investor', 'stakeholder', 'beneficiary'],
      default: 'owner',
    },
    // Dates
    acquisitionDate: Date,
    disposeDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    // Notes
    notes: String,
    // Monday Brain Plan tracking
    mondayPlanStatus: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Composite unique index to prevent duplicate owner-property mappings
OwnerPropertyMappingSchema.index(
  { ownerId: 1, propertyId: 1 },
  { unique: true }
);

OwnerPropertyMappingSchema.index({ ownerId: 1 });
OwnerPropertyMappingSchema.index({ propertyId: 1 });
OwnerPropertyMappingSchema.index({ isActive: 1 });
OwnerPropertyMappingSchema.index({ mondayPlanStatus: 1 });

OwnerPropertyMappingSchema.statics.findByOwner = function (ownerId) {
  return this.find({ ownerId, isActive: true })
    .populate('propertyId')
    .sort({ acquisitionDate: -1 });
};

OwnerPropertyMappingSchema.statics.findByProperty = function (propertyId) {
  return this.find({ propertyId, isActive: true })
    .populate('ownerId')
    .sort({ ownershipPercentage: -1 });
};

OwnerPropertyMappingSchema.statics.findJointOwners = function (propertyId) {
  return this.find({ propertyId, isActive: true, ownershipType: 'joint' })
    .populate('ownerId');
};

export default mongoose.model('OwnerPropertyMapping', OwnerPropertyMappingSchema);