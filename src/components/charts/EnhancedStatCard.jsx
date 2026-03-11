/**
 * EnhancedStatCard - Improved stat display with sparkline and trend indicator
 * Shows key metrics with visual trend and comparison
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  StatCardWrapper,
  StatCardHeader,
  StatCardLabel,
  TrendIcon,
  StatCardValue,
  StatValue,
  StatUnit,
  StatCardFooter,
  Sparkline,
  SparklinePath,
  SparklineFill,
  StatCardComparison,
  ChangeValue,
  ComparisonText
} from './EnhancedStatCard.styles';

const EnhancedStatCard = ({
  label = 'Metric',
  value = '0',
  unit = '',
  change = '+0%',
  trend = 'stable', // up, down, stable
  comparison = 'vs last month',
  icon: Icon = null,
  color = '#3B82F6',
  backgroundColor = 'rgba(59, 130, 246, 0.1)',
  sparklineData = [],
  onClick = null
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={20} />;
      case 'down':
        return <TrendingDown size={20} />;
      default:
        return <Minus size={20} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10B981'; // green
      case 'down':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  // Simple sparkline SVG
  const renderSparkline = () => {
    if (sparklineData.length === 0) return null;

    const width = 100;
    const height = 30;
    const points = sparklineData;
    
    if (points.length < 2) return null;

    const maxValue = Math.max(...points.map(p => typeof p === 'number' ? p : p.value));
    const minValue = Math.min(...points.map(p => typeof p === 'number' ? p : p.value));
    const range = maxValue - minValue || 1;

    const pathPoints = points.map((p, i) => {
      const val = typeof p === 'number' ? p : p.value;
      const x = (i / (points.length - 1)) * width;
      const y = height - ((val - minValue) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    return (
      <Sparkline width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <SparklinePath points={pathPoints} />
        <SparklineFill points={pathPoints} />
      </Sparkline>
    );
  };

  return (
    <StatCardWrapper
      backgroundColor={backgroundColor}
      borderColor={color}
      isClickable={!!onClick}
      onClick={onClick}
      title={label}
    >
      <StatCardHeader>
        <StatCardLabel>
          {Icon && <Icon size={16} style={{ color, marginRight: '8px' }} />}
          <span>{label}</span>
        </StatCardLabel>
        <TrendIcon as={trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus} trendType={trend} size={20} />
      </StatCardHeader>

      <StatCardValue>
        <StatValue style={{ color }}>
          {value}
        </StatValue>
        {unit && <StatUnit>{unit}</StatUnit>}
      </StatCardValue>

      <StatCardFooter>
        {sparklineData.length > 0 && renderSparkline()}
        <StatCardComparison>
          <ChangeValue style={{ color: getTrendColor() }}>
            {change}
          </ChangeValue>
          <ComparisonText>{comparison}</ComparisonText>
        </StatCardComparison>
      </StatCardFooter>
    </StatCardWrapper>
  );
};

export default EnhancedStatCard;
