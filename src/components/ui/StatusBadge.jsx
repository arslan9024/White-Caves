import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatusBadge Component
 * Color-coded status indicator with optional pulse animation
 * Fully accessible with ARIA labels and semantic HTML
 * 
 * @component
 * @param {Object} props
 * @param {string} props.status - Status type (success/warning/error/info/pending/active/inactive)
 * @param {string} props.label - Badge label text
 * @param {string} props.size - Badge size (sm/md/lg)
 * @param {string} props.variant - Badge variant (solid/outline)
 * 
 * @example
 * <StatusBadge 
 *   status="success" 
 *   label="Active" 
 *   size="md" 
 *   variant="solid" 
 * />
 */
const StatusBadge = ({
  status = 'info',
  label,
  size = 'md',
  variant = 'solid',
}) => {
  const statusConfig = {
    success: {
      solid: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      outline: 'border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300',
      dot: 'bg-green-500',
    },
    warning: {
      solid: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      outline: 'border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
      dot: 'bg-yellow-500',
    },
    error: {
      solid: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      outline: 'border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300',
      dot: 'bg-red-500',
    },
    info: {
      solid: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      outline: 'border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
    },
    pending: {
      solid: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
      outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
      dot: 'bg-gray-500',
    },
    active: {
      solid: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200',
      outline: 'border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
    inactive: {
      solid: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
      outline: 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300',
      dot: 'bg-slate-500',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const shouldPulse = ['active', 'pending'].includes(status);
  const config = statusConfig[status] || statusConfig.info;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-medium transition-colors ${
        sizeClasses[size]
      } ${config[variant]} ${shouldPulse ? 'animate-pulse' : ''}`}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <span
        className={`inline-block rounded-full ${dotSize} ${config.dot}`}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
    </div>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'pending', 'active', 'inactive']),
  label: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['solid', 'outline']),
};

export default StatusBadge;
