// Summary interface
interface DashboardSummary {
  totalProperties: number;
  activeAgents: number;
  monthlyRevenue: number;
  whatsappLeads: number;
  propertiesForSale: number;
  propertiesForRent: number;
  pendingContracts: number;
  closedDeals: number;
}

// Agent performance interface
interface AgentPerformanceData {
  agentId: unknown;
  name: string;
  dealsClosed: number;
  totalValue: number;
  rating: number;
}

// Distribution item interface
interface DistributionItem {
  name: string;
  value: number;
}

// Market analytics interface
interface MarketAnalytics {
  emiratesDistribution: DistributionItem[];
  propertyTypeDistribution: DistributionItem[];
  monthlyPerformance: unknown[];
  priceRangeDistribution: DistributionItem[];
}

// Full dashboard data interface
interface DashboardData {
  summary: DashboardSummary;
  recentProperties: unknown[];
  agentPerformance: AgentPerformanceData[];
  marketAnalytics: MarketAnalytics;
}

// Model interfaces
interface PropertyModel {
  countDocuments(query?: Record<string, unknown>): Promise<number>;
  find(query?: Record<string, unknown>): any;
  aggregate(pipeline: Record<string, unknown>[]): Promise<unknown[]>;
}

interface UserModel {
  countDocuments(query: Record<string, unknown>): Promise<number>;
  find(query: Record<string, unknown>): any;
}

interface ContractModel {
  countDocuments(query: Record<string, unknown>): Promise<number>;
}

interface DashboardServiceModels {
  Property?: PropertyModel;
  User?: UserModel;
  Contract?: ContractModel;
}

// Price range interface
interface PriceRange {
  min: number;
  max: number;
  label: string;
}

class DashboardService {
  private Property: PropertyModel | undefined;
  private User: UserModel | undefined;
  private Contract: ContractModel | undefined;

  constructor(models: DashboardServiceModels = {}) {
    this.Property = models.Property;
    this.User = models.User;
    this.Contract = models.Contract;
  }

  async getSummary(): Promise<DashboardSummary> {
    const summary: DashboardSummary = {
      totalProperties: 0,
      activeAgents: 0,
      monthlyRevenue: 0,
      whatsappLeads: 0,
      propertiesForSale: 0,
      propertiesForRent: 0,
      pendingContracts: 0,
      closedDeals: 0
    };

    try {
      if (this.Property) {
        summary.totalProperties = (await this.Property.countDocuments()) || 0;
        summary.propertiesForSale = (await this.Property.countDocuments({ listingType: 'SALE' })) || 0;
        summary.propertiesForRent = (await this.Property.countDocuments({ listingType: 'RENT' })) || 0;
      }

      if (this.User) {
        summary.activeAgents =
          (await this.User.countDocuments({
            roles: { $in: ['AGENT', 'agent', 'leasing-agent', 'secondary-sales-agent'] },
            status: 'active'
          })) || 0;
      }

      if (this.Contract) {
        summary.pendingContracts =
          (await this.Contract.countDocuments({
            status: { $in: ['draft', 'partially_signed'] }
          })) || 0;
        summary.closedDeals =
          (await this.Contract.countDocuments({ status: 'fully_signed' })) || 0;
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error fetching dashboard summary:', err.message || error);
    }

    return summary;
  }

  async getRecentProperties(limit: number = 10): Promise<unknown[]> {
    try {
      if (!this.Property) return [];

      return await this.Property
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('propertyCode title details.propertyType details.price.amount location status.current')
        .lean();
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error fetching recent properties:', err.message || error);
      return [];
    }
  }

  async getAgentPerformance(limit: number = 10): Promise<AgentPerformanceData[]> {
    try {
      if (!this.User) return [];

      const agents = await this.User
        .find({ roles: { $in: ['AGENT', 'agent', 'leasing-agent', 'secondary-sales-agent'] } })
        .limit(limit)
        .select('name email performance')
        .lean();

      return (agents as any[]).map((agent: any) => ({
        agentId: agent._id,
        name: agent.name || agent.email,
        dealsClosed: agent.performance?.dealsClosed || 0,
        totalValue: agent.performance?.totalValue || 0,
        rating: agent.performance?.rating || 0
      }));
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error fetching agent performance:', err.message || error);
      return [];
    }
  }

  async getMarketAnalytics(): Promise<MarketAnalytics> {
    const analytics: MarketAnalytics = {
      emiratesDistribution: [],
      propertyTypeDistribution: [],
      monthlyPerformance: [],
      priceRangeDistribution: []
    };

    try {
      if (this.Property) {
        const emiratesData = (await this.Property.aggregate([
          { $group: { _id: '$details.emirate', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])) as any[];

        analytics.emiratesDistribution = emiratesData.map((e) => ({
          name: e._id || 'Unknown',
          value: e.count
        }));

        const typeData = (await this.Property.aggregate([
          { $group: { _id: '$details.propertyType', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ])) as any[];

        analytics.propertyTypeDistribution = typeData.map((t) => ({
          name: t._id || 'Unknown',
          value: t.count
        }));

        const priceRanges: PriceRange[] = [
          { min: 0, max: 500000, label: 'Under 500K' },
          { min: 500000, max: 1000000, label: '500K - 1M' },
          { min: 1000000, max: 2000000, label: '1M - 2M' },
          { min: 2000000, max: 5000000, label: '2M - 5M' },
          { min: 5000000, max: Infinity, label: 'Above 5M' }
        ];

        for (const range of priceRanges) {
          const count = await this.Property.countDocuments({
            'details.price.amount': {
              $gte: range.min,
              $lt: range.max === Infinity ? 999999999 : range.max
            }
          });
          analytics.priceRangeDistribution.push({
            name: range.label,
            value: count
          });
        }
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Error fetching market analytics:', err.message || error);
    }

    return analytics;
  }

  async getDashboardData(): Promise<DashboardData> {
    const [summary, recentProperties, agentPerformance, marketAnalytics] = await Promise.all([
      this.getSummary(),
      this.getRecentProperties(),
      this.getAgentPerformance(),
      this.getMarketAnalytics()
    ]);

    return {
      summary,
      recentProperties,
      agentPerformance,
      marketAnalytics
    };
  }
}

export default DashboardService;
