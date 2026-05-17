import mongoose from 'mongoose';

/**
 * OwnerRelationship Model
 * Tracks relationships with property owners sourced from WhatsApp conversations
 * Manages communication history, properties owned, and engagement metrics
 */

const OwnerRelationshipSchema = new mongoose.Schema(
  {
    // Unique identifier
    relationshipId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    // Owner Identification
    ownerProfile: {
      name: {
        type: String,
        required: true,
        index: true,
      },
      whatsappNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      alternatePhone: String,
      email: String,
      emiratesId: String,
      tradeLicense: String,
      companyName: String,
      companyRegistration: String,
    },

    // Contact Information
    contactInfo: {
      preferredChannel: {
        type: String,
        enum: ['whatsapp', 'email', 'phone', 'meeting'],
        default: 'whatsapp',
      },
      communicationHistory: [
        {
          channel: String,
          date: Date,
          initiatedBy: { type: String, enum: ['owner', 'agent'] },
          subject: String,
          notes: String,
        },
      ],
      lastContactDate: Date,
      nextFollowUpDate: Date,
      responseTimeAverage: Number, // in hours
      responseRate: { type: Number, min: 0, max: 100 }, // percentage
    },

    // Relationship Metrics
    metrics: {
      totalPropertiesOffered: { type: Number, default: 0 },
      totalPropertiesListed: { type: Number, default: 0 },
      totalPropertiesRented: { type: Number, default: 0 },
      totalPropertiesSold: { type: Number, default: 0 },
      totalDealsValue: { type: Number, default: 0 }, // AED
      totalCommissionEarned: { type: Number, default: 0 }, // AED
      averageLeadResponseTime: Number, // in hours
      dealClosureRate: { type: Number, min: 0, max: 100 }, // percentage
      customerSatisfactionScore: { type: Number, min: 1, max: 5 },
    },

    // Owner Reliability Rating
    reliabilityRating: {
      overallScore: { type: Number, min: 1, max: 10, default: 5 },
      responsiveness: { type: Number, min: 1, max: 10 }, // How quickly they respond
      propertyQuality: { type: Number, min: 1, max: 10 }, // Quality of properties offered
      trustworthiness: { type: Number, min: 1, max: 10 }, // Do they deliver as promised
      communicationClarity: { type: Number, min: 1, max: 10 }, // Clear property information
      lastUpdatedAt: Date,
      updatedBy: String,
    },

    // Properties Owned / Managed by This Owner
    properties: [
      {
        propertyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'InventoryProperty',
        },
        opportunityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PropertyOpportunity',
        },
        propertyType: String,
        location: String,
        addedToInventoryAt: Date,
        status: {
          type: String,
          enum: ['listed', 'rented', 'sold', 'delisted'],
          default: 'listed',
        },
      },
    ],

    // Specializations (What type of properties does this owner have?)
    specializations: {
      propertyTypes: [String], // ['villa', 'apartment', 'townhouse', etc]
      locations: [String], // Areas where they have properties
      priceRange: {
        min: Number,
        max: Number,
      },
      bedroomRange: {
        min: Number,
        max: Number,
      },
    },

    // Engagement Status
    engagementStatus: {
      status: {
        type: String,
        enum: ['active', 'inactive', 'prospect', 'blocked', 'archived'],
        default: 'prospect',
        index: true,
      },
      statusChangedAt: Date,
      statusChangedBy: String,
      reason: String,
    },

    // Source Information
    sourceInfo: {
      discoveredAt: { type: Date, default: Date.now },
      discoveredThrough: {
        type: String,
        enum: ['whatsapp_conversation', 'direct_inquiry', 'referral', 'manual_entry'],
        default: 'whatsapp_conversation',
      },
      discoveredByAgent: String,
      firstPropertyConversationId: String,
    },

    // Agreement & Terms
    agreement: {
      hasAgreedToTerms: { type: Boolean, default: false },
      termsAcceptedAt: Date,
      commissionRate: Number, // percentage
      commissionCurrency: { type: String, default: 'AED' },
      specialTerms: String,
      exclusivityPeriod: String, // e.g., "3 months", "6 months"
      exclusivityEndDate: Date,
    },

    // Notes and Observations
    notes: String,
    internalNotes: [
      {
        date: Date,
        addedBy: String,
        note: String,
        category: { type: String, enum: ['observation', 'warning', 'opportunity', 'feedback'] },
      },
    ],

    // Assignment
    assignedAgent: {
      agentId: String,
      agentName: String,
      assignedAt: Date,
      isExclusiveAssignment: { type: Boolean, default: false },
    },

    // Verification Status
    verification: {
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      verifiedBy: String,
      verificationDocuments: [String], // URLs to ID, license, etc
      verificationNotes: String,
    },

    // Preferences
    preferences: {
      communicationLanguage: { type: String, default: 'Arabic' },
      preferredDocuments: [String], // Document types they prefer
      marketPreference: String, // 'rent', 'sale', 'both'
      priceTransparency: Boolean, // Willing to share prices
      photoQuality: String, // 'professional', 'standard', 'basic'
    },

    // Tags
    tags: [String],

    // System Fields
    isActive: { type: Boolean, default: true, index: true },
    archived: { type: Boolean, default: false },
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);

