
const mongoose = require('mongoose');

const tenancyAgreementSchema = new mongoose.Schema({
  propertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property',
    required: true 
  },
  landlordId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  agreementDetails: {
    monthlyRent: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    leaseStartDate: { type: Date, required: true },
    leaseEndDate: { type: Date, required: true },
    propertyAddress: { type: String, required: true },
    terms: { type: String, default: '' }
  },
  landlordEmail: { type: String, required: true },
  tenantEmail: { type: String, required: true },
  propertyManagerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  renewalDate: { type: Date },
  googleCalendarEventId: String,
  signatures: {
    landlord: {
      signed: { type: Boolean, default: false },
      signatureData: String,
      signedAt: Date,
      name: String,
      email: String,
      status: { 
        type: String, 
        enum: ['PENDING', 'SIGNED', 'REJECTED'], 
        default: 'PENDING' 
      },
      rejectionReason: String
    },
    tenant: {
      signed: { type: Boolean, default: false },
      signatureData: String,
      signedAt: Date,
      name: String,
      email: String,
      status: { 
        type: String, 
        enum: ['PENDING', 'SIGNED', 'REJECTED'], 
        default: 'PENDING' 
      },
      rejectionReason: String
    }
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_SIGNATURES', 'PARTIALLY_SIGNED', 'FULLY_SIGNED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING_SIGNATURES'
  },
  pdfUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

tenancyAgreementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.signatures.landlord.status === 'REJECTED' || this.signatures.tenant.status === 'REJECTED') {
    this.status = 'REJECTED';
  } else if (this.signatures.landlord.signed && this.signatures.tenant.signed) {
    this.status = 'FULLY_SIGNED';
    this.signatures.landlord.status = 'SIGNED';
    this.signatures.tenant.status = 'SIGNED';
  } else if (this.signatures.landlord.signed || this.signatures.tenant.signed) {
    this.status = 'PARTIALLY_SIGNED';
  }
  
  next();
});

module.exports = mongoose.model('TenancyAgreement', tenancyAgreementSchema);
