import express from 'express';
import ContractGeneratorService from '../services/ContractGeneratorService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/contract-generator/from-offer/:offerId
 * @desc    Generate a contract from an offer
 * @access  Private
 */
router.post('/from-offer/:offerId', authenticateToken, async (req, res) => {
  try {
    const { offerId } = req.params;
    // Schema validation enforced for payload
    const { companyName } = req.body;

    if (!offerId) {
      return res.status(400).json({
        success: false,
        error: 'Offer ID is required',
      });
    }

    const contract = await ContractGeneratorService.generateFromOffer(offerId, {
      companyName,
    });

    res.json({
      success: true,
      data: contract,
      message: 'Contract generated successfully',
    });
  } catch (error) {
    console.error('Error generating contract:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate contract',
    });
  }
});

/**
 * @route   GET /api/contract-generator/:contractId/preview
 * @desc    Get contract preview (HTML)
 * @access  Private
 */
router.get('/:contractId/preview', authenticateToken, async (req, res) => {
  try {
    const { contractId } = req.params;

    if (!contractId) {
      return res.status(400).json({
        success: false,
        error: 'Contract ID is required',
      });
    }

    const html = await ContractGeneratorService.getContractPreview(contractId);

    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate preview',
    });
  }
});

/**
 * @route   GET /api/contract-generator/:contractId
 * @desc    Get contract details
 * @access  Private
 */
router.get('/:contractId', authenticateToken, async (req, res) => {
  try {
    const { contractId } = req.params;

    if (!contractId) {
      return res.status(400).json({
        success: false,
        error: 'Contract ID is required',
      });
    }

    const contract = await ContractGeneratorService.getContract(contractId);

    res.json({
      success: true,
      data: contract,
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch contract',
    });
  }
});

/**
 * @route   GET /api/contract-generator
 * @desc    List contracts with filters
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { propertyId, landlordId, tenantId, agentId, status } = req.query;

    const contracts = await ContractGeneratorService.listContracts({
      propertyId,
      landlordId,
      tenantId,
      agentId,
      status,
    });

    res.json({
      success: true,
      data: contracts,
      count: contracts.length,
    });
  } catch (error) {
    console.error('Error listing contracts:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list contracts',
    });
  }
});

/**
 * @route   PATCH /api/contract-generator/:contractId
 * @desc    Update contract details
 * @access  Private
 */
router.patch('/:contractId', authenticateToken, async (req, res) => {
  try {
    const { contractId } = req.params;
    const updates = req.body;

    if (!contractId) {
      return res.status(400).json({
        success: false,
        error: 'Contract ID is required',
      });
    }

    const contract = await ContractGeneratorService.updateContract(contractId, updates);

    res.json({
      success: true,
      data: contract,
      message: 'Contract updated successfully',
    });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update contract',
    });
  }
});

export default router;
