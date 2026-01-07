import mongoose from 'mongoose';

const saleTimelineSchema = new mongoose.Schema({
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
  
  buyer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    email: String,
    phone: String,
    nationality: String
  },
  seller: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    email: String,
    phone: String
  },
  buyerAgent: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  sellerAgent: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  
  salePrice: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mortgage', 'installments', 'combination'],
    required: true
  },
  downPayment: Number,
  mortgageAmount: Number,
  bankName: String,
  completionDate: Date,
  possessionDate: Date,
  
  documents: {
    formF: {
      generated: { type: Boolean, default: false },
      signedByBuyer: { type: Boolean, default: false },
      signedBySeller: { type: Boolean, default: false },
      fileUrl: String,
      signingDate: Date,
      witnesses: [{
        name: String,
        emiratesId: String,
        signatureUrl: String
      }]
    },
    
    formB: {
      generated: { type: Boolean, default: false },
      signedByBuyer: { type: Boolean, default: false },
      fileUrl: String,
      signingDate: Date
    },
    
    buyerEmiratesId: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    buyerPassport: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    buyerVisa: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    buyerPoA: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      poaNumber: String
    },
    
    sellerEmiratesId: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    sellerPassport: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String
    },
    titleDeed: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      dldNumber: String
    },
    nocFromBank: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      bankName: String,
      nocNumber: String
    },
    dewaClearance: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      certificateNumber: String
    },
    serviceChargeClearance: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      providerName: String
    },
    
    managerCheque: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      chequeNumber: String,
      bankName: String,
      amount: Number,
      dateIssued: Date
    },
    bankTransferProof: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      transactionId: String,
      bankName: String,
      amount: Number,
      date: Date
    },
    mortgageOfferLetter: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      fileUrl: String,
      bankName: String,
      approvalDate: Date
    },
    
    mouzaaContract: {
      generated: { type: Boolean, default: false },
      fileUrl: String,
      dldReference: String
    },
    titleDeedTransfer: {
      completed: { type: Boolean, default: false },
      newTitleDeedNumber: String,
      transferDate: Date,
      fileUrl: String
    }
  },
  
  statusTimeline: [{
    stage: {
      type: String,
      enum: [
        'offer_made',
        'offer_accepted',
        'form_b_signed',
        'form_f_preparation',
        'form_f_signed',
        'document_collection_buyer',
        'document_collection_seller',
        'mortgage_approval',
        'noc_collection',
        'dewa_clearance',
        'dld_appointment',
        'title_deed_transfer',
        'keys_handover',
        'completed'
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
      enum: ['buyer', 'seller', 'buyer_agent', 'seller_agent', 'system'],
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
      'offer_made',
      'offer_accepted',
      'form_b_signed',
      'form_f_preparation',
      'form_f_signed',
      'document_collection_buyer',
      'document_collection_seller',
      'mortgage_approval',
      'noc_collection',
      'dewa_clearance',
      'dld_appointment',
      'title_deed_transfer',
      'keys_handover',
      'completed'
    ],
    default: 'offer_made'
  },
  
  overallStatus: {
    type: String,
    enum: ['active', 'pending', 'completed', 'cancelled', 'on_hold'],
    default: 'pending'
  },
  
  financials: {
    commissionRate: { type: Number, default: 2 },
    buyerAgentCommission: Number,
    sellerAgentCommission: Number,
    dldFees: Number,
    registrationFees: Number,
    totalCosts: Number
  },
  
  lastNotificationSent: Date,
  nextNotificationDue: Date,
  
  completedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

saleTimelineSchema.index({ propertyId: 1 });
saleTimelineSchema.index({ 'buyer.id': 1 });
saleTimelineSchema.index({ 'seller.id': 1 });
saleTimelineSchema.index({ currentStage: 1 });
saleTimelineSchema.index({ overallStatus: 1 });

saleTimelineSchema.virtual('completionPercentage').get(function() {
  const totalStages = 14;
  const completedStages = this.statusTimeline.filter(stage => 
    stage.status === 'completed'
  ).length;
  
  return Math.round((completedStages / totalStages) * 100);
});

saleTimelineSchema.pre('save', function(next) {
  if (this.currentStage === 'completed') {
    this.overallStatus = 'completed';
    this.completedAt = new Date();
  }
  
  if (this.salePrice && this.financials.commissionRate) {
    const totalCommission = this.salePrice * (this.financials.commissionRate / 100);
    this.financials.buyerAgentCommission = totalCommission / 2;
    this.financials.sellerAgentCommission = totalCommission / 2;
    this.financials.dldFees = this.salePrice * 0.04;
    this.financials.registrationFees = 4000;
    this.financials.totalCosts = this.financials.dldFees + this.financials.registrationFees + totalCommission;
  }
  
  next();
});

export default mongoose.model('SaleTimeline', saleTimelineSchema);
