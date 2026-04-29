import React, { memo } from 'react';
import './SharedComponents.css';

type StatusType = 'active' | 'idle' | 'busy' | 'offline' | 'online';
type SizeType = 'small' | 'medium' | 'large';

interface StatusIndicatorProps {
  status?: StatusType;
  size?: SizeType;
  showLabel?: boolean;
}

const StatusIndicator = memo(({ 
  status = 'idle',
  size = 'medium',
  showLabel = false
}: StatusIndicatorProps) => {
  const statusConfig = {
    active: { color: '#10B981', label: 'Active' },
    idle: { color: '#6B7280', label: 'Idle' },
    busy: { color: '#F59E0B', label: 'Busy' },
    offline: { color: '#EF4444', label: 'Offline' },
    online: { color: '#10B981', label: 'Online' }
  };
  
  const config = statusConfig[status] || statusConfig.idle;
  
  const sizeClass = {
    small: 'status-sm',
    medium: 'status-md',
    large: 'status-lg'
  }[size] || 'status-md';
  
  return (
    <span className={`status-indicator ${sizeClass}`} title={config.label}>
      <span 
        className={`status-dot ${status === 'active' || status === 'online' ? 'pulse' : ''}`}
        style={{ backgroundColor: config.color }}
      />
      {showLabel && <span className="status-label">{config.label}</span>}
    </span>
  );
});

StatusIndicator.displayName = 'StatusIndicator';
export default StatusIndicator;
