import React, { memo } from 'react';
import './SharedComponents.css';

const NotificationBadge = memo(({ 
  count = 0, 
  maxCount = 99, 
  severity = 'default',
  size = 'medium',
  pulse = false,
  showZero = false
}) => {
  if (count === 0 && !showZero) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  
  const severityClass = {
    default: 'badge-default',
    info: 'badge-info',
    warning: 'badge-warning',
    critical: 'badge-critical',
    success: 'badge-success'
  }[severity] || 'badge-default';
  
  const sizeClass = {
    small: 'badge-sm',
    medium: 'badge-md',
    large: 'badge-lg'
  }[size] || 'badge-md';
  
  return (
    <span 
      className={`notification-badge ${severityClass} ${sizeClass} ${pulse ? 'pulse' : ''}`}
      aria-label={`${count} notifications`}
    >
      {displayCount}
    </span>
  );
});

NotificationBadge.displayName = 'NotificationBadge';
export default NotificationBadge;
