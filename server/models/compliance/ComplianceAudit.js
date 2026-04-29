import mongoose from 'mongoose';
import crypto from 'crypto';

const complianceAuditSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true, index: true },
  
  entityType: {
    type: String,
    enum: ['kyc_profile', 'aml_alert', 'transaction', 'document', 'user', 'system', 'report', 'policy'],
    required: true
  },
  entityId: { type: String, required: true, index: true },
  
  action: {
    type: String,
    enum: [
      'create', 'update', 'delete', 'view', 'export', 'print',
      'verify', 'approve', 'reject', 'escalate', 'assign',
      'login', 'logout', 'failed_login', 'password_change',
      'document_upload', 'document_download', 'document_verify',
      'risk_assessment', 'pep_screening', 'sanctions_check',
      'alert_create', 'alert_investigate', 'alert_close', 'str_file',
      'policy_change', 'system_config', 'data_export', 'bulk_action'
    ],
    required: true,
    index: true
  },
  
  actor: {
    userId: String,
    username: String,
    role: String,
    department: String,
    aiAssistant: String,
    ipAddress: String,
    userAgent: String,
    deviceId: String,
    sessionId: String
  },
  
  timestamp: { type: Date, default: Date.now, index: true },
  
  details: {
    description: String,
    previousValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedFields: [String],
    reason: String,
    additionalInfo: mongoose.Schema.Types.Mixed
  },
  
  customerInfo: {
    customerId: String,
    customerName: String,
    emiratesId: String,
    riskCategory: String
  },
  
  outcome: {
    type: String,
    enum: ['success', 'failure', 'partial', 'pending'],
    default: 'success'
  },
  
  errorDetails: {
    errorCode: String,
    errorMessage: String,
    stackTrace: String
  },
  
  riskIndicators: {
    sensitiveDataAccessed: { type: Boolean, default: false },
    bulkOperation: { type: Boolean, default: false },
    afterHoursAccess: { type: Boolean, default: false },
    unusualLocation: { type: Boolean, default: false },
    elevatedPrivileges: { type: Boolean, default: false }
  },
  
  complianceFlags: {
    gdprRelevant: { type: Boolean, default: false },
    amlRelevant: { type: Boolean, default: false },
    kycRelevant: { type: Boolean, default: false },
    regulatoryReport: { type: Boolean, default: false }
  },
  
  dataIntegrity: {
    hash: String,
    previousHash: String,
    signature: String
  },
  
  retentionInfo: {
    retentionPeriod: { type: Number, default: 5 },
    retentionUnit: { type: String, default: 'years' },
    expiryDate: Date,
    archived: { type: Boolean, default: false },
    archivedAt: Date
  }
}, {
  timestamps: true
});

complianceAuditSchema.index({ 'actor.userId': 1, timestamp: -1 });
complianceAuditSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });
complianceAuditSchema.index({ 'customerInfo.customerId': 1, timestamp: -1 });
complianceAuditSchema.index({ 'complianceFlags.amlRelevant': 1, timestamp: -1 });

