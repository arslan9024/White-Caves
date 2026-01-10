import express from 'express';
import ZoeAIService from '../services/zoeAIService.js';
import ZoeConversation from '../models/ZoeConversation.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/query', async (req, res) => {
  try {
    const { query, sessionId } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const userId = req.headers['x-user-id'] || 'anonymous';
    const session = sessionId || crypto.randomUUID();

    const result = await ZoeAIService.processQuery(query.trim(), userId, session);

    res.json({
      success: true,
      sessionId: session,
      ...result
    });

  } catch (error) {
    console.error('Error processing Zoe query:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to process your query at this time',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/briefing', async (req, res) => {
  try {
    const result = await ZoeAIService.generateDailyBriefing();

    res.json({
      success: true,
      type: 'daily_briefing',
      timestamp: new Date().toISOString(),
      ...result
    });

  } catch (error) {
    console.error('Error generating briefing:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to generate briefing'
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { sessionId, limit = 20 } = req.query;
    const userId = req.headers['x-user-id'];

    let history;
    if (sessionId) {
      history = await ZoeConversation.getSessionHistory(sessionId, parseInt(limit));
    } else if (userId) {
      history = await ZoeConversation.getUserHistory(userId, parseInt(limit));
    } else {
      history = await ZoeConversation.find({})
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
    }

    res.json({
      success: true,
      history: history.map(h => ({
        id: h._id,
        query: h.query,
        response: h.response,
        intent: h.intent,
        confidence: h.metadata?.confidence,
        timestamp: h.createdAt
      }))
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch conversation history'
    });
  }
});

router.get('/departments', async (req, res) => {
  const departments = [
    { id: 'EXEC', name: 'Executive Office', head: 'Arslan Malik', email: 'executive@whitecaves.ae', phone: 'Ext. 100' },
    { id: 'SALES', name: 'Sales & Leasing Division', head: 'Tariq Al-Farsi', email: 'sales@whitecaves.ae', phone: 'Ext. 201' },
    { id: 'PROPMGMT', name: 'Property Management Division', head: 'Layla Hassan', email: 'management@whitecaves.ae', phone: 'Ext. 301' },
    { id: 'MARKETING', name: 'Marketing & Business Development', head: 'Omar Khalid', email: 'marketing@whitecaves.ae', phone: 'Ext. 401' },
    { id: 'OPERATIONS', name: 'Operations & Finance', head: 'Fatima Al-Zahra', email: 'operations@whitecaves.ae', phone: 'Ext. 501' }
  ];

  res.json({
    success: true,
    departments
  });
});

router.get('/services', async (req, res) => {
  const { category, department } = req.query;

  let services = [
    { id: 'RES-SALE-001', name: 'Primary Market Sales (Off-Plan)', category: 'Residential', department: 'SALES' },
    { id: 'RES-SALE-002', name: 'Secondary Market Sales', category: 'Residential', department: 'SALES' },
    { id: 'RES-SALE-003', name: 'Luxury Villa & Penthouse Sales', category: 'Residential', department: 'SALES' },
    { id: 'COMM-LEASE-001', name: 'Office Space Leasing', category: 'Commercial', department: 'SALES' },
    { id: 'COMM-LEASE-002', name: 'Retail Unit Acquisition', category: 'Commercial', department: 'SALES' },
    { id: 'PM-001', name: 'Full-Service Property Management', category: 'Property Management', department: 'PROPMGMT' },
    { id: 'PM-002', name: 'Tenant Screening & Placement', category: 'Property Management', department: 'PROPMGMT' },
    { id: 'PREMIUM-001', name: 'Real Estate Investment Consultation', category: 'Premium', department: 'EXEC' },
    { id: 'PREMIUM-004', name: 'DLD/RERA Transaction Facilitation', category: 'Premium', department: 'OPERATIONS' }
  ];

  if (category) {
    services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  if (department) {
    services = services.filter(s => s.department === department.toUpperCase());
  }

  res.json({
    success: true,
    services
  });
});

router.get('/quick-actions', async (req, res) => {
  res.json({
    success: true,
    actions: [
      { id: 'briefing', label: 'Daily Briefing', icon: 'calendar', query: 'Give me today\'s briefing' },
      { id: 'metrics', label: 'View Metrics', icon: 'chart', query: 'Show me current statistics' },
      { id: 'leads', label: 'Lead Status', icon: 'users', query: 'How many leads do we have?' },
      { id: 'contacts', label: 'Find Contact', icon: 'phone', query: 'Who should I contact about commercial leasing?' },
      { id: 'services', label: 'Our Services', icon: 'list', query: 'List all services we offer' },
      { id: 'process', label: 'Sales Process', icon: 'workflow', query: 'Walk me through the sales journey' }
    ]
  });
});

export default router;
