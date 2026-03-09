import React, { useState, useMemo } from 'react';
import {
  Database, Server, Activity, Wifi, Shield, Zap,
  BarChart3, TrendingUp, TrendingDown, CheckCircle,
  AlertTriangle, Clock, RefreshCw, Box, Code, Cpu,
  HardDrive, Network, Lock, GitBranch, Terminal
} from 'lucide-react';
import './AssistantDashboard.css';

const API_ENDPOINTS = [
  { path: '/api/properties', method: 'GET', avgTime: 125, successRate: 99.8, calls: 15420, cached: true },
  { path: '/api/leads', method: 'POST', avgTime: 89, successRate: 99.9, calls: 8934, cached: false },
  { path: '/api/whatsapp/send', method: 'POST', avgTime: 245, successRate: 98.5, calls: 12567, cached: false },
  { path: '/api/payments/process', method: 'POST', avgTime: 312, successRate: 99.7, calls: 3421, cached: false },
  { path: '/api/users/auth', method: 'POST', avgTime: 156, successRate: 99.95, calls: 28934, cached: true },
  { path: '/api/inventory', method: 'GET', avgTime: 178, successRate: 99.6, calls: 9823, cached: true },
  { path: '/api/analytics', method: 'GET', avgTime: 234, successRate: 99.4, calls: 4521, cached: true }
];

const DATABASE_METRICS = {
  connections: { current: 12, max: 100, available: 88 },
  queryPerformance: { avgTime: 45, slowQueries: 3, indexHits: 98.2 },
  storage: { used: 2.4, total: 10, percentage: 24 },
  operations: { reads: 45230, writes: 12450, updates: 8920, deletes: 1230 }
};

const CACHE_STATS = {
  hitRate: 94.5,
  missRate: 5.5,
  totalHits: 234567,
  totalMisses: 13245,
  memoryUsed: 512,
  memoryTotal: 1024,
  ttlAvg: 3600
};

const SECURITY_CHECKS = [
  { name: 'SSL/TLS Configuration', status: 'pass', lastCheck: '2 hours ago' },
  { name: 'JWT Token Validation', status: 'pass', lastCheck: '1 hour ago' },
  { name: 'Rate Limiting', status: 'pass', lastCheck: '30 mins ago' },
  { name: 'Input Sanitization', status: 'pass', lastCheck: '1 hour ago' },
  { name: 'CORS Policy', status: 'warning', lastCheck: '2 hours ago' },
  { name: 'SQL Injection Prevention', status: 'pass', lastCheck: '1 hour ago' }
];

const REALTIME_CONNECTIONS = [
  { type: 'WebSocket', active: 45, peak: 120, status: 'healthy' },
  { type: 'Server-Sent Events', active: 23, peak: 56, status: 'healthy' },
  { type: 'Long Polling', active: 12, peak: 34, status: 'degraded' }
];

