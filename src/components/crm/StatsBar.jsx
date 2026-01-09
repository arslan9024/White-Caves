import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatsBar.css';

const StatCard = ({ stat, onClick }) => {
  const trendClass = stat.trend > 0 ? 'positive' : stat.trend < 0 ? 'negative' : 'neutral';
  
  return (
    <div 
      className={`stat-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-icon-wrapper" style={{ backgroundColor: stat.color || '#3B82F6' }}>
        {stat.icon}
      </div>
      <div className="stat-content">
        <p className="stat-label">{stat.label}</p>
        <h3 className="stat-value">{stat.value}</h3>
        {stat.trend !== undefined && (
          <div className={`stat-trend ${trendClass}`}>
            {stat.trend > 0 ? <TrendingUp size={12} /> : stat.trend < 0 ? <TrendingDown size={12} /> : null}
            <span>{stat.trend > 0 ? '+' : ''}{stat.trend}%</span>
          </div>
        )}
        {stat.subtext && <p className="stat-subtext">{stat.subtext}</p>}
      </div>
    </div>
  );
};

const StatsBar = ({ stats, columns = 4, onStatClick }) => {
  return (
    <div className="stats-bar" style={{ '--columns': columns }}>
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.id || index} 
          stat={stat} 
          onClick={onStatClick ? () => onStatClick(stat) : undefined}
        />
      ))}
    </div>
  );
};

export default StatsBar;
