import mongoose from 'mongoose';

const ApprovalWorkflowSchema = new mongoose.Schema({
  // Reference to document being approved
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'documentType'
  },
  documentType: {
    type: String,
    required: true,
    enum: ['CompliancePolicy', 'ComplianceDocument', 'TrainingMaterial'],
    default: 'CompliancePolicy'
  },
  documentName: String,
  documentTitle: String,

  // Workflow Configuration
  workflowType: {
    type: String,
    enum: ['policy_approval', 'document_signature', 'cdd_verification', 'str_approval'],
    required: true
  },
  workflowName: String,

  // Workflow Stages
  stages: [{
    order: {
      type: Number,
      required: true
    },
    stageName: {
      type: String,
      required: true,
      enum: [
        'Compliance Review',
        'Legal Review',
        'CEO Review',
        'Board Approval',
        'Finance Review',
        'Other'
      ]
    },
    assignedTo: {
      name: String,
      id: String,
      role: String,
      email: String
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'approved', 'rejected', 'commented', 'returned'],
      default: 'pending'
    },
    dueDate: Date,
    startedDate: Date,
    completedDate: Date,
    comments: String,
    attachments: [{
      fileName: String,
      fileUrl: String,
      uploadedDate: Date
    }],
    rejectionReason: String,
    returnToStage: Number,
    reviewedBy: {
      name: String,
      id: String,
      timestamp: Date
    },
    approvingAction: {
      type: String,
      enum: ['approve', 'reject', 'request_changes', 'add_comment'],
      default: 'approve'
    },
    signingRequired: { type: Boolean, default: false },
    signatureStatus: {
      type: String,
      enum: ['pending', 'signed', 'failed'],
      default: 'pending'
    },
    signingDetails: {
      method: {
        type: String,
        enum: ['digital', 'physical', 'electronic'],
        default: 'digital'
      },
      signatureUrl: String,
      signedBy: String,
      signedDate: Date,
      ipAddress: String,
      deviceInfo: String
    }
  }],

  // Workflow Status
  currentStage: {
    type: Number,
    default: 1
  },
  overallStatus: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'rejected', 'returned', 'paused'],
    default: 'not_started'
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // SLA (Service Level Agreement)
  sla: {
    daysAllowed: { type: Number, default: 5 },
    daysUsed: Number,
    isOverdue: { type: Boolean, default: false },
    overdueDate: Date,
    overdayCount: Number
  },

  // Escalation Rules
  escalationRules: {
    escalateAfterDays: { type: Number, default: 3 },
    escalateIfOverdue: { type: Boolean, default: true },
    escalateTo: String,
    escalationTriggered: { type: Boolean, default: false },
    escalationDate: Date,
    escalationNotificationSent: { type: Boolean, default: false }
  },

  // Notifications
  notifications: [{
    recipientName: String,
    recipientEmail: String,
    notificationType: {
      type: String,
      enum: ['assignment', 'reminder', 'escalation', 'completion', 'rejection'],
      required: true
    },
    sentDate: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    readDate: Date
  }],

  // Audit Trail
  auditTrail: [{
    action: String,
    actor: String,
    actorId: String,
    timestamp: { type: Date, default: Date.now },
    details: String,
    changes: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    stageNumber: Number
  }],

  // Workflow Metadata
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  description: String,

  // Submitted Information
  submittedBy: {
    name: String,
    id: String,
    email: String,
    submitDate: { type: Date, default: Date.now }
  },

  // Completion Information
  completionDetails: {
    completedDate: Date,
    completedBy: String,
    completionNotes: String,
    finalApprover: String,
    completionStatus: {
      type: String,
      enum: ['approved', 'rejected', 'conditional'],
      default: 'approved'
    }
  },

  // Return/Revision Tracking
  revisionHistory: [{
    revisionNumber: Number,
    returnedToStage: Number,
    returnReason: String,
    returnedDate: Date,
    returnedBy: String,
    resubmissionDate: Date,
    resubmittedBy: String
  }],

  // Company Reference
  companyName: {
    type: String,
    default: 'White Caves Real Estate LLC'
  },

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String,
  internalNotes: String
});

// Index for fast queries
ApprovalWorkflowSchema.index({ 'assignedTo.id': 1, 'currentStage': 1 });
ApprovalWorkflowSchema.index({ overallStatus: 1 });
ApprovalWorkflowSchema.index({ createdAt: 1 });
ApprovalWorkflowSchema.index({ documentId: 1 });

// Middleware: Update updatedAt on save
ApprovalWorkflowSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate progress percentage
  const totalStages = this.stages.length;
  const completedStages = this.stages.filter(s => s.status !== 'pending').length;
  this.progressPercentage = (completedStages / totalStages) * 100;
  
  // Check if overdue
  if (this.sla.dueDate && new Date() > this.sla.dueDate && this.overallStatus !== 'completed') {
    this.sla.isOverdue = true;
    this.sla.overdayCount = Math.floor((new Date() - this.sla.dueDate) / (1000 * 60 * 60 * 24));
  }
  
  next();
});

export default mongoose.model('ApprovalWorkflow', ApprovalWorkflowSchema);
