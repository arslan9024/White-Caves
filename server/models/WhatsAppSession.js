import mongoose from 'mongoose';

const whatsAppSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    ownerEmail: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    connectionStatus: {
      type: String,
      enum: ['connected', 'connecting', 'disconnected'],
      default: 'disconnected',
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    businessName: {
      type: String,
      default: 'White Caves Real Estate',
    },
    connectedAt: {
      type: Date,
    },
    lastMessageAt: {
      type: Date,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    autoReplyEnabled: {
      type: Boolean,
      default: true,
    },
    chatbotEnabled: {
      type: Boolean,
      default: true,
    },
    businessHoursOnly: {
      type: Boolean,
      default: false,
    },
    businessHours: {
      type: Object,
      default: {},
    },
    welcomeMessage: {
      type: String,
      default: 'Welcome to White Caves Real Estate LLC.',
    },
    awayMessage: {
      type: String,
      default: 'We are currently offline. We will get back to you shortly.',
    },
    quickReplies: {
      type: Array,
      default: [],
    },
    qrCode: {
      type: String,
    },
    pairingCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WhatsAppSession =
  mongoose.models.WhatsAppSession || mongoose.model('WhatsAppSession', whatsAppSessionSchema);

export default WhatsAppSession;
