import mongoose from 'mongoose';

const tenancyTimelineSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  
  tenant: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    email: String,
    phone: String
  },
  landlord: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    email: String,
    phone: String
  },
  agent: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  
  contractType: {
    type: String,
    enum: ['new', 'renewal', 'transfer'],
    default: 'new'
  },
  startDate: Date,
  endDate: Date,
  rentAmount: Number,
  securityDeposit: Number,
  paymentFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom']
  },
  
  documents: {
    tenantEmiratesId: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      uploadedDate: Date,
      verifiedDate: Date
    },
    tenantPassport: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      uploadedDate: Date
    },
    tenantVisaCopy: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    tenantBankCheque: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      chequeNumber: String,
      bankName: String
    },
    
    titleDeed: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      dldNumber: String
    },
    landlordEmiratesId: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    landlordPassport: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    dewaBill: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      accountNumber: String
    },
    bankNoc: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      bankName: String
    },
    
    tenancyContract: {
      generated: { type: Boolean, default: false },
      fileUrl: String,
      generatedDate: Date
    },
    ejariCertificate: {
      registered: { type: Boolean, default: false },
      ejariNumber: String,
      fileUrl: String,
      registrationDate: Date
    },
    dewaTransfer: {
      completed: { type: Boolean, default: false },
      accountNumber: String,
      completionDate: Date
    }
  },
  
  statusTimeline: [{
    stage: {
      type: String,
      enum: [
        'initial_contact',
        'document_collection_tenant',
        'document_collection_landlord',
        'contract_preparation',
        'contract_review',
        'tenant_signing',
        'landlord_signing',
        'ejari_registration',
        'dewa_transfer',
        'keys_handover',
        'completed',
        'renewal_pending',
        'renewal_offered',
        'renewal_accepted',
        'termination_requested',
        'termination_completed'
      ],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled', 'on_hold'],
      default: 'pending'
    },
    initiatedBy: {
      type: String,
      enum: ['tenant', 'landlord', 'agent', 'system'],
      required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: String,
    dueDate: Date,
    completedDate: Date,
    documents: [{
      name: String,
      fileUrl: String,
      uploadedBy: String,
      uploadDate: Date
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  currentStage: {
    type: String,
    enum: [
      'initial_contact',
      'document_collection_tenant',
      'document_collection_landlord',
      'contract_preparation',
      'contract_review',
      'tenant_signing',
      'landlord_signing',
      'ejari_registration',
      'dewa_transfer',
      'keys_handover',
      'completed',
      'renewal_pending',
      'renewal_offered',
      'renewal_accepted',
      'termination_requested',
      'termination_completed'
    ],
    default: 'initial_contact'
  },
  
  overallStatus: {
    type: String,
    enum: ['active', 'pending', 'completed', 'cancelled', 'on_hold', 'renewal_due'],
    default: 'pending'
  },
  
  lastNotificationSent: Date,
  nextNotificationDue: Date,
  
  completedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tenancyTimelineSchema.index({ propertyId: 1 });
tenancyTimelineSchema.index({ 'tenant.id': 1 });
tenancyTimelineSchema.index({ 'landlord.id': 1 });
tenancyTimelineSchema.index({ currentStage: 1 });
tenancyTimelineSchema.index({ overallStatus: 1 });
tenancyTimelineSchema.index({ endDate: 1 });

tenancyTimelineSchema.virtual('completionPercentage').get(function() {
  const totalStages = 10;
  const completedStages = this.statusTimeline.filter(stage => 
    stage.status === 'completed'
  ).length;
  
  return Math.round((completedStages / totalStages) * 100);
});

tenancyTimelineSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return null;
  
  const today = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
});

tenancyTimelineSchema.pre('save', function(next) {
  if (this.currentStage === 'completed') {
    this.overallStatus = 'completed';
  } else if (this.currentStage === 'renewal_pending') {
    this.overallStatus = 'renewal_due';
  }
  
  if (this.endDate) {
    const daysRemaining = this.daysRemaining;
    if (daysRemaining <= 60 && daysRemaining > 0) {
      this.overallStatus = 'renewal_due';
    }
  }
  
  next();
});

export default mongoose.model('TenancyTimeline', tenancyTimelineSchema);
