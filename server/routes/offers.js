import express from 'express';
import Offer from '../models/Offer.js';
import PropertyInventory from '../models/PropertyInventory.js';
import DealJourney from '../models/DealJourney.js';
import User from '../models/User.js';
import Owner from '../models/Owner.js';

const router = express.Router();

// Create a new offer
router.post('/', async (req, res) => {
  try {
    const {
      propertyId,
      landlordId,
      tenantId,
      agentId,
      monthlyRent,
      securityDeposit,
      leaseDuration,
      chequeFrequency,
      noOfCheques,
      startDate,
      endDate,
      rentIncreasePercentage,
      maintenanceResponsibility,
      utilities,
      specialTerms,
    } = req.body;

    // Validate required fields
    if (!propertyId || !landlordId || !tenantId || !agentId || !monthlyRent || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const offer = new Offer({
      propertyId,
      landlordId,
      tenantId,
      agentId,
      monthlyRent,
      securityDeposit: securityDeposit || monthlyRent,
      leaseDuration: leaseDuration || 12,
      chequeFrequency: chequeFrequency || 'monthly',
      noOfCheques: noOfCheques || 12,
      startDate,
      endDate: endDate || new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 12, new Date(startDate).getDate()),
      rentIncreasePercentage: rentIncreasePercentage || 0,
      maintenanceResponsibility: maintenanceResponsibility || 'landlord',
      utilities: utilities || '',
      specialTerms: specialTerms || '',
      status: 'draft',
    });

    await offer.save();

    // Create property inventory entry if doesn't exist
    let propertyInventory = await PropertyInventory.findOne({ propertyId });
    if (!propertyInventory) {
      propertyInventory = new PropertyInventory({
        propertyId,
        status: 'offer_in_progress',
        currentOfferId: offer._id,
        visibleTo: {
          mary: true,
        },
      });
      await propertyInventory.save();
    } else {
      propertyInventory.currentOfferId = offer._id;
      propertyInventory.status = 'offer_in_progress';
      await propertyInventory.save();
    }

    // Create deal journey
    const dealJourney = new DealJourney({
      propertyId,
      landlordId,
      tenantId,
      agentId,
      offerId: offer._id,
      overallStatus: 'initiated',
      stages: [
        {
          stageId: 'offer_creation',
          stageName: 'Offer Creation',
          stageOrder: 1,
          status: 'completed',
          completedAt: new Date(),
          assignedTo: agentId,
        },
        {
          stageId: 'tenant_approval',
          stageName: 'Tenant Approval',
          stageOrder: 2,
          status: 'pending',
          assignedTo: tenantId,
        },
        {
          stageId: 'landlord_approval',
          stageName: 'Landlord Approval',
          stageOrder: 3,
          status: 'pending',
          assignedTo: landlordId,
        },
        {
          stageId: 'contract_generation',
          stageName: 'Contract Generation',
          stageOrder: 4,
          status: 'pending',
          assignedTo: agentId,
        },
        {
          stageId: 'signature',
          stageName: 'E-Signature',
          stageOrder: 5,
          status: 'pending',
        },
      ],
      expectedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    });

    await dealJourney.save();

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: {
        offer,
        dealJourney,
        propertyInventory,
      },
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

// Get all offers with filters
router.get('/', async (req, res) => {
  try {
    const { propertyId, tenantId, landlordId, agentId, status } = req.query;
    const filter = {};

    if (propertyId) filter.propertyId = propertyId;
    if (tenantId) filter.tenantId = tenantId;
    if (landlordId) filter.landlordId = landlordId;
    if (agentId) filter.agentId = agentId;
    if (status) filter.status = status;

    const offers = await Offer.find(filter)
      .populate('propertyId', 'name location type')
      .populate('landlordId', 'name email phone')
      .populate('tenantId', 'name email phone')
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: offers,
      count: offers.length,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Get single offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('propertyId')
      .populate('landlordId')
      .populate('tenantId')
      .populate('agentId');

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ error: 'Failed to fetch offer' });
  }
});

// Send offer to tenant
router.post('/:id/send-to-tenant', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Generate unique sign link for tenant
    const tenantSignLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/offers/${offer._id}/sign/tenant`;

    offer.tenantSignLink = tenantSignLink;
    offer.status = 'sent_to_tenant';
    offer.sentToTenantAt = new Date();

    // Add communication history
    offer.communicationHistory.push({
      type: 'email',
      recipient: 'tenant',
      subject: 'Property Offer - Action Required',
      message: `A new rental offer has been sent to you. Please review the terms and approve or reject.`,
      sentAt: new Date(),
      status: 'sent',
    });

    await offer.save();

    // Update deal journey
    await DealJourney.findOneAndUpdate(
      { offerId: offer._id },
      {
        overallStatus: 'offer_stage',
        'stages.1.status': 'in_progress',
        'stages.1.startDate': new Date(),
      }
    );

    res.json({
      success: true,
      message: 'Offer sent to tenant',
      data: {
        tenantSignLink,
        offer,
      },
    });
  } catch (error) {
    console.error('Error sending offer to tenant:', error);
    res.status(500).json({ error: 'Failed to send offer' });
  }
});

// Tenant approves offer
router.post('/:id/approve-tenant', async (req, res) => {
  try {
    const { notes } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    offer.tenantApproved = true;
    offer.tenantApprovedAt = new Date();
    offer.tenantApprovalNotes = notes || '';

    // Check if both approved
    if (offer.landlordApproved) {
      offer.status = 'both_approved';
    } else {
      offer.status = 'tenant_approved';
      // Send to landlord for approval
      const landlordSignLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/offers/${offer._id}/sign/landlord`;
      offer.landlordSignLink = landlordSignLink;
      offer.sentToLandlordAt = new Date();
      offer.status = 'sent_to_landlord';
    }

    await offer.save();

    // Update deal journey
    const dealJourney = await DealJourney.findOneAndUpdate(
      { offerId: offer._id },
      {
        'stages.1.status': 'completed',
        'stages.1.completedAt': new Date(),
        'stages.2.status': offer.landlordApproved ? 'completed' : 'in_progress',
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Offer approved by tenant',
      data: {
        offer,
        dealJourney,
      },
    });
  } catch (error) {
    console.error('Error approving offer:', error);
    res.status(500).json({ error: 'Failed to approve offer' });
  }
});

