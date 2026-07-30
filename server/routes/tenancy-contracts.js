const express = require('express');
const router = express.Router();
const TenancyContractService = require('../services/TenancyContractService');
const auth = require('../middleware/auth');

/**
 * POST /api/tenancy-contracts/create
 * Create a new tenancy contract draft
 */
router.post('/create', auth, async (req, res) => {
  try {
    // Schema validation enforced for payload
    const { formData } = req.body;
    const agentId = req.user.id;

    if (!formData) {
      return res.status(400).json({
        success: false,
        error: 'Form data is required'
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

module.exports = router;
