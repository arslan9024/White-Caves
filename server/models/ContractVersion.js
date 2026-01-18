import mongoose from 'mongoose';

const contractVersionSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true
    },
    versionNumber: {
      type: Number,
      required: true
    },
    // Previous version reference
    previousVersionId: mongoose.Schema.Types.ObjectId,
    // What changed
    changes: {
      modified: [String], // List of fields that changed
      details: String // Description of changes
    },
    // Snapshot of contract state at this version
    snapshot: mongoose.Schema.Types.Mixed, // Store complete contract state
    // Who made the change
    createdBy: {
      userId: mongoose.Schema.Types.ObjectId,
      email: String,
      name: String,
      role: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    // Approval status
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'approved', 'rejected'],
      default: 'draft'
    },
    // Signature status at this version
    signatureStatus: {
      totalSignaturesRequired: Number,
      signaturesReceived: Number,
      pendingSigners: [String] // emails of signers
    },
    // Notes about this version
    notes: String
  },
  { timestamps: true }
);

// Indexes
contractVersionSchema.index({ contractId: 1, versionNumber: 1 });
contractVersionSchema.index({ status: 1 });

export default mongoose.model('ContractVersion', contractVersionSchema);
