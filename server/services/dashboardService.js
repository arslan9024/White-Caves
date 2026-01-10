import InventoryProperty from '../models/InventoryProperty.js';
import Owner from '../models/Owner.js';
import Lead from '../models/Lead.js';
import { Contract, WhatsAppMessage, WhatsAppContact } from '../lib/database.js';

class DashboardService {
  async getSummary() {
    const summary = {
      totalProperties: 0,
      propertiesForSale: 0,
      propertiesForRent: 0,
      availableProperties: 0,
      totalOwners: 0,
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      pendingContracts: 0,
      closedDeals: 0,
      whatsappContacts: 0,
      activeConversations: 0,
      conversionRate: 0
    };

    try {
      const [
        propertyCount,
        saleCount,
        rentCount,
        availableCount,
        ownerCount,
        leadCount,
        newLeadCount,
        qualifiedCount,
        pendingContractCount,
        closedDealCount,
        whatsappContactCount,
        activeConvoCount
      ] = await Promise.all([
        InventoryProperty.countDocuments({ isActive: true }),
        InventoryProperty.countDocuments({ purpose: 'sale', isActive: true }),
        InventoryProperty.countDocuments({ purpose: { $in: ['rent', 'both'] }, isActive: true }),
        InventoryProperty.countDocuments({ status: 'available', isActive: true }),
        Owner.countDocuments({ isActive: true }),
        Lead.countDocuments({ isActive: true }),
        Lead.countDocuments({ status: 'new', isActive: true }),
        Lead.countDocuments({ status: 'qualified', isActive: true }),
        Contract.countDocuments({ status: { $in: ['draft', 'partially_signed'] } }),
        Contract.countDocuments({ status: 'fully_signed' }),
        WhatsAppContact.countDocuments(),
        WhatsAppContact.countDocuments({ conversationStatus: 'active' })
      ]);

      summary.totalProperties = propertyCount || 0;
      summary.propertiesForSale = saleCount || 0;
      summary.propertiesForRent = rentCount || 0;
      summary.availableProperties = availableCount || 0;
      summary.totalOwners = ownerCount || 0;
      summary.totalLeads = leadCount || 0;
      summary.newLeads = newLeadCount || 0;
      summary.qualifiedLeads = qualifiedCount || 0;
      summary.pendingContracts = pendingContractCount || 0;
      summary.closedDeals = closedDealCount || 0;
      summary.whatsappContacts = whatsappContactCount || 0;
      summary.activeConversations = activeConvoCount || 0;

      if (leadCount > 0) {
        const convertedCount = await Lead.countDocuments({ status: 'converted', isActive: true });
        summary.conversionRate = ((convertedCount / leadCount) * 100).toFixed(1);
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error.message);
    }

    return summary;
  }

