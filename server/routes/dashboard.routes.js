import express from 'express';
import dashboardService from '../services/dashboardService.js';

const router = express.Router();

router.get('/owner/summary', async (req, res) => {
  try {
    const dashboardData = await dashboardService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching owner dashboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      message: error.message 
    });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const summary = await dashboardService.getSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

router.get('/properties/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const properties = await dashboardService.getRecentProperties(limit);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching recent properties:', error);
    res.status(500).json({ error: 'Failed to fetch recent properties' });
  }
});

router.get('/leads/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const leads = await dashboardService.getRecentLeads(limit);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching recent leads:', error);
    res.status(500).json({ error: 'Failed to fetch recent leads' });
  }
});

router.get('/metrics', async (req, res) => {
  try {
    const metrics = await dashboardService.getPerformanceMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const analytics = await dashboardService.getMarketAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching market analytics:', error);
    res.status(500).json({ error: 'Failed to fetch market analytics' });
  }
});

router.get('/activities', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const activities = await dashboardService.getRecentActivities(limit);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.get('/report/download', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=whitecaves-report-${new Date().toISOString().split('T')[0]}.pdf`);
    res.send(Buffer.from('PDF Report Placeholder'));
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
