/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
import mongoose from 'mongoose';

const contractSignatureSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
      index: true,
    },
    signedBy: {
      userId: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
      role: {
        type: String,
        enum: ['buyer', 'seller', 'tenant', 'landlord', 'agent', 'witness'],
        required: true,
      },
    },
    signerType: {
      type: String,
      enum: ['landlord', 'tenant', 'agent', 'witness'],
      default: null,
    },
    signatureData: {
      imageData: String, // base64 encoded signature
      mimeType: String, // 'image/png', 'image/jpeg'
      hash: String, // SHA-256 of signature for verification
    },
    signedAt: {
      type: Date,
      default: null,
    },
    // Device & security info
    deviceInfo: {
      ipAddress: String,
      userAgent: String,
      platform: String, // 'Windows', 'macOS', 'iOS', 'Android'
      browser: String,
    },
    // Signing method
    method: {
      type: String,
      enum: ['canvas', 'biometric', 'digital_certificate', 'typed', 'uploaded'],
      default: 'canvas',
    },
    // Status
    status: {
      type: String,
      enum: ['pending', 'sent', 'opened', 'signed', 'rejected', 'expired'],
      default: 'pending',
      index: true,
    },
    // Expiration for pending signatures
    expiresAt: Date,
    // Signing order (multi-party contracts)
    order: Number, // 1st signer, 2nd signer, etc.
    // Signature token (for email links)
    tokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SignatureToken',
    },
    token: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    // Email tracking
    emailHistory: [
      {
        type: {
          type: String,
          enum: ['initial_request', 'reminder', 'escalation', 'confirmation'],
          default: 'initial_request',
        },
        sentAt: Date,
        openedAt: Date,
        clickedAt: Date,
        status: {
          type: String,
          enum: ['sent', 'bounced', 'opened', 'clicked'],
          default: 'sent',
        },
      },
    ],
    // Reminders sent
    reminders: [
      {
        sentAt: Date,
        type: {
          type: String,
          enum: ['day3', 'day5', 'day7_before_expiry'],
          default: 'day3',
        },
      },
    ],
    // Verification details
    validatedAt: Date,
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Rejection details
    rejectionReason: String,
    rejectedAt: Date,
    // Document hash for integrity
    documentHash: String,
    // Additional metadata
    metadata: {
      timezone: String,
      locale: String,
      browserInfo: String,
    },
    // Notes
    notes: String,
  },
  { timestamps: true }
);

// Indexes
contractSignatureSchema.index({ 'signedBy.userId': 1 });
contractSignatureSchema.index({ createdAt: 1 });
contractSignatureSchema.index({ contractId: 1, status: 1 });

// Methods
contractSignatureSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

contractSignatureSchema.methods.isSigned = function () {
  return this.status === 'signed' && this.signedAt;
};

contractSignatureSchema.methods.isPending = function () {
  return ['pending', 'sent', 'opened'].includes(this.status);
};

contractSignatureSchema.methods.addEmailEvent = async function (eventType, eventStatus = 'sent') {
  if (!this.emailHistory) {
    this.emailHistory = [];
  }

  this.emailHistory.push({
    type: eventType,
    sentAt: new Date(),
    status: eventStatus,
  });

  this.status = 'sent';
  return this.save();
};

contractSignatureSchema.methods.markAsOpened = async function () {
  if (this.emailHistory && this.emailHistory.length > 0) {
    this.emailHistory[this.emailHistory.length - 1].openedAt = new Date();
    this.emailHistory[this.emailHistory.length - 1].status = 'opened';
  }
  this.status = 'opened';
  return this.save();
};

contractSignatureSchema.methods.addReminder = async function (reminderType) {
  if (!this.reminders) {
    this.reminders = [];
  }

  this.reminders.push({
    sentAt: new Date(),
    type: reminderType,
  });

  return this.save();
};

// Statics
contractSignatureSchema.statics.getSignatureStatus = async function (contractId) {
  const signatures = await this.find({ contractId }).populate('signedBy.userId', 'name email');

  if (signatures.length === 0) {
    return { status: 'no_signatures', count: 0, signatures: [] };
  }

  const signedCount = signatures.filter(s => s.isSigned()).length;
  const totalCount = signatures.length;
  const pendingCount = signatures.filter(s => s.isPending()).length;

  let overallStatus = 'pending';
  if (signedCount === totalCount) {
    overallStatus = 'fully_signed';
  } else if (signedCount > 0) {
    overallStatus = 'partially_signed';
  }

  return {
    status: overallStatus,
    signed: signedCount,
    pending: pendingCount,
    total: totalCount,
    signatures: signatures.map(s => ({
      signerType: s.signerType || s.signedBy.role,
      name: s.signedBy.name,
      email: s.signedBy.email,
      status: s.status,
      signedAt: s.signedAt,
      expiresAt: s.expiresAt,
    })),
  };
};

contractSignatureSchema.statics.getPendingSignatures = async function (contractId) {
  return this.find({
    contractId,
    status: { $in: ['pending', 'sent', 'opened'] },
  }).populate('signedBy.userId', 'name email');
};

contractSignatureSchema.statics.getSignedSignatures = async function (contractId) {
  return this.find({
    contractId,
    status: 'signed',
  }).populate('signedBy.userId', 'name email');
};

contractSignatureSchema.statics.findByToken = async function (token) {
  return this.findOne({ token });
};

export default mongoose.model('ContractSignature', contractSignatureSchema);
