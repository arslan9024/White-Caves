import mongoose from 'mongoose';

const amlAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true, index: true },
  kycProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'KYCProfile', index: true },
  customerId: { type: String, index: true },
  
  alertType: {
    type: String,
    enum: ['transaction_pattern', 'customer_behavior', 'property_flag', 'pep_match', 'sanctions_match', 'adverse_media', 'manual_referral'],
    required: true
  },
  
  alertCategory: {
    type: String,
    enum: ['structuring', 'rapid_movement', 'round_amounts', 'third_party', 'cash_intensive', 'geographic_mismatch', 'unusual_frequency', 'price_manipulation', 'reluctant_info', 'inconsistent_info', 'unusual_documents', 'nominee_structures', 'rushed_transaction', 'no_concern_price', 'rapid_resale', 'abandoned_transaction', 'multiple_properties', 'renovation_inflated', 'pep_detection', 'sanctions_hit', 'negative_news', 'other'],
    required: true
  },
  
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true,
    index: true
  },
  
  status: {
    type: String,
    enum: ['open', 'under_investigation', 'escalated', 'closed_false_positive', 'closed_confirmed', 'str_filed'],
    default: 'open',
    index: true
  },
  
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  triggerDetails: {
    triggerSource: String,
    triggerRule: String,
    triggerData: mongoose.Schema.Types.Mixed,
    matchConfidence: Number,
    relatedTransactions: [{
      transactionId: String,
      amount: Number,
      currency: String,
      date: Date,
      type: String,
      description: String
    }]
  },
  
  customerSnapshot: {
    name: String,
    emiratesId: String,
    nationality: String,
    riskCategory: String,
    kycStatus: String,
    totalTransactionValue: Number
  },
  
  investigation: {
    startedAt: Date,
    startedBy: String,
    findings: String,
    evidenceCollected: [{
      type: String,
      description: String,
      fileUrl: String,
      uploadedAt: Date,
      uploadedBy: String
    }],
    interviews: [{
      interviewee: String,
      date: Date,
      summary: String,
      conductedBy: String
    }],
    riskAssessment: String,
    recommendation: {
      type: String,
      enum: ['close_false_positive', 'enhanced_monitoring', 'file_str', 'terminate_relationship', 'escalate_further']
    }
  },
  
  escalation: {
    escalatedAt: Date,
    escalatedBy: String,
    escalatedTo: String,
    escalationReason: String,
    escalationLevel: { type: Number, default: 1 }
  },
  
  strDetails: {
    filed: { type: Boolean, default: false },
    filedAt: Date,
    filedBy: String,
    strReference: String,
    submittedTo: String,
    strType: { type: String, enum: ['STR', 'SAR', 'PTR'] },
    reportContent: String,
    acknowledgmentReceived: Boolean,
    acknowledgmentDate: Date
  },
  
  resolution: {
    resolvedAt: Date,
    resolvedBy: String,
    resolutionType: String,
    resolutionNotes: String,
    followUpRequired: Boolean,
    followUpDate: Date,
    followUpNotes: String
  },
  
  assignedTo: { type: String, index: true },
  assignmentHistory: [{
    assignedTo: String,
    assignedBy: String,
    assignedAt: Date,
    reason: String
  }],
  
  timeline: [{
    action: String,
    performedBy: String,
    performedAt: { type: Date, default: Date.now },
    details: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  relatedAlerts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AMLAlert' }],
  
  dueDate: Date,
  slaBreached: { type: Boolean, default: false },
  
  tags: [String],
  
  aiAnalysis: {
    analyzedAt: Date,
    riskScore: Number,
    suggestedAction: String,
    confidenceLevel: Number,
    reasoning: String,
    similarCases: [{
      alertId: String,
      similarity: Number,
      outcome: String
    }]
  }
}, {
  timestamps: true
});

amlAlertSchema.index({ status: 1, severity: 1, createdAt: -1 });
amlAlertSchema.index({ 'customerSnapshot.name': 'text', description: 'text' });
amlAlertSchema.index({ dueDate: 1, slaBreached: 1 });

amlAlertSchema.pre('save', function(next) {
  if (!this.alertId) {
    this.alertId = `AML-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  
  if (this.isNew) {
    this.timeline.push({
      action: 'Alert Created',
      performedBy: 'system',
      performedAt: new Date(),
      details: `New ${this.severity} alert created: ${this.alertCategory}`
    });
  }
  
  next();
});

amlAlertSchema.methods.escalate = function(escalatedBy, escalatedTo, reason) {
  this.status = 'escalated';
  this.escalation = {
    escalatedAt: new Date(),
    escalatedBy,
    escalatedTo,
    escalationReason: reason,
    escalationLevel: (this.escalation?.escalationLevel || 0) + 1
  };
  this.timeline.push({
    action: 'Escalated',
    performedBy: escalatedBy,
    details: `Escalated to ${escalatedTo}: ${reason}`
  });
  return this.save();
};

amlAlertSchema.methods.assignTo = function(assignee, assignedBy, reason = '') {
  this.assignmentHistory.push({
    assignedTo: this.assignedTo,
    assignedBy,
    assignedAt: new Date(),
    reason
  });
  this.assignedTo = assignee;
  this.timeline.push({
    action: 'Reassigned',
    performedBy: assignedBy,
    details: `Assigned to ${assignee}${reason ? ': ' + reason : ''}`
  });
  return this.save();
};

amlAlertSchema.methods.close = function(resolvedBy, resolutionType, notes) {
  this.status = resolutionType === 'false_positive' ? 'closed_false_positive' : 'closed_confirmed';
  this.resolution = {
    resolvedAt: new Date(),
    resolvedBy,
    resolutionType,
    resolutionNotes: notes
  };
  this.timeline.push({
    action: 'Closed',
    performedBy: resolvedBy,
    details: `Closed as ${resolutionType}: ${notes}`
  });
  return this.save();
};

amlAlertSchema.methods.fileSTR = function(filedBy, strDetails) {
  this.status = 'str_filed';
  this.strDetails = {
    filed: true,
    filedAt: new Date(),
    filedBy,
    ...strDetails
  };
  this.timeline.push({
    action: 'STR Filed',
    performedBy: filedBy,
    details: `STR filed with reference: ${strDetails.strReference || 'pending'}`
  });
  return this.save();
};

amlAlertSchema.statics.getOpenAlerts = function(options = {}) {
  const query = { status: { $in: ['open', 'under_investigation'] } };
  if (options.severity) query.severity = options.severity;
  if (options.assignedTo) query.assignedTo = options.assignedTo;
  
  return this.find(query)
    .sort({ priority: -1, severity: -1, createdAt: 1 })
    .limit(options.limit || 100);
};

amlAlertSchema.statics.getAlertStats = function() {
  return this.aggregate([
    {
      $facet: {
        byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
        bySeverity: [{ $group: { _id: '$severity', count: { $sum: 1 } } }],
        byType: [{ $group: { _id: '$alertType', count: { $sum: 1 } } }],
        overdue: [{ $match: { dueDate: { $lt: new Date() }, status: { $nin: ['closed_false_positive', 'closed_confirmed', 'str_filed'] } } }, { $count: 'total' }]
      }
    }
  ]);
};

export default mongoose.model('AMLAlert', amlAlertSchema);
