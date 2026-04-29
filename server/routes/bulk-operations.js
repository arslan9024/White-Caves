import express from 'express';
import BulkOperationsService from '../services/BulkOperationsService.js';

const router = express.Router();

/**
 * POST /api/bulk/status-update
 * Update status for multiple properties
 */
router.post('/status-update', async (req, res) => {
  try {
    const { propertyIds, newStatus } = req.body;

    // Validation
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty propertyIds array',
      });
    }

    if (!newStatus || typeof newStatus !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided',
      });
    }

    const result = await BulkOperationsService.updateStatuses(propertyIds, newStatus);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Bulk status update error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/bulk/price-update
 * Update prices for multiple properties
 */
router.post('/price-update', async (req, res) => {
  try {
    const { propertyIds, priceUpdate } = req.body;

    // Validation
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty propertyIds array',
      });
    }

    if (!priceUpdate || !priceUpdate.type || priceUpdate.value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price update data',
      });
    }

    const result = await BulkOperationsService.updatePrices(propertyIds, priceUpdate);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Bulk price update error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/bulk/furnishing-update
 * Update furnishing type for multiple properties
 */
router.post('/furnishing-update', async (req, res) => {
  try {
    const { propertyIds, furnishing } = req.body;

    // Validation
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty propertyIds array',
      });
    }

    if (!furnishing || typeof furnishing !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid furnishing type provided',
      });
    }

    const result = await BulkOperationsService.updateFurnishing(propertyIds, furnishing);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Bulk furnishing update error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/bulk/tags-update
 * Update tags for multiple properties
 */
router.post('/tags-update', async (req, res) => {
  try {
    const { propertyIds, tags, operation } = req.body;

    // Validation
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty propertyIds array',
      });
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tags array',
      });
    }

    const result = await BulkOperationsService.updateTags(
      propertyIds,
      tags,
      operation || 'add'
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Bulk tags update error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/bulk/notify
 * Send notifications for multiple properties
 */
router.post('/notify', async (req, res) => {
  try {
    const { propertyIds, message, type } = req.body;

    // Validation
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty propertyIds array',
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification message',
      });
    }

    const result = await BulkOperationsService.sendNotifications(
      propertyIds,
      message,
      type || 'info'
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Bulk notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/bulk/delete
 * Soft delete multiple properties
 */
router.post('/delete', async (req, res) => {
  try {
    const { propertyIds } = req.body;

    // Validation
    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty propertyIds array',
      });
    }

    const result = await BulkOperationsService.deleteProperties(propertyIds);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /api/bulk/history
 * Get operation history
 */
router.get('/history', async (req, res) => {
  try {
    const { limit } = req.query;
    const result = await BulkOperationsService.getOperationHistory(
      parseInt(limit) || 20
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /api/bulk/undo
 * Undo last operation
 */
router.post('/undo', async (req, res) => {
  try {
    const result = await BulkOperationsService.undoLastOperation();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Undo error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
