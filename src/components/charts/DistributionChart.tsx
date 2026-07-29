/**
 * DistributionChart - Pie/Donut chart for data distribution
 * Shows breakdown of categories with interactive legend
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import './charts.css';

interface DistributionChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

interface DistributionChartProps {
  data?: DistributionChartData[];
  title?: string;
  height?: number;
  innerRadius?: number;
  colors?: string[];
}

// Tooltip component — defined outside to avoid re-creation on every render
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  chartData?: DistributionChartData[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, chartData = [] }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
    return (
      <div className="distribution-chart-tooltip">
        <p className="tooltip-label">{name}</p>
        <p className="tooltip-value">{value} ({percentage}%)</p>
      </div>
    );
  }
  return null;
};

// Default data when none provided
const DEFAULT_DATA: DistributionChartData[] = [
  { name: 'Category A', value: 35 },
  { name: 'Category B', value: 30 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 15 }
];

const DistributionChart: React.FC<DistributionChartProps> = ({
  data = [],
  title = 'Distribution',
  height = 300,
  innerRadius = 60,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = data.length > 0 ? data : DEFAULT_DATA;

  const handlePieEnter = useCallback((_data: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  const handlePieLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <div className="distribution-chart-container">
      <h3 className="distribution-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 20, right: 200, bottom: 20, left: 20 }}>
          <Pie
            data={chartData}
            cx="30%"
            cy="50%"
            labelLine={false}
            label={(entry: { value?: number }) => `${entry.value ?? 0}`}
            outerRadius={100}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={handlePieEnter}
            onMouseLeave={handlePieLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip chartData={chartData} />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value: string | number, entry: { payload?: { value?: number } }) => {
              const total = chartData.reduce((sum, item) => sum + item.value, 0);
              const payload = entry.payload as { value?: number } | undefined;
              const percentage = total > 0 ? (((payload?.value ?? 0) / total) * 100).toFixed(1) : '0.0';
              return `${value} (${percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;