// Tenant rejects offer
router.post('/:id/reject-tenant', async (req, res) => {
  try {
    const { notes } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    offer.status = 'tenant_rejected';
    offer.tenantApprovalNotes = notes || 'Tenant rejected the offer';

    await offer.save();

    // Update property inventory
    await PropertyInventory.findOneAndUpdate(
      { propertyId: offer.propertyId },
      { status: 'available', currentOfferId: null }
    );

    res.json({
      success: true,
      message: 'Offer rejected by tenant',
      data: offer,
    });
  } catch (error) {
    console.error('Error rejecting offer:', error);
    res.status(500).json({ error: 'Failed to reject offer' });
  }
});

// Landlord approves offer
router.post('/:id/approve-landlord', async (req, res) => {
  try {
    const { notes } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    offer.landlordApproved = true;
    offer.landlordApprovedAt = new Date();
    offer.landlordApprovalNotes = notes || '';

    if (offer.tenantApproved) {
      offer.status = 'both_approved';
    } else {
      offer.status = 'landlord_approved';
    }

    await offer.save();

    // Update deal journey
    await DealJourney.findOneAndUpdate(
      { offerId: offer._id },
      {
        'stages.2.status': 'completed',
        'stages.2.completedAt': new Date(),
        overallStatus: offer.tenantApproved ? 'approval_stage' : 'approval_stage',
      }
    );

    res.json({
      success: true,
      message: 'Offer approved by landlord',
      data: offer,
    });
  } catch (error) {
    console.error('Error approving offer:', error);
    res.status(500).json({ error: 'Failed to approve offer' });
  }
});

// Get offer status
router.get('/:id/status', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).select(
      'status tenantApproved landlordApproved sentToTenantAt sentToLandlordAt'
    );

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({
      success: true,
      data: {
        offerId: offer._id,
        status: offer.status,
        tenantApproved: offer.tenantApproved,
        landlordApproved: offer.landlordApproved,
        sentToTenantAt: offer.sentToTenantAt,
        sentToLandlordAt: offer.sentToLandlordAt,
      },
    });
  } catch (error) {
    console.error('Error fetching offer status:', error);
    res.status(500).json({ error: 'Failed to fetch offer status' });
  }
});

export default router;
