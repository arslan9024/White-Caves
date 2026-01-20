import mongoose from 'mongoose';

const GoAMLRegistrationSchema = new mongoose.Schema({
  // Registration Type
  registrationType: {
    type: String,
    enum: ['reporting_entity', 'dnfbp', 'financial_institution'],
    default: 'reporting_entity'
  },

  // Entity Information
  entityName: {
    type: String,
    required: true,
    default: 'White Caves Real Estate LLC'
  },
  businessType: {
    type: String,
    default: 'Real Estate Brokerage'
  },
  tradeLicense: {
    type: String,
    required: true,
    default: '1388443'
  },
  commercialRegister: {
    type: String,
    default: '2365938'
  },
  supervisoryBody: {
    type: String,
    required: true,
    default: 'Department of Economic Development (DED)',
    enum: [
      'Department of Economic Development (DED)',
      'Ministry of Economy & Tourism (MoET)',
      'Central Bank of UAE',
      'Dubai Financial Services Authority',
      'Other'
    ]
  },

  // Authorized Representative
  authorizedRepresentative: {
    name: {
      type: String,
      required: true,
      default: 'Arslan Malik Bashir Ahmad'
    },
    firstName: String,
    lastName: String,
    nationality: {
      type: String,
      required: true,
      default: 'Pakistan'
    },
    emiratesId: {
      type: String,
      required: true,
      default: '784-1993-1805733-0'
    },
    idType: {
      type: String,
      enum: ['passport', 'emirates_id', 'visa', 'other'],
      default: 'emirates_id'
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      default: 'the.white.caves@gmail.com'
    },
    phone: {
      type: String,
      required: true,
      default: '00971563616136'
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    }
  },

  // Documents
  attachedDocuments: [{
    documentType: {
      type: String,
      enum: ['trade_license', 'emiratesid', 'passport', 'visa', 'other'],
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSize: Number,
    mimeType: String,
    uploadedDate: {
      type: Date,
      default: Date.now
    },
    uploadedBy: String,
    verified: { type: Boolean, default: false },
    verifiedDate: Date,
    verifiedBy: String,
    description: String
  }],

  // Completion Status
  completionStatus: {
    entityInfo: {
      completed: { type: Boolean, default: false },
      completedDate: Date,
      lastModified: Date
    },
    userDetails: {
      completed: { type: Boolean, default: false },
      completedDate: Date,
      lastModified: Date
    },
    documents: {
      completed: { type: Boolean, default: false },
      completedDate: Date,
      lastModified: Date
    },
    termsAccepted: {
      completed: { type: Boolean, default: false },
      acceptedDate: Date,
      acceptedBy: String
    },
    overallCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },

  // Registration Status
  status: {
    type: String,
    enum: [
      'draft',
      'ready_for_submission',
      'submitted',
      'pending_fiu_review',
      'pending_additional_info',
      'approved',
      'rejected',
      'expired',
      'renewal_due'
    ],
    default: 'draft'
  },

  // Submission Details
  submissionDetails: {
    submittedDate: Date,
    submittedBy: String,
    submissionMethod: {
      type: String,
      enum: ['goaml_portal', 'manual_upload', 'email'],
      default: 'goaml_portal'
    },
    fuiConfirmationNumber: String,
    fuiReceiptDate: Date,
    fuiResponse: String,
    fuiReviewStatus: String,
    approvalDate: Date,
    rejectionReason: String,
    approvalLetter: {
      fileUrl: String,
      receivedDate: Date
    }
  },

  // Renewal Information
  renewalInformation: {
    initialRegistrationDate: Date,
    registrationValidUntil: Date,
    renewalDueDate: Date,
    renewalReminderSent: { type: Boolean, default: false },
    renewalReminderDate: Date,
    renewalFormPrepared: { type: Boolean, default: false },
    renewalSubmittedDate: Date
  },

  // Portal Access
  portalAccess: {
    activated: { type: Boolean, default: false },
    activationDate: Date,
    activationDetails: String,
    username: String,
    authenticatorConfigured: { type: Boolean, default: false },
    authenticatorDate: Date,
    lastAccessDate: Date,
    accessStatus: {
      type: String,
      enum: ['inactive', 'active', 'suspended', 'expired'],
      default: 'inactive'
    }
  },

  // Training & Compliance
  mandatoryTraining: {
    trainingRequired: { type: Boolean, default: true },
    trainingCompletionDeadline: Date,
    trainingCompleted: { type: Boolean, default: false },
    trainingCompletedDate: Date,
    trainingCertificate: {
      fileUrl: String,
      expiryDate: Date
    },
    trainingScore: Number
  },

  // STR Filing
  strFilingStatus: {
    capabilityActive: { type: Boolean, default: false },
    firstStrFiledDate: Date,
    totalStrsFileD: { type: Number, default: 0 },
    pendingStrs: { type: Number, default: 0 },
    lastStrFiledDate: Date
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

  // Company Reference
  companyName: {
    type: String,
    default: 'White Caves Real Estate LLC'
  },
  companyLicense: {
    type: String,
    default: '1388443'
  },

  // Notifications & Reminders
  notifications: [{
    notificationType: {
      type: String,
      enum: ['submission_reminder', 'approval_notice', 'renewal_reminder', 'training_reminder', 'other']
    },
    message: String,
    sentDate: Date,
    sentTo: String,
    read: { type: Boolean, default: false },
    readDate: Date
  }],

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  submittedAt: Date,
  approvedAt: Date,
  createdBy: String,
  updatedBy: String,
  lastModifiedBy: String,

  // Notes & Comments
  internalNotes: String,
  complianceNotes: String,
  legalReviewNotes: String
});

// Index for fast queries
GoAMLRegistrationSchema.index({ status: 1 });
GoAMLRegistrationSchema.index({ submittedDate: 1 });
GoAMLRegistrationSchema.index({ 'authorizedRepresentative.email': 1 });
GoAMLRegistrationSchema.index({ registrationValidUntil: 1 });

// Middleware: Update updatedAt on save
GoAMLRegistrationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate overall completion percentage
  const sections = [
    this.completionStatus.entityInfo.completed ? 25 : 0,
    this.completionStatus.userDetails.completed ? 25 : 0,
    this.completionStatus.documents.completed ? 25 : 0,
    this.completionStatus.termsAccepted.completed ? 25 : 0
  ];
  this.completionStatus.overallCompletion = sections.reduce((a, b) => a + b, 0);
  
  next();
});

export default mongoose.model('GoAMLRegistration', GoAMLRegistrationSchema);
