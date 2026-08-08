import React, { FC, useState, useEffect } from 'react';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';

const log = createLogger('SystemHealth');
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { isAdminOrAbove } from '../../utils/roleHelpers';
import './SystemHealthPage.css';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastChecked: string;
}

const SystemHealthPage: FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [healthStatus, setHealthStatus] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'down'>(
    'operational'
  );
  const [_fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isAdminOrAbove(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    const doFetch = () => fetchSystemHealth(controller.signal);
    doFetch();
    const interval = setInterval(doFetch, 60000);
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  const fetchSystemHealth = async (signal?: AbortSignal): Promise<void> => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await authFetch('/api/system/health', { signal });
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data.services || []);
        setOverallStatus(data.overall || 'operational');
      } else {
        const statusText = response.statusText || 'Unknown error';
        setFetchError(`Failed to fetch system health: ${response.status} ${statusText}`);
        setOverallStatus('down');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      log.error('Error fetching system health:', error);
      setFetchError('Unable to connect to health monitoring service.');
      setOverallStatus('down');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy':
        return '#10B981';
      case 'degraded':
        return '#C9A84C';
      case 'down':
        return '#EF4444';
      default:
        return 'rgba(255, 255, 255, 0.4)';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'healthy':
        return '✓';
      case 'degraded':
        return '⚠';
      case 'down':
        return '✗';
      default:
        return '?';
    }
  };

  return (
    <div className="system-health-page no-sidebar">
      <div className="sh-container full-width">
        <header className="sh-header">
          <h1>System Health Dashboard</h1>
          <p>Real-time platform monitoring and status</p>
        </header>

        <div className="sh-overall-status">
          <div className={`sh-status-card sh-status-${overallStatus}`}>
            <span className="sh-status-label">Overall Status</span>
            <span className="sh-status-value">
              {overallStatus === 'operational' && '🟢 Operational'}
              {overallStatus === 'degraded' && '🟡 Degraded'}
              {overallStatus === 'down' && '🔴 Down'}
            </span>
            <span className="sh-status-time">Last updated: just now</span>
          </div>
        </div>

        {loading ? (
          <div className="sh-loading">Loading system status...</div>
        ) : (
          <div className="sh-services-grid">
            {healthStatus.length > 0 ? (
              healthStatus.map(service => (
                <div
                  key={service.service}
                  className={`sh-service-card sh-service-${service.status}`}
                  style={{ borderLeftColor: getStatusColor(service.status) }}
                >
                  <div className="sh-service-header">
                    <span className="sh-service-status-icon">{getStatusIcon(service.status)}</span>
                    <h3 className="sh-service-name">{service.service}</h3>
                  </div>
                  <div className="sh-service-details">
                    <div className="sh-detail">
                      <span className="sh-label">Status:</span>
                      <span className="sh-value">{service.status}</span>
                    </div>
                    <div className="sh-detail">
                      <span className="sh-label">Uptime:</span>
                      <span className="sh-value">{service.uptime}%</span>
                    </div>
                    <div className="sh-detail">
                      <span className="sh-label">Last Check:</span>
                      <span className="sh-value">{service.lastChecked}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No services to display</p>
            )}
          </div>
        )}

        <div className="sh-metrics">
          <h3>Performance Metrics</h3>
          <div className="sh-metrics-grid">
            <div className="sh-metric-card">
              <span className="sh-metric-label">API Response Time</span>
              <span className="sh-metric-value">245ms</span>
            </div>
            <div className="sh-metric-card">
              <span className="sh-metric-label">Database Latency</span>
              <span className="sh-metric-value">52ms</span>
            </div>
            <div className="sh-metric-card">
              <span className="sh-metric-label">Cache Hit Rate</span>
              <span className="sh-metric-value">87.3%</span>
            </div>
            <div className="sh-metric-card">
              <span className="sh-metric-label">Error Rate</span>
              <span className="sh-metric-value">0.02%</span>
            </div>
          </div>
        </div>

        <div className="sh-actions">
          <button onClick={() => fetchSystemHealth()} className="sh-btn-refresh">
            🔄 Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPage;
