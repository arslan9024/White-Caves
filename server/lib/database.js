import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('MONGODB_URI not set, using in-memory storage');
    return;
  }
  
  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

const contractSchema = new mongoose.Schema({
  contractNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft', 'partially_signed', 'fully_signed'], default: 'draft' },
  ownerName: String,
  lessorName: String,
  lessorEmiratesId: String,
  lessorLicenseNo: String,
  lessorLicensingAuthority: String,
  lessorEmail: String,
  lessorPhone: String,
  tenantName: String,
  tenantEmiratesId: String,
  tenantLicenseNo: String,
  tenantLicensingAuthority: String,
  tenantEmail: String,
  tenantPhone: String,
  propertyUsage: { type: String, default: 'Residential' },
  plotNo: String,
  makaniNo: String,
  buildingName: String,
  propertyNo: String,
  propertyType: String,
  propertyArea: String,
  location: String,
  premisesNo: String,
  contractPeriodFrom: Date,
  contractPeriodTo: Date,
  contractValue: Number,
  annualRent: Number,
  securityDeposit: Number,
  modeOfPayment: String,
  numberOfCheques: String,
  brokerName: String,
  brokerEmail: String,
  brokerId: String,
  signatures: {
    lessor: {
      signature: String,
      signerName: String,
      signedAt: Date,
      ipAddress: String
    },
    tenant: {
      signature: String,
      signerName: String,
      signedAt: Date,
      ipAddress: String
    },
    broker: {
      signature: String,
      signerName: String,
      signedAt: Date
    }
  },
  signatureLinks: {
    lessor: {
      token: String,
      link: String,
      expiresAt: Date,
      createdAt: Date
    },
    tenant: {
      token: String,
      link: String,
      expiresAt: Date,
      createdAt: Date
    }
  },
  driveFileId: String,
  driveWebViewLink: String
}, { timestamps: true });

const signatureTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  role: { type: String, enum: ['lessor', 'tenant'], required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  usedAt: Date
}, { timestamps: true });

export const Contract = mongoose.model('Contract', contractSchema);
export const SignatureToken = mongoose.model('SignatureToken', signatureTokenSchema);

const whatsappMessageSchema = new mongoose.Schema({
  waId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  contactName: String,
  direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
  messageType: { type: String, enum: ['text', 'image', 'document', 'audio', 'video', 'location', 'template'], default: 'text' },
  content: String,
  mediaUrl: String,
  status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const whatsappChatbotRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trigger: { type: String, required: true },
  triggerType: { type: String, enum: ['keyword', 'contains', 'regex', 'any'], default: 'keyword' },
  response: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

const whatsappSettingsSchema = new mongoose.Schema({
  ownerEmail: { type: String, required: true, unique: true },
  isConnected: { type: Boolean, default: false },
  phoneNumber: String,
  phoneNumberId: String,
  businessId: String,
  accessToken: String,
  webhookVerifyToken: String,
  connectedAt: Date,
  settings: {
    autoReply: { type: Boolean, default: false },
    awayMessage: { type: String, default: 'Hello! We will get back to you soon.' },
    workingHours: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '22:00' },
      timezone: { type: String, default: 'Asia/Dubai' }
    },
    chatbotEnabled: { type: Boolean, default: false }
  }
}, { timestamps: true });

const whatsappContactSchema = new mongoose.Schema({
  waId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  name: String,
  profilePicture: String,
  lastMessageAt: Date,
  unreadCount: { type: Number, default: 0 },
  tags: [String],
  notes: String
}, { timestamps: true });

export const WhatsAppMessage = mongoose.model('WhatsAppMessage', whatsappMessageSchema);
export const WhatsAppChatbotRule = mongoose.model('WhatsAppChatbotRule', whatsappChatbotRuleSchema);
export const WhatsAppSettings = mongoose.model('WhatsAppSettings', whatsappSettingsSchema);
export const WhatsAppContact = mongoose.model('WhatsAppContact', whatsappContactSchema);
