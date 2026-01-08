import React, { useState, useEffect } from 'react';
import './StatusMessage.css';

const STATUS_CONFIGS = {
  success: {
    icon: '✓',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    textColor: '#10b981',
    label: 'Success',
  },
  error: {
    icon: '✕',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    textColor: '#ef4444',
    label: 'Error',
  },
  warning: {
    icon: '⚠',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    textColor: '#f59e0b',
    label: 'Warning',
  },
  info: {
    icon: 'ℹ',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    textColor: '#3b82f6',
    label: 'Info',
  },
  pending: {
    icon: '⏳',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    textColor: '#8b5cf6',
    label: 'Pending',
  },
};

export default function StatusMessage({
  type = 'info',
  message,
  title,
  autoDismiss = false,
  dismissAfter = 10000,
  onDismiss,
  showIcon = true,
  className = '',
  compact = false,
}) {
  const [visible, setVisible] = useState(true);
  const config = STATUS_CONFIGS[type] || STATUS_CONFIGS.info;

  useEffect(() => {
    if (autoDismiss && dismissAfter > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onDismiss]);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div 
      className={`status-message status-${type} ${compact ? 'compact' : ''} ${className}`}
      style={{
        '--status-bg': config.bgColor,
        '--status-border': config.borderColor,
        '--status-text': config.textColor,
      }}
      role="alert"
      aria-live="polite"
    >
      {showIcon && (
        <span className="status-icon" aria-hidden="true">
          {config.icon}
        </span>
      )}
      <div className="status-content">
        {title && <span className="status-title">{title}</span>}
        <span className="status-text">{message}</span>
      </div>
      {onDismiss && (
        <button 
          className="status-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function SuccessStatus({ message, ...props }) {
  return <StatusMessage type="success" message={message} {...props} />;
}

export function ErrorStatus({ message, ...props }) {
  return <StatusMessage type="error" message={message} {...props} />;
}

export function PendingStatus({ message, ...props }) {
  return <StatusMessage type="pending" message={message} {...props} />;
}

export function WarningStatus({ message, ...props }) {
  return <StatusMessage type="warning" message={message} {...props} />;
}

export function InfoStatus({ message, ...props }) {
  return <StatusMessage type="info" message={message} {...props} />;
}
