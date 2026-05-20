import ContractSignature from '../models/ContractSignature.js';
import SignatureToken from '../models/SignatureToken.js';
import SignatureAudit from '../models/SignatureAudit.js';
import Contract from '../models/Contract.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

class SignatureService {
  /**
   * Validate signature authenticity
   * @param {Object} signatureData - Signature data to validate
   * @returns {boolean} Whether signature is valid
   */
  validateSignature(signatureData) {
    try {
      // Check required fields
      if (!signatureData.imageData || !signatureData.hash) {
        return false;
      }

      // Verify hash matches
      const calculatedHash = crypto
        .createHash('sha256')
        .update(signatureData.imageData)
        .digest('hex');

      return calculatedHash === signatureData.hash;
    } catch (error) {
      console.error('Signature validation error:', error);
      return false;
    }
  }

  /**
   * Generate signing token
   * @param {String} contractId - Contract ID
   * @param {Object} signer - Signer information
   * @returns {Object} Token and signing data
   */
  generateSignatureToken(contractId, signer) {
    try {
      // Generate secure random token
      const token = crypto.randomBytes(32).toString('hex');

      // Set expiration (7 days)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Create signing URL
      const signingLink = `/sign/${contractId}/${token}`;

      return {
        token,
        signingLink,
        expiresAt,
        contractId,
        signer,
      };
    } catch (error) {
      throw new Error(`Failed to generate signature token: ${error.message}`);
    }
  }

  /**
   * Record signature
   * @param {String} contractId - Contract ID
   * @param {String} signatureId - Signature ID
   * @param {Object} signatureData - Signature image and metadata
   * @returns {Promise<Object>} Recorded signature
   */
  async recordSignature(contractId, signatureId, signatureData) {
    try {
      const signature = await ContractSignature.findById(signatureId);
      if (!signature) {
        throw new Error('Signature record not found');
      }

      // Check expiration
      if (new Date() > signature.expiresAt) {
        signature.status = 'expired';
        await signature.save();
        throw new Error('Signature request expired');
      }

      // Calculate signature hash
      const hash = crypto.createHash('sha256').update(signatureData.imageData).digest('hex');

      // Extract device info
      const userAgent = signatureData.deviceInfo?.userAgent || 'Unknown';
      const platform = this.detectPlatform(userAgent);
      const browser = this.detectBrowser(userAgent);

      // Update signature
      signature.signatureData = {
        imageData: signatureData.imageData,
        mimeType: signatureData.mimeType || 'image/png',
        hash,
      };
      signature.deviceInfo = {
        ipAddress: signatureData.deviceInfo?.ipAddress,
        userAgent,
        platform,
        browser,
      };
      signature.method = signatureData.method || 'canvas';
      signature.status = 'signed';
      signature.signedAt = new Date();

      await signature.save();

      return signature;
    } catch (error) {
      throw new Error(`Failed to record signature: ${error.message}`);
    }
  }

