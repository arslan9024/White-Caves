const mongoose = require('mongoose');

const MaintenanceRequestSchema = new mongoose.Schema({
  // Request reference number (auto-generated)
  referenceNumber: {
    type: String,
    unique: true,
    index: true
  },

  // Property details
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryProperty',
    required: true,
    index: true
  },
  propertyAddress: String,
  unitNumber: String,

  // Tenant who raised the request
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  tenantName: {
    type: String,
    required: true,
    trim: true
  },
  tenantEmail: String,
  tenantPhone: String,

  // Landlord
  landlordId: { type: String, index: true },
  landlordName: String,

  // Category of maintenance
  category: {
    type: String,
    enum: [
      'plumbing',
      'electrical',
      'hvac',
      'structural',
      'appliances',
      'pest_control',
      'cleaning',
      'painting',
      'flooring',
      'landscaping',
      'security',
      'internet_tv',
      'parking',
      'elevator',
      'other'
    ],
    required: true,
    index: true
  },

  // Priority / urgency
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium',
    index: true
  },

  // Title and description
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },

  // Status workflow
  status: {
    type: String,
    enum: [
      'submitted',
      'acknowledged',
      'scheduled',
      'in_progress',
      'pending_parts',
      'completed',
      'closed',
      'cancelled',
      'rejected'
    ],
    default: 'submitted',
    index: true
  },

  // Status history
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: {
      id: String,
      name: String,
      role: String
    },
    notes: String
  }],

  // Assigned technician / vendor
  assignedTo: {
    id: String,
    name: String,
    type: { type: String, enum: ['internal', 'vendor', 'contractor'] },
    phone: String,
    email: String
  },

  // Scheduling
  scheduledDate: Date,
  scheduledTimeSlot: {
    start: String,
    end: String
  },

  // Completed date
  completedDate: Date,

  // Estimated cost
  estimatedCost: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'AED' }
  },

  // Actual cost
  actualCost: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'AED' }
  },

  // Who pays (landlord / tenant)
  paymentResponsibility: {
    type: String,
    enum: ['landlord', 'tenant', 'shared', 'warranty', 'insurance'],
    default: 'landlord'
  },

  // Attachments (photos, videos of issue)
  attachments: [{
    url: String,
    type: { type: String, enum: ['image', 'video', 'document'] },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: String
  }],

  // Completion attachments (photos after fix)
  completionAttachments: [{
    url: String,
    type: { type: String, enum: ['image', 'video', 'document'] },
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Tenant rating and feedback
  tenantFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date
  },

  // Internal notes (not visible to tenant)
  internalNotes: String,

  // Tenant visible notes
  tenantNotes: String,

  // Is warranty claim
  isWarrantyClaim: {
    type: Boolean,
    default: false
  },

  // Warranty details
  warrantyDetails: {
    provider: String,
    claimNumber: String,
    expiryDate: Date
  },

  // Created by
  createdBy: {
    id: String,
    name: String,
    role: String
  },

  // SLA due date (based on priority)
  slaDueDate: Date,

  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Auto-generate reference number before save
MaintenanceRequestSchema.pre('save', async function (next) {
  if (!this.referenceNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('MaintenanceRequest').countDocuments();
    this.referenceNumber = `MR-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  // Set SLA due date based on priority if not set
  if (!this.slaDueDate && this.createdAt) {
    const slaHours = { emergency: 4, high: 24, medium: 72, low: 168 };
    const hours = slaHours[this.priority] || 72;
    this.slaDueDate = new Date(this.createdAt.getTime() + hours * 60 * 60 * 1000);
  }

  next();
});

// Indexes
MaintenanceRequestSchema.index({ propertyId: 1, status: 1 });
MaintenanceRequestSchema.index({ tenantId: 1, status: 1, createdAt: -1 });
MaintenanceRequestSchema.index({ status: 1, priority: 1, createdAt: -1 });

// Static: get open requests for a property
MaintenanceRequestSchema.statics.getOpenForProperty = function (propertyId) {
  return this.find({
    propertyId,
    status: { $nin: ['completed', 'closed', 'cancelled', 'rejected'] }
  }).sort({ priority: 1, createdAt: 1 });
};

// Static: get overdue requests (past SLA)
MaintenanceRequestSchema.statics.getOverdueSLA = function () {
  return this.find({
    status: { $nin: ['completed', 'closed', 'cancelled', 'rejected'] },
    slaDueDate: { $lt: new Date() }
  }).sort({ slaDueDate: 1 });
};

// Instance method: add status change
MaintenanceRequestSchema.methods.addStatusChange = function (newStatus, changedBy, notes) {
  this.status = newStatus;
  this.statusHistory.push({ status: newStatus, changedBy, notes });
  if (newStatus === 'completed') this.completedDate = new Date();
  return this.save();
};

const MaintenanceRequest = mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);

module.exports = MaintenanceRequest;
