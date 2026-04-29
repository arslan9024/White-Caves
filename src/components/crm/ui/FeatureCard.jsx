import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import './FeatureCard.css';

const FeatureCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = '#0EA5E9',
  onClick,
  className = '',
  size = 'medium',
  variant = 'default'
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'up') return <ArrowUpRight size={14} />;
    if (trend === 'down') return <ArrowDownRight size={14} />;
    return <Minus size={14} />;
  };

  return (
    <div 
      className={`feature-card ${size} ${variant} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      style={{ '--card-color': color }}
    >
      {Icon && (
        <div className="card-icon">
          <Icon size={size === 'small' ? 18 : 22} />
        </div>
      )}
      <div className="card-content">
        <span className="card-title">{title}</span>
        <div className="card-value-row">
          <span className="card-value">{value}</span>
          {trend && (
            <span className={`card-trend ${trend}`}>
              {getTrendIcon()}
              {trendValue && <span>{trendValue}</span>}
            </span>
          )}
        </div>
        {subtitle && <span className="card-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export const FeatureCardGrid = ({ children, columns = 4, className = '' }) => (
  <div className={`feature-card-grid cols-${columns} ${className}`}>
    {children}
  </div>
);

export default FeatureCard;
