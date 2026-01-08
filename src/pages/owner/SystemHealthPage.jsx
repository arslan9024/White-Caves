import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnalytics } from '../../store/analyticsSlice';
import './SystemHealthPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WebVitalCard = ({ name, label, value, rating, unit, thresholds }) => {
  const getStatusClass = () => {
    if (!value) return 'status-unknown';
    if (rating === 'good') return 'status-healthy';
    if (rating === 'needs-improvement') return 'status-warning';
    return 'status-error';
  };

  const formatValue = () => {
    if (value === null || value === undefined) return '-';
    if (name === 'CLS') return value.toFixed(3);
    return Math.round(value);
  };

  return (
    <div className={`web-vital-card ${getStatusClass()}`}>
      <div className="vital-header">
        <span className="vital-name">{name}</span>
        <span className={`vital-rating ${rating || 'unknown'}`}>
          {rating || 'Measuring...'}
        </span>
      </div>
      <div className="vital-value">
        <span className="value">{formatValue()}</span>
        <span className="unit">{unit}</span>
      </div>
      <div className="vital-label">{label}</div>
      {thresholds && (
        <div className="vital-thresholds">
          <span className="good">Good: ≤{thresholds.good}{unit}</span>
          <span className="poor">Poor: ≥{thresholds.poor}{unit}</span>
        </div>
      )}
    </div>
  );
};

const TrafficMetricCard = ({ icon, label, value, trend, change }) => (
  <div className="traffic-metric-card">
    <div className="metric-icon">{icon}</div>
    <div className="metric-content">
      <span className="metric-value">{value}</span>
      <span className="metric-label">{label}</span>
    </div>
    {trend && (
      <div className={`metric-trend ${trend}`}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
        {change && <span>{change}</span>}
      </div>
    )}
  </div>
);

function SystemHealthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.currentUser);
  const analytics = useSelector(state => state.analytics);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system/health');
      const data = await response.json();
      setHealthData(data);
      setLastChecked(new Date());
      dispatch(fetchAnalytics());
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthData({ error: 'Failed to fetch health status' });
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      checkHealth();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, checkHealth]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
      case 'healthy':
      case 'configured':
        return '✓';
      case 'degraded':
      case 'fallback':
        return '⚠';
      case 'disconnected':
      case 'error':
      case 'not_configured':
        return '✗';
      default:
        return '?';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'connected':
      case 'healthy':
      case 'configured':
        return 'status-healthy';
      case 'degraded':
      case 'fallback':
        return 'status-warning';
      case 'disconnected':
      case 'error':
      case 'not_configured':
        return 'status-error';
      default:
        return 'status-unknown';
    }
  };

  const getPerformanceScoreClass = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  };

  return (
    <div className="system-health-page">
      <button className="btn-back" onClick={() => navigate('/owner/dashboard')}>
        ← Back to Dashboard
      </button>

      <div className="health-header">
        <div>
          <h1>System Health Monitor</h1>
          <p className="subtitle">Real-time status of all connected services</p>
        </div>
        <div className="header-actions">
          <label className="auto-refresh-toggle">
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh (30s)</span>
          </label>
          <button className="btn-refresh" onClick={checkHealth} disabled={loading}>
            {loading ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>
      </div>

      {lastChecked && (
        <p className="last-checked">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}

      <div className="web-traffic-section">
        <h2>Web Traffic Health</h2>
        <p className="section-description">Live performance metrics from Speed Insights</p>
        
        <div className="performance-overview">
          <div className={`performance-score ${getPerformanceScoreClass(analytics.performance.score)}`}>
            <div className="score-ring">
              <svg viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="var(--bg-tertiary)" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${analytics.performance.score * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="score-value">{analytics.performance.score}</div>
            </div>
            <div className="score-label">Performance Score</div>
            <div className={`score-status ${analytics.performance.status}`}>
              {analytics.performance.status.replace('-', ' ')}
            </div>
          </div>

          <div className="traffic-metrics">
            <TrafficMetricCard 
              icon="👁" 
              label="Page Views" 
              value={analytics.traffic.pageViews.toLocaleString()}
              trend="up"
              change="+12%"
            />
            <TrafficMetricCard 
              icon="👤" 
              label="Active Users" 
              value={analytics.traffic.activeUsers || 1}
              trend="stable"
            />
            <TrafficMetricCard 
              icon="⏱" 
              label="Avg. Session" 
              value={`${Math.floor(analytics.traffic.avgSessionDuration / 60)}m`}
            />
            <TrafficMetricCard 
              icon="↩" 
              label="Bounce Rate" 
              value={`${analytics.traffic.bounceRate}%`}
              trend={analytics.traffic.bounceRate > 50 ? 'down' : 'up'}
            />
          </div>
        </div>

        <div className="web-vitals-grid">
          <WebVitalCard 
            name="LCP"
            label="Largest Contentful Paint"
            value={analytics.webVitals.lcp?.value}
            rating={analytics.webVitals.lcp?.rating}
            unit="ms"
            thresholds={{ good: 2500, poor: 4000 }}
          />
          <WebVitalCard 
            name="INP"
            label="Interaction to Next Paint"
            value={analytics.webVitals.inp?.value}
            rating={analytics.webVitals.inp?.rating}
            unit="ms"
            thresholds={{ good: 200, poor: 500 }}
          />
          <WebVitalCard 
            name="CLS"
            label="Cumulative Layout Shift"
            value={analytics.webVitals.cls?.value}
            rating={analytics.webVitals.cls?.rating}
            unit=""
            thresholds={{ good: 0.1, poor: 0.25 }}
          />
          <WebVitalCard 
            name="FCP"
            label="First Contentful Paint"
            value={analytics.webVitals.fcp?.value}
            rating={analytics.webVitals.fcp?.rating}
            unit="ms"
            thresholds={{ good: 1800, poor: 3000 }}
          />
          <WebVitalCard 
            name="TTFB"
            label="Time to First Byte"
            value={analytics.webVitals.ttfb?.value}
            rating={analytics.webVitals.ttfb?.rating}
            unit="ms"
            thresholds={{ good: 800, poor: 1800 }}
          />
        </div>

        {analytics.performance.lastUpdated && (
          <p className="vitals-updated">
            Vitals last updated: {new Date(analytics.performance.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>

      {loading && !healthData ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Checking system health...</p>
        </div>
      ) : healthData?.error ? (
        <div className="error-state">
          <p>{healthData.error}</p>
        </div>
      ) : (
        <div className="health-grid">
          <div className="health-card">
            <div className="card-header">
              <h3>Server</h3>
              <span className={`status-badge ${getStatusClass(healthData?.server?.status)}`}>
                {getStatusIcon(healthData?.server?.status)} {healthData?.server?.status || 'Unknown'}
              </span>
            </div>
            <div className="card-details">
              <div className="detail-row">
                <span className="label">Uptime</span>
                <span className="value">{healthData?.server?.uptime || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Environment</span>
                <span className="value">{healthData?.server?.environment || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Port</span>
                <span className="value">{healthData?.server?.port || '-'}</span>
              </div>
            </div>
          </div>

          <div className="health-card">
            <div className="card-header">
              <h3>MongoDB</h3>
              <span className={`status-badge ${getStatusClass(healthData?.mongodb?.status)}`}>
                {getStatusIcon(healthData?.mongodb?.status)} {healthData?.mongodb?.status || 'Unknown'}
              </span>
            </div>
            <div className="card-details">
              <div className="detail-row">
                <span className="label">Storage Mode</span>
                <span className="value">{healthData?.mongodb?.storageMode || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Database</span>
                <span className="value">{healthData?.mongodb?.database || '-'}</span>
              </div>
              {healthData?.mongodb?.error && (
                <div className="detail-row error">
                  <span className="label">Error</span>
                  <span className="value">{healthData?.mongodb?.error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="health-card">
            <div className="card-header">
              <h3>Firebase</h3>
              <span className={`status-badge ${getStatusClass(healthData?.firebase?.status)}`}>
                {getStatusIcon(healthData?.firebase?.status)} {healthData?.firebase?.status || 'Unknown'}
              </span>
            </div>
            <div className="card-details">
              <div className="detail-row">
                <span className="label">Project ID</span>
                <span className="value">{healthData?.firebase?.projectId || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Auth Domain</span>
                <span className="value">{healthData?.firebase?.authDomain || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Admin SDK</span>
                <span className="value">{healthData?.firebase?.adminSdk || '-'}</span>
              </div>
            </div>
          </div>

          <div className="health-card">
            <div className="card-header">
              <h3>Stripe</h3>
              <span className={`status-badge ${getStatusClass(healthData?.stripe?.status)}`}>
                {getStatusIcon(healthData?.stripe?.status)} {healthData?.stripe?.status || 'Unknown'}
              </span>
            </div>
            <div className="card-details">
              <div className="detail-row">
                <span className="label">API Key</span>
                <span className="value">{healthData?.stripe?.configured ? 'Configured' : 'Not Set'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mode</span>
                <span className="value">{healthData?.stripe?.mode || '-'}</span>
              </div>
            </div>
          </div>

          <div className="health-card">
            <div className="card-header">
              <h3>Google Drive</h3>
              <span className={`status-badge ${getStatusClass(healthData?.googleDrive?.status)}`}>
                {getStatusIcon(healthData?.googleDrive?.status)} {healthData?.googleDrive?.status || 'Unknown'}
              </span>
            </div>
            <div className="card-details">
              <div className="detail-row">
                <span className="label">Credentials</span>
                <span className="value">{healthData?.googleDrive?.configured ? 'Configured' : 'Not Set'}</span>
              </div>
              {healthData?.googleDrive?.error && (
                <div className="detail-row error">
                  <span className="label">Error</span>
                  <span className="value">{healthData?.googleDrive?.error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="health-card">
            <div className="card-header">
              <h3>Google Maps</h3>
              <span className={`status-badge ${getStatusClass(healthData?.googleMaps?.status)}`}>
                {getStatusIcon(healthData?.googleMaps?.status)} {healthData?.googleMaps?.status || 'Unknown'}
              </span>
            </div>
            <div className="card-details">
              <div className="detail-row">
                <span className="label">API Key</span>
                <span className="value">{healthData?.googleMaps?.configured ? 'Configured' : 'Not Set'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="deployment-section">
        <h2>Production Deployment Readiness</h2>
        
        {healthData?.productionReadiness && (
          <div className="readiness-overview">
            <div className={`readiness-score ${healthData.productionReadiness.isDeployable ? 'deployable' : 'not-deployable'}`}>
              <div className="score-circle">
                <span className="score-value">{healthData.productionReadiness.score}%</span>
                <span className="score-label">Ready</span>
              </div>
              <div className="score-details">
                <div className="score-stat">
                  <span className="stat-value">{healthData.productionReadiness.passedChecks}/{healthData.productionReadiness.totalChecks}</span>
                  <span className="stat-label">Checks Passed</span>
                </div>
                <div className="score-stat">
                  <span className={`stat-value ${healthData.productionReadiness.criticalIssues > 0 ? 'critical' : ''}`}>
                    {healthData.productionReadiness.criticalIssues}
                  </span>
                  <span className="stat-label">Critical Issues</span>
                </div>
                <div className={`deploy-status ${healthData.productionReadiness.isDeployable ? 'ready' : 'not-ready'}`}>
                  {healthData.productionReadiness.isDeployable ? '✓ Ready to Deploy' : '✗ Fix Critical Issues'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="deployment-checks">
          {healthData?.deploymentChecks?.map((check, index) => (
            <div key={index} className={`deployment-check ${check.status}`}>
              <div className="check-header">
                <span className={`check-icon ${check.status}`}>
                  {check.status === 'ready' || check.status === 'production' ? '✓' : 
                   check.status === 'simulated' ? '○' : '✗'}
                </span>
                <span className="check-name">{check.name}</span>
                {check.critical && <span className="critical-badge">Critical</span>}
              </div>
              <p className="check-message">{check.message}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="health-card whatsapp-card">
        <div className="card-header">
          <h3>WhatsApp Business</h3>
          <span className={`status-badge ${getStatusClass(healthData?.whatsapp?.status)}`}>
            {getStatusIcon(healthData?.whatsapp?.status)} {healthData?.whatsapp?.status || 'Unknown'}
          </span>
        </div>
        <div className="card-details">
          <div className="detail-row">
            <span className="label">API Token</span>
            <span className="value">{healthData?.whatsapp?.configured ? 'Configured' : 'Not Set (Simulated)'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone Number ID</span>
            <span className="value">{healthData?.whatsapp?.phoneNumberId || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="label">AI Chatbot</span>
            <span className="value">{healthData?.whatsapp?.chatbotEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
      
      <div className="env-section">
        <h2>Environment Variables</h2>
        <div className="env-grid">
          {healthData?.envVars?.map((env) => (
            <div key={env.name} className={`env-item ${env.set ? 'set' : 'not-set'}`}>
              <span className="env-name">{env.name}</span>
              <span className={`env-status ${env.set ? 'configured' : 'missing'}`}>
                {env.set ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SystemHealthPage;
