import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';
import './PricingAnalyticsChart.css';

/**
 * PricingAnalyticsChart Component
 * Shows pricing analytics: average price by area and price distribution
 */
function PricingAnalyticsChart({ data, loading = false }) {
  if (loading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }

  if (!data) {
    return <div className="chart-error">No data available</div>;
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#14b8a6', '#f97316'];

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `AED ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `AED ${(value / 1000).toFixed(0)}K`;
    }
    return `AED ${value}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatPrice(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pricing-charts">
      {/* Average Price by Area - Bar Chart */}
      {data.avgPriceByArea && data.avgPriceByArea.length > 0 && (
        <div className="pricing-chart pricing-chart--full-width">
          <div className="chart-header">
            <h3 className="chart-title">Average Price by Area (Top 10)</h3>
            <div className="chart-stat">
              <span className="stat-label">Highest:</span>
              <span className="stat-value">{formatPrice(data.avgPriceByArea[0]?.avgPrice || 0)}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.avgPriceByArea.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="area"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis 
                tickFormatter={formatPrice}
              />
              <Tooltip 
                content={<CustomTooltip />}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="avgPrice" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {data.avgPriceByArea.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-info">
            <p>Average prices across the top 10 areas by count</p>
          </div>
        </div>
      )}

      {/* Price Distribution - Histogram */}
      {data.priceDistribution && data.priceDistribution.ranges && (
        <div className="pricing-chart pricing-chart--full-width">
          <div className="chart-header">
            <h3 className="chart-title">Price Distribution</h3>
            <div className="chart-stats">
              <div className="chart-stat">
                <span className="stat-label">Min:</span>
                <span className="stat-value">{formatPrice(data.minPrice)}</span>
              </div>
              <div className="chart-stat">
                <span className="stat-label">Max:</span>
                <span className="stat-value">{formatPrice(data.maxPrice)}</span>
              </div>
              <div className="chart-stat">
                <span className="stat-label">Median:</span>
                <span className="stat-value">{formatPrice(data.medianPrice)}</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.priceDistribution.ranges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {data.priceDistribution.ranges.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-info">
            <p>Number of properties in each price range</p>
          </div>
        </div>
      )}

      {/* Portfolio Value Summary */}
      <div className="pricing-summary">
        <div className="summary-card">
          <div className="summary-label">Total Portfolio Value</div>
          <div className="summary-value">
            {formatPrice(data.totalPortfolioValue)}
          </div>
          <div className="summary-unit">Monthly Value</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-label">Average Property Price</div>
          <div className="summary-value">
            {data.avgPriceByArea && data.avgPriceByArea.length > 0
              ? formatPrice(
                  Math.round(
                    data.avgPriceByArea.reduce((sum, a) => sum + a.avgPrice, 0) /
                    data.avgPriceByArea.length
                  )
                )
              : 'N/A'
            }
          </div>
          <div className="summary-unit">Across All Areas</div>
        </div>

        <div className="summary-card">
          <div className="summary-label">Price Range</div>
          <div className="summary-value">
            {formatPrice(data.minPrice)} - {formatPrice(data.maxPrice)}
          </div>
          <div className="summary-unit">Min - Max</div>
        </div>
      </div>
    </div>
  );
}

export default PricingAnalyticsChart;
