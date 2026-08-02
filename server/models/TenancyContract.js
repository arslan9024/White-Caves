/**
 * @deprecated PRISMA MIGRATION — This Mongoose model is scheduled for removal.
 * Replacement: prisma/schema.prisma + src/lib/prisma.ts
 * Do NOT add new fields here. Use Prisma schema instead.
 */
const mongoose = require('mongoose');

const TenancyContractSchema = new mongoose.Schema({
  // Reference to original contract (if created from Contract model)
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    default: null
  },

  // Agent who created this contract
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },

  // Contract status
  status: {
    type: String,
    enum: ['Draft', 'Generated', 'AwaitingSignatures', 'PartiallySignedSignatures', 'FullySigned', 'Rejected', 'Archived'],
    default: 'Draft'
  },

  // ============ PROPERTY INFORMATION ============
  propertyInfo: {
    propertyId: mongoose.Schema.Types.ObjectId, // Reference to Property model
    description: String,
    address: String,
    city: String,
    emirate: String,
    plotNumber: String,
    buildingNumber: String,
    floorNumber: String,
    unitNumber: String,
    plotArea: Number,
    unitArea: Number,
    propertyType: String, // Villa, Apartment, Commercial, etc.
    furnished: {
      type: String,
      enum: ['Furnished', 'Unfurnished', 'Semifurnished'],
      default: 'Unfurnished'
    }
  },

  // ============ LANDLORD INFORMATION ============
  landlordInfo: {
    name: String,
    nationalId: String,
    passportNumber: String,
    nationality: String,
    emiratesId: String,
    email: String,
    phone: String,
    mobileNumber: String,
    address: String,
    bankName: String,
    bankAccountNumber: String,
    iban: String
  },

  // ============ TENANT INFORMATION ============
  tenantInfo: {
    name: String,
    nationalId: String,
    passportNumber: String,
    nationality: String,
    emiratesId: String,
    email: String,
    phone: String,
    mobileNumber: String,
    address: String,
    occupation: String,
    employer: String,
    visaNumber: String,
    visaExpiryDate: Date
  },

  // ============ CONTACT DETAILS ============
  contactDetails: {
    landlordContactPerson: String,
    landlordContactPhone: String,
    landlordContactEmail: String,
    tenantContactPerson: String,
    tenantContactPhone: String,
    tenantContactEmail: String,
    emergencyContactName: String,
    emergencyContactPhone: String
  },

  // ============ TENANCY TERMS ============
  tenancyTerms: {
    leaseStartDate: Date,
    leaseEndDate: Date,
    leasePeriodMonths: Number,
    renewalOption: {
      type: String,
      enum: ['Yes', 'No', 'Negotiable'],
      default: 'Negotiable'
    },
    renewalTermMonths: Number,
    rentAmount: Number,
    rentCurrency: {
      type: String,
      default: 'AED'
    },
    securityDeposit: Number,
    maintenanceFees: Number,
    maintenanceIncludedIn: String, // Rent or separate
    utilities: {
      water: Boolean,
      electricity: Boolean,
      gas: Boolean,
      internet: Boolean,
      chiller: Boolean
    },
    paymentMethod: String, // Bank transfer, Check, Cash
    paymentDay: Number, // Day of month
    maintenanceResponsibility: String, // Landlord/Tenant/Shared
    breakTerms: String, // Description of break clause
    allowedActivities: String, // Residential, Commercial, etc.
    restrictions: String, // No pets, etc.
    damageResponsibility: String
  },

  // ============ SIGNATURES ============
  signatures: {
    landlordSignature: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      signatureData: String, // Base64 signature
      ipAddress: String,
      userAgent: String,
      signatureToken: String
    },
    tenantSignature: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      signatureData: String, // Base64 signature
      ipAddress: String,
      userAgent: String,
      signatureToken: String
    }
  },

  // ============ DOCUMENT INFORMATION ============
  pdfDocument: {
    generatedAt: Date,
    pdfUrl: String, // Firebase Storage URL
    fileName: String,
    fileSize: Number,
    documentHash: String // For verification
  },

  // ============ AUDIT TRAIL ============
  auditTrail: [{
    action: String, // Created, Generated, SignatureRequested, Signed, Rejected, etc.
    performedBy: mongoose.Schema.Types.ObjectId,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    ipAddress: String
  }],

  // ============ NOTES & ATTACHMENTS ============
  notes: String,
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: Date,
    uploadedBy: mongoose.Schema.Types.ObjectId
  }],

  // ============ METADATA ============
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tenancyStartYear: Number,
  tenancyStartMonth: Number,
  referenceNumber: String, // Generated reference like TC-2026-001
  ejariRegisteringOffice: String // EJARI office where registered
});

// Indexes for performance
TenancyContractSchema.index({ agentId: 1, createdAt: -1 });
TenancyContractSchema.index({ status: 1, createdAt: -1 });
TenancyContractSchema.index({ 'propertyInfo.propertyId': 1 });
TenancyContractSchema.index({ 'landlordInfo.email': 1 });
TenancyContractSchema.index({ 'tenantInfo.email': 1 });
TenancyContractSchema.index({ referenceNumber: 1 });
TenancyContractSchema.index({ 'signatures.landlordSignature.signatureToken': 1 });
TenancyContractSchema.index({ 'signatures.tenantSignature.signatureToken': 1 });

// Generate reference number before saving
TenancyContractSchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('TenancyContract').countDocuments({
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year, 11, 31)
      }
    });
    this.referenceNumber = `TC-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  // Set month/year from lease start date
  if (this.tenancyTerms?.leaseStartDate) {
    this.tenancyStartYear = new Date(this.tenancyTerms.leaseStartDate).getFullYear();
    this.tenancyStartMonth = new Date(this.tenancyTerms.leaseStartDate).getMonth() + 1;
  }

  this.updatedAt = new Date();
  next();
});

// Method to check if all signatures collected
TenancyContractSchema.methods.isFullySigned = function() {
  return this.signatures?.landlordSignature?.signed && this.signatures?.tenantSignature?.signed;
};

// Method to get signature status
TenancyContractSchema.methods.getSignatureStatus = function() {
  return {
    landlordSigned: this.signatures?.landlordSignature?.signed || false,
    tenantSigned: this.signatures?.tenantSignature?.signed || false,
    bothSigned: this.isFullySigned(),
    signedAt: {
      landlord: this.signatures?.landlordSignature?.signedAt,
      tenant: this.signatures?.tenantSignature?.signedAt
    }
  };
};

// Method to add audit trail entry
TenancyContractSchema.methods.addAuditEntry = function(action, performedBy, details, ipAddress) {
  this.auditTrail.push({
    action,
    performedBy,
    details,
    ipAddress,
    timestamp: new Date()
  });
};

// Static method to create draft
TenancyContractSchema.statics.createDraft = function(agentId, formData) {
  return new this({
    agentId,
    status: 'Draft',
    propertyInfo: formData.propertyInfo,
    landlordInfo: formData.landlordInfo,
    tenantInfo: formData.tenantInfo,
    contactDetails: formData.contactDetails,
    tenancyTerms: formData.tenancyTerms,
    createdBy: agentId
  });
};

module.exports = mongoose.model('TenancyContract', TenancyContractSchema);
