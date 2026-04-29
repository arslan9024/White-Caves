/**
 * CustomerDueDiligence.js
 * Mongoose model for Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD) records
 */

const mongoose = require('mongoose');

const customerDueDiligenceSchema = new mongoose.Schema(
  {
    // Customer Information
    customerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerType: {
      type: String,
      enum: ['individual', 'entity'],
      required: true,
    },
    customerEmail: {
      type: String,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    customerPhone: {
      type: String,
      trim: true,
    },

    // Individual Customer Information
    nationality: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    passportNumber: {
      type: String,
    },
    emiratesIdNumber: {
      type: String,
    },

    // Entity Customer Information
    businessType: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    tradeBoringNumber: {
      type: String,
    },
    dedRegistration: {
      type: String,
    },
    businessAddress: {
      street: String,
      city: String,
      emirate: String,
      postalCode: String,
      country: String,
    },

    // General Information
    residentialAddress: {
      street: String,
      city: String,
      emirate: String,
      postalCode: String,
      country: String,
    },
    sourceOfFunds: {
      type: String,
      enum: [
        'salary_employment',
        'business_income',
        'investment_returns',
        'inheritance',
        'gifts',
        'retirement_savings',
        'property_sale',
        'other',
      ],
    },
    sourceOfFundsDescription: {
      type: String,
    },
    sourceOfFundsDocumentation: [
      {
        documentType: String,
        documentName: String,
        filePath: String,
        uploadDate: Date,
      },
    ],

    // PEP Status and Screening
    pepStatus: {
      type: String,
      enum: ['yes', 'no', 'pending'],
      default: 'pending',
    },
    pepDetails: {
      pepType: String, // 'current', 'former', 'family', 'associate'
      position: String,
      country: String,
      endDate: Date,
    },
    pepScreeningDate: {
      type: Date,
    },
    pepScreeningResult: {
      lists: {
        ofac: Object,
        unSanctions: Object,
        uaeFIUPEP: Object,
        dfsa: Object,
        eu: Object,
      },
      overallResult: String, // 'clear', 'hit'
      details: Array,
    },

    // Beneficial Owners (for entities)
    beneficialOwners: [
      {
        name: String,
        ownershipPercentage: Number,
        nationality: String,
        pepStatus: String,
        documentPath: String,
      },
    ],

    // Document Upload
    documentsUploaded: [
      {
        documentType: String,
        documentName: String,
        filePath: String,
        uploadDate: Date,
        uploadedBy: String,
      },
    ],

    // Risk Assessment
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    riskAssessmentDetails: {
      assessedBy: String,
      assessedById: String,
      assessmentDate: Date,
      factors: [String],
    },

    // CDD Status
    cddStatus: {
      type: String,
      enum: ['in_progress', 'completed', 'needs_update'],
      default: 'in_progress',
    },
    cddCompletionDate: {
      type: Date,
    },

    // Enhanced Due Diligence (EDD)
    needsEDD: {
      type: Boolean,
      default: false,
    },
    enhancedDueDiligence: {
      eddPerformedDate: Date,
      performedBy: String,
      performedById: String,
      sourceOfWealthVerification: {
        documentsProvided: [String],
        verified: Boolean,
        details: String,
      },
      businessPurposeAnalysis: String,
      beneficiaryAnalysis: [Object],
      transactionPatternAnalysis: String,
      additionalDocumentation: [Object],
      adverseMediaSearch: {
        performed: Boolean,
        results: String,
      },
      eddConclusion: String,
      eddRiskLevel: String,
    },

    // Approval Workflow
    approvalStatus: {
      type: String,
      enum: ['pending_approval', 'approved', 'rejected', 'awaiting_correction'],
      default: 'pending_approval',
      index: true,
    },
    approvedBy: {
      type: String,
    },
    approvedById: {
      type: String,
    },
    approvalDate: {
      type: Date,
    },
    approvalComments: {
      type: String,
    },
    conditionsForApproval: [
      {
        condition: String,
        dueDate: Date,
        completed: Boolean,
      },
    ],

    // Rejection Details
    rejectionReason: {
      type: String,
    },
    requiredCorrections: [
      {
        correction: String,
        dueDate: Date,
        completed: Boolean,
      },
    ],
    rejectedDate: {
      type: Date,
    },

    // Timing
    createdDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
    lastReviewDate: {
      type: Date,
    },
    nextReviewDate: {
      type: Date,
    },

    // Audit Trail
    auditTrail: [
      {
        action: String,
        actor: String,
        actorId: String,
        details: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Additional Fields
    notes: String,
    internalComments: String,
    complianceAlerts: [String],
    linkedTransactions: [String], // Transaction IDs
  },
  {
    timestamps: true,
    collection: 'customer_due_diligence',
  }
);

// Indexes for efficient queries
customerDueDiligenceSchema.index({ customerId: 1, riskLevel: 1 });
customerDueDiligenceSchema.index({ approvalStatus: 1, riskLevel: 1 });
customerDueDiligenceSchema.index({ createdDate: -1 });
customerDueDiligenceSchema.index({ pepStatus: 1, riskLevel: 1 });

// Middleware to update timestamps
customerDueDiligenceSchema.pre('save', function (next) {
  this.updatedDate = new Date();
  next();
});

// Method to check if CDD needs renewal
customerDueDiligenceSchema.methods.needsRenewal = function () {
  const renewalPeriod = 3 * 365 * 24 * 60 * 60 * 1000; // 3 years
  return Date.now() - this.createdDate.getTime() > renewalPeriod;
};

// Method to get CDD summary for compliance dashboard
customerDueDiligenceSchema.methods.getSummary = function () {
  return {
    customerId: this.customerId,
    customerName: this.customerName,
    customerType: this.customerType,
    riskLevel: this.riskLevel,
    pepStatus: this.pepStatus,
    approvalStatus: this.approvalStatus,
    cddStatus: this.cddStatus,
    needsEDD: this.needsEDD,
    createdDate: this.createdDate,
    approvalDate: this.approvalDate,
  };
};

// Create and export model
const CustomerDueDiligence = mongoose.model('CustomerDueDiligence', customerDueDiligenceSchema);

module.exports = CustomerDueDiligence;