// Indexes for efficient querying
OwnerRelationshipSchema.index({ 'engagementStatus.status': 1 });
OwnerRelationshipSchema.index({ 'metrics.totalPropertiesListed': -1 });
OwnerRelationshipSchema.index({ 'reliabilityRating.overallScore': -1 });
OwnerRelationshipSchema.index({ 'sourceInfo.discoveredAt': -1 });
OwnerRelationshipSchema.index({ 'assignedAgent.agentId': 1 });
OwnerRelationshipSchema.index({ createdAt: -1 });

// Static Methods

/**
 * Find owner by WhatsApp number
 */
OwnerRelationshipSchema.statics.findByWhatsappNumber = function (number) {
  return this.findOne({ 'ownerProfile.whatsappNumber': number });
};

/**
 * Find all active owners
 */
OwnerRelationshipSchema.statics.findActiveOwners = function () {
  return this.find({
    'engagementStatus.status': 'active',
    isActive: true,
  }).sort({ 'metrics.totalPropertiesListed': -1 });
};

/**
 * Find recently discovered owners
 */
OwnerRelationshipSchema.statics.findRecentlyDiscovered = function (daysAgo = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  return this.find({
    'sourceInfo.discoveredAt': { $gte: startDate },
    isActive: true,
  }).sort({ 'sourceInfo.discoveredAt': -1 });
};

/**
 * Find high-quality owners (good rating)
 */
OwnerRelationshipSchema.statics.findHighQualityOwners = function (minScore = 7) {
  return this.find({
    'reliabilityRating.overallScore': { $gte: minScore },
    'engagementStatus.status': { $in: ['active', 'prospect'] },
    isActive: true,
  }).sort({ 'reliabilityRating.overallScore': -1 });
};

/**
 * Find owners with properties in specific area
 */
OwnerRelationshipSchema.statics.findByLocation = function (location) {
  return this.find({
    'specializations.locations': location,
    isActive: true,
  });
};

/**
 * Find owners specializing in specific property type
 */
OwnerRelationshipSchema.statics.findByPropertyType = function (propertyType) {
  return this.find({
    'specializations.propertyTypes': propertyType,
    isActive: true,
  });
};

/**
 * Find owners needing follow-up
 */
OwnerRelationshipSchema.statics.findNeedingFollowUp = function () {
  return this.find({
    'contactInfo.nextFollowUpDate': { $lte: new Date() },
    'engagementStatus.status': { $in: ['prospect', 'active'] },
    isActive: true,
  }).sort({ 'contactInfo.nextFollowUpDate': 1 });
};

/**
 * Get top performing owners
 */
OwnerRelationshipSchema.statics.getTopPerformers = function (limit = 10) {
  return this.find({ isActive: true }).sort({ 'metrics.totalDealsValue': -1 }).limit(limit);
};

/**
 * Get owner statistics
 */
OwnerRelationshipSchema.statics.getOwnerStats = async function () {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$engagementStatus.status',
        count: { $sum: 1 },
        totalDealsValue: { $sum: '$metrics.totalDealsValue' },
        avgReliabilityScore: { $avg: '$reliabilityRating.overallScore' },
      },
    },
  ]);
};

// Instance Methods

/**
 * Add a property owned by this owner
 */
OwnerRelationshipSchema.methods.addProperty = async function (propertyId, propertyData) {
  this.properties.push({
    propertyId,
    propertyType: propertyData.type,
    location: propertyData.location,
    addedToInventoryAt: new Date(),
  });

  // Update specializations
  if (!this.specializations.propertyTypes.includes(propertyData.type)) {
    this.specializations.propertyTypes.push(propertyData.type);
  }

  if (!this.specializations.locations.includes(propertyData.location)) {
    this.specializations.locations.push(propertyData.location);
  }

  this.metrics.totalPropertiesOffered += 1;
  this.metrics.totalPropertiesListed += 1;

  return this.save();
};

/**
 * Update reliability rating based on recent deals
 */
OwnerRelationshipSchema.methods.updateReliabilityRating = async function (deal) {
  if (!this.reliabilityRating.overallScore) {
    this.reliabilityRating.overallScore = 5;
  }

  // Adjust score based on deal outcome
  if (deal.successful) {
    this.reliabilityRating.overallScore = Math.min(10, this.reliabilityRating.overallScore + 0.5);
  } else {
    this.reliabilityRating.overallScore = Math.max(1, this.reliabilityRating.overallScore - 0.5);
  }

  this.reliabilityRating.lastUpdatedAt = new Date();
  return this.save();
};

/**
 * Schedule next follow-up
 */
OwnerRelationshipSchema.methods.scheduleFollowUp = async function (daysFromNow = 7) {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysFromNow);

  this.contactInfo.nextFollowUpDate = nextDate;
  return this.save();
};

/**
 * Mark as active owner
 */
OwnerRelationshipSchema.methods.markActive = async function (updatedBy) {
  this.engagementStatus.status = 'active';
  this.engagementStatus.statusChangedAt = new Date();
  this.engagementStatus.statusChangedBy = updatedBy;
  return this.save();
};

/**
 * Calculate deal closure rate
 */
OwnerRelationshipSchema.methods.calculateDealClosureRate = function () {
  if (this.metrics.totalPropertiesListed === 0) return 0;

  const closed = this.metrics.totalPropertiesRented + this.metrics.totalPropertiesSold;
  return Math.round((closed / this.metrics.totalPropertiesListed) * 100);
};

export default mongoose.model('OwnerRelationship', OwnerRelationshipSchema);
