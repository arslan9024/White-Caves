import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SystemHealthPage.css';

function SystemHealthPage() {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system/health');
      const data = await response.json();
      setHealthData(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthData({ error: 'Failed to fetch health status' });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

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
        <button className="btn-refresh" onClick={checkHealth} disabled={loading}>
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      {lastChecked && (
        <p className="last-checked">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}

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
