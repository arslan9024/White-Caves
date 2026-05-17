const mongoose = require('mongoose');

const agentContactSchema = new mongoose.Schema(
  {
    // Contact Request Info
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    whatsAppLeadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WhatsAppLead',
    },

    // Contact Details
    contactMethod: {
      type: String,
      enum: ['whatsapp', 'email', 'call', 'sms'],
      default: 'whatsapp',
    },
    message: String,
    preferredDate: Date,
    preferredTime: String, // HH:mm format

    // Status Tracking
    status: {
      type: String,
      enum: ['pending', 'viewed', 'responded', 'scheduled', 'completed', 'cancelled'],
      default: 'pending',
    },
    response: String,
    respondedAt: Date,
    agentNotes: String,

    // Viewing Association
    viewingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Viewing',
    },

    // Metadata
    viewedAt: Date,
    conversationHistory: [
      {
        timestamp: Date,
        sender: String, // 'agent' or 'user'
        message: String,
        type: {
          type: String,
          enum: ['text', 'image', 'schedule_confirmation'],
        },
      },
    ],

    // Analytics
    responseTime: Number, // minutes
    userInteracted: Boolean,
    leadConverted: Boolean,
  },
  {
    timestamps: true,
  }
);

// Indexes
agentContactSchema.index({ agentId: 1, status: 1 });
agentContactSchema.index({ propertyId: 1 });
agentContactSchema.index({ userId: 1 });
agentContactSchema.index({ status: 1 });
agentContactSchema.index({ createdAt: -1 });
agentContactSchema.index({ preferredDate: 1 });

// Methods
agentContactSchema.methods.markAsViewed = function () {
  this.viewedAt = new Date();
  this.status = 'viewed';
  return this.save();
};

agentContactSchema.methods.addConversationMessage = function (sender, message, type = 'text') {
  this.conversationHistory.push({
    timestamp: new Date(),
    sender,
    message,
    type,
  });
  return this.save();
};

agentContactSchema.methods.calculateResponseTime = function () {
  if (this.respondedAt && this.createdAt) {
    this.responseTime = Math.floor((this.respondedAt - this.createdAt) / (1000 * 60)); // in minutes
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('AgentContact', agentContactSchema);
