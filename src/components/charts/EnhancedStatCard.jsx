/**
 * EnhancedStatCard - Improved stat display with sparkline and trend indicator
 * Shows key metrics with visual trend and comparison
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './EnhancedStatCard.css';

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
        return <TrendingUp size={20} className="trend-icon up" />;
      case 'down':
        return <TrendingDown size={20} className="trend-icon down" />;
      default:
        return <Minus size={20} className="trend-icon stable" />;
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
      <svg width={width} height={height} className="sparkline" viewBox={`0 0 ${width} ${height}`}>
        <polyline points={pathPoints} className="sparkline-path" />
        <polyline points={pathPoints} className="sparkline-fill" />
      </svg>
    );
  };

  return (
    <div
      className="enhanced-stat-card"
      style={{
        backgroundColor,
        borderLeftColor: color,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
      title={label}
    >
      <div className="stat-card-header">
        <div className="stat-card-label">
          {Icon && <Icon size={16} style={{ color, marginRight: '8px' }} />}
          <span>{label}</span>
        </div>
        {getTrendIcon()}
      </div>

      <div className="stat-card-value">
        <span className="value" style={{ color }}>
          {value}
        </span>
        {unit && <span className="unit">{unit}</span>}
      </div>

      <div className="stat-card-footer">
        {sparklineData.length > 0 && renderSparkline()}
        <div className="stat-card-comparison">
          <span className="change" style={{ color: getTrendColor() }}>
            {change}
          </span>
          <span className="comparison-text">{comparison}</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStatCard;
