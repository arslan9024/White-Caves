import React, { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import './BigTile.css';

const BigTile = ({ 
  icon: Icon,
  title,
  subtitle,
  description,
  stats = [],
  color = '#dc2626',
  onClick,
  onLearnMore,
  badge,
  isActive = false,
  size = 'medium',
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const tileClasses = [
    'big-tile',
    `big-tile-${size}`,
    isActive ? 'big-tile-active' : '',
    isHovered ? 'big-tile-hovered' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={tileClasses}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--tile-color': color }}
    >
      {badge && (
        <div className="tile-badge" style={{ backgroundColor: color }}>
          {badge}
        </div>
      )}
      
      <div className="tile-header">
        <div 
          className="tile-icon-container"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {Icon && <Icon size={size === 'large' ? 32 : size === 'small' ? 20 : 24} />}
        </div>
        
        <div className="tile-title-section">
          <h3 className="tile-title">{title}</h3>
          {subtitle && <span className="tile-subtitle">{subtitle}</span>}
        </div>
      </div>

      {description && (
        <p className="tile-description">{description}</p>
      )}

      {stats.length > 0 && (
        <div className="tile-stats">
          {stats.map((stat, index) => (
            <div key={index} className="tile-stat">
              <span className="stat-value" style={{ color }}>{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {children && (
        <div className="tile-content">
          {children}
        </div>
      )}

      <div className="tile-footer">
        {onLearnMore && (
          <button 
            className="tile-learn-more"
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore();
            }}
          >
            <span>Learn More</span>
            <ExternalLink size={14} />
          </button>
        )}
        
        <div className="tile-arrow" style={{ color }}>
          <ChevronRight size={20} />
        </div>
      </div>

      <div 
        className="tile-glow"
        style={{ background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)` }}
      />
    </div>
  );
};

export default BigTile;
