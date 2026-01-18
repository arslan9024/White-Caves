import express from 'express';
import SignatureService from '../services/SignatureService.js';
import Contract from '../models/Contract.js';
import ContractSignature from '../models/ContractSignature.js';

const router = express.Router();

/**
 * POST /api/signatures/request
 * Create a new signature request
 */
router.post('/request', async (req, res) => {
  try {
    const { contractId, signerEmail, signerRole, signerName, signerPhone } =
      req.body;

    // Validate input
    if (!contractId || !signerEmail || !signerRole) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Create signature request
    const request = await SignatureService.createSignatureRequest({
      contractId,
      signerEmail,
      signerRole,
      signerName,
      signerPhone
    });

    // Send signing notification
    await SignatureService.sendSigningNotification(
      request.signatureId,
      request.signingLink
    );

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error creating signature request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/signatures/:contractId/:token
 * Verify signature token and get signing page data
 */
router.get('/:contractId/:token', async (req, res) => {
  try {
    const { contractId, token } = req.params;

    // Verify token
    const tokenData = await SignatureService.verifySignatureToken(
      contractId,
      token
    );

    // Get contract data
    const contract = await Contract.findById(contractId)
      .select(
        'contractNumber status contractType propertyId tenantDetails landlordDetails'
      )
      .lean();

    if (!contract) {
      return res.status(404).json({
        success: false,
        error: 'Contract not found'
      });
    }

    res.json({
      success: true,
      data: {
        tokenData,
        contract
      }
    });
  } catch (error) {
    console.error('Error verifying signature token:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/signatures/:signatureId/sign
 * Submit signed signature
 */
router.post('/:signatureId/sign', async (req, res) => {
  try {
    const { signatureId } = req.params;
    const { imageData, mimeType, method, deviceInfo, coordinates } = req.body;

    // Validate input
    if (!imageData) {
      return res.status(400).json({
        success: false,
        error: 'Missing signature image data'
      });
    }

    // Add device info from request
    const enrichedDeviceInfo = {
      ...deviceInfo,
      ipAddress:
        req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent']
    };

    // Save signature
    const signature = await SignatureService.saveSignature(signatureId, {
      imageData,
      mimeType,
      method,
      deviceInfo: enrichedDeviceInfo,
      coordinates
    });

    res.json({
      success: true,
      data: {
        signatureId: signature._id,
        status: signature.status,
        signedAt: signature.signedAt
      }
    });
  } catch (error) {
    console.error('Error saving signature:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/signatures/:contractId/status
 * Get signature status for a contract
 */
router.get('/:contractId/status', async (req, res) => {
  try {
    const { contractId } = req.params;

    const status = await SignatureService.getSignatureStatus(contractId);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting signature status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/signatures/:contractId/stats
 * Get signature statistics
 */
router.get('/:contractId/stats', async (req, res) => {
  try {
    const { contractId } = req.params;

    const stats = await SignatureService.getSignatureStats(contractId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting signature stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/signatures/:contractId/audit
 * Get audit trail for a contract
 */
router.get('/:contractId/audit', async (req, res) => {
  try {
    const { contractId } = req.params;

    const auditTrail = await SignatureService.getAuditTrail(contractId);

    res.json({
      success: true,
      data: auditTrail
    });
  } catch (error) {
    console.error('Error getting audit trail:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/signatures/:signatureId/resend
 * Resend signing request
 */
router.post('/:signatureId/resend', async (req, res) => {
  try {
    const { signatureId } = req.params;

    const request = await SignatureService.resendSigningRequest(signatureId);

    // Send notification
    await SignatureService.sendSigningNotification(
      request.signatureId,
      request.signingLink
    );

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error resending signature request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/signatures/:signatureId/cancel
 * Cancel signature request
 */
router.post('/:signatureId/cancel', async (req, res) => {
  try {
    const { signatureId } = req.params;

    const signature = await SignatureService.cancelSignatureRequest(signatureId);

    res.json({
      success: true,
      data: signature
    });
  } catch (error) {
    console.error('Error cancelling signature request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/signatures/batch/request
 * Create multiple signature requests at once
 */
router.post('/batch/request', async (req, res) => {
  try {
    const { contractId, signers } = req.body;

    // Validate input
    if (!contractId || !signers || !Array.isArray(signers)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid contractId/signers'
      });
    }

    // Create batch requests
    const requests = await SignatureService.createBatchSignatureRequests(
      contractId,
      signers
    );

    // Send notifications
    for (const request of requests) {
      await SignatureService.sendSigningNotification(
        request.signatureId,
        request.signingLink
      );
    }

    res.json({
      success: true,
      data: {
        count: requests.length,
        requests
      }
    });
  } catch (error) {
    console.error('Error creating batch signature requests:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/signatures/user/:userEmail/pending
 * Get pending signatures for a user
 */
router.get('/user/:userEmail/pending', async (req, res) => {
  try {
    const { userEmail } = req.params;

    const signatures = await SignatureService.getPendingSignatures(userEmail);

    res.json({
      success: true,
      data: signatures
    });
  } catch (error) {
    console.error('Error getting pending signatures:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/signatures/bulk/status
 * Get signature status for multiple contracts
 */
router.post('/bulk/status', async (req, res) => {
  try {
    const { contractIds } = req.body;

    // Validate input
    if (!contractIds || !Array.isArray(contractIds)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid contractIds'
      });
    }

    // Get bulk status
    const statusMap = await SignatureService.getBulkSignatureStatus(contractIds);

    res.json({
      success: true,
      data: statusMap
    });
  } catch (error) {
    console.error('Error getting bulk signature status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
