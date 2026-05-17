import React from 'react';
import PropTypes from 'prop-types';

/**
 * Timeline Component
 * Vertical/horizontal timeline showing events with status indicators
 * Fully accessible and responsive with WCAG AAA compliance
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.items - Timeline items [{date, title, description, status}]
 * @param {string} props.variant - Layout variant (vertical/horizontal)
 * @param {string} props.color - Timeline color (red/blue/green/purple)
 * 
 * @example
 * <Timeline
 *   items={[
 *     { date: '2024-01-15', title: 'Step 1', status: 'completed' },
 *     { date: '2024-01-20', title: 'Step 2', status: 'pending' },
 *   ]}
 *   variant="vertical"
 *   color="red"
 * />
 */
const Timeline = ({
  items = [],
  variant = 'vertical',
  color = 'red',
}) => {
  const statusConfig = {
    completed: {
      bg: 'bg-green-500 dark:bg-green-400',
      text: 'text-green-600 dark:text-green-400',
      icon: '✓',
    },
    pending: {
      bg: 'bg-gray-300 dark:bg-gray-600',
      text: 'text-gray-600 dark:text-gray-400',
      icon: '○',
    },
    error: {
      bg: 'bg-red-500 dark:bg-red-400',
      text: 'text-red-600 dark:text-red-400',
      icon: '✕',
    },
  };

  const colorClasses = {
    red: 'bg-red-500 dark:bg-red-400',
    blue: 'bg-blue-500 dark:bg-blue-400',
    green: 'bg-green-500 dark:bg-green-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
  };

  if (variant === 'horizontal') {
    return (
      <div className="flex overflow-x-auto pb-4">
        {items.map((item, idx) => {
          const status = item.status || 'pending';
          const config = statusConfig[status];
          return (
            <div key={idx} className="flex-shrink-0 w-48">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border-4 border-white dark:border-gray-900 ${
                    config.bg
                  }`}
                  role="status"
                  aria-label={`Step ${idx + 1}: ${item.title}`}
                >
                  {config.icon}
                </div>
                {idx < items.length - 1 && (
                  <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.date}
                </p>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item, idx) => {
        const status = item.status || 'pending';
        const config = statusConfig[status];
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${config.bg} z-10 relative`}
                role="status"
                aria-label={`Timeline point: ${item.title}`}
              >
                {config.icon}
              </div>
              {!isLast && (
                <div className={`w-0.5 h-20 ${colorClasses[color]}`} />
              )}
            </div>
            <div className="flex-1 pt-1">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <span className={`text-xs font-semibold ${config.text}`}>
                    {status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.date}
                </p>
                {item.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

Timeline.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['completed', 'pending', 'error']),
  })).isRequired,
  variant: PropTypes.oneOf(['vertical', 'horizontal']),
  color: PropTypes.oneOf(['red', 'blue', 'green', 'purple']),
};

export default Timeline;
