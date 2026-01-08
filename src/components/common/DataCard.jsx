import React from 'react';
import { Link } from 'react-router-dom';
import './DataCard.css';

export default function DataCard({ 
  title, 
  viewAllLink,
  viewAllText = 'View All',
  children,
  className = '',
  headerActions,
  fullWidth = false
}) {
  return (
    <div className={`data-card ${fullWidth ? 'full-width' : ''} ${className}`}>
      <div className="data-card-header">
        <h3>{title}</h3>
        <div className="header-actions">
          {headerActions}
          {viewAllLink && (
            <Link to={viewAllLink} className="view-all-link">
              {viewAllText} →
            </Link>
          )}
        </div>
      </div>
      <div className="data-card-content">
        {children}
      </div>
    </div>
  );
}

export function DataCardGrid({ children, columns = 2, className = '' }) {
  return (
    <div 
      className={`data-card-grid ${className}`}
      style={{ '--card-columns': columns }}
    >
      {children}
    </div>
  );
}

export function DataList({ children, className = '' }) {
  return (
    <div className={`data-list ${className}`}>
      {children}
    </div>
  );
}

export function DataListItem({ 
  icon,
  avatar,
  avatarText,
  title, 
  subtitle, 
  meta,
  status,
  statusColor,
  badge,
  badgeColor,
  actions,
  onClick,
  className = ''
}) {
  return (
    <div 
      className={`data-list-item ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(icon || avatar || avatarText) && (
        <div className="item-avatar">
          {avatar ? (
            <img src={avatar} alt={title} />
          ) : avatarText ? (
            <span className="avatar-text">{avatarText}</span>
          ) : (
            <span className="avatar-icon">{icon}</span>
          )}
        </div>
      )}
      
      <div className="item-content">
        <span className="item-title">{title}</span>
        {subtitle && <span className="item-subtitle">{subtitle}</span>}
      </div>
      
      {meta && (
        <div className="item-meta">
          {meta}
        </div>
      )}
      
      {status && (
        <span 
          className="item-status"
          style={{ '--status-color': statusColor }}
        >
          {status}
        </span>
      )}
      
      {badge !== undefined && (
        <span 
          className="item-badge"
          style={{ '--badge-color': badgeColor }}
        >
          {badge}
        </span>
      )}
      
      {actions && (
        <div className="item-actions">
          {actions}
        </div>
      )}
    </div>
  );
}
