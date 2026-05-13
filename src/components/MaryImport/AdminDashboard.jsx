import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/authFetch';
import './AdminDashboard.css';

/**
 * AdminDashboard Component
 * Comprehensive admin panel for monitoring imports, system health, and user analytics
 */
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchSystemHealth();

    const interval = setInterval(() => {
      fetchDashboardData();
      fetchSystemHealth();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      const response = await authFetch(`/api/admin/dashboard?period=${selectedPeriod}`);
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const response = await authFetch('/api/admin/system-health');
      const result = await response.json();
      if (result.success) {
        setSystemHealth(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  if (isLoading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🎛️ Admin Dashboard</h1>
        <div className="header-controls">
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="btn btn-primary" onClick={fetchDashboardData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* System Health Section */}
      {systemHealth && <SystemHealthSection health={systemHealth} />}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeView === 'imports' ? 'active' : ''}`}
          onClick={() => setActiveView('imports')}
        >
          📥 Import Monitoring
        </button>
        <button
          className={`tab ${activeView === 'users' ? 'active' : ''}`}
          onClick={() => setActiveView('users')}
        >
          👥 Users & Activity
        </button>
        <button
          className={`tab ${activeView === 'database' ? 'active' : ''}`}
          onClick={() => setActiveView('database')}
        >
          💾 Database Stats
        </button>
        <button
          className={`tab ${activeView === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveView('alerts')}
        >
          🚨 Alerts & Logs
        </button>
      </div>

      {/* Tab Contents */}
      <div className="dashboard-content">
        {activeView === 'overview' && dashboardData && <OverviewTab data={dashboardData} />}
        {activeView === 'imports' && dashboardData && <ImportsTab data={dashboardData} />}
        {activeView === 'users' && dashboardData && <UsersTab data={dashboardData} />}
        {activeView === 'database' && dashboardData && <DatabaseTab data={dashboardData} />}
        {activeView === 'alerts' && dashboardData && <AlertsTab data={dashboardData} />}
      </div>
    </div>
  );
};

/**
 * System Health Section
 */
const SystemHealthSection = ({ health }) => {
  const getHealthColor = percentage => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  return (
    <div className="system-health">
      <h3>System Health</h3>
      <div className="health-grid">
        <HealthCard
          label="Server Status"
          status={health.serverStatus}
          uptime={health.uptime}
          color={health.serverStatus === 'healthy' ? 'success' : 'error'}
        />
        <HealthCard
          label="Database"
          percentage={health.databaseHealth}
          color={getHealthColor(health.databaseHealth)}
        />
        <HealthCard
          label="API Performance"
          percentage={health.apiPerformance}
          color={getHealthColor(health.apiPerformance)}
        />
        <HealthCard
          label="Storage"
          percentage={health.storageUsage}
          color={getHealthColor(100 - health.storageUsage)}
        />
      </div>
    </div>
  );
};

const HealthCard = ({ label, status, uptime, percentage, color }) => {
  return (
    <div className={`health-card ${color}`}>
      <div className="health-label">{label}</div>
      {status && (
        <div className="health-status">
          <span className="status-badge">{status}</span>
          {uptime && <span className="uptime">{uptime}</span>}
        </div>
      )}
      {percentage !== undefined && (
        <div className="health-meter">
          <div className="meter-fill" style={{ width: `${percentage}%` }} />
        </div>
      )}
      {percentage !== undefined && <div className="percentage">{percentage.toFixed(1)}%</div>}
    </div>
  );
};

/**
 * Overview Tab
 */
const OverviewTab = ({ data }) => {
  return (
    <div className="overview-section">
      <div className="metrics-grid">
        <MetricCard
          icon="📥"
          label="Total Imports"
          value={data.totalImports}
          change={data.importsChange}
        />
        <MetricCard
          icon="✅"
          label="Successful Imports"
          value={data.successfulImports}
          change={data.successfulChange}
        />
        <MetricCard
          icon="❌"
          label="Failed Imports"
          value={data.failedImports}
          change={data.failedChange}
          negative
        />
        <MetricCard
          icon="📊"
          label="Success Rate"
          value={`${data.successRate}%`}
          change={data.successRateChange}
        />
        <MetricCard
          icon="📝"
          label="Properties Created"
          value={data.propertiesCreated.toLocaleString()}
          change={data.propertiesChange}
        />
        <MetricCard
          icon="👤"
          label="Owners Created"
          value={data.ownersCreated.toLocaleString()}
          change={data.ownersChange}
        />
        <MetricCard
          icon="⏱️"
          label="Avg Import Duration"
          value={data.avgDuration}
          change={data.durationChange}
        />
        <MetricCard
          icon="🔄"
          label="Active Imports"
          value={data.activeImports}
          change={data.activeChange}
        />
      </div>

      <div className="charts-grid">
        <ChartCard title="Import Trend (Last 7 Days)" data={data.importTrend} type="line" />
        <ChartCard title="Status Distribution" data={data.statusDistribution} type="pie" />
        <ChartCard title="Import Size Distribution" data={data.sizeDistribution} type="bar" />
        <ChartCard title="Hourly Activity" data={data.hourlyActivity} type="area" />
      </div>
    </div>
  );
};

/**
 * Imports Tab
 */
const ImportsTab = ({ data }) => {
  const [expandedSession, setExpandedSession] = useState(null);

  return (
    <div className="imports-section">
      <div className="section-header">
        <h3>Recent Import Sessions</h3>
        <button className="btn btn-secondary">📥 Export All Reports</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>File</th>
            <th>User</th>
            <th>Status</th>
            <th>Rows</th>
            <th>Success Rate</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.recentImports?.map(imp => (
            <React.Fragment key={imp.sessionId}>
              <tr className={`import-row ${imp.status}`}>
                <td className="code">{imp.sessionId.substring(0, 8)}...</td>
                <td>{imp.fileName}</td>
                <td>{imp.importedBy}</td>
                <td>
                  <span className={`status-badge ${imp.status}`}>{imp.status}</span>
                </td>
                <td>{imp.totalRows}</td>
                <td>
                  <div className="rate-mini">
                    <div className="rate-fill" style={{ width: `${imp.successRate}%` }} />
                  </div>
                  {imp.successRate}%
                </td>
                <td>{new Date(imp.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="btn-icon"
                    onClick={() =>
                      setExpandedSession(expandedSession === imp.sessionId ? null : imp.sessionId)
                    }
                  >
                    {expandedSession === imp.sessionId ? '▼' : '▶'}
                  </button>
                  <button className="btn-icon" title="View Report">
                    📊
                  </button>
                </td>
              </tr>
              {expandedSession === imp.sessionId && (
                <tr className="expanded-row">
                  <td colSpan="8">
                    <SessionDetails session={imp} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SessionDetails = ({ session }) => {
  return (
    <div className="session-details">
      <div className="details-grid">
        <DetailItem label="Session ID" value={session.sessionId} />
        <DetailItem label="Properties Created" value={session.propertiesCreated} />
        <DetailItem label="Properties Updated" value={session.propertiesUpdated} />
        <DetailItem label="Owners Created" value={session.ownersCreated} />
        <DetailItem label="Owners Updated" value={session.ownersUpdated} />
        <DetailItem label="Duplicates Found" value={session.duplicatesFound} />
        <DetailItem label="Errors" value={session.totalErrors} />
        <DetailItem label="Warnings" value={session.totalWarnings} />
      </div>
    </div>
  );
};

/**
 * Users Tab
 */
const UsersTab = ({ data }) => {
  return (
    <div className="users-section">
      <div className="section-header">
        <h3>User Activity</h3>
        <button className="btn btn-secondary">👥 Export User List</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Imports</th>
            <th>Total Rows</th>
            <th>Success Rate</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {data.activeUsers?.map(user => (
            <tr key={user.id}>
              <td className="user-name">{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className="role-badge">{user.role}</span>
              </td>
              <td>{user.importCount}</td>
              <td>{user.totalRows.toLocaleString()}</td>
              <td>{user.successRate}%</td>
              <td>{formatTimeAgo(user.lastActive)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Database Tab
 */
const DatabaseTab = ({ data }) => {
  return (
    <div className="database-section">
      <div className="section-header">
        <h3>Database Statistics</h3>
        <button className="btn btn-secondary">🔄 Run Optimization</button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Properties"
          value={data.totalProperties?.toLocaleString()}
          icon="🏠"
        />
        <StatCard label="Total Owners" value={data.totalOwners?.toLocaleString()} icon="👤" />
        <StatCard
          label="Total Relationships"
          value={data.totalRelationships?.toLocaleString()}
          icon="🔗"
        />
        <StatCard label="Database Size" value={data.databaseSize} icon="💾" />
      </div>

      <div className="collections-info">
        <h4>Collection Statistics</h4>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Collection</th>
              <th>Documents</th>
              <th>Size</th>
              <th>Avg Doc Size</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.collections?.map(col => (
              <tr key={col.name}>
                <td className="code">{col.name}</td>
                <td>{col.documentCount}</td>
                <td>{col.size}</td>
                <td>{col.avgSize}</td>
                <td>{new Date(col.lastUpdated).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Alerts Tab
 */
const AlertsTab = ({ data }) => {
  const [alertFilter, setAlertFilter] = useState('all');

  const filteredAlerts = data.alerts?.filter(alert => {
    if (alertFilter === 'all') return true;
    return alert.severity === alertFilter;
  });

  return (
    <div className="alerts-section">
      <div className="section-header">
        <h3>System Alerts & Logs</h3>
        <select
          value={alertFilter}
          onChange={e => setAlertFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Alerts</option>
          <option value="critical">🔴 Critical</option>
          <option value="warning">🟡 Warning</option>
          <option value="info">🔵 Info</option>
        </select>
      </div>

      <div className="alerts-list">
        {filteredAlerts?.map(alert => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};

const AlertItem = ({ alert }) => {
  const getSeverityIcon = severity => {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <div className={`alert-item ${alert.severity}`}>
      <div className="alert-header">
        <span className="severity">
          {getSeverityIcon(alert.severity)} {alert.severity}
        </span>
        <span className="time">{formatTimeAgo(alert.timestamp)}</span>
      </div>
      <div className="alert-message">{alert.message}</div>
      {alert.details && <div className="alert-details">{alert.details}</div>}
    </div>
  );
};

/**
 * Helper Components
 */

const MetricCard = ({ icon, label, value, change, negative }) => {
  const changeClass =
    (change > 0 && !negative) || (change < 0 && negative) ? 'positive' : 'negative';
  const changeSymbol = change > 0 ? '↑' : '↓';

  return (
    <div className="metric-card">
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
      </div>
      <div className="metric-value">{value}</div>
      {change !== undefined && (
        <div className={`metric-change ${changeClass}`}>
          {changeSymbol} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
};

const ChartCard = ({ title, data, type }) => {
  return (
    <div className="chart-card">
      <h4>{title}</h4>
      <div className="chart-placeholder">
        <p>Chart Type: {type}</p>
        <p>Data points: {data?.length || 0}</p>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

/**
 * Utility Functions
 */

function formatTimeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString();
}

export default AdminDashboard;
