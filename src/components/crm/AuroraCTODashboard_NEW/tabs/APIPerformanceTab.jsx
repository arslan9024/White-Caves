import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const APIPerformanceTab = ({ systemComponents }) => {
  const apiMetrics = systemComponents.filter(c => c.type === 'api' || c.type === 'backend' || c.type === 'cache');

  const responseTimeMetrics = [
    { endpoint: '/api/properties', method: 'GET', avgTime: 145, p95: 320, status: 'good' },
    { endpoint: '/api/leads', method: 'POST', avgTime: 234, p95: 512, status: 'good' },
    { endpoint: '/api/assistants', method: 'GET', avgTime: 89, p95: 156, status: 'excellent' },
    { endpoint: '/api/analytics', method: 'GET', avgTime: 412, p95: 892, status: 'warning' }
  ];

  return (
    <div className="api-performance-view">
      <h3>API Performance Monitoring</h3>
      
      <div className="performance-grid">
        {apiMetrics.map(component => (
          <div key={component.id} className="perf-metric-card">
            <div className="perf-header">
              <h4>{component.name}</h4>
              <span className={`health-badge health-${component.status}`}>
                {component.status}
              </span>
            </div>
            <div className="perf-metrics">
              <div className="metric">
                <span className="label">Response Time:</span>
                <span className="value">{component.metrics.responseTime}ms</span>
              </div>
              <div className="metric">
                <span className="label">CPU:</span>
                <span className="value">{component.metrics.cpu}%</span>
              </div>
              <div className="metric">
                <span className="label">Memory:</span>
                <span className="value">{component.metrics.memory}%</span>
              </div>
              <div className="metric">
                <span className="label">Uptime:</span>
                <span className="value">{component.metrics.uptime}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="endpoints-section">
        <h4><Zap size={16} /> Endpoint Performance</h4>
        <div className="endpoints-table">
          <table>
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Method</th>
                <th>Avg Response</th>
                <th>P95 Response</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {responseTimeMetrics.map((metric, idx) => (
                <tr key={idx} className={`status-${metric.status}`}>
                  <td className="endpoint-name">{metric.endpoint}</td>
                  <td className="method">
                    <span className={`method-badge method-${metric.method.toLowerCase()}`}>
                      {metric.method}
                    </span>
                  </td>
                  <td className="response-time">{metric.avgTime}ms</td>
                  <td className="response-time">{metric.p95}ms</td>
                  <td>
                    <span className={`status-badge status-${metric.status}`}>
                      {metric.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="performance-recommendations">
        <h4>Performance Recommendations</h4>
        <div className="recommendations-list">
          <div className="recommendation-item">
            <AlertTriangle size={16} />
            <span>/api/analytics endpoint needs optimization - consider caching</span>
          </div>
          <div className="recommendation-item">
            <CheckCircle size={16} />
            <span>API backend performing excellently - no action needed</span>
          </div>
          <div className="recommendation-item">
            <Zap size={16} />
            <span>Redis cache is highly optimized - response time 5ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIPerformanceTab;
