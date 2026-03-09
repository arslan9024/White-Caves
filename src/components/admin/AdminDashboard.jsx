import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Users, Settings, Activity, TrendingUp, AlertCircle, BarChart3,
  Home, Clock, CheckCircle, XCircle, ChevronRight, Filter, Download
} from 'lucide-react';
import './AdminDashboard.css';

/**
 * AdminDashboard Component
 * 
 * Comprehensive admin control panel for super user (lion role)
 * Features:
 * - System health monitoring
 * - User management
 * - Activity tracking
 * - Analytics overview
 * - System settings
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterPeriod, setFilterPeriod] = useState('7d');
  
  // Get user info from Redux
  const user = useSelector(state => state.auth?.user);
  const userRole = useSelector(state => state.auth?.role);

  // Mock data - replace with real API calls
  const systemMetrics = {
    totalUsers: 1243,
    activeUsers: 567,
    totalProperties: 3421,
    activeListings: 892,
    totalTransactions: 5234,
    completedTransactions: 4891,
    systemHealth: 'excellent',
    uptime: 99.98,
    responseTime: 142,
    errorRate: 0.02
  };

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new property listing', time: '2 hours ago', type: 'create' },
    { id: 2, user: 'Jane Smith', action: 'Updated commission settings', time: '4 hours ago', type: 'update' },
    { id: 3, user: 'Ahmed Hassan', action: 'Generated performance report', time: '6 hours ago', type: 'download' },
    { id: 4, user: 'System', action: 'Automated backup completed', time: '8 hours ago', type: 'system' },
  ];

  const alerts = [
    { id: 1, severity: 'warning', message: 'High CPU usage detected', status: 'active' },
    { id: 2, severity: 'info', message: 'Database backup scheduled', status: 'pending' },
  ];

  const renderOverviewTab = () => (
    <div className="admin-overview">
      <div className="metrics-grid">
        {/* Users Metrics */}
        <div className="metric-card users-card">
          <div className="metric-header">
            <Users size={24} />
            <span className="metric-title">Total Users</span>
          </div>
          <div className="metric-value">{systemMetrics.totalUsers}</div>
          <div className="metric-subtext">{systemMetrics.activeUsers} active</div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill users-fill" 
              style={{ width: `${(systemMetrics.activeUsers / systemMetrics.totalUsers) * 100}%` }}
            />
          </div>
        </div>

        {/* Properties Metrics */}
        <div className="metric-card properties-card">
          <div className="metric-header">
            <Home size={24} />
            <span className="metric-title">Properties</span>
          </div>
          <div className="metric-value">{systemMetrics.totalProperties}</div>
          <div className="metric-subtext">{systemMetrics.activeListings} active listings</div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill properties-fill" 
              style={{ width: `${(systemMetrics.activeListings / systemMetrics.totalProperties) * 100}%` }}
            />
          </div>
        </div>

        {/* Transactions Metrics */}
        <div className="metric-card transactions-card">
          <div className="metric-header">
            <TrendingUp size={24} />
            <span className="metric-title">Transactions</span>
          </div>
          <div className="metric-value">{systemMetrics.totalTransactions}</div>
          <div className="metric-subtext">{systemMetrics.completedTransactions} completed</div>
          <div className="metric-bar">
            <div 
              className="metric-bar-fill transactions-fill" 
              style={{ width: `${(systemMetrics.completedTransactions / systemMetrics.totalTransactions) * 100}%` }}
            />
          </div>
        </div>

        {/* System Health */}
        <div className="metric-card health-card">
          <div className="metric-header">
            <Activity size={24} />
            <span className="metric-title">System Health</span>
          </div>
          <div className={`metric-status ${systemMetrics.systemHealth}`}>
            {systemMetrics.systemHealth.toUpperCase()}
          </div>
          <div className="metric-details">
            <div className="detail-item">
              <span>Uptime:</span>
              <span className="detail-value">{systemMetrics.uptime}%</span>
            </div>
            <div className="detail-item">
              <span>Response:</span>
              <span className="detail-value">{systemMetrics.responseTime}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <div className="section-header">
            <AlertCircle size={20} />
            <h3>Active Alerts</h3>
          </div>
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                <div className="alert-content">
                  <span className="alert-message">{alert.message}</span>
                  <span className={`alert-status status-${alert.status}`}>{alert.status}</span>
                </div>
                <ChevronRight size={18} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="activity-section">
        <div className="section-header">
          <Clock size={20} />
          <h3>Recent Activity</h3>
          <button className="header-action">
            <Filter size={16} />
          </button>
        </div>
        <div className="activities-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon activity-${activity.type}`}>
                {activity.type === 'create' && <CheckCircle size={16} />}
                {activity.type === 'update' && <Settings size={16} />}
                {activity.type === 'download' && <Download size={16} />}
                {activity.type === 'system' && <Activity size={16} />}
              </div>
              <div className="activity-content">
                <div className="activity-user">{activity.user}</div>
                <div className="activity-action">{activity.action}</div>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="admin-users">
      <div className="section-header">
        <Users size={20} />
        <h3>User Management</h3>
        <button className="btn-primary">+ Add User</button>
      </div>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td><span className="role-badge role-agent">Agent</span></td>
              <td><span className="status-badge status-active">Active</span></td>
              <td>2 hours ago</td>
              <td>
                <button className="action-btn">Edit</button>
                <button className="action-btn danger">Remove</button>
              </td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td><span className="role-badge role-admin">Admin</span></td>
              <td><span className="status-badge status-active">Active</span></td>
              <td>1 hour ago</td>
              <td>
                <button className="action-btn">Edit</button>
                <button className="action-btn">Suspend</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="admin-settings">
      <div className="section-header">
        <Settings size={20} />
        <h3>System Settings</h3>
      </div>
      
      <div className="settings-groups">
        <div className="settings-group">
          <h4>General Settings</h4>
          <div className="setting-item">
            <label>Platform Name</label>
            <input type="text" defaultValue="White Caves" />
          </div>
          <div className="setting-item">
            <label>Support Email</label>
            <input type="email" defaultValue="support@whitecaves.ae" />
          </div>
        </div>

        <div className="settings-group">
          <h4>Performance Settings</h4>
          <div className="setting-item">
            <label>Cache Enabled</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Auto-backup Interval (hours)</label>
            <input type="number" defaultValue="24" />
          </div>
        </div>

        <div className="settings-group">
          <h4>Security Settings</h4>
          <div className="setting-item">
            <label>Two-Factor Authentication</label>
            <select defaultValue="enabled">
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Session Timeout (minutes)</label>
            <input type="number" defaultValue="30" />
          </div>
        </div>

        <button className="btn-primary btn-save">Save Settings</button>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="admin-analytics">
      <div className="section-header">
        <BarChart3 size={20} />
        <h3>Analytics & Reports</h3>
        <select 
          className="filter-select" 
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h4>User Growth Trend</h4>
          <div className="chart-placeholder">
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '75%' }}></div>
            <div className="chart-bar" style={{ height: '85%' }}></div>
            <div className="chart-bar" style={{ height: '95%' }}></div>
            <div className="chart-bar" style={{ height: '100%' }}></div>
          </div>
        </div>

        <div className="chart-container">
          <h4>Transaction Volume</h4>
          <div className="chart-placeholder">
            <div className="chart-bar" style={{ height: '70%' }}></div>
            <div className="chart-bar" style={{ height: '80%' }}></div>
            <div className="chart-bar" style={{ height: '65%' }}></div>
            <div className="chart-bar" style={{ height: '85%' }}></div>
            <div className="chart-bar" style={{ height: '90%' }}></div>
          </div>
        </div>
      </div>

      <div className="report-actions">
        <button className="btn-secondary">
          <Download size={18} />
          Export Report
        </button>
        <button className="btn-secondary">
          <BarChart3 size={18} />
          Full Analytics
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Dashboard</h1>
          <p>Platform management and monitoring</p>
        </div>
        <div className="admin-user-info">
          <span className="user-name">{user?.displayName || 'Admin'}</span>
          <span className="user-role">Super User</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={20} />
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={20} />
          Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default AdminDashboard;
