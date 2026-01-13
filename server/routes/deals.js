import express from 'express';
import TenancyDeal from '../models/TenancyDeal.js';
import SalesDeal from '../models/SalesDeal.js';
import DemoData from '../models/DemoData.js';
import { seedAllDemoData } from '../seeds/demoDataSeeder.js';

const router = express.Router();

router.get('/tenancy', async (req, res) => {
  try {
    const { status, brokerId, isDemo, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (brokerId) query['broker.agentId'] = brokerId;
    if (isDemo !== undefined) query.isDemo = isDemo === 'true';
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [deals, total] = await Promise.all([
      TenancyDeal.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      TenancyDeal.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: deals,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/tenancy/:dealNumber', async (req, res) => {
  try {
    const deal = await TenancyDeal.findOne({ dealNumber: req.params.dealNumber });
    if (!deal) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/tenancy', async (req, res) => {
  try {
    const dealNumber = await TenancyDeal.generateDealNumber();
    const deal = new TenancyDeal({ ...req.body, dealNumber });
    await deal.save();
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/tenancy/:dealNumber/status', async (req, res) => {
  try {
    const { status, notes, actor } = req.body;
    const deal = await TenancyDeal.findOne({ dealNumber: req.params.dealNumber });
    if (!deal) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }
    
    deal.status = status;
    deal.timeline.push({
      stage: status,
      status: 'in_progress',
      timestamp: new Date(),
      actor: actor || 'System',
      notes: notes || `Status updated to ${status}`
    });
    
    await deal.save();
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/sales', async (req, res) => {
  try {
    const { status, dealType, brokerId, isDemo, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (dealType) query.dealType = dealType;
    if (brokerId) query['broker.agentId'] = brokerId;
    if (isDemo !== undefined) query.isDemo = isDemo === 'true';
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [deals, total] = await Promise.all([
      SalesDeal.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      SalesDeal.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: deals,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/sales/:dealNumber', async (req, res) => {
  try {
    const deal = await SalesDeal.findOne({ dealNumber: req.params.dealNumber });
    if (!deal) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/sales', async (req, res) => {
  try {
    const dealType = req.body.dealType || 'secondary';
    const dealNumber = await SalesDeal.generateDealNumber(dealType);
    const deal = new SalesDeal({ ...req.body, dealNumber });
    await deal.save();
    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/sales/:dealNumber/status', async (req, res) => {
  try {
    const { status, notes, actor } = req.body;
    const deal = await SalesDeal.findOne({ dealNumber: req.params.dealNumber });
    if (!deal) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }
    
    deal.status = status;
    deal.timeline.push({
      stage: status,
      status: 'in_progress',
      timestamp: new Date(),
      actor: actor || 'System',
      notes: notes || `Status updated to ${status}`
    });
    
    await deal.save();
    res.json({ success: true, data: deal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/demo', async (req, res) => {
  try {
    const { category, type } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (type) query.type = type;
    
    const demoData = await DemoData.find(query);
    res.json({ success: true, data: demoData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/demo/seed', async (req, res) => {
  try {
    const results = await seedAllDemoData();
    res.json({ success: true, message: 'Demo data seeded successfully', data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const [tenancyStats, salesStats] = await Promise.all([
      TenancyDeal.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$financials.totalContractValue' } } }
      ]),
      SalesDeal.aggregate([
        { $group: { _id: { status: '$status', type: '$dealType' }, count: { $sum: 1 }, totalValue: { $sum: '$financials.totalTransactionValue' } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        tenancy: tenancyStats,
        sales: salesStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
