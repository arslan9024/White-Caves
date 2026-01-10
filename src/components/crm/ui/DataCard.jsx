import React from 'react';
import { ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import './DataCard.css';

const DataCard = ({
  title,
  value,
  subtitle,
  change,
  changeType,
  icon: Icon,
  color = '#DC2626',
  size = 'medium',
  loading = false,
  onClick,
  actions,
  footer,
  className = ''
}) => {
  const isPositive = changeType === 'positive';

  return (
    <div 
      className={`data-card data-card--${size} ${loading ? 'loading' : ''} ${onClick ? 'clickable' : ''} ${className}`}
      style={{ '--card-accent': color }}
      onClick={onClick}
    >
      {loading ? (
        <div className="data-card-skeleton">
          <div className="skeleton-icon" />
          <div className="skeleton-content">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        </div>
      ) : (
        <>
          <div className="data-card-header">
            {Icon && (
              <div className="data-card-icon">
                <Icon size={size === 'small' ? 18 : 22} />
              </div>
            )}
            {actions && (
              <button className="data-card-menu">
                <MoreVertical size={16} />
              </button>
            )}
          </div>
          
          <div className="data-card-body">
            <span className="data-card-title">{title}</span>
            <div className="data-card-value-row">
              <span className="data-card-value">{value}</span>
              {change && (
                <span className={`data-card-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {change}
                </span>
              )}
            </div>
            {subtitle && <span className="data-card-subtitle">{subtitle}</span>}
          </div>

          {footer && (
            <div className="data-card-footer">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataCard;
