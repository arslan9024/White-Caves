import mongoose from 'mongoose';
import crypto from 'crypto';

const signatureTokenSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
      index: true
    },
    contractSignatureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractSignature'
    },
    signerType: {
      type: String,
      enum: ['landlord', 'tenant', 'agent', 'witness'],
      required: true
    },
    signerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    // Token expiration (7 days)
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    // Token usage tracking
    usedAt: Date,
    status: {
      type: String,
      enum: ['active', 'used', 'expired', 'revoked'],
      default: 'active',
      index: true
    },
    // Email tracking
    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentAt: Date,
    emailBounced: Boolean,
    
    // Reminder tracking
    reminders: [
      {
        sentAt: Date,
        type: {
          type: String,
          enum: ['day3', 'day5', 'day7_before_expiry'],
          default: 'day3'
        },
        status: {
          type: String,
          enum: ['sent', 'bounced', 'failed'],
          default: 'sent'
        }
      }
    ],
    
    // Security information
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    // Metadata
    metadata: {
      ipAddress: String,
      userAgent: String
    }
  },
  { 
    timestamps: true,
    indexes: [
      { contractId: 1, signerType: 1 },
      { token: 1 },
      { expiresAt: 1 },
      { status: 1 },
      { signerId: 1 }
    ]
  }
);

// Generate secure token
signatureTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Create token for signer
signatureTokenSchema.statics.createForSigner = async function(contractId, signerId, signerType, createdByUserId) {
  const token = this.generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days validity
  
  const signatureToken = new this({
    contractId,
    signerId,
    signerType,
    token,
    expiresAt,
    createdByUserId,
    status: 'active'
  });
  
  return signatureToken.save();
};

// Methods
signatureTokenSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

signatureTokenSchema.methods.isActive = function() {
  return this.status === 'active' && !this.isExpired();
};

signatureTokenSchema.methods.markAsUsed = async function() {
  this.usedAt = new Date();
  this.status = 'used';
  return this.save();
};

signatureTokenSchema.methods.markAsExpired = async function() {
  this.status = 'expired';
  return this.save();
};

signatureTokenSchema.methods.revoke = async function(reason = '') {
  this.status = 'revoked';
  return this.save();
};

signatureTokenSchema.methods.markEmailSent = async function() {
  this.emailSent = true;
  this.emailSentAt = new Date();
  return this.save();
};

signatureTokenSchema.methods.addReminder = async function(reminderType) {
  if (!this.reminders) {
    this.reminders = [];
  }
  
  this.reminders.push({
    sentAt: new Date(),
    type: reminderType,
    status: 'sent'
  });
  
  return this.save();
};

// Statics
signatureTokenSchema.statics.findByToken = async function(token) {
  const signatureToken = await this.findOne({ token, status: 'active' });
  
  if (!signatureToken) {
    return null;
  }
  
  if (signatureToken.isExpired()) {
    await signatureToken.markAsExpired();
    return null;
  }
  
  return signatureToken;
};

signatureTokenSchema.statics.getPendingTokens = async function(contractId) {
  return this.find({
    contractId,
    status: 'active',
    expiresAt: { $gt: new Date() }
  }).populate('signerId', 'name email');
};

signatureTokenSchema.statics.getExpiredTokens = async function() {
  return this.find({
    status: 'active',
    expiresAt: { $lt: new Date() }
  });
};

signatureTokenSchema.statics.cleanupExpiredTokens = async function() {
  const expiredTokens = await this.getExpiredTokens();
  
  for (const token of expiredTokens) {
    await token.markAsExpired();
  }
  
  return expiredTokens.length;
};

// Prevent model recompilation when module reloads
const SignatureTokenModel = mongoose.models.SignatureToken || mongoose.model('SignatureToken', signatureTokenSchema);
export default SignatureTokenModel;
