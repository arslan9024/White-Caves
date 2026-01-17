import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AlertBanner Component
 * Alert message with icon and dismiss button
 * Supports auto-dismiss and action buttons
 * WCAG AAA accessible with role="alert"
 * 
 * @component
 * @param {Object} props
 * @param {string} props.type - Alert type (success/warning/error/info)
 * @param {string} props.title - Alert title
 * @param {string} props.message - Alert message
 * @param {Function} props.onDismiss - Dismiss callback
 * @param {Object} props.action - Optional action {label, onClick}
 * @param {number} props.autoClose - Auto-close delay in ms (0 = disabled)
 * 
 * @example
 * <AlertBanner
 *   type="success"
 *   title="Success"
 *   message="Your changes have been saved"
 *   onDismiss={() => }
 *   autoClose={3000}
 * />
 */
const AlertBanner = ({
  type = 'info',
  title,
  message,
  onDismiss,
  action,
  autoClose = 0,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const typeConfig = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      icon: '✓',
      text: 'text-green-800 dark:text-green-200',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-950',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: '⚠',
      text: 'text-yellow-800 dark:text-yellow-200',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950',
      border: 'border-red-200 dark:border-red-800',
      icon: '✕',
      text: 'text-red-800 dark:text-red-200',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'ℹ',
      text: 'text-blue-800 dark:text-blue-200',
    },
  };

  const config = typeConfig[type];

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  useEffect(() => {
    if (autoClose > 0 && isVisible) {
      const timer = setTimeout(handleDismiss, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`border-l-4 rounded-lg p-4 ${config.bg} ${config.border} border shadow-sm`}
      style={{ animation: 'slideDown 0.3s ease-out' }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 text-lg font-bold ${config.text}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold ${config.text}`}>{title}</h4>
          )}
          {message && (
            <p className={`text-sm ${config.text} ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-2 font-medium underline hover:no-underline ${config.text} transition-colors`}
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className={`flex-shrink-0 text-lg font-bold ${config.text} hover:opacity-70 transition-opacity`}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

AlertBanner.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  onDismiss: PropTypes.func,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  autoClose: PropTypes.number,
};

export default AlertBanner;
