import DashboardService from '../../../server/services/dashboardService.js';

export const getSummary = async (req, res) => {
  try {
    const dashboardService = new DashboardService();
    const data = await dashboardService.getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const getMarketAnalytics = async (req, res) => {
  try {
    const dashboardService = new DashboardService();
    const analytics = await dashboardService.getMarketAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market analytics' });
  }
};

export const getAgentPerformance = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const dashboardService = new DashboardService();
    const performance = await dashboardService.getAgentPerformance(limit);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch agent performance' });
  }
};

export const getRecentProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const dashboardService = new DashboardService();
    const properties = await dashboardService.getRecentProperties(limit);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent properties' });
  }
};
