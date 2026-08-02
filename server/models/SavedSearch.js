/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const savedSearchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    filters: {
      minPrice: Number,
      maxPrice: Number,
      bedrooms: {
        min: Number,
        max: Number,
      },
      bathrooms: {
        min: Number,
        max: Number,
      },
      areas: [String],
      propertyTypes: [String],
      amenities: [String],
      minArea: Number,
      maxArea: Number,
      keywords: [String],
    },
    sortBy: {
      type: String,
      enum: ['featured', 'price_asc', 'price_desc', 'newest', 'area_desc'],
      default: 'newest',
    },
    // Alert settings
    alertEnabled: {
      type: Boolean,
      default: true,
    },
    alertFrequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily',
    },
    // Notification history
    lastAlertSent: Date,
    alertsSent: {
      type: Number,
      default: 0,
    },
    newPropertiesCount: {
      type: Number,
      default: 0,
    },
    // Auto-notification email
    notificationEmail: String,
    // Usage stats
    viewCount: {
      type: Number,
      default: 0,
    },
    lastSearched: Date,
  },
  { timestamps: true }
);

// Indexes
savedSearchSchema.index({ userId: 1, createdAt: -1 });
savedSearchSchema.index({ alertEnabled: 1, alertFrequency: 1 });

export default mongoose.model('SavedSearch', savedSearchSchema);
