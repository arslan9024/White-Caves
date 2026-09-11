import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import Property from '../models/Property.js';
import Transaction from '../models/Transaction.js';
import logger from '../utils/logger.js';

const isDbConnected = () => mongoose?.connection?.readyState === 1;

/** Safely execute a DB query — logs failures instead of silently swallowing them. */
async function safeQuery<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    logger.error(`[DashboardService] ${label} query failed`, { error: (err as Error).message });
    return fallback;
  }
}

export class DashboardService {
  async getDashboardData() {
    if (!isDbConnected()) {
      return { summary: { totalLeads: 0, activeLeads: 0, totalProperties: 0, totalTransactions: 0, monthlyRevenue: 0 } };
    }

    // 300% Acceleration: All four counts fire concurrently
    const [totalLeads, activeLeads, totalProperties, totalTransactions] = await Promise.all([
      safeQuery('totalLeads', () => Lead.countDocuments(), 0),
      safeQuery('activeLeads', () => Lead.countDocuments({ status: { $in: ['new', 'contacted', 'qualified'] } }), 0),
      safeQuery('totalProperties', () => Property.countDocuments(), 0),
      safeQuery('totalTransactions', () => Transaction.countDocuments(), 0),
    ]);

    // Monthly revenue: sum transactions closed this calendar month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await safeQuery('monthlyRevenue', async () => {
      const result = await Transaction.aggregate([
        { $match: { status: 'completed', closedAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      return result[0]?.total ?? 0;
    }, 0);

    return {
      summary: { totalLeads, activeLeads, totalProperties, totalTransactions, monthlyRevenue },
    };
  }

  async getSummary() {
    return this.getDashboardData();
  }

  async getRecentProperties(limit = 10) {
    if (!isDbConnected()) return { properties: [] };
    const properties = await safeQuery('recentProperties', () => Property.find().sort({ createdAt: -1 }).limit(limit).lean(), []);
    return { properties };
  }

  async getRecentLeads(limit = 5) {
    if (!isDbConnected()) return [];
    return safeQuery('recentLeads', () => Lead.find().sort({ createdAt: -1 }).limit(limit).lean(), []);
  }

  async getPerformanceMetrics() {
    if (!isDbConnected()) return { topAgents: [], conversionRate: 0, averageDealSize: 0 };

    const [conversionData, dealSizeData] = await Promise.all([
      safeQuery('conversionRate', async () => {
        const total = await Lead.countDocuments();
        const converted = await Lead.countDocuments({ status: 'converted' });
        return total > 0 ? Math.round((converted / total) * 1000) / 10 : 0;
      }, 0),
      safeQuery('avgDealSize', async () => {
        const result = await Transaction.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, avg: { $avg: '$amount' } } },
        ]);
        return result[0]?.avg ?? 0;
      }, 0),
    ]);

    return { topAgents: [], conversionRate: conversionData, averageDealSize: Math.round(dealSizeData) };
  }

  async getAgentPerformance(limit = 10) {
    if (!isDbConnected()) return { topAgents: [], performance: {} };

    const topAgents = await safeQuery('agentPerformance', async () => {
      return Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: '$agentId', totalRevenue: { $sum: '$amount' }, dealCount: { $sum: 1 } } },
        { $sort: { totalRevenue: -1 } },
        { $limit: limit },
      ]);
    }, []);

    return { topAgents, performance: {} };
  }

  async getMarketAnalytics() {
    if (!isDbConnected()) return { priceIndex: 0, demandTrend: 'stable', topLocations: [], marketInsights: {} };

    const topLocations = await safeQuery('topLocations', async () => {
      return Property.aggregate([
        { $group: { _id: '$community', avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
    }, []);

    return { priceIndex: 0, demandTrend: 'stable', topLocations, marketInsights: {} };
  }

  async getRecentActivities(limit = 10) {
    if (!isDbConnected()) return [];
    return safeQuery('recentActivities', async () => {
      // Merge latest leads and transactions into a unified activity feed
      const [leads, txns] = await Promise.all([
        Lead.find().sort({ createdAt: -1 }).limit(limit).lean(),
        Transaction.find().sort({ createdAt: -1 }).limit(limit).lean(),
      ]);
      const activities = [
        ...leads.map((l: any) => ({ type: 'lead', id: l._id, title: l.name ?? 'New Lead', date: l.createdAt })),
        ...txns.map((t: any) => ({ type: 'transaction', id: t._id, title: t.reference ?? 'Transaction', date: t.createdAt })),
      ];
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return activities.slice(0, limit);
    }, []);
  }

  async getConversionMetrics() {
    if (!isDbConnected()) return { total: 0, byAgent: {}, bySource: {} };

    const [total, bySource] = await Promise.all([
      safeQuery('convTotal', () => Lead.countDocuments({ status: 'converted' }), 0),
      safeQuery('convBySource', async () => {
        const result = await Lead.aggregate([
          { $match: { status: 'converted' } },
          { $group: { _id: '$source', count: { $sum: 1 } } },
        ]);
        const map: Record<string, number> = {};
        for (const r of result) { map[r._id ?? 'unknown'] = r.count; }
        return map;
      }, {}),
    ]);

    return { total, byAgent: {}, bySource };
  }

  async getRevenueAnalytics() {
    if (!isDbConnected()) return { monthlyRevenue: [], commissionDistribution: {}, topEarners: [] };

    const monthlyRevenue = await safeQuery('monthlyRevenue', async () => {
      return Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$closedAt' } }, total: { $sum: '$amount' } } },
        { $sort: { _id: -1 } },
        { $limit: 12 },
      ]);
    }, []);

    return { monthlyRevenue, commissionDistribution: {}, topEarners: [] };
  }
}

// Support both instantiation (`new DashboardService()`) and direct singleton usage
const defaultInstance = new DashboardService();
for (const prop of Object.getOwnPropertyNames(DashboardService.prototype)) {
  if (prop !== 'constructor') {
    const fn = (defaultInstance as any)[prop];
    if (typeof fn === 'function') {
      (DashboardService as any)[prop] = fn.bind(defaultInstance);
    }
  }
}

export default DashboardService;
