import mongoose, { Schema, Model, Document } from 'mongoose';

interface IQuickReply {
  trigger?: string;
  response?: string;
  enabled?: boolean;
}

interface IBusinessHours {
  start?: string;
  end?: string;
  timezone?: string;
}

interface IMessageCount {
  sent?: number;
  received?: number;
}

interface IWhatsAppSession extends Document {
  userId?: string | null;
  ownerEmail: string;
  sessionId: string;
  phoneNumber?: string | null;
  businessName?: string;
  connectionStatus?: 'disconnected' | 'connecting' | 'connected' | 'qr_pending' | 'authenticated';
  lastQrCode?: string | null;
  qrCodeExpiry?: Date | null;
  sessionData?: Record<string, unknown> | null;
  webhookUrl?: string | null;
  autoReplyEnabled?: boolean;
  chatbotEnabled?: boolean;
  businessHoursOnly?: boolean;
  businessHours?: IBusinessHours;
  awayMessage?: string;
  welcomeMessage?: string;
  quickReplies?: IQuickReply[];
  connectedAt?: Date | null;
  lastMessageAt?: Date | null;
  messageCount?: IMessageCount;
  metaBusinessId?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenExpiry?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  isConnected(): boolean;
  isQrExpired(): boolean;
}

interface IWhatsAppSessionModel extends Model<IWhatsAppSession> {}

const whatsAppSessionSchema = new Schema<IWhatsAppSession>(
  {
    userId: {
      type: String,
      required: false,
      default: null,
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
    phoneNumber: {
      type: String,
      default: null,
    },
    businessName: {
      type: String,
      default: 'White Caves Real Estate',
    },
    connectionStatus: {
      type: String,
      enum: ['disconnected', 'connecting', 'connected', 'qr_pending', 'authenticated'],
      default: 'disconnected',
    },
    lastQrCode: {
      type: String,
      default: null,
    },
    qrCodeExpiry: {
      type: Date,
      default: null,
    },
    sessionData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    webhookUrl: {
      type: String,
      default: null,
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
      start: { type: String, default: '09:00' },
      end: { type: String, default: '22:00' },
      timezone: { type: String, default: 'Asia/Dubai' },
    },
    awayMessage: {
      type: String,
      default:
        'Thank you for contacting White Caves Real Estate. We are currently away and will respond as soon as possible.',
    },
    welcomeMessage: {
      type: String,
      default:
        'Welcome to White Caves Real Estate! How can we assist you today with your property needs in Dubai?',
    },
    quickReplies: [
      {
        trigger: String,
        response: String,
        enabled: { type: Boolean, default: true },
      },
    ],
    connectedAt: {
      type: Date,
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    messageCount: {
      sent: { type: Number, default: 0 },
      received: { type: Number, default: 0 },
    },
    metaBusinessId: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Instance methods
whatsAppSessionSchema.methods.isConnected = function (this: IWhatsAppSession): boolean {
  return (
    this.connectionStatus === 'connected' || this.connectionStatus === 'authenticated'
  );
};

whatsAppSessionSchema.methods.isQrExpired = function (this: IWhatsAppSession): boolean {
  if (!this.qrCodeExpiry) return true;
  return new Date() > this.qrCodeExpiry;
};

const WhatsAppSession: IWhatsAppSessionModel = mongoose.model<IWhatsAppSession, IWhatsAppSessionModel>(
  'WhatsAppSession',
  whatsAppSessionSchema
);

export default WhatsAppSession;
export type { IWhatsAppSession, IQuickReply, IBusinessHours, IMessageCount };
