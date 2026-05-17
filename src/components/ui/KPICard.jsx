import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * KPICard Component
 * Dashboard metric card with title, value, trend indicator, and optional sparkline
 * Fully responsive with dark mode support
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {number|string} props.value - Main metric value
 * @param {string} props.unit - Unit of measurement (e.g., "%", "K", "M")
 * @param {number} props.trend - Trend percentage (positive/negative)
 * @param {string} props.color - Color variant (red/blue/green/purple)
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {boolean} props.loading - Loading state
 * @param {Array<number>} props.sparklineData - Array of numbers for mini chart
 * 
 * @example
 * <KPICard
 *   title="Total Revenue"
 *   value={45230}
 *   unit="$"
 *   trend={12.5}
 *   color="red"
 *   icon={<DollarSign size={24} />}
 *   sparklineData={[10, 15, 12, 18, 22, 20, 25]}
 * />
 */
const KPICard = ({
  title,
  value,
  unit = '',
  trend = 0,
  color = 'red',
  icon,
  loading = false,
  sparklineData = [],
}) => {
  const trendColor = trend > 0 
    ? 'text-green-600 dark:text-green-400' 
    : trend < 0 
    ? 'text-red-600 dark:text-red-400' 
    : 'text-gray-600 dark:text-gray-400';
  
  const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';

  // Calculate sparkline points
  const sparklinePoints = useMemo(() => {
    if (!sparklineData || sparklineData.length === 0) return [];
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    return sparklineData.map((val, idx) => ({
      x: (idx / (sparklineData.length - 1)) * 100,
      y: 100 - ((val - min) / range) * 100,
    }));
  }, [sparklineData]);

  const colorClasses = {
    red: 'border-l-red-500 dark:border-l-red-500 bg-red-50 dark:bg-red-950',
    blue: 'border-l-blue-500 dark:border-l-blue-500 bg-blue-50 dark:bg-blue-950',
    green: 'border-l-green-500 dark:border-l-green-500 bg-green-50 dark:bg-green-950',
    purple: 'border-l-purple-500 dark:border-l-purple-500 bg-purple-50 dark:bg-purple-950',
  };

  return (
    <div 
      className={`border-l-4 rounded-lg p-6 bg-white dark:bg-gray-900 shadow-md transition-shadow hover:shadow-lg ${colorClasses[color] || colorClasses.red}`}
      role="region"
      aria-label={`${title} metric card`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            {loading ? (
              <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {value}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {unit}
                </span>
              </>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-2xl text-gray-400 dark:text-gray-600" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      {trend !== 0 && (
        <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
          <span>{trendIcon}</span>
          <span>{Math.abs(trend).toFixed(1)}%</span>
          <span className="text-gray-600 dark:text-gray-400 ml-1">vs last period</span>
        </div>
      )}

      {sparklinePoints.length > 1 && (
        <div className="mt-4 h-12 relative">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="absolute inset-0"
            aria-hidden="true"
          >
            <polyline
              points={sparklinePoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={`hsl(${color === 'green' ? '120' : color === 'red' ? '0' : '210'}, 70%, 50%)`}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

KPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string,
  trend: PropTypes.number,
  color: PropTypes.oneOf(['red', 'blue', 'green', 'purple']),
  icon: PropTypes.node,
  loading: PropTypes.bool,
  sparklineData: PropTypes.arrayOf(PropTypes.number),
};

export default KPICard;
