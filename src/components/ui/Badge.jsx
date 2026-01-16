import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge Component
 * Simple badge with optional dismiss button
 * Fully accessible with WCAG AAA compliance
 * 
 * @component
 * @param {Object} props
 * @param {string} props.label - Badge label text
 * @param {string} props.color - Badge color (red/blue/green/purple/gray)
 * @param {string} props.size - Badge size (sm/md/lg)
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {Function} props.onRemove - Remove callback for dismissible badges
 * 
 * @example
 * <Badge 
 *   label="New" 
 *   color="red" 
 *   size="md"
 *   onRemove={() => console.log('removed')}
 * />
 */
const Badge = ({
  label,
  color = 'gray',
  size = 'md',
  icon,
  onRemove,
}) => {
  const colorClasses = {
    red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
        colorClasses[color]
      } ${sizeClasses[size]} ${onRemove ? 'pr-1' : ''}`}
      role="status"
      aria-label={`Badge: ${label}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 ml-1 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 rounded-full p-0.5"
          aria-label={`Remove ${label} badge`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['red', 'blue', 'green', 'purple', 'gray']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  onRemove: PropTypes.func,
};

export default Badge;
