import mongoose from 'mongoose';

/**
 * PropertyOpportunity Model
 * Tracks property opportunities found through WhatsApp conversation analysis
 * Before they are verified and added to main InventoryProperty collection
 */

const PropertyOpportunitySchema = new mongoose.Schema(
  {
    // Unique identifier
    opportunityId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },

    // Source Information
    sourceType: {
      type: String,
      enum: ['whatsapp_conversation', 'manual_entry', 'api', 'other'],
      default: 'whatsapp_conversation',
      required: true,
    },

    sourceReference: {
      conversationId: String,
      messageId: String,
      whatsappChatId: String,
      extractedAt: { type: Date, default: Date.now },
      extractedBy: String, // 'nina_bot' or agent name
    },

    // Owner Information
    ownerInfo: {
      name: String,
      whatsappNumber: String,
      email: String,
      alternatePhone: String,
      ownershipType: {
        type: String,
        enum: ['direct_owner', 'property_manager', 'broker', 'uncertain'],
        default: 'uncertain',
      },
    },

    // Property Details (Extracted from conversation)
    propertyDetails: {
      type: {
        type: String,
        enum: ['villa', 'apartment', 'townhouse', 'penthouse', 'duplex', 'studio', 'plot', 'other'],
        required: true,
      },
      location: {
        area: String,
        coordinates: {
          latitude: Number,
          longitude: Number,
        },
        nearbyLandmarks: [String],
      },
      size: {
        rooms: Number,
        sqft: Number,
        sqm: Number,
      },
      furnishing: {
        type: String,
        enum: ['unfurnished', 'semi_furnished', 'furnished', 'unknown'],
        default: 'unknown',
      },
      features: [String], // ['pool', 'gym', 'parking', 'garden', etc]
      yearBuilt: Number,
      bedroomDetails: {
        masterbedroom: { sqft: Number },
        bedrooms: [{ name: String, sqft: Number }],
      },
    },

    // Availability Information
    availability: {
      forRent: {
        available: Boolean,
        monthlyPrice: Number,
        currency: { type: String, default: 'AED' },
        minimumLease: String, // '1 year', '6 months', etc
        availableFrom: Date,
      },
      forSale: {
        available: Boolean,
        askingPrice: Number,
        currency: { type: String, default: 'AED' },
        pricePerSqft: Number,
        negotiable: Boolean,
      },
    },

    // Confidence & Verification Status
    confidenceScore: {
      overall: { type: Number, min: 0, max: 100, default: 0 }, // 0-100%
      components: {
        propertyMentioned: { type: Number, min: 0, max: 100, default: 0 },
        ownerIdentified: { type: Number, min: 0, max: 100, default: 0 },
        detailsComplete: { type: Number, min: 0, max: 100, default: 0 },
        priceConfirmed: { type: Number, min: 0, max: 100, default: 0 },
      },
      calculatedAt: Date,
      reasoning: String, // Why this confidence score
    },

    // Verification Workflow Status
    verificationStatus: {
      status: {
        type: String,
        enum: [
          'initial_detection', // Just found in conversation
          'waiting_for_photos', // Asked for photos, awaiting response
          'waiting_for_details', // Asked for additional details
          'partially_verified', // Some details confirmed
          'fully_verified', // All critical details confirmed
          'rejected', // Owner didn't confirm
          'duplicate', // Same property found elsewhere
        ],
        default: 'initial_detection',
        index: true,
      },
      statusUpdatedAt: Date,
      statusUpdatedBy: String, // Agent name or system
      notes: String,
    },

    // Verification Checklist
    verificationChecklist: {
      propertyTypeConfirmed: { status: Boolean, confirmedAt: Date, confirmedBy: String },
      locationConfirmed: { status: Boolean, confirmedAt: Date, confirmedBy: String },
      ownershipConfirmed: { status: Boolean, confirmedAt: Date, confirmedBy: String },
      photosReceived: {
        status: Boolean,
        count: Number,
        urls: [String],
        confirmedAt: Date,
        confirmedBy: String,
      },
      priceConfirmed: { status: Boolean, confirmedAt: Date, confirmedBy: String },
      furnishingConfirmed: { status: Boolean, confirmedAt: Date, confirmedBy: String },
      legalStatusConfirmed: { status: Boolean, confirmedAt: Date, confirmedBy: String },
      allRequiredFieldsComplete: {
        type: Boolean,
        default: false,
        index: true,
      },
    },

    // Conversation History & Follow-ups
    conversationHistory: [
      {
        messageId: String,
        sender: { type: String, enum: ['owner', 'agent', 'nina_bot'] },
        senderName: String,
        content: String,
        timestamp: Date,
        relevantToProperty: Boolean,
        extractedEntities: {
          keywords: [String],
          entities: [String],
        },
      },
    ],

    // Follow-up Actions
    followUpActions: [
      {
        actionType: {
          type: String,
          enum: [
            'ask_for_photos',
            'ask_for_price',
            'ask_for_location',
            'verify_ownership',
            'request_lease_terms',
          ],
        },
        actionCreatedAt: Date,
        actionCreatedBy: String,
        actionText: String,
        sentAt: Date,
        responseReceived: Boolean,
        responseMessage: String,
        responseReceivedAt: Date,
        priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
      },
    ],

    // Link to Final Property (Once verified and added to inventory)
    linkedInventoryPropertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryProperty',
      sparse: true,
    },

    // Assignment
    assignedAgent: {
      agentId: String,
      agentName: String,
      assignedAt: Date,
    },

    // Quality & Performance Metrics
    metrics: {
      viewedByAgents: Number,
      timesFollowedUp: Number,
      daysToVerification: Number,
      daysToListingInInventory: Number,
      leadInterestCount: Number,
      viewingsScheduled: Number,
      dealsClosedFromThisProperty: Number,
    },

    // Tags and Categories
    tags: [String],
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
      index: true,
    },

    // System Fields
    isActive: { type: Boolean, default: true, index: true },
    archived: { type: Boolean, default: false },
    archivedReason: String,
    archivedAt: Date,
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);

