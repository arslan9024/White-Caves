/**
 * AnalyticsService.js
 * Service for generating comprehensive analytics and statistics
 * for the inventory dashboard
 */

import PropertyInventory from '../models/PropertyInventory.js';
import InventoryProperty from '../models/InventoryProperty.js';

class AnalyticsService {
  /**
   * Get all dashboard statistics at once
   */
  async getOverallStats() {
    try {
      const [
        keyMetrics,
        distribution,
        pricing,
        occupancy,
        areaAnalytics
      ] = await Promise.all([
        this.getKeyMetrics(),
        this.getPropertyDistribution(),
        this.getPricingAnalytics(),
        this.getOccupancyMetrics(),
        this.getAreaAnalytics()
      ]);

      return {
        keyMetrics,
        distribution,
        pricing,
        occupancy,
        areaAnalytics,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting overall stats:', error);
      throw new Error(`Failed to get overall stats: ${error.message}`);
    }
  }

  /**
   * Get key metrics (summary numbers)
   */
  async getKeyMetrics() {
    try {
      const properties = await InventoryProperty.find().lean();

      if (!properties.length) {
        return {
          totalProperties: 0,
          vacantProperties: 0,
          occupiedProperties: 0,
          maintenanceProperties: 0,
          availableForLeaseProperties: 0,
          averagePrice: 0,
          totalPortfolioValue: 0,
          occupancyRate: 0
        };
      }

      // Calculate stats
      const vacantCount = properties.filter(p => p.status === 'Vacant').length;
      const occupiedCount = properties.filter(p => p.status === 'Occupied').length;
      const maintenanceCount = properties.filter(p => p.status === 'Maintenance').length;
      const availableForLeaseCount = properties.filter(p => p.status === 'Available for Lease').length;

      const totalPrice = properties.reduce((sum, p) => sum + (p.pricePerMonth || 0), 0);
      const averagePrice = properties.length > 0 ? Math.round(totalPrice / properties.length) : 0;
      const totalPortfolioValue = totalPrice;
      const occupancyRate = properties.length > 0 
        ? Math.round((occupiedCount / properties.length) * 100 * 10) / 10 
        : 0;

      return {
        totalProperties: properties.length,
        vacantProperties: vacantCount,
        occupiedProperties: occupiedCount,
        maintenanceProperties: maintenanceCount,
        availableForLeaseProperties: availableForLeaseCount,
        averagePrice,
        totalPortfolioValue,
        occupancyRate
      };
    } catch (error) {
      console.error('Error getting key metrics:', error);
      throw new Error(`Failed to get key metrics: ${error.message}`);
    }
  }

  /**
   * Get property distribution by various criteria
   */
  async getPropertyDistribution() {
    try {
      const properties = await InventoryProperty.find().lean();

      if (!properties.length) {
        return {
          byStatus: [],
          byType: [],
          byArea: [],
          byFurnishing: []
        };
      }

      const distribution = {
        byStatus: this.aggregateByField(properties, 'status'),
        byType: this.aggregateByField(properties, 'propertyType'),
        byArea: this.aggregateByField(properties, 'area'),
        byFurnishing: this.aggregateByField(properties, 'furnishingStatus')
      };

      return distribution;
    } catch (error) {
      console.error('Error getting property distribution:', error);
      throw new Error(`Failed to get property distribution: ${error.message}`);
    }
  }

  /**
   * Get pricing analytics
   */
  async getPricingAnalytics() {
    try {
      const properties = await InventoryProperty.find().lean();

      if (!properties.length) {
        return {
          avgPriceByArea: [],
          priceDistribution: { ranges: [] },
          totalPortfolioValue: 0,
          minPrice: 0,
          maxPrice: 0,
          medianPrice: 0
        };
      }

      // Average price by area
      const areaGroups = {};
      properties.forEach(p => {
        if (!areaGroups[p.area]) {
          areaGroups[p.area] = { total: 0, count: 0 };
        }
        areaGroups[p.area].total += p.pricePerMonth || 0;
        areaGroups[p.area].count += 1;
      });

      const avgPriceByArea = Object.entries(areaGroups)
        .map(([area, data]) => ({
          area,
          avgPrice: Math.round(data.total / data.count),
          count: data.count
        }))
        .sort((a, b) => b.avgPrice - a.avgPrice);

      // Price distribution ranges
      const prices = properties.map(p => p.pricePerMonth || 0).sort((a, b) => a - b);
      const minPrice = prices[0];
      const maxPrice = prices[prices.length - 1];
      const medianPrice = prices[Math.floor(prices.length / 2)];

      const priceRanges = [
        { min: 0, max: 200000, label: '0-200K' },
        { min: 200000, max: 400000, label: '200K-400K' },
        { min: 400000, max: 600000, label: '400K-600K' },
        { min: 600000, max: 1000000, label: '600K-1M' },
        { min: 1000000, max: Infinity, label: '1M+' }
      ];

      const priceDistribution = {
        ranges: priceRanges.map(range => ({
          range: range.label,
          count: properties.filter(p => {
            const price = p.pricePerMonth || 0;
            return price >= range.min && price < range.max;
          }).length
        }))
      };

      const totalPortfolioValue = properties.reduce((sum, p) => sum + (p.pricePerMonth || 0), 0);

      return {
        avgPriceByArea,
        priceDistribution,
        totalPortfolioValue,
        minPrice,
        maxPrice,
        medianPrice
      };
    } catch (error) {
      console.error('Error getting pricing analytics:', error);
      throw new Error(`Failed to get pricing analytics: ${error.message}`);
    }
  }

  /**
   * Get occupancy metrics
   */
  async getOccupancyMetrics() {
    try {
      const properties = await InventoryProperty.find().lean();

      if (!properties.length) {
        return {
          occupancyRate: 0,
          vacantCount: 0,
          occupiedCount: 0,
          maintenanceCount: 0,
          availableForLeaseCount: 0,
          statusBreakdown: []
        };
      }

      const vacantCount = properties.filter(p => p.status === 'Vacant').length;
      const occupiedCount = properties.filter(p => p.status === 'Occupied').length;
      const maintenanceCount = properties.filter(p => p.status === 'Maintenance').length;
      const availableForLeaseCount = properties.filter(p => p.status === 'Available for Lease').length;

      const occupancyRate = properties.length > 0
        ? Math.round((occupiedCount / properties.length) * 100 * 10) / 10
        : 0;

      const statusBreakdown = [
        { status: 'Occupied', count: occupiedCount, percentage: Math.round((occupiedCount / properties.length) * 100 * 10) / 10 },
        { status: 'Vacant', count: vacantCount, percentage: Math.round((vacantCount / properties.length) * 100 * 10) / 10 },
        { status: 'Maintenance', count: maintenanceCount, percentage: Math.round((maintenanceCount / properties.length) * 100 * 10) / 10 },
        { status: 'Available for Lease', count: availableForLeaseCount, percentage: Math.round((availableForLeaseCount / properties.length) * 100 * 10) / 10 }
      ].filter(item => item.count > 0);

      return {
        occupancyRate,
        vacantCount,
        occupiedCount,
        maintenanceCount,
        availableForLeaseCount,
        statusBreakdown
      };
    } catch (error) {
      console.error('Error getting occupancy metrics:', error);
      throw new Error(`Failed to get occupancy metrics: ${error.message}`);
    }
  }

  /**
   * Get analytics for a specific area
   */
  async getAreaAnalytics(area = null) {
    try {
      let query = {};
      if (area) {
        query.area = area;
      }

      const properties = await InventoryProperty.find(query).lean();

      if (!properties.length) {
        return {
          area: area || 'All Areas',
          propertyCount: 0,
          averagePrice: 0,
          distribution: [],
          occupancyRate: 0
        };
      }

      const totalPrice = properties.reduce((sum, p) => sum + (p.pricePerMonth || 0), 0);
      const averagePrice = Math.round(totalPrice / properties.length);

      const vacantCount = properties.filter(p => p.status === 'Vacant').length;
      const occupiedCount = properties.filter(p => p.status === 'Occupied').length;
      const occupancyRate = properties.length > 0
        ? Math.round((occupiedCount / properties.length) * 100 * 10) / 10
        : 0;

      const distribution = this.aggregateByField(properties, 'propertyType');

      return {
        area: area || 'All Areas',
        propertyCount: properties.length,
        averagePrice,
        totalValue: totalPrice,
        distribution,
        occupancyRate,
        vacantCount,
        occupiedCount
      };
    } catch (error) {
      console.error('Error getting area analytics:', error);
      throw new Error(`Failed to get area analytics: ${error.message}`);
    }
  }

  /**
   * Get all areas with analytics
   */
  async getAllAreaAnalytics() {
    try {
      const properties = await InventoryProperty.find().lean();

      if (!properties.length) {
        return [];
      }

      const areas = [...new Set(properties.map(p => p.area))];

      const areaAnalytics = await Promise.all(
        areas.map(area => this.getAreaAnalytics(area))
      );

      return areaAnalytics.sort((a, b) => b.propertyCount - a.propertyCount);
    } catch (error) {
      console.error('Error getting all area analytics:', error);
      throw new Error(`Failed to get all area analytics: ${error.message}`);
    }
  }

  /**
   * Get trend data over time (simplified - uses current data)
   * Can be enhanced with historical data if timestamps are added
   */
  async getTrendData(startDate = null, endDate = null) {
    try {
      const properties = await InventoryProperty.find().lean();

      if (!properties.length) {
        return {
          dates: [],
          propertyCount: [],
          occupancyRate: [],
          averagePrice: []
        };
      }

      // Simplified: return current snapshot
      // In a real implementation, this would query historical data
      const stats = await this.getKeyMetrics();

      return {
        summary: {
          totalProperties: stats.totalProperties,
          occupancyRate: stats.occupancyRate,
          averagePrice: stats.averagePrice,
          period: 'current'
        }
      };
    } catch (error) {
      console.error('Error getting trend data:', error);
      throw new Error(`Failed to get trend data: ${error.message}`);
    }
  }

  /**
   * Helper: Aggregate properties by a field
   */
  aggregateByField(properties, field) {
    const groups = {};

    properties.forEach(property => {
      const value = property[field] || 'Unknown';
      if (!groups[value]) {
        groups[value] = 0;
      }
      groups[value] += 1;
    });

    const total = properties.length;

    return Object.entries(groups)
      .map(([key, count]) => ({
        [field === 'propertyType' ? 'type' : 
          field === 'furnishingStatus' ? 'furnishing' : 
          field === 'status' ? 'status' : 'area']: key,
        count,
        percentage: Math.round((count / total) * 100 * 10) / 10
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get comparison between two periods (simplified)
   */
  async getComparison(period = 'month') {
    try {
      const current = await this.getKeyMetrics();

      // Simplified: return comparison structure
      // In real implementation, would compare with previous period data
      return {
        current,
        previous: null,
        comparison: {
          totalPropertiesChange: 0,
          occupancyRateChange: 0,
          priceChange: 0
        },
        period
      };
    } catch (error) {
      console.error('Error getting comparison:', error);
      throw new Error(`Failed to get comparison: ${error.message}`);
    }
  }

  /**
   * Export statistics as formatted object
   */
  async exportDashboardData() {
    try {
      const stats = await this.getOverallStats();

      return {
        exportedAt: new Date().toISOString(),
        data: stats,
        format: 'json'
      };
    } catch (error) {
      console.error('Error exporting dashboard data:', error);
      throw new Error(`Failed to export dashboard data: ${error.message}`);
    }
  }
}

export default new AnalyticsService();
