import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import './OccupancyChart.css';

/**
 * OccupancyChart Component
 * Shows occupancy metrics with pie charts and progress indicators
 */
function OccupancyChart({ data, loading = false }) {
  if (loading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }

  if (!data) {
    return <div className="chart-error">No data available</div>;
  }

  const COLORS = ['#10b981', '#EF4444', '#f59e0b', '#ef4444'];

  const renderCustomLabel = (entry) => {
    return `${(entry.percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="occupancy-charts">
      {/* Occupancy Progress Bar */}
      <div className="occupancy-progress">
        <div className="progress-header">
          <h3 className="progress-title">Occupancy Rate</h3>
          <span className="progress-percentage">{data.occupancyRate}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${data.occupancyRate}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>Occupied: {data.occupiedCount}</span>
          <span>Vacant: {data.vacantCount}</span>
        </div>
      </div>

      {/* Status Breakdown - Donut Chart */}
      {data.statusBreakdown && data.statusBreakdown.length > 0 && (
        <div className="occupancy-chart">
          <h3 className="chart-title">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.statusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {data.statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name === 'count' ? 'Count' : 'Status']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {data.statusBreakdown.map((item, idx) => (
              <div key={idx} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: COLORS[idx] }}></span>
                <div>
                  <div className="legend-label">{item.status}</div>
                  <div className="legend-value">{item.count} units ({item.percentage}%)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Occupancy Summary Cards */}
      <div className="occupancy-summary">
        <div className="summary-card summary-card--occupied">
          <div className="card-icon">🏠</div>
          <div className="card-content">
            <div className="card-label">Occupied</div>
            <div className="card-value">{data.occupiedCount}</div>
            <div className="card-percentage">
              {Math.round((data.occupiedCount / (data.occupiedCount + data.vacantCount)) * 100 * 10) / 10}%
            </div>
          </div>
        </div>

        <div className="summary-card summary-card--vacant">
          <div className="card-icon">🔑</div>
          <div className="card-content">
            <div className="card-label">Vacant</div>
            <div className="card-value">{data.vacantCount}</div>
            <div className="card-percentage">
              {Math.round((data.vacantCount / (data.occupiedCount + data.vacantCount)) * 100 * 10) / 10}%
            </div>
          </div>
        </div>

        {data.maintenanceCount > 0 && (
          <div className="summary-card summary-card--maintenance">
            <div className="card-icon">🔧</div>
            <div className="card-content">
              <div className="card-label">Maintenance</div>
              <div className="card-value">{data.maintenanceCount}</div>
            </div>
          </div>
        )}

        {data.availableForLeaseCount > 0 && (
          <div className="summary-card summary-card--available">
            <div className="card-icon">📋</div>
            <div className="card-content">
              <div className="card-label">Available for Lease</div>
              <div className="card-value">{data.availableForLeaseCount}</div>
            </div>
          </div>
        )}
      </div>

      {/* Occupancy Insights */}
      <div className="occupancy-insights">
        <div className="insight-card">
          <div className="insight-icon">📊</div>
          <div className="insight-content">
            <h4>Quick Stats</h4>
            <ul>
              <li><strong>Total Units:</strong> {data.occupiedCount + data.vacantCount + data.maintenanceCount + data.availableForLeaseCount}</li>
              <li><strong>Occupied Units:</strong> {data.occupiedCount}</li>
              <li><strong>Vacant Units:</strong> {data.vacantCount}</li>
              <li><strong>Occupancy Rate:</strong> {data.occupancyRate}%</li>
            </ul>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">💡</div>
          <div className="insight-content">
            <h4>Insights</h4>
            <ul>
              {data.occupancyRate >= 80 && (
                <li>✅ Strong occupancy rate indicates healthy portfolio</li>
              )}
              {data.occupancyRate < 80 && data.occupancyRate >= 60 && (
                <li>⚠️ Moderate occupancy - consider marketing vacant units</li>
              )}
              {data.occupancyRate < 60 && (
                <li>❌ Low occupancy - urgent action recommended</li>
              )}
              {data.vacantCount > 0 && (
                <li>📢 {data.vacantCount} vacant units available for lease</li>
              )}
              {data.maintenanceCount > 0 && (
                <li>🔧 {data.maintenanceCount} units under maintenance</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OccupancyChart;
