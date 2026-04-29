import React from 'react';
import PropTypes from 'prop-types';

/**
 * Chart Component
 * Flexible chart component for data visualization
 * Supports line, bar, and pie chart types with dark mode
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.data - Chart data points
 * @param {string} props.type - Chart type: 'line', 'bar', 'pie'
 * @param {string} props.title - Chart title
 * @param {string} props.color - Primary color
 */
const Chart = ({
  data = [],
  type = 'line',
  title = 'Chart',
  color = 'red'
}) => {
  const colorMap = {
    red: 'rgb(220, 38, 38)',
    blue: 'rgb(59, 130, 246)',
    green: 'rgb(34, 197, 94)',
    purple: 'rgb(147, 51, 234)',
    gold: 'rgb(212, 175, 55)'
  };

  const renderChart = () => {
    if (type === 'line') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorMap[color]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colorMap[color]} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map(i => (
            <line
              key={`h-${i}`}
              x1="40" y1={i * 50} x2="380" y2={i * 50}
              stroke="currentColor" strokeWidth="1" opacity="0.1"
            />
          ))}

          {/* Y-axis */}
          <line x1="40" y1="20" x2="40" y2="280" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          {/* X-axis */}
          <line x1="40" y1="280" x2="380" y2="280" stroke="currentColor" strokeWidth="2" opacity="0.3" />

          {/* Sample line chart */}
          <polyline
            points="50,240 100,180 150,200 200,120 250,160 300,100 350,140"
            fill="none"
            stroke={colorMap[color]}
            strokeWidth="2"
          />
          <polygon
            points="50,240 100,180 150,200 200,120 250,160 300,100 350,140 350,280 50,280"
            fill="url(#lineGradient)"
          />

          {/* Data points */}
          {[50, 100, 150, 200, 250, 300, 350].map((x, i) => (
            <circle
              key={`point-${i}`}
              cx={x}
              cy={[240, 180, 200, 120, 160, 100, 140][i]}
              r="4"
              fill={colorMap[color]}
            />
          ))}
        </svg>
      );
    }

    if (type === 'bar') {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          {/* Grid */}
          {[1, 2, 3, 4, 5].map(i => (
            <line
              key={`h-${i}`}
              x1="40" y1={i * 50} x2="380" y2={i * 50}
              stroke="currentColor" strokeWidth="1" opacity="0.1"
            />
          ))}

          {/* Axes */}
          <line x1="40" y1="20" x2="40" y2="280" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <line x1="40" y1="280" x2="380" y2="280" stroke="currentColor" strokeWidth="2" opacity="0.3" />

          {/* Bars */}
          {[
            { x: 70, height: 180 },
            { x: 120, height: 200 },
            { x: 170, height: 140 },
            { x: 220, height: 240 },
            { x: 270, height: 120 },
            { x: 320, height: 160 }
          ].map((bar, i) => (
            <rect
              key={`bar-${i}`}
              x={bar.x - 15}
              y={280 - bar.height}
              width="30"
              height={bar.height}
              fill={colorMap[color]}
              opacity="0.8"
            />
          ))}
        </svg>
      );
    }

    if (type === 'pie') {
      const slices = [30, 25, 20, 15, 10];
      let currentAngle = 0;

      return (
        <svg viewBox="0 0 400 300" className="w-full h-64">
          {slices.map((slice, i) => {
            const sliceAngle = (slice / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            const colors = [colorMap[color], colorMap.blue, colorMap.green, colorMap.purple, colorMap.gold];

            const x1 = 200 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 150 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 200 + 80 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 150 + 80 * Math.sin((endAngle * Math.PI) / 180);

            const largeArc = sliceAngle > 180 ? 1 : 0;
            const pathData = [
              `M 200 150`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle = endAngle;

            return (
              <path
                key={`slice-${i}`}
                d={pathData}
                fill={colors[i]}
                opacity="0.8"
              />
            );
          })}
        </svg>
      );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="w-full text-slate-900 dark:text-white">
        {renderChart()}
      </div>
    </div>
  );
};

Chart.propTypes = {
  data: PropTypes.array,
  type: PropTypes.oneOf(['line', 'bar', 'pie']),
  title: PropTypes.string,
  color: PropTypes.oneOf(['red', 'blue', 'green', 'purple', 'gold'])
};

export default Chart;
