import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './KpiCard.css';

const KpiCard = ({
  title,
  value,
  previousValue,
  trend,
  trendValue,
  icon: Icon,
  color = '#0EA5E9',
  format = 'number',
  size = 'medium',
  variant = 'default',
  loading = false,
  onClick,
  subtitle,
  prefix,
  suffix
}) => {
  const formatValue = (val) => {
    if (val === null || val === undefined) return '-';
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-AE', {
          style: 'currency',
          currency: 'AED',
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(val);
      case 'percent':
        return `${val}%`;
      case 'compact':
        return new Intl.NumberFormat('en', { notation: 'compact' }).format(val);
      case 'decimal':
        return val.toFixed(2);
      default:
        return typeof val === 'number' ? val.toLocaleString() : val;
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={14} />;
    if (trend === 'down') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendClass = () => {
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    return 'trend-neutral';
  };

  if (loading) {
    return (
      <div className={`kpi-card ${size} ${variant} loading`}>
        <div className="kpi-skeleton">
          <div className="skeleton-icon" />
          <div className="skeleton-content">
            <div className="skeleton-title" />
            <div className="skeleton-value" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`kpi-card ${size} ${variant} ${onClick ? 'clickable' : ''}`}
      style={{ '--kpi-color': color }}
      onClick={onClick}
    >
      {Icon && (
        <div className="kpi-icon">
          <Icon size={size === 'small' ? 16 : size === 'large' ? 28 : 20} />
        </div>
      )}
      <div className="kpi-content">
        <span className="kpi-title">{title}</span>
        <div className="kpi-value-row">
          <span className="kpi-value">
            {prefix}{formatValue(value)}{suffix}
          </span>
          {(trend || trendValue) && (
            <span className={`kpi-trend ${getTrendClass()}`}>
              {getTrendIcon()}
              {trendValue && <span>{trendValue}</span>}
            </span>
          )}
        </div>
        {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export const KpiCardGrid = ({ children, columns = 4, gap = '16px' }) => (
  <div
    className="kpi-card-grid"
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap
    }}
  >
    {children}
  </div>
);

export default KpiCard;
