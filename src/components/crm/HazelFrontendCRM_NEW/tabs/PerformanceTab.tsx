import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface PerformanceMetric {
  metric: string;
  value: string;
  target: string;
  trend: 'up' | 'down' | 'stable';
}

interface PerformanceTabProps {
  metrics: PerformanceMetric[];
}

const PerformanceTab: React.FC<PerformanceTabProps> = ({ metrics }) => {
  return (
    <div className="performance-view">
      <h3>Performance Metrics</h3>
      
      <div className="performance-grid">
        {metrics.map((metric: PerformanceMetric) => (
          <div key={metric.metric} className="performance-card">
            <div className="perf-header">
              <span className="perf-name">{metric.metric}</span>
              <span className={`trend-indicator trend-${metric.trend}`}>
                {metric.trend === 'up' && <TrendingUp size={14} />}
                {metric.trend === 'down' && (
                  <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                )}
                {metric.trend === 'stable' && <span className="stable">—</span>}
              </span>
            </div>
            <div className="perf-value">{metric.value}</div>
            <div className="perf-target">Target: {metric.target}</div>
            <div className="perf-progress">
              <div 
                className="progress-bar"
                style={{
                  width: metric.trend === 'up' 
                    ? '85%' 
                    : metric.trend === 'down' 
                    ? '65%' 
                    : '75%'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="perf-summary">
        <h4>Performance Summary</h4>
        <div className="summary-list">
          <div className="summary-item">
            <span className="label">Lighthouse Score:</span>
            <span className="value">94/100</span>
          </div>
          <div className="summary-item">
            <span className="label">Performance Grade:</span>
            <span className="value grade-a">A</span>
          </div>
          <div className="summary-item">
            <span className="label">Bundle Health:</span>
            <span className="value">Good</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTab;