const WillowBackendCRM = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');

  const apiStats = useMemo(() => ({
    totalCalls: API_ENDPOINTS.reduce((sum, e) => sum + e.calls, 0),
    avgResponseTime: Math.round(API_ENDPOINTS.reduce((sum, e) => sum + e.avgTime, 0) / API_ENDPOINTS.length),
    avgSuccessRate: (API_ENDPOINTS.reduce((sum, e) => sum + e.successRate, 0) / API_ENDPOINTS.length).toFixed(2),
    cachedEndpoints: API_ENDPOINTS.filter(e => e.cached).length
  }), []);

  return (
    <div className="assistant-dashboard willow">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)' }}>
          <Database size={28} />
        </div>
        <div className="assistant-info">
          <h2>Willow - Elite Backend Engineer</h2>
          <p>API performance, database optimization, and system reliability</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' }}>
            <Server size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{API_ENDPOINTS.length}</span>
            <span className="stat-label">API Endpoints</span>
          </div>
          <span className="stat-change positive">{apiStats.cachedEndpoints} cached</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}>
            <Zap size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{apiStats.avgResponseTime}ms</span>
            <span className="stat-label">Avg Response</span>
          </div>
          <span className="stat-change positive">-12ms</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Activity size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{apiStats.avgSuccessRate}%</span>
            <span className="stat-label">Success Rate</span>
          </div>
          <span className="stat-change positive">+0.2%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <Database size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{DATABASE_METRICS.connections.current}</span>
            <span className="stat-label">DB Connections</span>
          </div>
        </div>
      </div>

      <div className="assistant-tabs">
        {['overview', 'apis', 'database', 'caching', 'security', 'realtime'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && <BarChart3 size={14} />}
            {tab === 'apis' && <Server size={14} />}
            {tab === 'database' && <Database size={14} />}
            {tab === 'caching' && <Zap size={14} />}
            {tab === 'security' && <Shield size={14} />}
            {tab === 'realtime' && <Wifi size={14} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="overview-section">
              <h3><Server size={16} /> API Health</h3>
              <div className="health-metrics">
                <div className="health-item">
                  <span>Total Calls (24h)</span>
                  <span className="value">{apiStats.totalCalls.toLocaleString()}</span>
                </div>
                <div className="health-item">
                  <span>Avg Response Time</span>
                  <span className="value">{apiStats.avgResponseTime}ms</span>
                </div>
                <div className="health-item">
                  <span>Success Rate</span>
                  <span className="value success">{apiStats.avgSuccessRate}%</span>
                </div>
              </div>
            </div>
            <div className="overview-section">
              <h3><Database size={16} /> Database Status</h3>
              <div className="health-metrics">
                <div className="health-item">
                  <span>Active Connections</span>
                  <span className="value">{DATABASE_METRICS.connections.current}/{DATABASE_METRICS.connections.max}</span>
                </div>
                <div className="health-item">
                  <span>Index Hit Rate</span>
                  <span className="value success">{DATABASE_METRICS.queryPerformance.indexHits}%</span>
                </div>
                <div className="health-item">
                  <span>Storage Used</span>
                  <span className="value">{DATABASE_METRICS.storage.percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apis' && (
          <div className="apis-view">
            <div className="apis-header">
              <h3>API Endpoints Performance</h3>
              <div className="time-range-selector">
                {['1h', '24h', '7d', '30d'].map(range => (
                  <button
                    key={range}
                    className={timeRange === range ? 'active' : ''}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="api-list">
              {API_ENDPOINTS.map(api => (
                <div key={api.path} className="api-card">
                  <div className="api-header">
                    <span className={`method-badge ${api.method.toLowerCase()}`}>{api.method}</span>
                    <span className="api-path">{api.path}</span>
                    {api.cached && <span className="cached-badge"><Zap size={12} /> Cached</span>}
                  </div>
                  <div className="api-metrics">
                    <div className="metric">
                      <Clock size={14} />
                      <span>{api.avgTime}ms</span>
                    </div>
                    <div className="metric">
                      <CheckCircle size={14} />
                      <span>{api.successRate}%</span>
                    </div>
                    <div className="metric">
                      <Activity size={14} />
                      <span>{api.calls.toLocaleString()} calls</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="database-view">
            <div className="db-section">
              <h3><Network size={16} /> Connection Pool</h3>
              <div className="connection-stats">
                <div className="pool-bar">
                  <div 
                    className="pool-used" 
                    style={{ width: `${(DATABASE_METRICS.connections.current / DATABASE_METRICS.connections.max) * 100}%` }}
                  ></div>
                </div>
                <div className="pool-info">
                  <span>Active: {DATABASE_METRICS.connections.current}</span>
                  <span>Available: {DATABASE_METRICS.connections.available}</span>
                  <span>Max: {DATABASE_METRICS.connections.max}</span>
                </div>
              </div>
            </div>
            <div className="db-section">
              <h3><BarChart3 size={16} /> Query Performance</h3>
              <div className="query-stats">
                <div className="stat-box">
                  <span className="label">Avg Query Time</span>
                  <span className="value">{DATABASE_METRICS.queryPerformance.avgTime}ms</span>
                </div>
                <div className="stat-box">
                  <span className="label">Slow Queries</span>
                  <span className="value warning">{DATABASE_METRICS.queryPerformance.slowQueries}</span>
                </div>
                <div className="stat-box">
                  <span className="label">Index Hits</span>
                  <span className="value success">{DATABASE_METRICS.queryPerformance.indexHits}%</span>
                </div>
              </div>
            </div>
            <div className="db-section">
              <h3><HardDrive size={16} /> Operations Summary</h3>
              <div className="operations-grid">
                <div className="op-card reads"><span>Reads</span><span>{DATABASE_METRICS.operations.reads.toLocaleString()}</span></div>
                <div className="op-card writes"><span>Writes</span><span>{DATABASE_METRICS.operations.writes.toLocaleString()}</span></div>
                <div className="op-card updates"><span>Updates</span><span>{DATABASE_METRICS.operations.updates.toLocaleString()}</span></div>
                <div className="op-card deletes"><span>Deletes</span><span>{DATABASE_METRICS.operations.deletes.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'caching' && (
          <div className="caching-view">
            <h3><Zap size={16} /> Cache Performance</h3>
            <div className="cache-stats">
              <div className="cache-card highlight">
                <span className="label">Hit Rate</span>
                <span className="value success">{CACHE_STATS.hitRate}%</span>
              </div>
              <div className="cache-card">
                <span className="label">Miss Rate</span>
                <span className="value">{CACHE_STATS.missRate}%</span>
              </div>
              <div className="cache-card">
                <span className="label">Total Hits</span>
                <span className="value">{CACHE_STATS.totalHits.toLocaleString()}</span>
              </div>
              <div className="cache-card">
                <span className="label">Memory Used</span>
                <span className="value">{CACHE_STATS.memoryUsed}MB / {CACHE_STATS.memoryTotal}MB</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-view">
            <h3><Shield size={16} /> Security Checks</h3>
            <div className="security-list">
              {SECURITY_CHECKS.map(check => (
                <div key={check.name} className={`security-card ${check.status}`}>
                  <div className="check-status">
                    {check.status === 'pass' && <CheckCircle size={18} />}
                    {check.status === 'warning' && <AlertTriangle size={18} />}
                  </div>
                  <div className="check-info">
                    <span className="check-name">{check.name}</span>
                    <span className="check-time">Last check: {check.lastCheck}</span>
                  </div>
                  <span className={`status-badge ${check.status}`}>{check.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'realtime' && (
          <div className="realtime-view">
            <h3><Wifi size={16} /> Real-time Connections</h3>
            <div className="realtime-grid">
              {REALTIME_CONNECTIONS.map(conn => (
                <div key={conn.type} className={`realtime-card ${conn.status}`}>
                  <div className="conn-header">
                    <Wifi size={18} />
                    <span className="conn-type">{conn.type}</span>
                    <span className={`status-indicator ${conn.status}`}></span>
                  </div>
                  <div className="conn-stats">
                    <div className="stat">
                      <span className="label">Active</span>
                      <span className="value">{conn.active}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Peak</span>
                      <span className="value">{conn.peak}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WillowBackendCRM;
