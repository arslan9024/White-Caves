import ContractSignature from '../models/ContractSignature.js';
import crypto from 'crypto';

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
        signer
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
      const hash = crypto
        .createHash('sha256')
        .update(signatureData.imageData)
        .digest('hex');

      // Extract device info
      const userAgent = signatureData.deviceInfo?.userAgent || 'Unknown';
      const platform = this.detectPlatform(userAgent);
      const browser = this.detectBrowser(userAgent);

      // Update signature
      signature.signatureData = {
        imageData: signatureData.imageData,
        mimeType: signatureData.mimeType || 'image/png',
        hash
      };
      signature.deviceInfo = {
        ipAddress: signatureData.deviceInfo?.ipAddress,
        userAgent,
        platform,
        browser
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
        contractId
      }).lean();

      const totalRequired = 2; // Default: tenant + landlord
      const signed = signatures.filter((s) => s.status === 'signed').length;
      const pending = signatures.filter((s) => s.status === 'pending').length;
      const expired = signatures.filter((s) => s.status === 'expired').length;

      return {
        contractId,
        totalRequired,
        signed,
        pending,
        expired,
        complete: signed >= totalRequired,
        signatures: signatures.map((s) => ({
          id: s._id,
          signer: s.signedBy?.email,
          role: s.signedBy?.role,
          status: s.status,
          signedAt: s.signedAt,
          expiresAt: s.expiresAt
        }))
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
    if (userAgent.includes('iPhone') || userAgent.includes('iPad'))
      return 'iOS';
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
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
      return 'Safari';
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
        status: 'pending'
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
      const signature = await ContractSignature.findById(signatureId).populate(
        'contractId'
      );
      if (!signature) {
        throw new Error('Signature not found');
      }

      // TODO: Integrate with email service
      // For now, just log
      console.log(`Reminder: Please sign contract ${signature.contractId._id}`);

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
        contractId: { $in: contractIds }
      }).lean();

      const result = {};
      contractIds.forEach((id) => {
        result[id] = {
          total: 0,
          signed: 0,
          pending: 0,
          signatures: []
        };
      });

      signatures.forEach((sig) => {
        const contractId = sig.contractId.toString();
        result[contractId].total++;
        if (sig.status === 'signed') {
          result[contractId].signed++;
        } else if (sig.status === 'pending') {
          result[contractId].pending++;
        }
        result[contractId].signatures.push({
          email: sig.signedBy.email,
          status: sig.status
        });
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to get bulk signature status: ${error.message}`);
    }
  }
}

export default new SignatureService();
