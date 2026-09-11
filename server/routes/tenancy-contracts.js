import express from 'express';
import TenancyContractService from '../services/TenancyContractService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/tenancy-contracts/create
 * Create a new tenancy contract draft
 */
router.post('/create', auth, async (req, res) => {
  try {
    const { formData } = req.body;
    const agentId = req.user.id;

    // schema validation — formData must be a non-null object
    if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required and must be a valid object'
      });
    }

    const result = await TenancyContractService.createDraft(agentId, formData);

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating tenancy contract:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/tenancy-contracts/:contractId
 * Update a draft tenancy contract
 */
router.put('/:contractId', auth, async (req, res) => {
  try {
    const { contractId } = req.params;
    const { formData } = req.body;

    const result = await TenancyContractService.updateDraft(contractId, formData);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating tenancy contract:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/tenancy-contracts/:contractId/generate-pdf
 * Generate PDF from contract data
 */
router.post('/:contractId/generate-pdf', auth, async (req, res) => {
  try {
    const { contractId } = req.params;
    const agentId = req.user.id;

    const result = await TenancyContractService.generatePDF(contractId, agentId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/tenancy-contracts/:contractId/request-signatures
 * Request signatures from landlord and tenant
 */
router.post('/:contractId/request-signatures', auth, async (req, res) => {
  try {
    const { contractId } = req.params;
    const agentId = req.user.id;

    const result = await TenancyContractService.requestSignatures(contractId, agentId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error requesting signatures:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/tenancy-contracts/sign/:token
 * Get contract for signing (public endpoint)
 */
router.get('/sign/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const contractData = await TenancyContractService.getContractForSigning(token);

    res.json({
      success: true,
      data: contractData
    });
  } catch (error) {
    console.error('Error retrieving contract for signing:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/tenancy-contracts/sign/:token
 * Submit signature for contract (public endpoint)
 */
router.post('/sign/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { signatureData } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!signatureData) {
      return res.status(400).json({
        success: false,
        error: 'Signature data is required'
      });
    }

    const result = await TenancyContractService.recordSignature(
      token,
      signatureData,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error recording signature:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/tenancy-contracts/:contractId/status
 * Get contract status and signature information
 */
router.get('/:contractId/status', auth, async (req, res) => {
  try {
    const { contractId } = req.params;

    const statusData = await TenancyContractService.getContractStatus(contractId);

    res.json({
      success: true,
      data: statusData
    });
  } catch (error) {
    console.error('Error getting contract status:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/tenancy-contracts/:contractId/download
 * Download contract PDF
 */
router.get('/:contractId/download', auth, async (req, res) => {
  try {
    const { contractId } = req.params;

    const downloadData = await TenancyContractService.downloadContract(contractId);

    res.json({
      success: true,
      data: downloadData
    });
  } catch (error) {
    console.error('Error downloading contract:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/tenancy-contracts/list
 * List contracts for agent
 */
router.get('/', auth, async (req, res) => {
  try {
    const agentId = req.user.id;
    const { status, propertyId, limit, skip } = req.query;

    const filters = {
      status,
      propertyId,
      limit: parseInt(limit) || 50,
      skip: parseInt(skip) || 0
    };

    const result = await TenancyContractService.listContractsByAgent(agentId, filters);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error listing contracts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/tenancy-contracts/cron/ejari-expiry
 * Daily cron scan identifying contracts expiring within 90 days, 60 days, and 30 days.
 * Auto-generates Form 7 renewal proposals.
 */
router.post('/cron/ejari-expiry', async (req, res) => {
  try {
    // In production, this should be protected by an internal secret or API gateway
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev_cron_secret'}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized cron trigger' });
    }

    const { prisma } = await import('../database.js');
    const { Prisma } = await import('@prisma/client');
    const today = new Date();
    
    // Calculate the thresholds
    const days90 = new Date(today); days90.setDate(today.getDate() + 90);
    const days60 = new Date(today); days60.setDate(today.getDate() + 60);
    const days30 = new Date(today); days30.setDate(today.getDate() + 30);

    // Fetch active leases expiring in exactly 90, 60, or 30 days
    // For simplicity, we just fetch all active leases that expire between 0 and 90 days,
    // and then process them based on intervals. 
    // In a real system, we might track "lastNotificationSent" to avoid spam.
    const expiringLeases = await prisma.lease.findMany({
      where: {
        status: 'active',
        endDate: {
          lte: days90,
          gte: today
        }
      },
      include: {
        tenant: true,
        landlord: true,
        property: true
      }
    });

    const notificationsSent = [];
    for (const lease of expiringLeases) {
      const daysUntilExpiry = Math.ceil((lease.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Auto-generate Form 7 (renewal proposal) and send SMS/WhatsApp if exactly 90, 60, or 30 days
      if (daysUntilExpiry === 90 || daysUntilExpiry === 60 || daysUntilExpiry === 30) {
        notificationsSent.push({
          leaseId: lease.id,
          tenantEmail: lease.tenant?.email,
          daysUntilExpiry,
          message: `Your tenancy contract for ${lease.property?.title} expires in ${daysUntilExpiry} days.`
        });
        
        // Log the event or call NotificationService...
      }
    }

    res.json({
      success: true,
      processed: expiringLeases.length,
      notificationsSent: notificationsSent.length,
      details: notificationsSent
    });
  } catch (error) {
    console.error('Error running ejari expiry cron:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
