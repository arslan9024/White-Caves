import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    contractNumber: {
      type: String,
      unique: true,
      required: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent'
    },
    
    // Parties involved
    tenant: {
      name: String,
      email: String,
      phone: String,
      emiratesId: String,
      passport: String,
      nationality: String,
      address: String
    },
    landlord: {
      name: String,
      email: String,
      phone: String,
      emiratesId: String,
      passport: String,
      nationality: String,
      address: String
    },
    witness: {
      name: String,
      email: String,
      phone: String
    },
    
    // Property details
    propertyDetails: {
      address: String,
      unitNumber: String,
      community: String,
      emirate: String,
      propertyType: String,
      bedrooms: Number,
      bathrooms: Number,
      area: Number // sqft
    },
    
    // Lease terms
    leaseTerms: {
      rentAmount: Number,
      currency: { type: String, default: 'AED' },
      rentalPeriod: {
        startDate: Date,
        endDate: Date,
        durationMonths: Number
      },
      paymentSchedule: String, // e.g., "Monthly", "Quarterly", "Annually"
      securityDeposit: Number,
      maidRoomAllowed: Boolean,
      petPolicy: String,
      parkingSpaces: Number
    },
    
    // Template & customization
    template: {
      type: String,
      enum: ['standard_ejari', 'furnished', 'commercial', 'custom'],
      default: 'standard_ejari'
    },
    customClauses: [
      {
        title: String,
        content: String
      }
    ],
    
    // Signature tracking
    signatures: {
      tenant: {
        name: String,
        signatureImage: String, // base64 or URL
        signedAt: Date,
        signatureToken: String,
        tokenExpiresAt: Date,
        ipAddress: String,
        userAgent: String
      },
      landlord: {
        name: String,
        signatureImage: String,
        signedAt: Date,
        signatureToken: String,
        tokenExpiresAt: Date,
        ipAddress: String,
        userAgent: String
      },
      witness: {
        name: String,
        signatureImage: String,
        signedAt: Date,
        signatureToken: String,
        tokenExpiresAt: Date,
        ipAddress: String,
        userAgent: String
      }
    },
    
    // Status & Workflow
    status: {
      type: String,
      enum: ['draft', 'pending_signatures', 'partially_signed', 'fully_signed', 'executed', 'cancelled'],
      default: 'draft'
    },
    
    // Document storage
    pdfUrl: String,
    pdfHash: String, // SHA-256 hash for verification
    googleDriveFileId: String,
    
    // Ejari registration
    ejariRegistration: {
      registrationNumber: String,
      registrationDate: Date,
      dldReference: String,
      status: {
        type: String,
        enum: ['pending', 'registered', 'rejected'],
        default: 'pending'
      }
    },
    
    // Renewal
    renewal: {
      renewalDate: Date, // 100 days before lease end
      renewalNotificationSent: Boolean,
      sentAt: Date,
      renewalContractId: mongoose.Schema.Types.ObjectId
    },
    
    // Audit trail
    history: [
      {
        action: String,
        actor: mongoose.Schema.Types.ObjectId,
        timestamp: Date,
        details: String
      }
    ]
  },
  { timestamps: true }
);

// Indexes
contractSchema.index({ contractNumber: 1 });
contractSchema.index({ propertyId: 1 });
contractSchema.index({ leadId: 1 });
contractSchema.index({ agentId: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ 'leaseTerms.rentalPeriod.endDate': 1 });

// Generate contract number
contractSchema.pre('save', async function (next) {
  if (!this.contractNumber) {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(7).toUpperCase();
    this.contractNumber = `WC-${year}-${random}`;
  }
  next();
});

export default mongoose.model('Contract', contractSchema);
