import express from 'express';
import TenancyTimeline from '../models/TenancyTimeline.js';
import SaleTimeline from '../models/SaleTimeline.js';

const router = express.Router();

const generateTransactionId = (type) => {
  const prefix = type === 'tenancy' ? 'TEN' : 'SAL';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

router.post('/tenancy', async (req, res) => {
  try {
    const transactionId = generateTransactionId('tenancy');
    const timeline = new TenancyTimeline({
      ...req.body,
      transactionId,
      statusTimeline: [{
        stage: 'initial_contact',
        status: 'completed',
        initiatedBy: 'agent',
        completedDate: new Date(),
        notes: 'Transaction initiated'
      }]
    });
    
    await timeline.save();
    res.status(201).json(timeline);
  } catch (error) {
    console.error('Error creating tenancy timeline:', error);
    res.status(500).json({ error: 'Failed to create tenancy timeline' });
  }
});

router.post('/sale', async (req, res) => {
  try {
    const transactionId = generateTransactionId('sale');
    const timeline = new SaleTimeline({
      ...req.body,
      transactionId,
      statusTimeline: [{
        stage: 'offer_made',
        status: 'completed',
        initiatedBy: 'buyer_agent',
        completedDate: new Date(),
        notes: 'Offer submitted'
      }]
    });
    
    await timeline.save();
    res.status(201).json(timeline);
  } catch (error) {
    console.error('Error creating sale timeline:', error);
    res.status(500).json({ error: 'Failed to create sale timeline' });
  }
});

router.get('/tenancy', async (req, res) => {
  try {
    const { status, stage, propertyId, tenantId, landlordId } = req.query;
    const query = {};
    
    if (status) query.overallStatus = status;
    if (stage) query.currentStage = stage;
    if (propertyId) query.propertyId = propertyId;
    if (tenantId) query['tenant.id'] = tenantId;
    if (landlordId) query['landlord.id'] = landlordId;
    
    const timelines = await TenancyTimeline.find(query)
      .populate('propertyId', 'title propertyCode location')
      .sort({ updatedAt: -1 })
      .limit(50);
    
    res.json(timelines);
  } catch (error) {
    console.error('Error fetching tenancy timelines:', error);
    res.status(500).json({ error: 'Failed to fetch tenancy timelines' });
  }
});

router.get('/sale', async (req, res) => {
  try {
    const { status, stage, propertyId, buyerId, sellerId } = req.query;
    const query = {};
    
    if (status) query.overallStatus = status;
    if (stage) query.currentStage = stage;
    if (propertyId) query.propertyId = propertyId;
    if (buyerId) query['buyer.id'] = buyerId;
    if (sellerId) query['seller.id'] = sellerId;
    
    const timelines = await SaleTimeline.find(query)
      .populate('propertyId', 'title propertyCode location')
      .sort({ updatedAt: -1 })
      .limit(50);
    
    res.json(timelines);
  } catch (error) {
    console.error('Error fetching sale timelines:', error);
    res.status(500).json({ error: 'Failed to fetch sale timelines' });
  }
});

router.get('/tenancy/:id', async (req, res) => {
  try {
    const timeline = await TenancyTimeline.findOne({ 
      $or: [
        { _id: req.params.id },
        { transactionId: req.params.id }
      ]
    })
    .populate('propertyId')
    .populate('tenant.id', 'name email phone')
    .populate('landlord.id', 'name email phone')
    .populate('agent.id', 'name email');
    
    if (!timeline) {
      return res.status(404).json({ error: 'Tenancy timeline not found' });
    }
    
    res.json(timeline);
  } catch (error) {
    console.error('Error fetching tenancy timeline:', error);
    res.status(500).json({ error: 'Failed to fetch tenancy timeline' });
  }
});

router.get('/sale/:id', async (req, res) => {
  try {
    const timeline = await SaleTimeline.findOne({ 
      $or: [
        { _id: req.params.id },
        { transactionId: req.params.id }
      ]
    })
    .populate('propertyId')
    .populate('buyer.id', 'name email phone')
    .populate('seller.id', 'name email phone');
    
    if (!timeline) {
      return res.status(404).json({ error: 'Sale timeline not found' });
    }
    
    res.json(timeline);
  } catch (error) {
    console.error('Error fetching sale timeline:', error);
    res.status(500).json({ error: 'Failed to fetch sale timeline' });
  }
});

router.patch('/tenancy/:id/stage', async (req, res) => {
  try {
    const { stage, status, initiatedBy, notes, dueDate } = req.body;
    
    const timeline = await TenancyTimeline.findOne({
      $or: [{ _id: req.params.id }, { transactionId: req.params.id }]
    });
    
    if (!timeline) {
      return res.status(404).json({ error: 'Timeline not found' });
    }
    
    timeline.statusTimeline.push({
      stage,
      status: status || 'in_progress',
      initiatedBy,
      notes,
      dueDate,
      createdAt: new Date()
    });
    
    timeline.currentStage = stage;
    await timeline.save();
    
    res.json(timeline);
  } catch (error) {
    console.error('Error updating tenancy stage:', error);
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

router.patch('/sale/:id/stage', async (req, res) => {
  try {
    const { stage, status, initiatedBy, notes, dueDate } = req.body;
    
    const timeline = await SaleTimeline.findOne({
      $or: [{ _id: req.params.id }, { transactionId: req.params.id }]
    });
    
    if (!timeline) {
      return res.status(404).json({ error: 'Timeline not found' });
    }
    
    timeline.statusTimeline.push({
      stage,
      status: status || 'in_progress',
      initiatedBy,
      notes,
      dueDate,
      createdAt: new Date()
    });
    
    timeline.currentStage = stage;
    await timeline.save();
    
    res.json(timeline);
  } catch (error) {
    console.error('Error updating sale stage:', error);
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

router.patch('/tenancy/:id/document', async (req, res) => {
  try {
    const { documentType, fileUrl, verified } = req.body;
    
    const timeline = await TenancyTimeline.findOne({
      $or: [{ _id: req.params.id }, { transactionId: req.params.id }]
    });
    
    if (!timeline) {
      return res.status(404).json({ error: 'Timeline not found' });
    }
    
    if (timeline.documents[documentType]) {
      timeline.documents[documentType].uploaded = true;
      timeline.documents[documentType].fileUrl = fileUrl;
      timeline.documents[documentType].uploadedDate = new Date();
      if (verified) {
        timeline.documents[documentType].verified = true;
        timeline.documents[documentType].verifiedDate = new Date();
      }
    }
    
    await timeline.save();
    res.json(timeline);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [tenancyStats, saleStats] = await Promise.all([
      TenancyTimeline.aggregate([
        { $group: { _id: '$overallStatus', count: { $sum: 1 } } }
      ]),
      SaleTimeline.aggregate([
        { $group: { _id: '$overallStatus', count: { $sum: 1 } } }
      ])
    ]);
    
    const renewalsDue = await TenancyTimeline.countDocuments({
      overallStatus: 'renewal_due'
    });
    
    res.json({
      tenancy: {
        byStatus: tenancyStats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
      },
      sale: {
        byStatus: saleStats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
      },
      renewalsDue
    });
  } catch (error) {
    console.error('Error fetching timeline stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
