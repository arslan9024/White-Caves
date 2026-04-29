import express from 'express';
import MaintenanceRequest from '../models/MaintenanceRequest.js';

const router = express.Router();

// GET /api/maintenance - List maintenance requests
router.get('/', async (req, res) => {
  try {
    const { propertyId, tenantId, landlordId, status, priority, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (propertyId) filter.propertyId = propertyId;
    if (tenantId) filter.tenantId = tenantId;
    if (landlordId) filter.landlordId = landlordId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [requests, total] = await Promise.all([
      MaintenanceRequest.find(filter)
        .sort({ priority: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      MaintenanceRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      requests,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/maintenance/overdue-sla - Get requests past SLA
router.get('/overdue-sla', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.getOverdueSLA();
    res.json({ success: true, requests, count: requests.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/maintenance/property/:propertyId/open - Open requests for property
router.get('/property/:propertyId/open', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.getOpenForProperty(req.params.propertyId);
    res.json({ success: true, requests, count: requests.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/maintenance/:id - Get single request
router.get('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/maintenance - Create maintenance request
router.post('/', async (req, res) => {
  try {
    const request = await MaintenanceRequest.create(req.body);
    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/maintenance/:id - Update request
router.put('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/maintenance/:id/status - Update status with audit trail
router.post('/:id/status', async (req, res) => {
  try {
    const { status, notes, changedBy } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });

    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });

    await request.addStatusChange(status, changedBy || { id: 'system', name: 'System' }, notes);
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/maintenance/:id/assign - Assign to technician/vendor
router.post('/:id/assign', async (req, res) => {
  try {
    const { assignedTo, scheduledDate, scheduledTimeSlot } = req.body;
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { $set: { assignedTo, scheduledDate, scheduledTimeSlot, status: 'scheduled' } },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/maintenance/:id/feedback - Submit tenant feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { $set: { tenantFeedback: { rating, comment, submittedAt: new Date() } } },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/maintenance/:id - Delete request
router.delete('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Maintenance request not found' });
    res.json({ success: true, message: 'Maintenance request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
