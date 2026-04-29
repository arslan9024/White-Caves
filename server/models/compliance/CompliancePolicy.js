import mongoose from 'mongoose';

const CompliancePolicySchema = new mongoose.Schema({
  // Basic Information
  policyType: {
    type: String,
    enum: ['AML_CFT', 'KYC', 'CDD', 'DATA_PROTECTION', 'DOCUMENT_RETENTION', 'TRAINING'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },

  // Version Management
  version: {
    major: { type: Number, default: 1 },
    minor: { type: Number, default: 0 },
    patch: { type: Number, default: 0 }
  },
  versionString: {
    type: String,
    default: function() {
      return `${this.version.major}.${this.version.minor}.${this.version.patch}`;
    }
  },

  // Content
  content: {
    type: String,
    required: true
  },
  htmlContent: {
    type: String,
    default: null
  },

  // Status & Dates
  status: {
    type: String,
    enum: ['draft', 'under_review', 'legal_review', 'approved', 'signed', 'active', 'archived', 'expired'],
    default: 'draft'
  },
  effectiveDate: {
    type: Date,
    default: null
  },
  lastReviewDate: {
    type: Date,
    default: null
  },
  nextReviewDate: {
    type: Date,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null
  },

  // Approval Chain
  approvalChain: [{
    stage: {
      type: String,
      enum: ['compliance_officer', 'legal_counsel', 'ceo', 'board'],
      required: true
    },
    roleName: String,
    assignedTo: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'commented'],
      default: 'pending'
    },
    approverName: String,
    approverId: String,
    approvalDate: Date,
    comments: String,
    rejectionReason: String
  }],

  // Signatures
  signatures: [{
    signedBy: String,
    signerName: String,
    signerId: String,
    role: String,
    signatureDate: Date,
    method: {
      type: String,
      enum: ['digital', 'physical', 'electronic'],
      default: 'digital'
    },
    signatureUrl: String,
    ipAddress: String,
    deviceInfo: String
  }],

  // Documents & Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    uploadedDate: Date,
    fileType: String,
    description: String
  }],

  // Tags & Categories
  tags: [String],
  category: {
    type: String,
    enum: ['Governance', 'Procedures', 'Forms', 'Training', 'Regulatory'],
    default: 'Governance'
  },

  // Access Control
  accessControl: {
    viewableBy: {
      type: [String],
      default: ['compliance_officer', 'admin', 'management'],
      enum: ['compliance_officer', 'admin', 'management', 'staff', 'public']
    },
    editableBy: {
      type: [String],
      default: ['compliance_officer', 'legal'],
      enum: ['compliance_officer', 'legal', 'admin', 'ceo']
    },
    fileableBy: {
      type: [String],
      default: ['compliance_officer', 'admin'],
      enum: ['compliance_officer', 'admin', 'ceo']
    }
  },

  // Audit Trail
  auditTrail: [{
    action: String,
    actor: String,
    actorId: String,
    timestamp: { type: Date, default: Date.now },
    changes: mongoose.Schema.Types.Mixed,
    details: String,
    ipAddress: String
  }],

  // Publishing
  publishedAt: Date,
  publishedBy: String,
  archivedAt: Date,
  archivedBy: String,
  archivedReason: String,

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String,

  // Version History (track all versions)
  versionHistory: [{
    version: String,
    content: String,
    createdDate: Date,
    createdBy: String,
    status: String
  }],

  // Company Reference
  companyName: {
    type: String,
    default: 'White Caves Real Estate LLC'
  },
  companyLicense: {
    type: String,
    default: '1388443'
  }
});

// Index for fast queries
CompliancePolicySchema.index({ policyType: 1, status: 1 });
CompliancePolicySchema.index({ effectiveDate: 1 });
CompliancePolicySchema.index({ tags: 1 });

// Middleware: Update updatedAt on save
CompliancePolicySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (!this.versionString) {
    this.versionString = `${this.version.major}.${this.version.minor}.${this.version.patch}`;
  }
  next();
});

export default mongoose.model('CompliancePolicy', CompliancePolicySchema);
