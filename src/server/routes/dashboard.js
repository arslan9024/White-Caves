import express from 'express';
import DashboardService from '../../../server/services/dashboardService.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const dashboardService = new DashboardService();
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.get('/analytics/market', async (req, res) => {
  try {
    const dashboardService = new DashboardService();
    const analytics = await dashboardService.getMarketAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Market analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch market analytics' });
  }
});

router.get('/agents/performance', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const dashboardService = new DashboardService();
    const performance = await dashboardService.getAgentPerformance(limit);
    res.json(performance);
  } catch (error) {
    console.error('Agent performance error:', error);
    res.status(500).json({ error: 'Failed to fetch agent performance' });
  }
});

router.get('/properties/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const dashboardService = new DashboardService();
    const properties = await dashboardService.getRecentProperties(limit);
    res.json(properties);
  } catch (error) {
    console.error('Recent properties error:', error);
    res.status(500).json({ error: 'Failed to fetch recent properties' });
  }
});

export default router;
