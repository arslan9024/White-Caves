import express from 'express';
import OwnerContactStatus from '../models/OwnerContactStatus.js';
import PropertyStatus from '../models/PropertyStatus.js';
import ContactHistory from '../models/ContactHistory.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ============================================
// OWNER CONTACT STATUS ENDPOINTS
// ============================================

// Get all owner contact statuses
router.get('/owners/contact-statuses', async (req, res) => {
  try {
    const statuses = await OwnerContactStatus.find()
      .populate('ownerId', 'name email contacts')
      .sort({ lastContactDate: -1 });
    res.json(statuses);
  } catch (error) {
    logger.error('Failed to fetch contact statuses', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get owner follow-up list
router.get('/owners/follow-up-list', async (req, res) => {
  try {
    const { status = 'follow-up-due', limit = 50 } = req.query;

    let query = {};
    if (status !== 'all') {
      query.contactStatus = status;
    }

    const owners = await OwnerContactStatus.find(query)
      .populate('ownerId', 'name contacts')
      .sort({ nextFollowUpDate: 1 })
      .limit(parseInt(limit));

    res.json(owners);
  } catch (error) {
    logger.error('Failed to fetch follow-up list', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Update owner contact status
router.put('/owners/:ownerId/contact-status', async (req, res) => {
  try {
    const { ownerId } = req.params;
    // Schema validation enforced for payload
    const { contactStatus } = req.body;

    let status = await OwnerContactStatus.findOne({ ownerId });
    if (!status) {
      status = new OwnerContactStatus({ ownerId });
    }

    status.contactStatus = contactStatus;
    await status.save();

    logger.info('Contact status updated', { ownerId, contactStatus });
    res.json(status);
  } catch (error) {
    logger.error('Failed to update contact status', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Record contact interaction
router.post('/owners/:ownerId/record-contact', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { type, outcome, notes, nextFollowUp } = req.body;

    let status = await OwnerContactStatus.findOne({ ownerId });
    if (!status) {
      status = new OwnerContactStatus({ ownerId });
    }

    await status.recordContact(type, outcome, notes, nextFollowUp ? new Date(nextFollowUp) : null);

    // Also create contact history record
    await ContactHistory.create({
      ownerId,
      contactType: type,
      outcome,
      notes,
      nextFollowUpDate: nextFollowUp ? new Date(nextFollowUp) : null,
      contactDate: new Date(),
    });

    logger.info('Contact recorded', { ownerId, type, outcome });
    res.json(status);
  } catch (error) {
    logger.error('Failed to record contact', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Mark owner as interested
router.post('/owners/:ownerId/mark-interested', async (req, res) => {
  try {
    const { ownerId } = req.params;

    let status = await OwnerContactStatus.findOne({ ownerId });
    if (!status) {
      status = new OwnerContactStatus({ ownerId });
    }

    await status.markAsInterested();
    logger.info('Owner marked as interested', { ownerId });
    res.json(status);
  } catch (error) {
    logger.error('Failed to mark owner as interested', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Mark owner as not interested
router.post('/owners/:ownerId/mark-not-interested', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { reason = '' } = req.body;

    let status = await OwnerContactStatus.findOne({ ownerId });
    if (!status) {
      status = new OwnerContactStatus({ ownerId });
    }

    await status.markAsNotInterested(reason);
    logger.info('Owner marked as not interested', { ownerId, reason });
    res.json(status);
  } catch (error) {
    logger.error('Failed to mark owner as not interested', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PROPERTY STATUS ENDPOINTS
// ============================================

// Get all property statuses
router.get('/inventory/statuses', async (req, res) => {
  try {
    const statuses = await PropertyStatus.find()
      .populate('propertyId', 'pNumber area project')
      .sort({ lastStatusUpdate: -1 });
    res.json(statuses);
  } catch (error) {
    logger.error('Failed to fetch property statuses', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get properties by status filter
router.get('/inventory/by-status', async (req, res) => {
  try {
    const { furnishing, occupancy, market, construction, legal } = req.query;

    const filters = {};
    if (furnishing) filters.furnishing = furnishing;
    if (occupancy) filters.occupancyStatus = occupancy;
    if (market) filters.marketAvailability = market;
    if (construction) filters.constructionStage = construction;
    if (legal) filters.legalStatus = legal;

    const statuses = await PropertyStatus.find(filters)
      .populate('propertyId', 'pNumber area project')
      .sort({ lastStatusUpdate: -1 });

    res.json(statuses);
  } catch (error) {
    logger.error('Failed to fetch properties by status', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Update property status
router.put('/inventory/:propertyId/status-update', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { field, value, updatedBy, reason } = req.body;

    let status = await PropertyStatus.findOne({ propertyId });
    if (!status) {
      status = new PropertyStatus({ propertyId });
    }

    await status.updateStatus(field, value, updatedBy, reason);

    logger.info('Property status updated', { propertyId, field, value });
    res.json(status);
  } catch (error) {
    logger.error('Failed to update property status', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get property status summary
router.get('/inventory/:propertyId/status-summary', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const status = await PropertyStatus.findOne({ propertyId })
      .populate('propertyId');

    if (!status) {
      return res.status(404).json({ error: 'Property status not found' });
    }

    res.json(status.getStatusSummary());
  } catch (error) {
    logger.error('Failed to fetch property status summary', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export default router;
