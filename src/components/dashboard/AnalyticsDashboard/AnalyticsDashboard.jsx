import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { authFetch } from '../../../utils/authFetch';
import MetricCard from './MetricCard';
import PropertyDistributionChart from './PropertyDistributionChart';
import PricingAnalyticsChart from './PricingAnalyticsChart';
import OccupancyChart from './OccupancyChart';
import './AnalyticsDashboard.css';

/**
 * AnalyticsDashboard Component
 * Comprehensive analytics and reporting dashboard
 */
function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await authFetch('/api/property-inventory/analytics/dashboard');

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard statistics (${response.status})`);
      }

      const payload = await response.json();

      if (payload.success) {
        setStats(payload.data);
        setLastUpdated(new Date());
      } else {
        throw new Error('Failed to fetch dashboard statistics');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchDashboardStats();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(
      () => {
        fetchDashboardStats();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(refreshInterval);
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardStats();
  };

  // Handle export
  const handleExport = async () => {
    try {
      const response = await authFetch('/api/property-inventory/analytics/export');

      if (!response.ok) {
        throw new Error(`Failed to export analytics data (${response.status})`);
      }

      const payload = await response.json();

      // Convert to JSON and download
      const dataStr = JSON.stringify(payload.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export analytics data');
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard analytics-dashboard--loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="analytics-dashboard analytics-dashboard--error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Failed to Load Dashboard</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn btn--primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    keyMetrics = {},
    distribution = {},
    pricing = {},
    occupancy = {},
    areaAnalytics = [],
  } = stats || {};

  return (
    <div className="analytics-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Analytics & Reports</h1>
          <p className="dashboard-subtitle">Comprehensive property portfolio insights</p>
        </div>

        <div className="header-actions">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn--secondary"
            title="Refresh dashboard"
          >
            {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>
          <button
            onClick={handleExport}
            className="btn btn--secondary"
            title="Export analytics data"
          >
            ⬇ Export
          </button>
        </div>
      </div>

      {/* Last Updated Info */}
      {lastUpdated && (
        <div className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      )}

      {/* Key Metrics Section */}
      {keyMetrics && (
        <section className="analytics-section">
          <h2 className="section-title">Key Metrics</h2>
          <div className="metrics-grid">
            <MetricCard
              title="Total Properties"
              value={keyMetrics.totalProperties || 0}
              unit="units"
              icon={<Home size={24} />}
              color="blue"
            />
            <MetricCard
              title="Occupied Properties"
              value={keyMetrics.occupiedProperties || 0}
              unit="units"
              icon={<Users size={24} />}
              color="green"
              trend="up"
              trendPercent={12}
            />
            <MetricCard
              title="Vacant Properties"
              value={keyMetrics.vacantProperties || 0}
              unit="units"
              icon={<DollarSign size={24} />}
              color="amber"
            />
            <MetricCard
              title="Average Price"
              value={
                keyMetrics.averagePrice
                  ? `AED ${(keyMetrics.averagePrice / 1000).toFixed(0)}K`
                  : 'N/A'
              }
              unit=""
              icon={<TrendingUp size={24} />}
              color="purple"
            />
            <MetricCard
              title="Portfolio Value"
              value={
                keyMetrics.totalPortfolioValue
                  ? `AED ${(keyMetrics.totalPortfolioValue / 1000000).toFixed(1)}M`
                  : 'N/A'
              }
              unit=""
              icon={<BarChart3 size={24} />}
              color="red"
            />
            <MetricCard
              title="Occupancy Rate"
              value={`${keyMetrics.occupancyRate || 0}%`}
              unit="occupied"
              icon={<TrendingUp size={24} />}
              color="green"
              trend={
                keyMetrics.occupancyRate >= 75
                  ? 'up'
                  : keyMetrics.occupancyRate >= 50
                    ? 'neutral'
                    : 'down'
              }
            />
          </div>
        </section>
      )}

      {/* Distribution Charts Section */}
      {distribution && Object.keys(distribution).length > 0 && (
        <section className="analytics-section">
          <h2 className="section-title">Property Distribution</h2>
          <PropertyDistributionChart data={distribution} loading={false} />
        </section>
      )}

      {/* Pricing Analytics Section */}
      {pricing && Object.keys(pricing).length > 0 && (
        <section className="analytics-section">
          <h2 className="section-title">Pricing Analytics</h2>
          <PricingAnalyticsChart data={pricing} loading={false} />
        </section>
      )}

      {/* Occupancy Metrics Section */}
      {occupancy && Object.keys(occupancy).length > 0 && (
        <section className="analytics-section">
          <h2 className="section-title">Occupancy Metrics</h2>
          <OccupancyChart data={occupancy} loading={false} />
        </section>
      )}

      {/* Area Analytics Section */}
      {areaAnalytics && areaAnalytics.length > 0 && (
        <section className="analytics-section">
          <h2 className="section-title">Area-Wise Analytics</h2>
          <div className="area-analytics-grid">
            {areaAnalytics.slice(0, 6).map((area, index) => (
              <div key={index} className="area-card">
                <div className="area-header">
                  <h3 className="area-name">{area.area}</h3>
                  <span className="area-badge">{area.propertyCount}</span>
                </div>
                <div className="area-stats">
                  <div className="stat">
                    <span className="stat-label">Avg Price</span>
                    <span className="stat-value">
                      AED {area.averagePrice ? (area.averagePrice / 1000).toFixed(0) : 0}K
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Occupancy</span>
                    <span className="stat-value">{area.occupancyRate || 0}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Value</span>
                    <span className="stat-value">
                      AED {area.totalValue ? (area.totalValue / 1000000).toFixed(1) : 0}M
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="dashboard-footer">
        <p>This dashboard updates automatically every 5 minutes</p>
        <p className="footer-secondary">For detailed reports, contact your administrator</p>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
