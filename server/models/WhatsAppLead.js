const mongoose = require('mongoose');

const whatsAppLeadSchema = new mongoose.Schema(
  {
    // WhatsApp Contact Info
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    whatsAppId: {
      type: String,
      unique: true,
      sparse: true,
    },
    displayName: String,
    profilePicUrl: String,

    // Lead Metadata
    leadType: {
      type: String,
      enum: ['inquiry', 'property-specific', 'appointment-request', 'negotiation', 'complaint', 'other'],
      default: 'inquiry',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost'],
      default: 'new',
    },
    leadScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Property Interest
    propertyIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
    preferredAreas: [String],
    budgetMin: Number,
    budgetMax: Number,
    propertyType: [String], // 'apartment', 'villa', 'townhouse', etc.
    bedrooms: Number,
    moveInDate: Date,

    // Conversation
    conversationHistory: [
      {
        timestamp: Date,
        sender: {
          type: String,
          enum: ['user', 'bot', 'agent'],
        },
        message: String,
        messageType: {
          type: String,
          enum: ['text', 'image', 'document', 'location'],
          default: 'text',
        },
        mediaUrl: String,
        intent: String, // e.g., 'price_inquiry', 'schedule_viewing', 'location_info'
        entities: mongoose.Schema.Types.Mixed, // e.g., { area: 'JBR', priceRange: '500k-800k' }
      },
    ],

    // Engagement Metrics
    firstContactDate: Date,
    lastInteractionDate: Date,
    messageCount: {
      type: Number,
      default: 0,
    },
    responseTimeAverage: Number, // minutes
    engagementLevel: {
      type: String,
      enum: ['cold', 'warm', 'hot'],
      default: 'cold',
    },

    // Agent Assignment
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
    },
    assignedAt: Date,

    // NLP Analysis
    nlpAnalysis: {
      keywords: [String],
      sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
      },
      intent: String,
      entities: mongoose.Schema.Mixed,
      lastAnalyzedAt: Date,
    },

    // Qualification Info
    qualificationScore: Number,
    qualificationNotes: String,
    qualifiedAt: Date,

    // Contact Preferences
    preferredContactMethod: {
      type: String,
      enum: ['whatsapp', 'call', 'sms', 'email'],
      default: 'whatsapp',
    },
    doNotContact: {
      type: Boolean,
      default: false,
    },
    timezone: String,

    // CRM Integration
    linkedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    source: {
      type: String,
      enum: ['whatsapp-bot', 'website-form', 'agent-referral', 'import'],
      default: 'whatsapp-bot',
    },

    // Custom Metadata
    customFields: mongoose.Schema.Types.Mixed,
    tags: [String],
    notes: [
      {
        content: String,
        createdBy: mongoose.Schema.Types.ObjectId,
        createdAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
whatsAppLeadSchema.index({ phoneNumber: 1 });
whatsAppLeadSchema.index({ whatsAppId: 1 });
whatsAppLeadSchema.index({ status: 1 });
whatsAppLeadSchema.index({ leadScore: -1 });
whatsAppLeadSchema.index({ assignedAgentId: 1 });
whatsAppLeadSchema.index({ lastInteractionDate: -1 });
whatsAppLeadSchema.index({ propertyIds: 1 });
whatsAppLeadSchema.index({ createdAt: -1 });

// Method to add message to conversation history
whatsAppLeadSchema.methods.addMessage = function (message) {
  this.conversationHistory.push({
    timestamp: new Date(),
    ...message,
  });
  this.lastInteractionDate = new Date();
  this.messageCount = (this.messageCount || 0) + 1;
  return this.save();
};

// Method to update NLP analysis
whatsAppLeadSchema.methods.updateNLPAnalysis = function (analysis) {
  this.nlpAnalysis = {
    ...this.nlpAnalysis,
    ...analysis,
    lastAnalyzedAt: new Date(),
  };
  return this.save();
};

// Method to calculate lead score
whatsAppLeadSchema.methods.calculateLeadScore = function () {
  let score = 0;

  // Recent interaction (up to 20 points)
  if (this.lastInteractionDate) {
    const hoursSinceLastInteraction =
      (new Date() - this.lastInteractionDate) / (1000 * 60 * 60);
    if (hoursSinceLastInteraction < 24) score += 20;
    else if (hoursSinceLastInteraction < 7 * 24) score += 10;
  }

  // Message count (up to 15 points)
  if (this.messageCount > 10) score += 15;
  else if (this.messageCount > 5) score += 10;
  else if (this.messageCount > 2) score += 5;

  // Sentiment (up to 20 points)
  if (this.nlpAnalysis && this.nlpAnalysis.sentiment === 'positive') score += 20;
  else if (this.nlpAnalysis && this.nlpAnalysis.sentiment === 'neutral')
    score += 10;

  // Property interests (up to 25 points)
  if (this.propertyIds && this.propertyIds.length > 0)
    score += Math.min(25, this.propertyIds.length * 5);

  // Budget defined (up to 20 points)
  if (this.budgetMin && this.budgetMax) score += 20;
  else if (this.budgetMin || this.budgetMax) score += 10;

  this.leadScore = Math.min(100, score);
  return this.save();
};

// Method to determine engagement level
whatsAppLeadSchema.methods.updateEngagementLevel = function () {
  if (this.leadScore >= 70) this.engagementLevel = 'hot';
  else if (this.leadScore >= 40) this.engagementLevel = 'warm';
  else this.engagementLevel = 'cold';
  return this.save();
};

module.exports = mongoose.model('WhatsAppLead', whatsAppLeadSchema);
