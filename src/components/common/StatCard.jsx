import React from 'react';
import './StatCard.css';

export default function StatCard({ 
  icon, 
  value, 
  label, 
  change, 
  positive = true,
  variant = 'default',
  onClick,
  className = ''
}) {
  return (
    <div 
      className={`stat-card-reusable ${variant} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`stat-icon-wrapper ${variant}`}>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {change && (
          <span className={`stat-change ${positive ? 'positive' : 'negative'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export function StatCardGrid({ children, columns = 4, className = '' }) {
  return (
    <div 
      className={`stat-card-grid ${className}`}
      style={{ '--grid-columns': columns }}
    >
      {children}
    </div>
  );
}
