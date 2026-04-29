const express = require('express');
const router = express.Router();
const AgentContact = require('../models/AgentContact');
const Viewing = require('../models/Viewing');
const WhatsAppLead = require('../models/WhatsAppLead');
const eventService = require('../services/eventService');

/**
 * Create agent contact request
 * POST /api/agent-contact
 */
router.post('/', async (req, res) => {
  try {
    const { agentId, propertyId, contactMethod, message, preferredDate, preferredTime, userId } =
      req.body;

    // Validate required fields
    if (!agentId || !propertyId) {
      return res.status(400).json({ error: 'Agent ID and Property ID are required' });
    }

    // Create contact request
    const contactRequest = new AgentContact({
      agentId,
      propertyId,
      userId,
      contactMethod,
      message,
      preferredDate,
      preferredTime,
      status: 'pending',
    });

    await contactRequest.save();

    // If viewing requested, create viewing record
    if (preferredDate && preferredTime) {
      const viewing = new Viewing({
        propertyId,
        agentId,
        userId,
        scheduledDate: new Date(`${preferredDate}T${preferredTime}`),
        contactMethod,
        status: 'requested',
        notes: message,
      });

      await viewing.save();
      contactRequest.viewingId = viewing._id;
      await contactRequest.save();
    }

    // Link to WhatsApp lead if exists
    if (req.body.phoneNumber) {
      const lead = await WhatsAppLead.findOne({ phoneNumber: req.body.phoneNumber });
      if (lead) {
        contactRequest.whatsAppLeadId = lead._id;
        lead.status = 'contacted';
        await lead.save();
        await contactRequest.save();
      }
    }

    // Emit event for agent notification
    eventService.emit('agent-contact-request', {
      contactRequestId: contactRequest._id,
      agentId,
      propertyId,
      contactMethod,
      preferredDate,
      preferredTime,
    });

    res.status(201).json({
      success: true,
      message: 'Contact request sent successfully',
      contactRequest,
    });
  } catch (error) {
    console.error('Error creating agent contact request:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get agent contact requests
 * GET /api/agent-contact?agentId=xxx&status=pending
 */
router.get('/', async (req, res) => {
  try {
    const { agentId, status, propertyId, limit = 20, skip = 0 } = req.query;

    const filter = {};
    if (agentId) filter.agentId = agentId;
    if (status) filter.status = status;
    if (propertyId) filter.propertyId = propertyId;

    const requests = await AgentContact.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('agentId', 'name phone email profilePicture')
      .populate('propertyId', 'title price area images')
      .populate('userId', 'name email phone');

    const total = await AgentContact.countDocuments(filter);

    res.json({
      requests,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get single contact request
 * GET /api/agent-contact/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const request = await AgentContact.findById(req.params.id)
      .populate('agentId')
      .populate('propertyId')
      .populate('userId')
      .populate('viewingId');

    if (!request) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update contact request status
 * PUT /api/agent-contact/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { status, response, agentNotes, viewingConfirmedDate, viewingConfirmedTime } = req.body;

    const request = await AgentContact.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(response && { response, respondedAt: new Date() }),
        ...(agentNotes && { agentNotes }),
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    // Update associated viewing if exists
    if (viewingConfirmedDate && viewingConfirmedTime && request.viewingId) {
      const viewing = await Viewing.findByIdAndUpdate(
        request.viewingId,
        {
          scheduledDate: new Date(`${viewingConfirmedDate}T${viewingConfirmedTime}`),
          status: 'confirmed',
        },
        { new: true }
      );
    }

    // Emit status update event
    eventService.emit('agent-contact-status-updated', {
      contactRequestId: request._id,
      status,
      agentId: request.agentId,
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Send response/message to contact request
 * POST /api/agent-contact/:id/respond
 */
router.post('/:id/respond', async (req, res) => {
  try {
    const { message, response, scheduleDate, scheduleTime } = req.body;

    const request = await AgentContact.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    // Add response
    request.response = response || message;
    request.respondedAt = new Date();
    request.status = 'responded';

    // Schedule viewing if dates provided
    if (scheduleDate && scheduleTime && request.viewingId) {
      const viewing = await Viewing.findByIdAndUpdate(
        request.viewingId,
        {
          scheduledDate: new Date(`${scheduleDate}T${scheduleTime}`),
          status: 'confirmed',
        }
      );
    }

    await request.save();

    // Send notification to user
    eventService.emit('agent-response-received', {
      contactRequestId: request._id,
      agentId: request.agentId,
      propertyId: request.propertyId,
      userId: request.userId,
      message: response || message,
    });

    // Send message via contact method
    const Property = require('../models/Property');
    const property = await Property.findById(request.propertyId);

    if (request.contactMethod === 'whatsapp' && request.whatsAppLeadId) {
      const WhatsAppService = require('../services/WhatsAppService');
      await WhatsAppService.sendAgentMessage(request, property, message);
    }

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cancel contact request
 * DELETE /api/agent-contact/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const request = await AgentContact.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Contact request not found' });
    }

    // Cancel associated viewing if exists
    if (request.viewingId) {
      await Viewing.findByIdAndUpdate(request.viewingId, {
        status: 'cancelled',
      });
    }

    res.json({ success: true, message: 'Contact request cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
