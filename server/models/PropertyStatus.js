/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const PropertyStatusSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryProperty',
      required: true,
      unique: true,
    },
    // Furnishing dimension
    furnishing: {
      type: String,
      enum: ['unfurnished', 'furnished', 'semi-furnished'],
      default: 'unfurnished',
    },
    // Occupancy dimension
    occupancyStatus: {
      type: String,
      enum: ['vacant', 'occupied', 'rented', 'mixed'],
      default: 'vacant',
    },
    // Market availability dimension
    marketAvailability: {
      type: String,
      enum: ['available', 'for-rent', 'for-sale', 'hold', 'not-available'],
      default: 'available',
    },
    // Construction stage dimension
    constructionStage: {
      type: String,
      enum: ['under_construction', 'handed_over', 'renovation', 'maintenance'],
      default: 'handed_over',
    },
    // Legal status dimension
    legalStatus: {
      type: String,
      enum: ['registered', 'pending', 'disputed', 'freehold', 'leasehold'],
      default: 'registered',
    },
    // Status history
    statusHistory: [
      {
        field: String,
        oldValue: String,
        newValue: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: String,
        reason: String,
      },
    ],
    // Additional tracking
    lastStatusUpdate: Date,
    statusNotes: String,
    updatedBy: String,
  },
  { timestamps: true }
);

PropertyStatusSchema.index({ propertyId: 1 });
PropertyStatusSchema.index({ furnishing: 1 });
PropertyStatusSchema.index({ occupancyStatus: 1 });
PropertyStatusSchema.index({ marketAvailability: 1 });
PropertyStatusSchema.index({ constructionStage: 1 });
PropertyStatusSchema.index({ legalStatus: 1 });
PropertyStatusSchema.index({ lastStatusUpdate: -1 });

PropertyStatusSchema.statics.findByStatus = function (field, value) {
  const query = {};
  query[field] = value;
  return this.find(query).populate('propertyId');
};

PropertyStatusSchema.statics.findByMultipleStatus = function (filters) {
  return this.find(filters).populate('propertyId');
};

PropertyStatusSchema.methods.updateStatus = function (field, newValue, updatedBy = '', reason = '') {
  const oldValue = this[field];
  
  if (oldValue !== newValue) {
    this.statusHistory.push({
      field,
      oldValue,
      newValue,
      changedBy: updatedBy,
      reason,
    });
    this[field] = newValue;
    this.lastStatusUpdate = new Date();
  }
  
  return this.save();
};

PropertyStatusSchema.methods.getStatusSummary = function () {
  return {
    furnishing: this.furnishing,
    occupancyStatus: this.occupancyStatus,
    marketAvailability: this.marketAvailability,
    constructionStage: this.constructionStage,
    legalStatus: this.legalStatus,
    lastUpdate: this.lastStatusUpdate,
  };
};

export default mongoose.model('PropertyStatus', PropertyStatusSchema);