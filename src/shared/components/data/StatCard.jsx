import React from 'react';
import Card from '../ui/Card';
import './StatCard.css';

const StatCard = React.memo(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  suffix,
  prefix,
  trend,
  trendLabel,
  loading = false,
  className = ''
}) => {
  const baseClass = 'wc-stat-card';
  const classes = [baseClass, className].filter(Boolean).join(' ');

  const changeClasses = [
    `${baseClass}__change`,
    changeType === 'positive' && `${baseClass}__change--positive`,
    changeType === 'negative' && `${baseClass}__change--negative`,
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <Card elevated className={`${classes} ${baseClass}--loading`}>
        <div className={`${baseClass}__skeleton`}>
          <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--title`} />
          <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--value`} />
          <div className={`${baseClass}__skeleton-line ${baseClass}__skeleton-line--change`} />
        </div>
      </Card>
    );
  }

  return (
    <Card elevated className={classes}>
      <div className={`${baseClass}__header`}>
        <span className={`${baseClass}__title`}>{title}</span>
        {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
      </div>
      
      <div className={`${baseClass}__value`}>
        {prefix && <span className={`${baseClass}__prefix`}>{prefix}</span>}
        <span className={`${baseClass}__number`}>{value}</span>
        {suffix && <span className={`${baseClass}__suffix`}>{suffix}</span>}
      </div>

      {(change !== undefined || trend) && (
        <div className={`${baseClass}__footer`}>
          {change !== undefined && (
            <span className={changeClasses}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </span>
          )}
          {trendLabel && (
            <span className={`${baseClass}__trend-label`}>{trendLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
