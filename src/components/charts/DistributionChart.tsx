/**
 * DistributionChart - Pie/Donut chart for data distribution
 * Shows breakdown of categories with interactive legend
 */

import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import './charts.css';

interface DistributionChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface DistributionChartProps {
  data?: DistributionChartData[];
  title?: string;
  height?: number;
  innerRadius?: number;
  colors?: string[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  data = [],
  title = 'Distribution',
  height = 300,
  innerRadius = 60,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Default data if none provided
  const defaultData = [
    { name: 'Category A', value: 35 },
    { name: 'Category B', value: 30 },
    { name: 'Category C', value: 20 },
    { name: 'Category D', value: 15 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((value / total) * 100).toFixed(1);
      return (
        <div className="distribution-chart-tooltip">
          <p className="tooltip-label">{name}</p>
          <p className="tooltip-value">{value} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  const handlePieEnter = (data, index) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
  };

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
            label={(entry) => `${entry.value}`}
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry) => {
              const total = chartData.reduce((sum, item) => sum + item.value, 0);
              const percentage = ((entry.payload.value / total) * 100).toFixed(1);
              return `${value} (${percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;
