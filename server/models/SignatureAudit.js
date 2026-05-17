import mongoose from 'mongoose';

const signatureAuditSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
      index: true
    },
    contractSignatureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractSignature'
    },
    action: {
      type: String,
      enum: [
        'token_created',
        'email_sent',
        'email_opened',
        'link_clicked',
        'signature_initiated',
        'signature_completed',
        'signature_rejected',
        'reminder_sent',
        'token_expired',
        'token_revoked',
        'contract_fully_signed',
        'signature_verified',
        'audit_log_created'
      ],
      required: true,
      index: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    actorType: {
      type: String,
      enum: ['system', 'user', 'signer', 'admin'],
      default: 'system'
    },
    // Signature/Signer information
    signerType: {
      type: String,
      enum: ['landlord', 'tenant', 'agent', 'witness'],
      default: null
    },
    signerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // Action details
    details: {
      description: String,
      oldStatus: String,
      newStatus: String,
      reason: String,
      metadata: mongoose.Schema.Types.Mixed
    },
    // Security information
    ipAddress: String,
    userAgent: String,
    deviceInfo: {
      platform: String,
      browser: String,
      timezone: String
    },
    // Result of action
    result: {
      type: String,
      enum: ['success', 'failure', 'pending'],
      default: 'success'
    },
    errorMessage: String,
    
    // Severity level for important actions
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info'
    },
    
    // For verification and compliance
    documentHash: String,
    signatureHash: String,
    
    // Additional context
    context: mongoose.Schema.Types.Mixed
  },
  { 
    timestamps: true,
    indexes: [
      { contractId: 1, createdAt: -1 },
      { action: 1, createdAt: -1 },
      { signerId: 1, createdAt: -1 },
      { contractId: 1, action: 1 },
      { createdAt: 1 }
    ]
  }
);

// Statics
signatureAuditSchema.statics.log = async function(auditData) {
  const audit = new this(auditData);
  return audit.save();
};

signatureAuditSchema.statics.getContractAudit = async function(contractId) {
  return this.find({ contractId })
    .populate('actor', 'name email')
    .populate('signerId', 'name email')
    .sort({ createdAt: -1 });
};

signatureAuditSchema.statics.getSignerAudit = async function(signerId) {
  return this.find({ signerId })
    .populate('actor', 'name email')
    .sort({ createdAt: -1 });
};

signatureAuditSchema.statics.getActionLog = async function(action, contractId = null) {
  const query = { action };
  if (contractId) {
    query.contractId = contractId;
  }
  
  return this.find(query)
    .populate('actor', 'name email')
    .populate('signerId', 'name email')
    .sort({ createdAt: -1 });
};

signatureAuditSchema.statics.getCriticalEvents = async function(contractId = null) {
  const query = { severity: 'critical' };
  if (contractId) {
    query.contractId = contractId;
  }
  
  return this.find(query)
    .populate('actor', 'name email')
    .sort({ createdAt: -1 });
};

signatureAuditSchema.statics.getFailedActions = async function(contractId = null) {
  const query = { result: 'failure' };
  if (contractId) {
    query.contractId = contractId;
  }
  
  return this.find(query)
    .populate('actor', 'name email')
    .sort({ createdAt: -1 });
};

signatureAuditSchema.statics.logTokenCreated = async function(contractId, signerId, signerType, tokenId, actor) {
  return this.log({
    contractId,
    signerId,
    signerType,
    action: 'token_created',
    actor,
    actorType: 'system',
    details: {
      description: `Signature token created for ${signerType}`,
      metadata: { tokenId }
    },
    result: 'success'
  });
};

signatureAuditSchema.statics.logEmailSent = async function(contractId, signerId, signerType, actor) {
  return this.log({
    contractId,
    signerId,
    signerType,
    action: 'email_sent',
    actor,
    actorType: actor ? 'user' : 'system',
    details: {
      description: `Signature request email sent to ${signerType}`,
      newStatus: 'email_sent'
    },
    result: 'success'
  });
};

signatureAuditSchema.statics.logSignatureCompleted = async function(contractId, signerId, signerType, contractSignatureId) {
  return this.log({
    contractId,
    contractSignatureId,
    signerId,
    signerType,
    action: 'signature_completed',
    actorType: 'signer',
    details: {
      description: `${signerType} completed digital signature`,
      newStatus: 'signed'
    },
    result: 'success',
    severity: 'info'
  });
};

signatureAuditSchema.statics.logContractFullySigned = async function(contractId) {
  return this.log({
    contractId,
    action: 'contract_fully_signed',
    actorType: 'system',
    details: {
      description: 'All parties have signed the contract',
      newStatus: 'fully_signed'
    },
    result: 'success',
    severity: 'info'
  });
};

export default mongoose.model('SignatureAudit', signatureAuditSchema);
