import mongoose from 'mongoose';

const whatsAppSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false,
    default: null
  },
  ownerEmail: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    default: null
  },
  businessName: {
    type: String,
    default: 'White Caves Real Estate'
  },
  connectionStatus: {
    type: String,
    enum: ['disconnected', 'connecting', 'connected', 'qr_pending', 'authenticated'],
    default: 'disconnected'
  },
  lastQrCode: {
    type: String,
    default: null
  },
  qrCodeExpiry: {
    type: Date,
    default: null
  },
  sessionData: {
    type: Object,
    default: null
  },
  webhookUrl: {
    type: String,
    default: null
  },
  autoReplyEnabled: {
    type: Boolean,
    default: true
  },
  chatbotEnabled: {
    type: Boolean,
    default: true
  },
  businessHoursOnly: {
    type: Boolean,
    default: false
  },
  businessHours: {
    start: { type: String, default: '09:00' },
    end: { type: String, default: '22:00' },
    timezone: { type: String, default: 'Asia/Dubai' }
  },
  awayMessage: {
    type: String,
    default: 'Thank you for contacting White Caves Real Estate. We are currently away and will respond as soon as possible.'
  },
  welcomeMessage: {
    type: String,
    default: 'Welcome to White Caves Real Estate! How can we assist you today with your property needs in Dubai?'
  },
  quickReplies: [{
    trigger: String,
    response: String,
    enabled: { type: Boolean, default: true }
  }],
  connectedAt: {
    type: Date,
    default: null
  },
  lastMessageAt: {
    type: Date,
    default: null
  },
  messageCount: {
    sent: { type: Number, default: 0 },
    received: { type: Number, default: 0 }
  },
  metaBusinessId: {
    type: String,
    default: null
  },
  accessToken: {
    type: String,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  },
  tokenExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

whatsAppSessionSchema.methods.isConnected = function() {
  return this.connectionStatus === 'connected' || this.connectionStatus === 'authenticated';
};

whatsAppSessionSchema.methods.isQrExpired = function() {
  if (!this.qrCodeExpiry) return true;
  return new Date() > this.qrCodeExpiry;
};

const WhatsAppSession = mongoose.model('WhatsAppSession', whatsAppSessionSchema);

export default WhatsAppSession;
