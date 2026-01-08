import React from 'react';
import './SkeletonLoader.css';

export const SkeletonText = ({ width = '100%', height = '16px', className = '' }) => (
  <div 
    className={`skeleton-text ${className}`}
    style={{ width, height }}
  />
);

export const SkeletonCircle = ({ size = '40px', className = '' }) => (
  <div 
    className={`skeleton-circle ${className}`}
    style={{ width: size, height: size }}
  />
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`}>
    <div className="skeleton-card-header">
      <SkeletonCircle size="48px" />
      <div className="skeleton-card-title">
        <SkeletonText width="120px" height="18px" />
        <SkeletonText width="80px" height="14px" />
      </div>
    </div>
    <div className="skeleton-card-body">
      <SkeletonText width="100%" height="24px" />
      <SkeletonText width="60%" height="14px" />
    </div>
  </div>
);

export const SkeletonStatCard = ({ className = '' }) => (
  <div className={`skeleton-stat-card ${className}`}>
    <SkeletonCircle size="40px" />
    <div className="skeleton-stat-content">
      <SkeletonText width="80px" height="12px" />
      <SkeletonText width="60px" height="24px" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`skeleton-table ${className}`}>
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText key={i} width="80px" height="14px" />
      ))}
    </div>
    <div className="skeleton-table-body">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <SkeletonText 
              key={colIdx} 
              width={colIdx === 0 ? '120px' : '80px'} 
              height="14px" 
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div className="skeleton-dashboard">
    <div className="skeleton-stats-row">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>
    <div className="skeleton-content-row">
      <div className="skeleton-main-content">
        <SkeletonCard />
        <SkeletonTable rows={5} columns={4} />
      </div>
      <div className="skeleton-sidebar-content">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  </div>
);

export const EmptyState = ({ 
  icon: Icon,
  title = 'No data available',
  description = 'There is nothing to display at the moment.',
  action,
  actionLabel = 'Get Started'
}) => (
  <div className="empty-state">
    <div className="empty-state-icon">
      {Icon && <Icon size={48} />}
    </div>
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-description">{description}</p>
    {action && (
      <button className="empty-state-action" onClick={action}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default {
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonDashboard,
  EmptyState
};
