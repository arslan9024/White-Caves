import mongoose from 'mongoose';

const serviceProgressSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: [
      'INITIATED',
      'ASSIGNED',
      'IN_PROGRESS',
      'UNDER_REVIEW',
      'AWAITING_CLIENT',
      'DOCUMENTATION',
      'COMPLIANCE',
      'COMPLETED',
      'FAILED',
      'CANCELLED',
    ],
    default: 'INITIATED',
  },
  stageNumber: { type: Number, default: 1 }, // Current stage number
  totalStages: { type: Number, default: 1 }, // Total stages in workflow
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 }, // 0-100%
  startedAt: { type: Date },
  completedAt: { type: Date },
  estimatedCompletionDate: { type: Date },
  actualCompletionDate: { type: Date },
  isOverdue: { type: Boolean, default: false },
  daysToDeadline: { type: Number }, // Negative = overdue, positive = days remaining
  milestones: [
    {
      name: { type: String, required: true },
      description: String,
      targetDate: Date,
      completedDate: Date,
      isCompleted: { type: Boolean, default: false },
      priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
      dependsOn: [String], // milestone IDs this depends on
    },
  ],
  blockers: [
    {
      issue: String,
      severity: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
      reportedAt: { type: Date, default: Date.now },
      resolvedAt: Date,
      resolution: String,
    },
  ],
  notes: [
    {
      text: String,
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      type: { type: String, enum: ['INTERNAL', 'CLIENT_FACING'], default: 'INTERNAL' },
    },
  ],
});