complianceAuditSchema.pre('save', function(next) {
  if (!this.auditId) {
    this.auditId = `AUD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }
  
  if (!this.retentionInfo.expiryDate) {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + this.retentionInfo.retentionPeriod);
    this.retentionInfo.expiryDate = expiryDate;
  }
  
  const dataToHash = JSON.stringify({
    auditId: this.auditId,
    entityType: this.entityType,
    entityId: this.entityId,
    action: this.action,
    actor: this.actor,
    timestamp: this.timestamp,
    details: this.details
  });
  this.dataIntegrity.hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  
  const now = new Date();
  const hour = now.getHours();
  if (hour < 7 || hour > 20) {
    this.riskIndicators.afterHoursAccess = true;
  }
  
  next();
});

complianceAuditSchema.statics.logAction = async function(params) {
  const {
    entityType,
    entityId,
    action,
    actor,
    details,
    customerInfo,
    outcome = 'success',
    errorDetails,
    complianceFlags = {}
  } = params;
  
  const audit = new this({
    entityType,
    entityId,
    action,
    actor: {
      userId: actor.userId || actor.id,
      username: actor.username || actor.email,
      role: actor.role,
      department: actor.department,
      aiAssistant: actor.aiAssistant,
      ipAddress: actor.ipAddress,
      userAgent: actor.userAgent,
      deviceId: actor.deviceId,
      sessionId: actor.sessionId
    },
    details,
    customerInfo,
    outcome,
    errorDetails,
    complianceFlags: {
      amlRelevant: ['alert_create', 'alert_investigate', 'str_file', 'sanctions_check'].includes(action),
      kycRelevant: ['verify', 'document_verify', 'risk_assessment', 'pep_screening'].includes(action),
      ...complianceFlags
    }
  });
  
  return audit.save();
};

complianceAuditSchema.statics.getAuditTrail = function(entityType, entityId, options = {}) {
  const query = { entityType, entityId };
  if (options.startDate) query.timestamp = { $gte: options.startDate };
  if (options.endDate) query.timestamp = { ...query.timestamp, $lte: options.endDate };
  if (options.action) query.action = options.action;
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(options.limit || 100);
};

complianceAuditSchema.statics.getUserActivity = function(userId, options = {}) {
  const query = { 'actor.userId': userId };
  if (options.startDate) query.timestamp = { $gte: options.startDate };
  if (options.endDate) query.timestamp = { ...query.timestamp, $lte: options.endDate };
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(options.limit || 100);
};

complianceAuditSchema.statics.getComplianceReport = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate, $lte: endDate },
        $or: [
          { 'complianceFlags.amlRelevant': true },
          { 'complianceFlags.kycRelevant': true }
        ]
      }
    },
    {
      $facet: {
        byAction: [{ $group: { _id: '$action', count: { $sum: 1 } } }],
        byEntity: [{ $group: { _id: '$entityType', count: { $sum: 1 } } }],
        byOutcome: [{ $group: { _id: '$outcome', count: { $sum: 1 } } }],
        riskIndicators: [
          {
            $match: {
              $or: [
                { 'riskIndicators.sensitiveDataAccessed': true },
                { 'riskIndicators.afterHoursAccess': true },
                { 'riskIndicators.bulkOperation': true }
              ]
            }
          },
          { $count: 'flaggedActivities' }
        ],
        dailyTrend: [
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]
      }
    }
  ]);
};

complianceAuditSchema.statics.searchAuditLogs = function(searchParams) {
  const query = {};
  
  if (searchParams.entityType) query.entityType = searchParams.entityType;
  if (searchParams.entityId) query.entityId = searchParams.entityId;
  if (searchParams.action) query.action = { $in: Array.isArray(searchParams.action) ? searchParams.action : [searchParams.action] };
  if (searchParams.userId) query['actor.userId'] = searchParams.userId;
  if (searchParams.customerId) query['customerInfo.customerId'] = searchParams.customerId;
  if (searchParams.startDate || searchParams.endDate) {
    query.timestamp = {};
    if (searchParams.startDate) query.timestamp.$gte = new Date(searchParams.startDate);
    if (searchParams.endDate) query.timestamp.$lte = new Date(searchParams.endDate);
  }
  if (searchParams.amlRelevant) query['complianceFlags.amlRelevant'] = true;
  if (searchParams.kycRelevant) query['complianceFlags.kycRelevant'] = true;
  
  const page = searchParams.page || 1;
  const limit = searchParams.limit || 50;
  const skip = (page - 1) * limit;
  
  return Promise.all([
    this.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit),
    this.countDocuments(query)
  ]).then(([logs, total]) => ({
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }));
};

export default mongoose.model('ComplianceAudit', complianceAuditSchema);
