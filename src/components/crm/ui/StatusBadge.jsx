import React from 'react';
import './StatusBadge.css';

const STATUS_CONFIGS = {
  active: { label: 'Active', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  inactive: { label: 'Inactive', color: '#94A3B8', bgColor: 'rgba(148, 163, 184, 0.1)' },
  pending: { label: 'Pending', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  success: { label: 'Success', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  error: { label: 'Error', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  warning: { label: 'Warning', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  new: { label: 'New', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  hot: { label: 'Hot', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  cold: { label: 'Cold', color: '#64748B', bgColor: 'rgba(100, 116, 139, 0.1)' },
  qualified: { label: 'Qualified', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.1)' },
  converted: { label: 'Converted', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  lost: { label: 'Lost', color: '#94A3B8', bgColor: 'rgba(148, 163, 184, 0.1)' },
  available: { label: 'Available', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  sold: { label: 'Sold', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  rented: { label: 'Rented', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  reserved: { label: 'Reserved', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' }
};

const StatusBadge = ({
  status,
  label,
  color,
  bgColor,
  size = 'medium',
  pulse = false,
  className = ''
}) => {
  const config = STATUS_CONFIGS[status] || {};
  const displayLabel = label || config.label || status;
  const displayColor = color || config.color || '#64748B';
  const displayBgColor = bgColor || config.bgColor || 'rgba(100, 116, 139, 0.1)';

  return (
    <span 
      className={`status-badge status-badge--${size} ${pulse ? 'pulse' : ''} ${className}`}
      style={{ 
        '--badge-color': displayColor,
        '--badge-bg': displayBgColor
      }}
    >
      {pulse && <span className="status-badge-dot" />}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
