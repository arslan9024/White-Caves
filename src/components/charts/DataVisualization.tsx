/**
 * Data Visualization Components
 * Provides chart and graph components for department data
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const BarChartWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  gap: 8px;
`;

const BarItem = styled.div<{ $height: number; $color?: string }>`
  flex: 1;
  height: ${props => props.$height}%;
  background: ${props => props.$color || '#3498db'};
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    background: ${props => props.$color || '#2980b9'};
    opacity: 0.9;

    &::after {
      content: attr(data-label);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      margin-bottom: 8px;
    }
  }
`;

const LineChartWrapper = styled.svg`
  width: 100%;
  height: 100%;
`;

const ChartLabel = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #999;
  white-space: nowrap;
`;

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  maxValue?: number;
  animated?: boolean;
}

/**
 * Simple Bar Chart Component
 */
export const BarChart: React.FC<BarChartProps> = ({ data, maxValue, animated = true }) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <ChartContainer>
      <BarChartWrapper>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              height: '100%',
              gap: '8px',
            }}
          >
            <BarItem
              $height={(item.value / max) * 100}
              $color={item.color}
              data-label={`${item.label}: ${item.value}`}
              style={{ background: item.color || 'var(--primary-color)' }}
            />
            <ChartLabel>{item.label}</ChartLabel>
          </div>
        ))}
      </BarChartWrapper>
    </ChartContainer>
  );
};

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  color?: string;
  maxValue?: number;
}

/**
 * Simple Line Chart Component
 */
export const LineChart: React.FC<LineChartProps> = ({ data, color = '#3498db', maxValue }) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);
  const chartHeight = 200;
  const chartWidth = 800;
  const padding = 40;

  const points = useMemo(() => {
    return data.map((item, index) => {
      const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - (item.value / max) * (chartHeight - 2 * padding);
      return { x, y, ...item };
    });
  }, [data, max]);

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <ChartContainer>
      <LineChartWrapper viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <line
            key={`grid-${index}`}
            x1={padding}
            y1={chartHeight - ratio * (chartHeight - 2 * padding)}
            x2={chartWidth - padding}
            y2={chartHeight - ratio * (chartHeight - 2 * padding)}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeDasharray="4"
          />
        ))}

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={color}
            stroke="#fff"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text
            key={`label-${index}`}
            x={point.x}
            y={chartHeight - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#999"
          >
            {point.label}
          </text>
        ))}
      </LineChartWrapper>
    </ChartContainer>
  );
};

interface PieChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  size?: number;
}

/**
 * Simple Pie Chart Component
 */
export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const slices = useMemo(() => {
    let startAngle = -Math.PI / 2;
    return data.map((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      const startX = size / 2 + (size / 2) * Math.cos(startAngle);
      const startY = size / 2 + (size / 2) * Math.sin(startAngle);
      const endX = size / 2 + (size / 2) * Math.cos(endAngle);
      const endY = size / 2 + (size / 2) * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      const slice = {
        label: item.label,
        value: item.value,
        color: item.color || '#3498db',
        path: `M ${size / 2} ${size / 2} L ${startX} ${startY} A ${
          size / 2
        } ${size / 2} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
      };

      startAngle = endAngle;
      return slice;
    });
  }, [data, total, size]);

  return (
    <ChartContainer>
      <LineChartWrapper viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {slices.map((slice, index) => (
          <g key={index}>
            <path d={slice.path} fill={slice.color} stroke="#000" strokeWidth="1" opacity="0.8" />
          </g>
        ))}
      </LineChartWrapper>
    </ChartContainer>
  );
};

/**
 * Progress Ring Component
 * Shows progress as a circular indicator
 */
interface ProgressRingProps {
  value: number;
  max?: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

const ProgressRingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const RingSvg = styled.svg`
  transform: rotate(-90deg);
`;

const ProgressLabel = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
`;

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  color = '#3498db',
  size = 120,
  strokeWidth = 8,
  showLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  const percentage = Math.round((value / max) * 100);

  return (
    <ProgressRingWrapper>
      <RingSvg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </RingSvg>
      {showLabel && <ProgressLabel>{percentage}%</ProgressLabel>}
    </ProgressRingWrapper>
  );
};

export default {
  BarChart,
  LineChart,
  PieChart,
  ProgressRing,
};
