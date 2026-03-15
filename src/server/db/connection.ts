import mongoose, { Schema, Model, Document } from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
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

// ===== CONTRACT & SIGNATURE SCHEMAS =====

interface ISignature {
  signature?: string;
  signerName?: string;
  signedAt?: Date;
  ipAddress?: string;
}

interface ISignatureLink {
  token?: string;
  link?: string;
  expiresAt?: Date;
  createdAt?: Date;
}

interface IContract extends Document {
  contractNumber: string;
  status: 'draft' | 'partially_signed' | 'fully_signed';
  ownerName?: string;
  lessorName?: string;
  lessorEmiratesId?: string;
  lessorLicenseNo?: string;
  lessorLicensingAuthority?: string;
  lessorEmail?: string;
  lessorPhone?: string;
  tenantName?: string;
  tenantEmiratesId?: string;
  tenantLicenseNo?: string;
  tenantLicensingAuthority?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  propertyUsage?: string;
  plotNo?: string;
  makaniNo?: string;
  buildingName?: string;
  propertyNo?: string;
  propertyType?: string;
  propertyArea?: string;
  location?: string;
  premisesNo?: string;
  contractPeriodFrom?: Date;
  contractPeriodTo?: Date;
  contractValue?: number;
  annualRent?: number;
  securityDeposit?: number;
  modeOfPayment?: string;
  numberOfCheques?: string;
  brokerName?: string;
  brokerEmail?: string;
  brokerId?: string;
  signatures?: {
    lessor?: ISignature;
    tenant?: ISignature;
    broker?: ISignature;
  };
  signatureLinks?: {
    lessor?: ISignatureLink;
    tenant?: ISignatureLink;
  };
  driveFileId?: string;
  driveWebViewLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ISignatureToken extends Document {
  token: string;
  contractId: string;
  role: 'lessor' | 'tenant';
  expiresAt: Date;
  used?: boolean;
  usedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const contractSchema = new Schema<IContract>(
  {
    contractNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['draft', 'partially_signed', 'fully_signed'],
      default: 'draft',
    },
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
        ipAddress: String,
      },
      tenant: {
        signature: String,
        signerName: String,
        signedAt: Date,
        ipAddress: String,
      },
      broker: {
        signature: String,
        signerName: String,
        signedAt: Date,
      },
    },
    signatureLinks: {
      lessor: {
        token: String,
        link: String,
        expiresAt: Date,
        createdAt: Date,
      },
      tenant: {
        token: String,
        link: String,
        expiresAt: Date,
        createdAt: Date,
      },
    },
    driveFileId: String,
    driveWebViewLink: String,
  },
  { timestamps: true }
);

const signatureTokenSchema = new Schema<ISignatureToken>(
  {
    token: { type: String, required: true, unique: true },
    contractId: {
      type: Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    role: { type: String, enum: ['lessor', 'tenant'], required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    usedAt: Date,
  },
  { timestamps: true }
);

export const Contract: Model<IContract> = mongoose.model<IContract>(
  'Contract',
  contractSchema
);
export const SignatureToken: Model<ISignatureToken> =
  mongoose.model<ISignatureToken>('SignatureToken', signatureTokenSchema);

// ===== WHATSAPP SCHEMAS =====

interface IWhatsAppMessage extends Document {
  waId: string;
  phoneNumber: string;
  contactName?: string;
  direction: 'incoming' | 'outgoing';
  messageType?: 'text' | 'image' | 'document' | 'audio' | 'video' | 'location' | 'template';
  content?: string;
  mediaUrl?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IWhatsAppChatbotRule extends Document {
  name: string;
  trigger: string;
  triggerType?: 'keyword' | 'contains' | 'regex' | 'any';
  response: string;
  isActive?: boolean;
  priority?: number;
  usageCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IWhatsAppSettings extends Document {
  ownerEmail: string;
  isConnected?: boolean;
  phoneNumber?: string;
  phoneNumberId?: string;
  businessId?: string;
  accessToken?: string;
  webhookVerifyToken?: string;
  connectedAt?: Date;
  settings?: {
    autoReply?: boolean;
    awayMessage?: string;
    workingHours?: {
      enabled?: boolean;
      start?: string;
      end?: string;
      timezone?: string;
    };
    chatbotEnabled?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface IWhatsAppContact extends Document {
  waId: string;
  phoneNumber: string;
  name?: string;
  profilePicture?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
  tags?: string[];
  notes?: string;
  leadScore?: number;
  detectedIntent?: string;
  detectedLanguage?: string;
  extractedEntities?: Record<string, unknown>;
  assignedAgent?: string | null;
  conversationStatus?: 'active' | 'pending' | 'resolved' | 'escalated';
  createdAt?: Date;
  updatedAt?: Date;
}

const whatsappMessageSchema = new Schema<IWhatsAppMessage>(
  {
    waId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    contactName: String,
    direction: {
      type: String,
      enum: ['incoming', 'outgoing'],
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'document', 'audio', 'video', 'location', 'template'],
      default: 'text',
    },
    content: String,
    mediaUrl: String,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent',
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const whatsappChatbotRuleSchema = new Schema<IWhatsAppChatbotRule>(
  {
    name: { type: String, required: true },
    trigger: { type: String, required: true },
    triggerType: {
      type: String,
      enum: ['keyword', 'contains', 'regex', 'any'],
      default: 'keyword',
    },
    response: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const whatsappSettingsSchema = new Schema<IWhatsAppSettings>(
  {
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
      awayMessage: {
        type: String,
        default: 'Hello! We will get back to you soon.',
      },
      workingHours: {
        enabled: { type: Boolean, default: false },
        start: { type: String, default: '09:00' },
        end: { type: String, default: '22:00' },
        timezone: { type: String, default: 'Asia/Dubai' },
      },
      chatbotEnabled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const whatsappContactSchema = new Schema<IWhatsAppContact>(
  {
    waId: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    name: String,
    profilePicture: String,
    lastMessageAt: Date,
    unreadCount: { type: Number, default: 0 },
    tags: [String],
    notes: String,
    leadScore: { type: Number, default: 0 },
    detectedIntent: String,
    detectedLanguage: String,
    extractedEntities: {
      type: Schema.Types.Mixed,
      default: {},
    },
    assignedAgent: { type: String, default: null },
    conversationStatus: {
      type: String,
      enum: ['active', 'pending', 'resolved', 'escalated'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const WhatsAppMessage: Model<IWhatsAppMessage> =
  mongoose.model<IWhatsAppMessage>('WhatsAppMessage', whatsappMessageSchema);
export const WhatsAppChatbotRule: Model<IWhatsAppChatbotRule> =
  mongoose.model<IWhatsAppChatbotRule>(
    'WhatsAppChatbotRule',
    whatsappChatbotRuleSchema
  );
export const WhatsAppSettings: Model<IWhatsAppSettings> =
  mongoose.model<IWhatsAppSettings>(
    'WhatsAppSettings',
    whatsappSettingsSchema
  );
export const WhatsAppContact: Model<IWhatsAppContact> =
  mongoose.model<IWhatsAppContact>(
    'WhatsAppContact',
    whatsappContactSchema
  );
