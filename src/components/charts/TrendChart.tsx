/**
 * TrendChart - Line chart visualization for trends over time
 * Shows metrics evolution with smooth animations
 */

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import './charts.css';

const TrendChart = ({
  data = [],
  title = 'Trend Analysis',
  color = '#3B82F6',
  height = 300,
  showArea = true,
  xAxisKey = 'name',
  yAxisKey = 'value',
  animate = true
}) => {
  // Sample trend data if none provided
  const defaultData = [
    { name: 'Week 1', value: 45, target: 50 },
    { name: 'Week 2', value: 52, target: 50 },
    { name: 'Week 3', value: 48, target: 50 },
    { name: 'Week 4', value: 61, target: 50 },
    { name: 'Week 5', value: 55, target: 50 },
    { name: 'Week 6', value: 67, target: 50 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="trend-chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className="trend-chart-container">
      <h3 className="trend-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.2)" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {showArea ? (
            <>
              <Area
                type="monotone"
                dataKey={yAxisKey}
                stroke={color}
                fillOpacity={1}
                fill="url(#colorTrend)"
                isAnimationActive={animate}
                animationDuration={1000}
              />
              {data.length > 0 && data[0].target && (
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, r: 5 }}
                activeDot={{ r: 7 }}
                isAnimationActive={animate}
                animationDuration={1000}
              />
              {data.length > 0 && data[0].target && (
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
