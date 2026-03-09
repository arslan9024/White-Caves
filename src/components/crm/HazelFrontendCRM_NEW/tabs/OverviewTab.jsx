import React from 'react';
import { Package, TrendingUp, Zap, Accessibility, BarChart3 } from 'lucide-react';

const OverviewTab = ({ componentStats, accessibilityStats, performanceMetrics }) => {
  return (
    <div className="overview-view">
      <h3>Frontend System Overview</h3>
      
      <div className="overview-grid">
        <div className="overview-section">
          <h4><Package size={16} /> Component Library Status</h4>
          <div className="status-grid">
            <div className="status-item success">
              <span className="icon">✓</span>
              <span>{componentStats.stable} Stable</span>
            </div>
            <div className="status-item info">
              <TrendingUp size={16} />
              <span>{componentStats.new} New</span>
            </div>
            <div className="status-item total">
              <Package size={16} />
              <span>{componentStats.total} Total</span>
            </div>
          </div>
        </div>

        <div className="overview-section">
          <h4><Zap size={16} /> Performance Summary</h4>
          <div className="metrics-list">
            {performanceMetrics.slice(0, 3).map(m => (
              <div key={m.metric} className="metric-row">
                <span className="metric-name">{m.metric}</span>
                <span className={`metric-value trend-${m.trend}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overview-section">
          <h4><Accessibility size={16} /> Accessibility Score</h4>
          <div className="a11y-summary">
            <div className="score-display">
              <span className="score">{accessibilityStats.avgScore}%</span>
              <span className="label">Average</span>
            </div>
            <div className="issues">
              <span className="count">{accessibilityStats.totalIssues}</span>
              <span className="label">Open Issues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