  /**
   * Get signature status
   * @param {String} contractId - Contract ID
   * @returns {Promise<Object>} Signature status
   */
  async getSignatureStatus(contractId) {
    try {
      const signatures = await ContractSignature.find({
        contractId,
      }).lean();

      const totalRequired = 2; // Default: tenant + landlord
      const signed = signatures.filter(s => s.status === 'signed').length;
      const pending = signatures.filter(s => s.status === 'pending').length;
      const expired = signatures.filter(s => s.status === 'expired').length;

      return {
        contractId,
        totalRequired,
        signed,
        pending,
        expired,
        complete: signed >= totalRequired,
        signatures: signatures.map(s => ({
          id: s._id,
          signer: s.signedBy?.email,
          role: s.signedBy?.role,
          status: s.status,
          signedAt: s.signedAt,
          expiresAt: s.expiresAt,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to get signature status: ${error.message}`);
    }
  }

  /**
   * Detect platform from user agent
   * @param {String} userAgent - User agent string
   * @returns {String} Platform name
   */
  detectPlatform(userAgent) {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Unknown';
  }

  /**
   * Detect browser from user agent
   * @param {String} userAgent - User agent string
   * @returns {String} Browser name
   */
  detectBrowser(userAgent) {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  /**
   * Validate signing request hasn't expired
   * @param {String} signatureId - Signature ID
   * @returns {Promise<boolean>} Whether request is still valid
   */
  async isSigningRequestValid(signatureId) {
    try {
      const signature = await ContractSignature.findById(signatureId);
      if (!signature) return false;
      if (signature.status !== 'pending') return false;
      if (new Date() > signature.expiresAt) {
        signature.status = 'expired';
        await signature.save();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Signing request validation error:', error);
      return false;
    }
  }

  /**
   * Get all pending signatures for a user
   * @param {String} userEmail - User email
   * @returns {Promise<Array>} Pending signatures
   */
  async getPendingSignatures(userEmail) {
    try {
      const signatures = await ContractSignature.find({
        'signedBy.email': userEmail,
        status: 'pending',
      })
        .populate('contractId', 'contractNumber status')
        .sort({ expiresAt: 1 });

      return signatures;
    } catch (error) {
      throw new Error(`Failed to get pending signatures: ${error.message}`);
    }
  }

  /**
   * Send signature reminder email
   * @param {String} signatureId - Signature ID
   * @returns {Promise<void>}
   */
  async sendSignatureReminder(signatureId) {
    try {
      const signature = await ContractSignature.findById(signatureId).populate('contractId');
      if (!signature) {
        throw new Error('Signature not found');
      }

      const { sendEmailTracked, wrapInBrandedTemplate } = await import('./emailService.js');
      const signingLink = `/sign/${signature.contractId._id}/${signature.token}`;
      const html = wrapInBrandedTemplate(
        `
          <h2>Signature Reminder</h2>
          <p>Dear ${signature.signedBy.name || 'Valued Client'}, your contract signature is still pending.</p>
          <p>Please sign contract <strong>${signature.contractId.contractNumber || signature.contractId._id}</strong> using the secure link below.</p>
          <p><a class="cta" href="${signingLink}">Review & Sign Contract</a></p>
          <p>This link expires on: ${signature.expiresAt.toLocaleString()}</p>
        `,
        { preheader: 'Your White Caves contract signature is still pending' }
      );

      await sendEmailTracked({
        to: signature.signedBy.email,
        subject: `Reminder: Contract signature pending (${signature.contractId.contractNumber || signature.contractId._id})`,
        html,
        text: `Dear ${signature.signedBy.name || 'Valued Client'}, your contract signature is still pending. Review and sign: ${signingLink}`,
        tags: [
          { name: 'type', value: 'contract_signature_reminder' },
          { name: 'contractId', value: String(signature.contractId._id) },
        ],
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to send reminder: ${error.message}`);
    }
  }

  /**
   * Bulk get signatures for multiple contracts
   * @param {Array<String>} contractIds - Contract IDs
   * @returns {Promise<Object>} Signature data keyed by contract ID
   */
  async getBulkSignatureStatus(contractIds) {
    try {
      const signatures = await ContractSignature.find({
        contractId: { $in: contractIds },
      }).lean();

      const result = {};
      contractIds.forEach(id => {
        result[id] = {
          total: 0,
          signed: 0,
          pending: 0,
          signatures: [],
        };
      });

      signatures.forEach(sig => {
        const contractId = sig.contractId.toString();
        result[contractId].total++;
        if (sig.status === 'signed') {
          result[contractId].signed++;
        } else if (sig.status === 'pending') {
          result[contractId].pending++;
        }
        result[contractId].signatures.push({
          email: sig.signedBy.email,
          status: sig.status,
        });
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to get bulk signature status: ${error.message}`);
    }
  }

  /**
   * Create new signature request
   * @param {Object} signatureData - Signature request data
   * @returns {Promise<Object>} Created signature request
   */
  async createSignatureRequest(signatureData) {
    try {
      const {
        contractId,
        signerEmail,
        signerRole,
        signerName,
        signerPhone,
        signatureType = 'digital',
      } = signatureData;

      // Check if signature already exists
      const existingSignature = await ContractSignature.findOne({
        contractId,
        'signedBy.email': signerEmail,
      });

      if (existingSignature && existingSignature.status === 'signed') {
        throw new Error('This contract has already been signed by this user');
      }

      // Generate token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Create signature record
      const signature = new ContractSignature({
        contractId,
        signedBy: {
          email: signerEmail,
          name: signerName,
          phone: signerPhone,
          role: signerRole,
        },
        token,
        expiresAt,
        signatureType,
        status: 'pending',
      });

      await signature.save();

      // Create audit log
      await this.createAuditLog(contractId, signerEmail, 'request_created', {
        signatureId: signature._id,
        expiresAt,
      });

      return {
        signatureId: signature._id,
        token,
        signingLink: `/contracts/sign/${contractId}/${token}`,
        expiresAt,
      };
    } catch (error) {
      throw new Error(`Failed to create signature request: ${error.message}`);
    }
  }

  /**
   * Verify signature token is valid
   * @param {String} contractId - Contract ID
   * @param {String} token - Signature token
   * @returns {Promise<Object>} Token data if valid
   */
  async verifySignatureToken(contractId, token) {
    try {
      const signature = await ContractSignature.findOne({
        contractId,
        token,
      });

      if (!signature) {
        throw new Error('Invalid signature token');
      }

      if (signature.status === 'expired') {
        throw new Error('Signature request has expired');
      }

      if (signature.status === 'signed') {
        throw new Error('Contract has already been signed by this party');
      }

      if (new Date() > signature.expiresAt) {
        signature.status = 'expired';
        await signature.save();
        throw new Error('Signature request has expired');
      }

      // Check rate limiting (max 10 signature page views per hour)
      const recentViews = signature.pageViews || [];
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentCount = recentViews.filter(view => new Date(view) > oneHourAgo).length;

      if (recentCount > 10) {
        throw new Error('Too many signature requests. Please try again later.');
      }

      // Update page views
      signature.pageViews = [...recentViews, new Date()];
      await signature.save();

      return {
        signatureId: signature._id,
        contractId,
        signerEmail: signature.signedBy.email,
        signerName: signature.signedBy.name,
        signerRole: signature.signedBy.role,
        expiresAt: signature.expiresAt,
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Save signature data
   * @param {String} signatureId - Signature ID
   * @param {Object} signatureData - Signature image and metadata
   * @returns {Promise<Object>} Saved signature
   */
  async saveSignature(signatureId, signatureData) {
    try {
      const signature = await ContractSignature.findById(signatureId);
      if (!signature) {
        throw new Error('Signature request not found');
      }

      if (signature.status !== 'pending') {
        throw new Error(`Cannot sign: status is ${signature.status}`);
      }

      if (new Date() > signature.expiresAt) {
        signature.status = 'expired';
        await signature.save();
        throw new Error('Signature request has expired');
      }

      // Calculate hash
      const hash = crypto.createHash('sha256').update(signatureData.imageData).digest('hex');

      // Extract device info
      const userAgent = signatureData.deviceInfo?.userAgent || 'Unknown';
      const platform = this.detectPlatform(userAgent);
      const browser = this.detectBrowser(userAgent);

      // Update signature
      signature.signatureData = {
        imageData: signatureData.imageData,
        mimeType: signatureData.mimeType || 'image/png',
        hash,
        coordinates: signatureData.coordinates || null,
      };
      signature.deviceInfo = {
        ipAddress: signatureData.deviceInfo?.ipAddress,
        userAgent,
        platform,
        browser,
        timestamp: new Date(),
      };
      signature.method = signatureData.method || 'canvas';
      signature.status = 'signed';
      signature.signedAt = new Date();

      await signature.save();

      // Create audit log
      await this.createAuditLog(signature.contractId, signature.signedBy.email, 'signed', {
        signatureId,
        method: signature.method,
        platform,
        browser,
      });

      // Check if all signatures collected
      await this.checkContractSignatureCompletion(signature.contractId);

      return signature;
    } catch (error) {
      throw new Error(`Failed to save signature: ${error.message}`);
    }
  }

  /**
   * Check if all required signatures are collected
   * @param {String} contractId - Contract ID
   * @returns {Promise<boolean>} True if all signatures collected
   */
  async checkContractSignatureCompletion(contractId) {
    try {
      const contract = await Contract.findById(contractId);
      if (!contract) throw new Error('Contract not found');

      const signatures = await ContractSignature.find({
        contractId,
        status: 'signed',
      });

      // Check if all required signers have signed
      const requiredRoles = contract.requiredSignatures || ['tenant', 'landlord'];
      const signedRoles = signatures.map(s => s.signedBy.role);

      const allSigned = requiredRoles.every(role => signedRoles.includes(role));

      if (allSigned) {
        contract.signatureStatus = 'complete';
        contract.fullySignedAt = new Date();
        contract.status = 'executed';
        await contract.save();

        // Create audit log
        await this.createAuditLog(contractId, 'system', 'all_signatures_complete', {
          signedAt: new Date(),
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error checking signature completion:', error);
      return false;
    }
  }

  /**
   * Create audit log entry
   * @param {String} contractId - Contract ID
   * @param {String} actor - Who performed the action
   * @param {String} action - Action performed
   * @param {Object} details - Additional details
   * @returns {Promise<Object>} Created audit log
   */
  async createAuditLog(contractId, actor, action, details = {}) {
    try {
      const auditLog = new SignatureAudit({
        contractId,
        actor,
        action,
        details,
        timestamp: new Date(),
      });

      await auditLog.save();
      return auditLog;
    } catch (error) {
      console.error('Error creating audit log:', error);
      // Don't throw to prevent blocking the main operation
    }
  }

  /**
   * Get contract audit trail
   * @param {String} contractId - Contract ID
   * @returns {Promise<Array>} Audit log entries
   */
  async getAuditTrail(contractId) {
    try {
      const auditLogs = await SignatureAudit.find({ contractId }).sort({ timestamp: -1 }).lean();

      return auditLogs;
    } catch (error) {
      throw new Error(`Failed to get audit trail: ${error.message}`);
    }
  }

  /**
   * Send signing notification
   * @param {String} signatureId - Signature ID
   * @param {String} signingLink - Link to signing page
   * @returns {Promise<boolean>} True if sent successfully
   */
  async sendSigningNotification(signatureId, signingLink) {
    try {
      const signature = await ContractSignature.findById(signatureId).populate('contractId');
      if (!signature) {
        throw new Error('Signature not found');
      }

      const { sendEmailTracked, wrapInBrandedTemplate } = await import('./emailService.js');
      const contractLabel = signature.contractId.contractNumber || signature.contractId._id;
      const html = wrapInBrandedTemplate(
        `
          <h2>Signature Request Ready</h2>
          <p>Dear ${signature.signedBy.name || 'Valued Client'}, your signature is requested for contract <strong>${contractLabel}</strong>.</p>
          <p>Open the secure signing link below to review and sign the document.</p>
          <p><a class="cta" href="${signingLink}">Review & Sign Contract</a></p>
          <p>This link expires on: ${signature.expiresAt.toLocaleString()}</p>
        `,
        { preheader: 'Your White Caves contract signature request is ready' }
      );

      await sendEmailTracked({
        to: signature.signedBy.email,
        subject: `Signature Request: Contract ${contractLabel}`,
        html,
        text: `Dear ${signature.signedBy.name || 'Valued Client'}, please review and sign contract ${contractLabel}: ${signingLink}`,
        tags: [
          { name: 'type', value: 'contract_signature_request' },
          { name: 'contractId', value: String(signature.contractId._id) },
        ],
      });

      // Create audit log
      await this.createAuditLog(signature.contractId._id, 'system', 'notification_sent', {
        email: signature.signedBy.email,
      });

      return true;
    } catch (error) {
      console.error('Failed to send signing notification:', error);
      return false;
    }
  }

  /**
   * Resend signing request
   * @param {String} signatureId - Signature ID
   * @returns {Promise<Object>} Updated signature request
   */
  async resendSigningRequest(signatureId) {
    try {
      const signature = await ContractSignature.findById(signatureId);
      if (!signature) {
        throw new Error('Signature not found');
      }

      // Generate new token
      const newToken = crypto.randomBytes(32).toString('hex');
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      signature.token = newToken;
      signature.expiresAt = newExpiresAt;
      signature.pageViews = [];
      await signature.save();

      // Create audit log
      await this.createAuditLog(signature.contractId, 'system', 'request_resent', {
        signatureId,
        expiresAt: newExpiresAt,
      });

      return {
        signatureId: signature._id,
        token: newToken,
        signingLink: `/contracts/sign/${signature.contractId}/${newToken}`,
        expiresAt: newExpiresAt,
      };
    } catch (error) {
      throw new Error(`Failed to resend signing request: ${error.message}`);
    }
  }

  /**
   * Cancel signature request
   * @param {String} signatureId - Signature ID
   * @returns {Promise<Object>} Cancelled signature
   */
  async cancelSignatureRequest(signatureId) {
    try {
      const signature = await ContractSignature.findByIdAndUpdate(
        signatureId,
        { status: 'cancelled', cancelledAt: new Date() },
        { new: true }
      );

      if (!signature) {
        throw new Error('Signature not found');
      }

      // Create audit log
      await this.createAuditLog(signature.contractId, 'system', 'request_cancelled', {
        signatureId,
      });

      return signature;
    } catch (error) {
      throw new Error(`Failed to cancel signature request: ${error.message}`);
    }
  }

  /**
   * Get signature statistics for a contract
   * @param {String} contractId - Contract ID
   * @returns {Promise<Object>} Signature statistics
   */
  async getSignatureStats(contractId) {
    try {
      const signatures = await ContractSignature.find({ contractId });
      const auditLogs = await SignatureAudit.find({ contractId }).sort({
        timestamp: -1,
      });

      const stats = {
        contractId,
        totalSignatures: signatures.length,
        signed: signatures.filter(s => s.status === 'signed').length,
        pending: signatures.filter(s => s.status === 'pending').length,
        expired: signatures.filter(s => s.status === 'expired').length,
        cancelled: signatures.filter(s => s.status === 'cancelled').length,
        averageSigningTime: this.calculateAverageSigningTime(signatures),
        lastActivity: auditLogs[0]?.timestamp || null,
        auditLogCount: auditLogs.length,
      };

      return stats;
    } catch (error) {
      throw new Error(`Failed to get signature stats: ${error.message}`);
    }
  }

  /**
   * Calculate average time to sign
   * @param {Array} signatures - Signature records
   * @returns {String} Human-readable average signing time
   */
  calculateAverageSigningTime(signatures) {
    const signedSignatures = signatures.filter(s => s.status === 'signed');
    if (signedSignatures.length === 0) return 'N/A';

    const totalTime = signedSignatures.reduce((sum, sig) => {
      const created = new Date(sig.createdAt);
      const signed = new Date(sig.signedAt);
      return sum + (signed - created);
    }, 0);

    const avgMs = totalTime / signedSignatures.length;
    const hours = Math.floor(avgMs / (1000 * 60 * 60));
    const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Batch create signature requests
   * @param {String} contractId - Contract ID
   * @param {Array} signerList - List of signers
   * @returns {Promise<Array>} Created signature requests
   */
  async createBatchSignatureRequests(contractId, signerList) {
    try {
      const requests = [];

      for (const signer of signerList) {
        const request = await this.createSignatureRequest({
          contractId,
          signerEmail: signer.email,
          signerRole: signer.role,
          signerName: signer.name,
          signerPhone: signer.phone,
        });
        requests.push(request);
      }

      // Create audit log
      await this.createAuditLog(contractId, 'system', 'batch_requests_created', {
        count: requests.length,
      });

      return requests;
    } catch (error) {
      throw new Error(`Failed to create batch signature requests: ${error.message}`);
    }
  }
}

export default new SignatureService();
