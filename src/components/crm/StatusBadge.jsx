import React from 'react';
import './StatusBadge.css';

const STATUS_CONFIGS = {
  active: { label: 'Active', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  inactive: { label: 'Inactive', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  pending: { label: 'Pending', color: '#d97706', bg: 'rgba(245, 158, 11, 0.1)' },
  completed: { label: 'Completed', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  in_progress: { label: 'In Progress', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  available: { label: 'Available', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  sold: { label: 'Sold', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
  rented: { label: 'Rented', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  reserved: { label: 'Reserved', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  draft: { label: 'Draft', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  live: { label: 'Live', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  online: { label: 'Online', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  offline: { label: 'Offline', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  busy: { label: 'Busy', color: '#d97706', bg: 'rgba(245, 158, 11, 0.1)' },
  away: { label: 'Away', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.1)' },
  hot: { label: 'Hot', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  warm: { label: 'Warm', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  cold: { label: 'Cold', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  qualified: { label: 'Qualified', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  unqualified: { label: 'Unqualified', color: '#9ca3af', bg: 'rgba(156, 163, 175, 0.1)' },
  new: { label: 'New', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
  contacted: { label: 'Contacted', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  negotiation: { label: 'Negotiation', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  closed: { label: 'Closed', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  lost: { label: 'Lost', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  high: { label: 'High', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  low: { label: 'Low', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  approved: { label: 'Approved', color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  review: { label: 'Review', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
};

const StatusBadge = ({ status, size = 'md', showDot = false, customLabel, customColor, customBg }) => {
  const config = STATUS_CONFIGS[status?.toLowerCase()] || {
    label: status || 'Unknown',
    color: '#6b7280',
    bg: 'rgba(107, 114, 128, 0.1)'
  };

  const label = customLabel || config.label;
  const color = customColor || config.color;
  const bg = customBg || config.bg;

  return (
    <span
      className={`status-badge status-badge--${size}`}
      style={{ color, backgroundColor: bg }}
    >
      {showDot && <span className="status-dot" style={{ backgroundColor: color }} />}
      {label}
    </span>
  );
};

export default StatusBadge;
