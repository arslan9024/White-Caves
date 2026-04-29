import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AuroraTechnicalDashboard.css';

const AuroraTechnicalDashboard = () => {
  const auroraSlice = useSelector(state => state.aurora);
  const [activeTab, setActiveTab] = useState('health');
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/aurora/monitoring/health');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Sample data for charts
  const latencyTrend = [
    { time: '8:00 AM', api: 420, db: 35, avg: 428 },
    { time: '9:00 AM', api: 450, db: 42, avg: 456 },
    { time: '10:00 AM', api: 480, db: 48, avg: 488 },
    { time: '11:00 AM', api: 520, db: 55, avg: 530 },
    { time: '12:00 PM', api: 510, db: 52, avg: 520 },
    { time: '1:00 PM', api: 490, db: 48, avg: 498 },
    { time: '2:00 PM', api: 475, db: 45, avg: 482 },
    { time: '3:00 PM', api: 460, db: 42, avg: 467 }
  ];

  const errorRateTrend = [
    { time: '8:00 AM', rate: 0.3, threshold: 0.5 },
    { time: '9:00 AM', rate: 0.35, threshold: 0.5 },
    { time: '10:00 AM', rate: 0.4, threshold: 0.5 },
    { time: '11:00 AM', rate: 0.45, threshold: 0.5 },
    { time: '12:00 PM', rate: 0.4, threshold: 0.5 },
    { time: '1:00 PM', rate: 0.35, threshold: 0.5 },
    { time: '2:00 PM', rate: 0.3, threshold: 0.5 },
    { time: '3:00 PM', rate: 0.25, threshold: 0.5 }
  ];

  const serviceHealth = [
    { name: 'Healthy', value: 10, color: '#10b981' },
    { name: 'Degraded', value: 1, color: '#fb923c' }
  ];

  const concurrentUsersTrend = [
    { time: '8:00 AM', users: 25, capacity: 100 },
    { time: '9:00 AM', users: 30, capacity: 100 },
    { time: '10:00 AM', users: 35, capacity: 100 },
    { time: '11:00 AM', users: 40, capacity: 100 },
    { time: '12:00 PM', users: 45, capacity: 100 },
    { time: '1:00 PM', users: 50, capacity: 100 },
    { time: '2:00 PM', users: 55, capacity: 100 },
    { time: '3:00 PM', users: 65, capacity: 100 }
  ];

  const apiPerformance = [
    { endpoint: '/auth/login', latency: 180, errorRate: 0.2, throughput: 450 },
    { endpoint: '/properties', latency: 220, errorRate: 0.3, throughput: 380 },
    { endpoint: '/leads', latency: 150, errorRate: 0.1, throughput: 520 },
    { endpoint: '/viewings/schedule', latency: 200, errorRate: 0.2, throughput: 280 },
    { endpoint: '/negotiations/create', latency: 210, errorRate: 0.15, throughput: 150 },
    { endpoint: '/documents/upload', latency: 300, errorRate: 0.4, throughput: 80 },
    { endpoint: '/messages/send', latency: 120, errorRate: 0.1, throughput: 920 },
    { endpoint: '/analytics/reports', latency: 600, errorRate: 0.5, throughput: 45 },
    { endpoint: '/webauthn/verify', latency: 280, errorRate: 0.3, throughput: 200 },
    { endpoint: '/system/health', latency: 45, errorRate: 0.05, throughput: 2000 }
  ];

  const alerts = [
    { id: 'ALERT-001', severity: 'warning', service: 'Analytics Service', message: 'Report generation time >1s', timestamp: '14:32:15' },
    { id: 'ALERT-002', severity: 'info', service: 'MongoDB', message: 'Connection pool 70% utilized', timestamp: '14:25:42' }
  ];

  const services = [
    { name: 'Property Sourcing', status: 'healthy', latency: 120, errorRate: 0.1 },
    { name: 'Lead Management', status: 'healthy', latency: 95, errorRate: 0.05 },
    { name: 'Viewing Coordination', status: 'healthy', latency: 110, errorRate: 0.1 },
    { name: 'Negotiation Management', status: 'healthy', latency: 130, errorRate: 0.1 },
    { name: 'Document Management', status: 'healthy', latency: 150, errorRate: 0.2 },
    { name: 'Communication Service', status: 'healthy', latency: 100, errorRate: 0.05 },
    { name: 'Analytics Service', status: 'degraded', latency: 200, errorRate: 0.5 },
    { name: 'Authentication Service', status: 'healthy', latency: 80, errorRate: 0.05 },
    { name: 'API Gateway', status: 'healthy', latency: 50, errorRate: 0.02 },
    { name: 'WebAuthn Service', status: 'healthy', latency: 90, errorRate: 0.15 },
    { name: 'Session Management', status: 'healthy', latency: 70, errorRate: 0.03 }
  ];

  const renderHealthOverview = () => (
    <div className="aurora-health-grid">
      <section className="aurora-section">
        <h3>🟢 System Health Status</h3>
        <div className="health-summary">
          <div className="health-stat">
            <div className="stat-value">99.98%</div>
            <div className="stat-label">Uptime</div>
            <div className="stat-trend">↑ +0.05% vs target</div>
          </div>
          <div className="health-stat">
            <div className="stat-value">10/11</div>
            <div className="stat-label">Services Healthy</div>
            <div className="stat-trend">1 degraded (analytics)</div>
          </div>
          <div className="health-stat">
            <div className="stat-value">2</div>
            <div className="stat-label">Active Alerts</div>
            <div className="stat-trend">1 warning, 1 info</div>
          </div>
          <div className="health-stat">
            <div className="stat-value">460ms</div>
            <div className="stat-label">Avg API Latency</div>
            <div className="stat-trend">↓ 40ms below threshold</div>
          </div>
        </div>
      </section>

      <section className="aurora-section">
        <h3>📊 API Latency Trend (p95)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latencyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #10b981' }} />
            <Legend />
            <Line type="monotone" dataKey="api" stroke="#dc2626" strokeWidth={2} name="API Latency (ms)" />
            <Line type="monotone" dataKey="db" stroke="#10b981" strokeWidth={2} name="DB Latency (ms)" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="aurora-section">
        <h3>📈 Error Rate Trend (Target: &lt;0.5%)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={errorRateTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #10b981' }} />
            <Area type="monotone" dataKey="rate" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" name="Error Rate %" />
            <Line type="stepAfter" dataKey="threshold" stroke="#10b981" strokeDasharray="5 5" name="Threshold" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="aurora-section">
        <h3>👥 Concurrent Users vs Capacity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={concurrentUsersTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #10b981' }} />
            <Area type="monotone" dataKey="capacity" fill="rgba(255, 255, 255, 0.05)" stroke="#888" name="Capacity" />
            <Area type="monotone" dataKey="users" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth={2} name="Active Users" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="aurora-section">
        <h3>🔍 Service Health Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={serviceHealth} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
              {serviceHealth.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #10b981' }} />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );

  const renderServices = () => (
    <section className="aurora-section">
      <h3>🔧 Service Health Details</h3>
      <div className="services-table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Status</th>
              <th>Avg Latency</th>
              <th>Error Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc, idx) => (
              <tr key={idx} className={`status-${svc.status}`}>
                <td className="service-name">{svc.name}</td>
                <td>
                  <span className={`status-badge status-${svc.status}`}>
                    {svc.status === 'healthy' ? '✓ Healthy' : '⚠ Degraded'}
                  </span>
                </td>
                <td>{svc.latency}ms</td>
                <td className={`error-rate ${svc.errorRate > 0.3 ? 'high' : 'low'}`}>{(svc.errorRate * 100).toFixed(2)}%</td>
                <td>
                  <button className="action-btn">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderAPIs = () => (
    <section className="aurora-section">
      <h3>📡 API Endpoint Performance</h3>
      <div className="apis-table-wrapper">
        <table className="apis-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>p50 Latency</th>
              <th>Error Rate</th>
              <th>Throughput (req/s)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {apiPerformance.map((api, idx) => {
              const isAboveThreshold = api.latency > 500;
              return (
                <tr key={idx} className={isAboveThreshold ? 'warning' : 'healthy'}>
                  <td className="endpoint-name">{api.endpoint}</td>
                  <td className={isAboveThreshold ? 'alert' : ''}>{api.latency}ms</td>
                  <td className={api.errorRate > 0.3 ? 'alert' : ''}>{(api.errorRate * 100).toFixed(1)}%</td>
                  <td>{api.throughput}</td>
                  <td>
                    <span className={`perf-badge ${isAboveThreshold ? 'warning' : 'healthy'}`}>
                      {isAboveThreshold ? '⚠ Slow' : '✓ Fast'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderAlerts = () => (
    <section className="aurora-section">
      <h3>🚨 Active Alerts</h3>
      {alerts.length === 0 ? (
        <div className="no-alerts">
          <p>✓ No active alerts</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`alert-item severity-${alert.severity}`}>
              <div className="alert-header">
                <span className="alert-id">{alert.id}</span>
                <span className={`severity-badge ${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                <span className="alert-time">{alert.timestamp}</span>
              </div>
              <div className="alert-service">{alert.service}</div>
              <div className="alert-message">{alert.message}</div>
              <button className="dismiss-btn">Acknowledge</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="aurora-technical-dashboard">
      <header className="aurora-header">
        <div className="aurora-title">
          <h1>🤖 Aurora's Technical Monitoring Dashboard</h1>
          <p>Real-Time System Health & Performance Tracking (Wednesday, Jan 22)</p>
        </div>
        <div className="aurora-controls">
          <select 
            value={refreshInterval} 
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            className="refresh-select"
          >
            <option value={5000}>Refresh: 5s</option>
            <option value={10000}>Refresh: 10s</option>
            <option value={30000}>Refresh: 30s</option>
          </select>
          <span className="last-update">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <nav className="aurora-nav">
        <button 
          className={`nav-btn ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          🟢 Health Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          🔧 Services ({services.filter(s => s.status === 'healthy').length}/{services.length})
        </button>
        <button 
          className={`nav-btn ${activeTab === 'apis' ? 'active' : ''}`}
          onClick={() => setActiveTab('apis')}
        >
          📡 API Endpoints
        </button>
        <button 
          className={`nav-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts ({alerts.filter(a => a.severity === 'critical').length})
        </button>
      </nav>

      <main className="aurora-content">
        {activeTab === 'health' && renderHealthOverview()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'apis' && renderAPIs()}
        {activeTab === 'alerts' && renderAlerts()}
      </main>

      <footer className="aurora-footer">
        <p>Aurora's Technical Authority: Real-time monitoring, performance analysis, and infrastructure optimization</p>
      </footer>
    </div>
  );
};

export default AuroraTechnicalDashboard;
