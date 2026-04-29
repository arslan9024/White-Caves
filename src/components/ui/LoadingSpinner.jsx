import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner Component
 * Animated loading spinner with multiple variants
 * Respects prefers-reduced-motion for accessibility
 * 
 * @component
 * @param {Object} props
 * @param {string} props.size - Spinner size (sm/md/lg)
 * @param {string} props.color - Spinner color (red/blue/green/purple)
 * @param {string} props.text - Optional loading text
 * @param {string} props.variant - Spinner style (dots/ring/spiral)
 * 
 * @example
 * <LoadingSpinner 
 *   size="md" 
 *   color="red" 
 *   text="Loading..." 
 *   variant="ring" 
 * />
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'red',
  text,
  variant = 'ring',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    red: 'border-red-500 dark:border-red-400',
    blue: 'border-blue-500 dark:border-blue-400',
    green: 'border-green-500 dark:border-green-400',
    purple: 'border-purple-500 dark:border-purple-400',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex gap-1.5 justify-center items-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`${sizeClasses[size]} rounded-full bg-red-500 dark:bg-red-400`}
                style={{ 
                  animation: `bounce 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.16}s`
                }}
              />
            ))}
          </div>
        );
      case 'spiral':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div
              className={`absolute inset-0 rounded-full border-4 border-transparent ${colorClasses[color]} border-t-current`}
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <div
              className={`absolute inset-1 rounded-full border-2 border-transparent ${colorClasses[color]} border-b-current`}
              style={{ animation: 'spin 1s linear infinite reverse' }}
            />
          </div>
        );
      case 'ring':
      default:
        return (
          <div 
            className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-red-500 dark:border-t-red-400 rounded-full`}
            style={{ animation: 'spin 1s linear infinite' }}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderSpinner()}
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['red', 'blue', 'green', 'purple']),
  text: PropTypes.string,
  variant: PropTypes.oneOf(['dots', 'ring', 'spiral']),
};

export default LoadingSpinner;
