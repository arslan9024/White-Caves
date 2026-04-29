import mongoose from 'mongoose';

const ComplianceOfficerDesignationSchema = new mongoose.Schema({
  // Officer Details
  officerName: {
    type: String,
    required: true,
    trim: true
  },
  officerFirstName: String,
  officerLastName: String,
  emiratesId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nationality: {
    type: String,
    default: 'Pakistan'
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },

  // Contact Information
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  alternateEmail: String,
  alternatePhone: String,

  // Designation Details
  title: {
    type: String,
    default: 'Managing Director & AML Compliance Officer',
    required: true
  },
  department: String,
  reportingTo: String,

  // Appointment Information
  appointmentDate: {
    type: Date,
    required: true,
    default: () => new Date('2026-01-20')
  },
  effectiveDate: {
    type: Date,
    required: true,
    default: () => new Date('2026-01-20')
  },
  designationStatus: {
    type: String,
    enum: ['designated', 'active', 'suspended', 'terminated', 'inactive'],
    default: 'active'
  },

  // Delegated Authorities
  delegatedAuthorities: {
    type: [String],
    default: [
      'file_str',
      'conduct_edd',
      'staff_training',
      'document_verification',
      'regulatory_liaison',
      'policy_approval',
      'record_management',
      'customer_screening',
      'transaction_monitoring'
    ],
    enum: [
      'file_str',
      'conduct_edd',
      'staff_training',
      'document_verification',
      'regulatory_liaison',
      'policy_approval',
      'record_management',
      'customer_screening',
      'transaction_monitoring',
      'audit_review',
      'signature_authority'
    ]
  },

  // Responsibilities
  responsibilities: {
    type: [String],
    default: [
      'File Suspicious Transaction Reports on goAML portal',
      'Conduct Customer Due Diligence assessments',
      'Approve risk assessments for high-value transactions',
      'Screen customers against PEP and sanctions lists',
      'Conduct annual AML/CFT training for staff',
      'Maintain compliance records and audit trails',
      'Liaison with FIU and regulatory authorities',
      'Approve AML/CFT policies and updates',
      'Investigate suspicious transactions',
      'Prepare quarterly compliance reports to Board'
    ]
  },

  // Authority Documents
  appointmentLetter: {
    documentId: String,
    fileName: String,
    fileUrl: String,
    uploadedDate: Date,
    status: {
      type: String,
      enum: ['draft', 'awaiting_signature', 'signed', 'archived'],
      default: 'draft'
    },
    signedDate: Date,
    signedBy: String
  },

  boardResolution: {
    resolutionNumber: String,
    resolutionDate: Date,
    approvedBy: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'archived'],
      default: 'pending'
    },
    documentUrl: String,
    approvalDate: Date
  },

  authorityDocument: {
    documentId: String,
    fileName: String,
    fileUrl: String,
    uploadedDate: Date,
    effectiveDate: Date,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['draft', 'active', 'expired', 'archived'],
      default: 'draft'
    }
  },

  // Backup/Succession Planning
  backupOfficer: {
    backupOfficerId: String,
    backupOfficerName: String,
    backupEmail: String,
    designatedDate: Date,
    activationTrigger: String
  },

  // Compliance Status
  complianceStatus: {
    trained: { type: Boolean, default: false },
    trainingDate: Date,
    trainingExpiry: Date,
    backgroundCheckPassed: { type: Boolean, default: false },
    backgroundCheckDate: Date,
    noCriminalRecord: { type: Boolean, default: false },
    noSanctionsMatch: { type: Boolean, default: false },
    pepScreeningPassed: { type: Boolean, default: false }
  },

  // goAML Portal Access
  goamlAccess: {
    activated: { type: Boolean, default: false },
    activationDate: Date,
    username: String,
    lastLoginDate: Date,
    loginAttempts: { type: Number, default: 0 },
    accountStatus: {
      type: String,
      enum: ['inactive', 'active', 'suspended', 'locked'],
      default: 'inactive'
    },
    authenticatorEnabled: { type: Boolean, default: false }
  },

  // Company Reference
  companyName: {
    type: String,
    default: 'White Caves Real Estate LLC'
  },
  tradeLicense: {
    type: String,
    default: '1388443'
  },
  commercialRegister: {
    type: String,
    default: '2365938'
  },
  supervisoryBody: {
    type: String,
    default: 'Department of Economic Development (DED)'
  },

  // Audit Trail
  auditTrail: [{
    action: String,
    actor: String,
    actorId: String,
    timestamp: { type: Date, default: Date.now },
    details: String,
    changes: mongoose.Schema.Types.Mixed,
    ipAddress: String
  }],

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String,
  notes: String
});

// Index for fast queries
ComplianceOfficerDesignationSchema.index({ emiratesId: 1 });
ComplianceOfficerDesignationSchema.index({ designationStatus: 1 });
ComplianceOfficerDesignationSchema.index({ appointmentDate: 1 });

// Middleware: Update updatedAt on save
ComplianceOfficerDesignationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('ComplianceOfficerDesignation', ComplianceOfficerDesignationSchema);
