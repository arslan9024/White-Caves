import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import './charts.css';

interface MetricItem {
  label: string;
  value: string;
  unit?: string;
}

interface MetricsChartProps {
  data?: MetricItem[];
  title?: string;
  color?: string;
  height?: number;
  dataKeys?: string[];
}

// Tooltip component — defined outside to avoid re-creation on every render
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; unit?: string } }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, unit } = payload[0].payload;
    return (
      <div className="metrics-chart-tooltip">
        <p className="tooltip-label">{name}</p>
        <p className="tooltip-value">{value} {unit}</p>
      </div>
    );
  }
  return null;
};

const MetricsChart: React.FC<MetricsChartProps> = ({
  data = [],
  title = 'Metrics Overview',
  color = '#3B82F6',
  height = 300,
  dataKeys = ['value']
}) => {
  // Color palette for bars
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Transform metric cards to chart data
  const chartData = data.map((metric, idx) => {
    const parsed = Number(metric.value);
    const value = Number.isFinite(parsed) ? parsed : 0;
    return {
      name: metric.label || `Metric ${idx + 1}`,
      value,
      unit: metric.unit || ''
    };
  });

  return (
    <div className="metrics-chart-container">
      <h3 className="metrics-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.2)" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