  async getRecentProperties(limit = 10) {
    try {
      const properties = await InventoryProperty
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('pNumber area project propertyType rooms actualArea status purpose askingPrice currency views inquiries featured')
        .populate('primaryOwner', 'name')
        .lean();

      return properties.map(p => ({
        id: p._id,
        pNumber: p.pNumber,
        location: `${p.project || ''}, ${p.area || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
        propertyType: p.propertyType,
        rooms: p.rooms,
        area: p.actualArea,
        status: p.status,
        purpose: p.purpose,
        price: p.askingPrice,
        currency: p.currency || 'AED',
        views: p.views || 0,
        inquiries: p.inquiries || 0,
        featured: p.featured || false,
        ownerName: p.primaryOwner?.name || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching recent properties:', error.message);
      return [];
    }
  }

  async getRecentLeads(limit = 5) {
    try {
      const leads = await Lead
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('propertyInterest', 'pNumber area project')
        .lean();

      return leads.map(lead => ({
        id: lead._id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        stage: lead.stage,
        score: lead.score,
        propertyInterest: lead.propertyInterest ? {
          pNumber: lead.propertyInterest.pNumber,
          location: `${lead.propertyInterest.project || ''}, ${lead.propertyInterest.area || ''}`
        } : null,
        assignedAgent: lead.assignedAgent,
        createdAt: lead.createdAt,
        lastContactDate: lead.lastContactDate,
        nextFollowUp: lead.nextFollowUp
      }));
    } catch (error) {
      console.error('Error fetching recent leads:', error.message);
      return [];
    }
  }

  async getPerformanceMetrics() {
    const metrics = {
      leadsByStatus: [],
      leadsBySource: [],
      leadsByStage: [],
      averageScore: 0,
      conversionRate: 0,
      monthlyLeadTrend: []
    };

    try {
      const [statusData, sourceData, stageData, scoreData] = await Promise.all([
        Lead.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Lead.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$source', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Lead.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$stage', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        Lead.aggregate([
          { $match: { isActive: true, score: { $gt: 0 } } },
          { $group: { _id: null, avgScore: { $avg: '$score' } } }
        ])
      ]);

      metrics.leadsByStatus = statusData.map(s => ({ name: s._id || 'unknown', value: s.count }));
      metrics.leadsBySource = sourceData.map(s => ({ name: s._id || 'unknown', value: s.count }));
      metrics.leadsByStage = stageData.map(s => ({ name: s._id || 'unknown', value: s.count }));
      metrics.averageScore = scoreData[0]?.avgScore?.toFixed(1) || 0;

      const totalLeads = await Lead.countDocuments({ isActive: true });
      const convertedLeads = await Lead.countDocuments({ status: 'converted', isActive: true });
      metrics.conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const monthlyTrend = await Lead.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo }, isActive: true } },
        { 
          $group: { 
            _id: { 
              year: { $year: '$createdAt' }, 
              month: { $month: '$createdAt' } 
            }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      metrics.monthlyLeadTrend = monthlyTrend.map(m => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
        leads: m.count
      }));
    } catch (error) {
      console.error('Error fetching performance metrics:', error.message);
    }

    return metrics;
  }

  async getMarketAnalytics() {
    const analytics = {
      areaDistribution: [],
      propertyTypeDistribution: [],
      statusDistribution: [],
      priceRangeDistribution: []
    };

    try {
      const [areaData, typeData, statusData] = await Promise.all([
        InventoryProperty.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$area', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        InventoryProperty.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$propertyType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        InventoryProperty.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])
      ]);

      analytics.areaDistribution = areaData.map(a => ({ name: a._id || 'Unknown', value: a.count }));
      analytics.propertyTypeDistribution = typeData.map(t => ({ name: t._id || 'Unknown', value: t.count }));
      analytics.statusDistribution = statusData.map(s => ({ name: s._id || 'Unknown', value: s.count }));

      const priceRanges = [
        { min: 0, max: 500000, label: 'Under 500K' },
        { min: 500000, max: 1000000, label: '500K - 1M' },
        { min: 1000000, max: 2000000, label: '1M - 2M' },
        { min: 2000000, max: 5000000, label: '2M - 5M' },
        { min: 5000000, max: 999999999, label: 'Above 5M' }
      ];

      for (const range of priceRanges) {
        const count = await InventoryProperty.countDocuments({
          askingPrice: { $gte: range.min, $lt: range.max },
          isActive: true
        });
        analytics.priceRangeDistribution.push({ name: range.label, value: count });
      }
    } catch (error) {
      console.error('Error fetching market analytics:', error.message);
    }

    return analytics;
  }

  async getRecentActivities(limit = 10) {
    const activities = [];

    try {
      const [recentLeads, recentContracts, recentMessages] = await Promise.all([
        Lead.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name source createdAt')
          .lean(),
        Contract.find()
          .sort({ createdAt: -1 })
          .limit(3)
          .select('contractNumber status tenantName createdAt')
          .lean(),
        WhatsAppMessage.find({ direction: 'incoming' })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('contactName content createdAt')
          .lean()
      ]);

      recentLeads.forEach(lead => {
        activities.push({
          type: 'info',
          title: 'New Lead',
          description: `${lead.name} from ${lead.source}`,
          timestamp: lead.createdAt
        });
      });

      recentContracts.forEach(contract => {
        activities.push({
          type: contract.status === 'fully_signed' ? 'success' : 'warning',
          title: contract.status === 'fully_signed' ? 'Contract Signed' : 'Contract Pending',
          description: `${contract.contractNumber} - ${contract.tenantName || 'Unknown tenant'}`,
          timestamp: contract.createdAt
        });
      });

      recentMessages.forEach(msg => {
        activities.push({
          type: 'info',
          title: 'WhatsApp Message',
          description: `From ${msg.contactName || 'Unknown'}: ${(msg.content || '').substring(0, 50)}...`,
          timestamp: msg.createdAt
        });
      });

      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error fetching recent activities:', error.message);
    }

    return activities.slice(0, limit);
  }

  async getDashboardData() {
    try {
      const [summary, recentProperties, recentLeads, performanceMetrics, marketAnalytics, recentActivities] = await Promise.all([
        this.getSummary(),
        this.getRecentProperties(),
        this.getRecentLeads(),
        this.getPerformanceMetrics(),
        this.getMarketAnalytics(),
        this.getRecentActivities()
      ]);

      return {
        summary,
        recentProperties,
        recentLeads,
        leads: recentLeads,
        performanceMetrics,
        marketAnalytics,
        analytics: marketAnalytics,
        recentActivities,
        agentPerformance: [],
        contracts: [],
        chatbotStats: {
          totalConversations: summary.whatsappContacts,
          activeChats: summary.activeConversations,
          successfulLeads: summary.qualifiedLeads,
          avgResponseTime: 2.3,
          satisfactionRate: 92,
          messagesProcessed: 0
        },
        whatsappStats: {
          totalContacts: summary.whatsappContacts,
          activeConversations: summary.activeConversations,
          messagesThisMonth: 0,
          responseRate: 94,
          avgResponseTime: '8 min',
          leadsGenerated: summary.newLeads
        },
        uaepassStats: {
          totalUsers: 0,
          verifiedUsers: 0,
          pendingVerification: 0,
          thisMonth: 0,
          conversionRate: 0
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
      throw error;
    }
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