const serviceBookingSchema = new mongoose.Schema({
  // Core identifiers
  serviceBookingId: { type: String, unique: true, sparse: true }, // Auto-generated unique ID
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: String, required: true }, // References ServiceCatalog service ID
  serviceName: { type: String, required: true }, // e.g., "Property Valuation", "Documentation"
  serviceCategory: {
    type: String,
    enum: [
      'TRANSACTION_AGENCY',
      'PROPERTY_MANAGEMENT',
      'LEGAL_COMPLIANCE',
      'FINANCIAL_SERVICES',
      'MARKETING_MEDIA',
      'TECHNOLOGY_AI',
      'CONCIERGE_LIFESTYLE',
      'INVESTMENT_ADVISORY',
    ],
    required: true,
  },

  // Pricing & Cost
  pricingModel: {
    type: {
      type: String,
      enum: ['FIXED', 'PERCENTAGE', 'HOURLY', 'ON_REQUEST'],
      required: true,
    },
    baseAmount: Number, // For fixed pricing
    percentage: Number, // For percentage-based pricing (e.g., 2.5%)
    rate: Number, // For hourly pricing
    currency: { type: String, default: 'AED' },
    appliedDiscount: {
      type: Number,
      default: 0, // Percentage discount applied (e.g., 10 = 10% off)
      min: 0,
      max: 100,
    },
    appliedTierBonus: {
      type: Number,
      default: 0, // Tier-based discount/bonus in percentage
      min: -50,
      max: 50,
    },
    totalAmount: Number, // Final calculated amount
    calculatedAt: Date, // When pricing was last calculated
    priceAdjustmentReason: String, // e.g., "Volume discount", "Loyalty bonus", "Premium rate - ultra-rare property"
  },

  // Property context (if applicable)
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  propertyAddress: String,
  propertyType: String, // e.g., 'VILLA', 'APARTMENT', 'TOWNHOUSE'
  propertyValue: Number, // Used for percentage-based pricing
  propertyRarity: {
    type: String,
    enum: ['STANDARD', 'PREMIUM', 'ULTRA_PREMIUM', 'ULTRA_RARE'],
    default: 'STANDARD',
  }, // Affects pricing

  // Client context
  clientTier: {
    type: String,
    enum: ['BASIC', 'ESSENTIAL', 'PREMIUM', 'ULTRA_PREMIUM', 'CORPORATE'],
    default: 'BASIC',
  },
  clientHistory: {
    totalTransactions: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    isReturningClient: { type: Boolean, default: false },
    loyaltyScore: { type: Number, default: 0, min: 0, max: 100 }, // Affects pricing
  },

  // Assignment
  assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTeam: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignmentReason: String, // e.g., "Specialty in ultra-premium properties", "Available & high conversion rate"
  agentAcceptedAt: Date,
  agentRejectionReason: String,

  // Progress tracking
  progress: serviceProgressSchema,

  // Workflow execution
  workflowId: String, // References ServiceCatalog workflow definition
  workflowVersion: Number, // In case workflow is updated
  workflowSteps: [
    {
      stepNumber: Number,
      stepName: String,
      description: String,
      automationLevel: { type: String, enum: ['FULL', 'PARTIAL', 'MANUAL'], default: 'MANUAL' },
      status: {
        type: String,
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
        default: 'PENDING',
      },
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      startedAt: Date,
      completedAt: Date,
      estimatedDuration: Number, // In hours
      actualDuration: Number, // In hours
      output: String, // What was produced/generated
      dependencies: [Number], // Step numbers this depends on
    },
  ],

  // Service details
  serviceDescription: String,
  clientRequirements: [String],
  specialInstructions: String,
  attachments: [
    {
      filename: String,
      url: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now },
      type: { type: String, enum: ['CONTRACT', 'DOCUMENT', 'EVIDENCE', 'COMMUNICATION', 'OTHER'] },
    },
  ],

  // Compliance & Regulatory
  complianceRequirements: [
    {
      requirement: {
        type: String,
        enum: [
          'RERA_REGISTRATION',
          'DLD_APPROVAL',
          'EJARI_REGISTRATION',
          'DEWA_SETUP',
          'AML_CHECK',
          'UAE_PASS',
        ],
        required: true,
      },
      isRequired: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
        default: 'NOT_STARTED',
      },
      completedAt: Date,
      certificationNumber: String,
      expiryDate: Date,
      verificationUrl: String,
    },
  ],

  // Timeline & SLA
  sla: {
    responseTimeHours: Number,
    resolutionTimeDays: Number,
    escalationPath: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  timeline: {
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    deliveredAt: Date,
  },

  // Quality & Feedback
  quality: {
    rating: { type: Number, min: 1, max: 5 }, // Client rating
    feedback: String,
    reviewedAt: Date,
    improvedPoints: [String], // What improved from feedback
    issuesFound: [String], // Issues or defects
  },

  // Outcomes & Results
  outcome: {
    status: { type: String, enum: ['SUCCESS', 'PARTIAL', 'FAILED', 'PENDING'] },
    successRate: { type: Number, min: 0, max: 100 }, // 0-100%
    deliverables: [
      {
        name: String,
        description: String,
        url: String,
        deliveredAt: Date,
      },
    ],
    failureReason: String,
    retryCount: { type: Number, default: 0 },
  },

  // Financial tracking
  payments: [
    {
      amount: Number,
      currency: { type: String, default: 'AED' },
      method: { type: String, enum: ['CARD', 'BANK_TRANSFER', 'CHEQUE', 'INVOICE'] },
      paidAt: Date,
      invoiceNumber: String,
      status: { type: String, enum: ['PENDING', 'PAID', 'OVERDUE', 'REFUNDED'] },
    },
  ],
  totalPaid: { type: Number, default: 0 },
  balanceRemaining: Number,

  // Communication history
  communications: [
    {
      type: { type: String, enum: ['EMAIL', 'WHATSAPP', 'CALL', 'MEETING', 'PORTAL_MESSAGE'] },
      subject: String,
      message: String,
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sentTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      sentAt: { type: Date, default: Date.now },
      readAt: Date,
      attachments: [String],
    },
  ],

  // Audit trail
  statusHistory: [
    {
      oldStatus: String,
      newStatus: String,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      changedAt: { type: Date, default: Date.now },
      reason: String,
    },
  ],

  // Metadata
  tags: [String],
  isArchived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

// Create indexes for fast querying
serviceBookingSchema.index({ clientId: 1, createdAt: -1 });
serviceBookingSchema.index({ assignedAgentId: 1, 'progress.stage': 1 });
serviceBookingSchema.index({ 'progress.stage': 1, 'progress.isOverdue': 1 });
serviceBookingSchema.index({ clientTier: 1 });
serviceBookingSchema.index({ createdAt: -1 });

// Pre-save middleware to auto-generate serviceBookingId
serviceBookingSchema.pre('save', async function (next) {
  if (!this.serviceBookingId) {
    const count = await mongoose.model('ServiceBooking').countDocuments();
    const timestamp = Date.now();
    this.serviceBookingId = `SB-${timestamp}-${count + 1}`;
  }
  this.updatedAt = new Date();
  next();
});

// Methods
serviceBookingSchema.methods.updateProgress = function (newStage, percentage, estimatedCompletion) {
  this.progress.stage = newStage;
  this.progress.completionPercentage = percentage;
  if (estimatedCompletion) {
    this.progress.estimatedCompletionDate = estimatedCompletion;
  }
  this.progress.startedAt = this.progress.startedAt || new Date();
  return this.save();
};

serviceBookingSchema.methods.markCompleted = function () {
  this.progress.stage = 'COMPLETED';
  this.progress.completionPercentage = 100;
  this.progress.completedAt = new Date();
  this.timeline.completedAt = new Date();
  return this.save();
};

serviceBookingSchema.methods.addBlocker = function (issue, severity) {
  this.progress.blockers.push({ issue, severity, reportedAt: new Date() });
  return this.save();
};

serviceBookingSchema.methods.resolveBlocker = function (blockerIndex, resolution) {
  if (this.progress.blockers[blockerIndex]) {
    this.progress.blockers[blockerIndex].resolvedAt = new Date();
    this.progress.blockers[blockerIndex].resolution = resolution;
  }
  return this.save();
};

serviceBookingSchema.methods.addNote = function (text, userId, isClientFacing = false) {
  this.progress.notes.push({
    text,
    addedBy: userId,
    timestamp: new Date(),
    type: isClientFacing ? 'CLIENT_FACING' : 'INTERNAL',
  });
  return this.save();
};

serviceBookingSchema.methods.recordCommunication = function (commData) {
  this.communications.push({
    ...commData,
    sentAt: new Date(),
  });
  return this.save();
};

const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

export default ServiceBooking;
