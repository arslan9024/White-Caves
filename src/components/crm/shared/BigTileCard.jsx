import React, { memo } from 'react';
import { MoreVertical, ExternalLink } from 'lucide-react';
import './SharedComponents.css';

const BigTileCard = memo(({ 
  title, 
  subtitle,
  icon: Icon,
  value,
  status,
  statusColor,
  actions,
  children,
  onClick,
  color = 'var(--assistant-color, #0EA5E9)',
  variant = 'default'
}) => {
  return (
    <div 
      className={`big-tile-card ${variant} ${onClick ? 'clickable' : ''}`}
      style={{ '--tile-accent': color }}
      onClick={onClick}
    >
      <div className="tile-header">
        <div className="tile-title-row">
          {Icon && (
            <div className="tile-icon" style={{ background: `${color}20`, color }}>
              <Icon size={20} />
            </div>
          )}
          <div className="tile-title-content">
            <h4 className="tile-title">{title}</h4>
            {subtitle && <span className="tile-subtitle">{subtitle}</span>}
          </div>
        </div>
        <div className="tile-actions">
          {status && (
            <span 
              className="tile-status" 
              style={{ 
                background: `${statusColor || color}20`, 
                color: statusColor || color 
              }}
            >
              {status}
            </span>
          )}
          {actions && (
            <button className="tile-menu-btn">
              <MoreVertical size={16} />
            </button>
          )}
          {onClick && (
            <ExternalLink size={14} className="tile-link-icon" />
          )}
        </div>
      </div>
      
      {value !== undefined && (
        <div className="tile-value">{value}</div>
      )}
      
      {children && (
        <div className="tile-body">
          {children}
        </div>
      )}
    </div>
  );
});

BigTileCard.displayName = 'BigTileCard';
export default BigTileCard;
