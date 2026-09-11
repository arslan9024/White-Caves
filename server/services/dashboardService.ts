import Lead from '../models/Lead.js';
import Property from '../models/Property.js';
import Transaction from '../models/Transaction.js';

class DashboardService {
  async getDashboardData() {
    const totalLeads = await Lead.countDocuments().catch(() => 0);
    const activeLeads = await Lead.countDocuments({ status: { $in: ['new', 'contacted', 'qualified'] } }).catch(() => 0);
    const totalProperties = await Property.countDocuments().catch(() => 0);
    const totalTransactions = await Transaction.countDocuments().catch(() => 0);
    
    return {
      summary: {
        totalLeads,
        activeLeads,
        totalProperties,
        totalTransactions,
        monthlyRevenue: 0
      }
    };
  }

  async getSummary() {
    return this.getDashboardData();
  }

  async getRecentProperties(limit = 10) {
    const properties = await Property.find().sort({ createdAt: -1 }).limit(limit).catch(() => []);
    return { properties };
  }

  async getRecentLeads(limit = 5) {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(limit).catch(() => []);
    return leads;
  }

  async getPerformanceMetrics() {
    return {
      topAgents: [],
      performance: {}
    };
  }

  async getMarketAnalytics() {
    return {
      priceIndex: 0,
      demandTrend: 'stable',
      topLocations: [],
      marketInsights: {}
    };
  }

  async getRecentActivities(limit = 10) {
    return [];
  }
}

export default new DashboardService();
