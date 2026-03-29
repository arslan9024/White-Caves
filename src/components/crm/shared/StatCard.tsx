import React, { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './SharedComponents.css';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<{ size?: number | string }>;
  color?: string;
  size?: 'default' | 'large';
  onClick?: () => void;
}

const StatCard = memo(({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color = 'var(--assistant-color, #0EA5E9)',
  size = 'default',
  onClick
}: StatCardProps) => {
  const isPositive = (change ?? 0) > 0;
  const isNeutral = change == null || change === 0 || !Number.isFinite(change);
  
  return (
    <div 
      className={`stat-card ${size} ${onClick ? 'clickable' : ''}`}
      style={{ '--card-accent': color } as React.CSSProperties}
      onClick={onClick}
    >
      {Icon && (
        <div className="stat-icon" style={{ background: `${color}20`, color }}>
          <Icon size={size === 'large' ? 24 : 20} />
        </div>
      )}
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
      {!isNeutral && (
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';
export default StatCard;
