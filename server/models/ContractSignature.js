import mongoose from 'mongoose';

const contractSignatureSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true
    },
    signedBy: {
      userId: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
      role: {
        type: String,
        enum: ['buyer', 'seller', 'tenant', 'landlord', 'agent', 'witness'],
        required: true
      }
    },
    signatureData: {
      imageData: String, // base64 encoded signature
      mimeType: String, // 'image/png', 'image/jpeg'
      hash: String // SHA-256 of signature for verification
    },
    signedAt: {
      type: Date,
      default: Date.now
    },
    // Device & security info
    deviceInfo: {
      ipAddress: String,
      userAgent: String,
      platform: String, // 'Windows', 'macOS', 'iOS', 'Android'
      browser: String
    },
    // Signing method
    method: {
      type: String,
      enum: ['canvas', 'biometric', 'digital_certificate'],
      default: 'canvas'
    },
    // Status
    status: {
      type: String,
      enum: ['pending', 'signed', 'rejected', 'expired'],
      default: 'pending'
    },
    // Expiration for pending signatures
    expiresAt: Date,
    // Signing order (multi-party contracts)
    order: Number, // 1st signer, 2nd signer, etc.
    // Notes
    notes: String
  },
  { timestamps: true }
);

// Indexes
contractSignatureSchema.index({ contractId: 1 });
contractSignatureSchema.index({ 'signedBy.userId': 1 });
contractSignatureSchema.index({ status: 1 });
contractSignatureSchema.index({ createdAt: 1 });

export default mongoose.model('ContractSignature', contractSignatureSchema);
