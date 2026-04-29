import React from 'react';
import './MetricCard.css';

/**
 * MetricCard Component
 * Displays a single metric with value, trend, and icon
 */
function MetricCard({
  title,
  value,
  unit = '',
  icon = null,
  trend = null,
  trendPercent = null,
  color = 'blue',
  size = 'medium'
}) {
  const getColorClasses = () => {
    const colors = {
      blue: 'metric-card--blue',
      green: 'metric-card--green',
      red: 'metric-card--red',
      amber: 'metric-card--amber',
      purple: 'metric-card--purple'
    };
    return colors[color] || colors.blue;
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend === 'up') {
      return <span className="metric-card__trend metric-card__trend--up">↑</span>;
    } else if (trend === 'down') {
      return <span className="metric-card__trend metric-card__trend--down">↓</span>;
    }
    return <span className="metric-card__trend metric-card__trend--neutral">→</span>;
  };

  return (
    <div className={`metric-card metric-card--${size} ${getColorClasses()}`}>
      {/* Icon Section */}
      {icon && (
        <div className="metric-card__icon">
          {icon}
        </div>
      )}

      {/* Content Section */}
      <div className="metric-card__content">
        <h3 className="metric-card__title">{title}</h3>
        
        <div className="metric-card__value-section">
          <div className="metric-card__value">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="metric-card__unit">{unit}</span>}
          </div>

          {trendPercent !== null && (
            <div className={`metric-card__trend-badge metric-card__trend-badge--${trend || 'neutral'}`}>
              {getTrendIcon()}
              <span>{Math.abs(trendPercent)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