// Indexes for efficient querying
PropertyOpportunitySchema.index({ 'sourceReference.conversationId': 1 });
PropertyOpportunitySchema.index({ 'ownerInfo.whatsappNumber': 1 });
PropertyOpportunitySchema.index({ 'propertyDetails.location.area': 1 });
PropertyOpportunitySchema.index({ 'verificationStatus.status': 1 });
PropertyOpportunitySchema.index({ 'confidenceScore.overall': 1 });
PropertyOpportunitySchema.index({ 'assignedAgent.agentId': 1 });
PropertyOpportunitySchema.index({ createdAt: -1 });
PropertyOpportunitySchema.index({ 'verificationChecklist.allRequiredFieldsComplete': 1 });

// Static Methods

/**
 * Find opportunities by area
 */
PropertyOpportunitySchema.statics.findByArea = function (area) {
  return this.find({
    'propertyDetails.location.area': area,
    isActive: true,
    archived: false,
  });
};

/**
 * Find high-confidence opportunities ready for quick-add
 */
PropertyOpportunitySchema.statics.findHighConfidenceOpportunities = function (minConfidence = 80) {
  return this.find({
    'confidenceScore.overall': { $gte: minConfidence },
    'verificationChecklist.allRequiredFieldsComplete': true,
    isActive: true,
    archived: false,
  }).sort({ 'confidenceScore.overall': -1 });
};

/**
 * Find opportunities needing follow-up
 */
PropertyOpportunitySchema.statics.findNeedingFollowUp = function () {
  return this.find({
    'verificationStatus.status': {
      $in: ['initial_detection', 'waiting_for_photos', 'waiting_for_details'],
    },
    isActive: true,
    archived: false,
  }).sort({ createdAt: 1 });
};

/**
 * Find opportunities by owner phone
 */
PropertyOpportunitySchema.statics.findByOwnerPhone = function (phone) {
  return this.findOne({ 'ownerInfo.whatsappNumber': phone });
};

/**
 * Get verification statistics
 */
PropertyOpportunitySchema.statics.getVerificationStats = async function () {
  return this.aggregate([
    { $match: { isActive: true, archived: false } },
    {
      $group: {
        _id: '$verificationStatus.status',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$confidenceScore.overall' },
      },
    },
  ]);
};

/**
 * Calculate overall confidence score
 */
PropertyOpportunitySchema.methods.calculateConfidenceScore = function () {
  const weights = {
    propertyMentioned: 0.25,
    ownerIdentified: 0.25,
    detailsComplete: 0.25,
    priceConfirmed: 0.25,
  };

  const weighted =
    (this.confidenceScore.components.propertyMentioned || 0) * weights.propertyMentioned +
    (this.confidenceScore.components.ownerIdentified || 0) * weights.ownerIdentified +
    (this.confidenceScore.components.detailsComplete || 0) * weights.detailsComplete +
    (this.confidenceScore.components.priceConfirmed || 0) * weights.priceConfirmed;

  this.confidenceScore.overall = Math.round(weighted);
  this.confidenceScore.calculatedAt = new Date();

  return this.confidenceScore.overall;
};

/**
 * Check if all required fields are complete
 */
PropertyOpportunitySchema.methods.checkCompleteness = function () {
  const required = [
    this.propertyDetails.type,
    this.propertyDetails.location.area,
    this.ownerInfo.name,
    this.ownerInfo.whatsappNumber,
  ];

  const allComplete = required.every(field => field !== null && field !== undefined);

  this.verificationChecklist.allRequiredFieldsComplete = allComplete;

  return allComplete;
};

/**
 * Mark as fully verified and ready for inventory
 */
PropertyOpportunitySchema.methods.markFullyVerified = async function (verifiedBy) {
  this.verificationStatus.status = 'fully_verified';
  this.verificationStatus.statusUpdatedAt = new Date();
  this.verificationStatus.statusUpdatedBy = verifiedBy;

  return this.save();
};

export default mongoose.model('PropertyOpportunity', PropertyOpportunitySchema);
