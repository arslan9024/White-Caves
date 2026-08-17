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
import './PropertyDistributionChart.css';

/**
 * PropertyDistributionChart Component
 * Shows property distribution by status, type, area, and furnishing
 */
function PropertyDistributionChart({ data, loading = false }) {
  if (loading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }

  if (!data) {
    return <div className="chart-error">No data available</div>;
  }

  const COLORS = {
    status: ['#EF4444', '#10b981', '#f59e0b', '#ef4444'],
    type: ['#EF4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'],
    furnishing: ['#EF4444', '#10b981', '#f59e0b'],
    area: ['#EF4444', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']
  };

  const renderCustomLabel = (entry) => {
    const { percent, count } = entry;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="distribution-charts">
      {/* Status Distribution - Pie Chart */}
      {data.byStatus && data.byStatus.length > 0 && (
        <div className="distribution-chart">
          <h3 className="chart-title">Properties by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.byStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {data.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.status[index % COLORS.status.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name === 'count' ? 'Count' : 'Status']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {data.byStatus.map((item, idx) => (
              <div key={idx} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: COLORS.status[idx] }}></span>
                <span>{item.status}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type Distribution - Bar Chart */}
      {data.byType && data.byType.length > 0 && (
        <div className="distribution-chart">
          <h3 className="chart-title">Properties by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="type" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="count" fill="#EF4444" radius={[8, 8, 0, 0]}>
                {data.byType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.type[index % COLORS.type.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {data.byType.map((item, idx) => (
              <div key={idx} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: COLORS.type[idx] }}></span>
                <span>{item.type}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Furnishing Distribution - Pie Chart */}
      {data.byFurnishing && data.byFurnishing.length > 0 && (
        <div className="distribution-chart">
          <h3 className="chart-title">Properties by Furnishing</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.byFurnishing}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="furnishing"
              >
                {data.byFurnishing.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.furnishing[index % COLORS.furnishing.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name === 'count' ? 'Count' : 'Furnishing']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {data.byFurnishing.map((item, idx) => (
              <div key={idx} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: COLORS.furnishing[idx] }}></span>
                <span>{item.furnishing}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Area Distribution - Bar Chart */}
      {data.byArea && data.byArea.length > 0 && (
        <div className="distribution-chart distribution-chart--full-width">
          <h3 className="chart-title">Properties by Area (Top 10)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.byArea.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="area"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="count" fill="#EF4444" radius={[8, 8, 0, 0]}>
                {data.byArea.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.area[index % COLORS.area.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend chart-legend--multi-column">
            {data.byArea.slice(0, 10).map((item, idx) => (
              <div key={idx} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: COLORS.area[idx] }}></span>
                <span>{item.area}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDistributionChart;
