import React from 'react';

const OverviewTab = ({ apiStats, dbHealth, cacheHealth, securityStatus, realtimeStats }) => {
  return (
    <div className="overview-view">
      <h3>System Overview</h3>
      <div className="overview-grid">
        <div className="overview-card">
          <h4>API Performance</h4>
          <div className="metric-row">
            <span>Total Calls:</span>
            <span>{(apiStats.totalCalls / 1000).toFixed(0)}K</span>
          </div>
          <div className="metric-row">
            <span>Avg Response:</span>
            <span>{apiStats.avgResponseTime}ms</span>
          </div>
          <div className="metric-row">
            <span>Success Rate:</span>
            <span>{apiStats.avgSuccessRate}%</span>
          </div>
          <div className="metric-row">
            <span>Cached Endpoints:</span>
            <span>{apiStats.cachedEndpoints}</span>
          </div>
        </div>

        <div className="overview-card">
          <h4>Database Health</h4>
          <div className="metric-row">
            <span>Connections:</span>
            <span>{dbHealth.connections}</span>
          </div>
          <div className="metric-row">
            <span>Storage:</span>
            <span>{dbHealth.storage}</span>
          </div>
          <div className="metric-row">
            <span>Storage Used:</span>
            <span>{dbHealth.storagePercentage}%</span>
          </div>
        </div>

        <div className="overview-card">
          <h4>Cache Performance</h4>
          <div className="metric-row">
            <span>Hit Rate:</span>
            <span>{cacheHealth}%</span>
          </div>
          <div className="metric-row">
            <span>Memory Used:</span>
            <span>512MB / 1024MB</span>
          </div>
          <div className="metric-row">
            <span>Utilization:</span>
            <span>50%</span>
          </div>
        </div>

        <div className="overview-card">
          <h4>System Security</h4>
          <div className="metric-row">
            <span>Security Score:</span>
            <span>{securityStatus.percentage}%</span>
          </div>
          <div className="metric-row">
            <span>Checks Passed:</span>
            <span>{securityStatus.passed}/{securityStatus.total}</span>
          </div>
          <div className="metric-row">
            <span>Real-time Active:</span>
            <span>{realtimeStats.totalActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
