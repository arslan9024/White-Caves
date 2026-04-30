import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createLogger } from '../../utils/logger';
import type { RootState } from '../../store/store';
import {
  Users, Settings, Activity, TrendingUp, AlertCircle, BarChart3,
  Clock, CheckCircle, Download
} from 'lucide-react';
import { Alert, Pagination } from '../../components/ui';
import * as S from './AdminDashboard.styles';

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
  const [currentActivityPage, setCurrentActivityPage] = useState(1);
  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [activitiesPerPage] = useState(5);
  const [usersPerPage] = useState(10);
  
  // Get user info from Redux
  const user = useSelector((state: RootState) => state.auth?.user);

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

  const users = [
    {
      id: 1,
      name: 'John Doe',
      role: 'agent',
      status: 'active',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'admin',
      status: 'active',
      lastActive: '1 hour ago'
    },
    {
      id: 3,
      name: 'Ahmed Hassan',
      role: 'agent',
      status: 'inactive',
      lastActive: '3 days ago'
    },
  ];

  // Pagination logic for activities (MUST be after data declarations)
  const activitiesStartIdx = (currentActivityPage - 1) * activitiesPerPage;
  const activitiesEndIdx = activitiesStartIdx + activitiesPerPage;
  const paginatedActivities = recentActivities.slice(activitiesStartIdx, activitiesEndIdx);
  const activitiesTotalPages = Math.ceil(recentActivities.length / activitiesPerPage);

  // Pagination logic for users (MUST be after data declarations)
  const usersStartIdx = (currentUsersPage - 1) * usersPerPage;
  const usersEndIdx = usersStartIdx + usersPerPage;
  const paginatedUsers = users.slice(usersStartIdx, usersEndIdx);
  const usersTotalPages = Math.ceil(users.length / usersPerPage);


  return (
    <S.AdminContainer>
      <S.AdminHeader>
        <S.AdminTitle>
          <h1>Admin Dashboard</h1>
          <p>Platform management and monitoring</p>
        </S.AdminTitle>
        <S.AdminUserInfo>
          <S.UserName>{user?.displayName || 'Admin'}</S.UserName>
          <S.UserRole>Super User</S.UserRole>
        </S.AdminUserInfo>
      </S.AdminHeader>

      <S.AdminTabs>
        <S.Tab 
          $active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          <Activity size={20} />
          Overview
        </S.Tab>
        <S.Tab 
          $active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Users
        </S.Tab>
        <S.Tab 
          $active={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={20} />
          Analytics
        </S.Tab>
        <S.Tab 
          $active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={20} />
          Settings
        </S.Tab>
      </S.AdminTabs>

      <S.AdminContent>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <S.AdminOverview>
            <S.MetricsGrid>
              {/* Users Metrics */}
              <S.MetricCard>
                <S.MetricHeader>
                  <Users size={24} />
                  <S.MetricTitle>Total Users</S.MetricTitle>
                </S.MetricHeader>
                <S.MetricValue>{systemMetrics.totalUsers}</S.MetricValue>
                <S.MetricSubtext>{systemMetrics.activeUsers} active</S.MetricSubtext>
              </S.MetricCard>

              {/* Properties Metrics */}
              <S.MetricCard>
                <S.MetricHeader>
                  <TrendingUp size={24} />
                  <S.MetricTitle>Total Properties</S.MetricTitle>
                </S.MetricHeader>
                <S.MetricValue>{systemMetrics.totalProperties}</S.MetricValue>
                <S.MetricSubtext>{systemMetrics.activeListings} active</S.MetricSubtext>
              </S.MetricCard>

              {/* Transactions Metrics */}
              <S.MetricCard>
                <S.MetricHeader>
                  <CheckCircle size={24} />
                  <S.MetricTitle>Transactions</S.MetricTitle>
                </S.MetricHeader>
                <S.MetricValue>{systemMetrics.totalTransactions}</S.MetricValue>
                <S.MetricSubtext>{systemMetrics.completedTransactions} completed</S.MetricSubtext>
              </S.MetricCard>

              {/* System Health */}
              <S.MetricCard>
                <S.MetricHeader>
                  <Activity size={24} />
                  <S.MetricTitle>System Health</S.MetricTitle>
                </S.MetricHeader>
                <S.MetricValue>{systemMetrics.uptime}%</S.MetricValue>
                <S.MetricSubtext>{systemMetrics.systemHealth} condition</S.MetricSubtext>
              </S.MetricCard>
            </S.MetricsGrid>

            {/* System Status */}
            <S.StatusSection>
              <S.SectionHeader>
                <Activity size={20} />
                <h3>System Status</h3>
              </S.SectionHeader>
              
              <S.StatusGrid>
                <S.StatusItem>
                  <S.StatusLabel>Response Time</S.StatusLabel>
                  <S.StatusValue>{systemMetrics.responseTime}ms</S.StatusValue>
                </S.StatusItem>
                <S.StatusItem>
                  <S.StatusLabel>Error Rate</S.StatusLabel>
                  <S.StatusValue>{systemMetrics.errorRate}%</S.StatusValue>
                </S.StatusItem>
                <S.StatusItem>
                  <S.StatusLabel>Uptime</S.StatusLabel>
                  <S.StatusValue>{systemMetrics.uptime}%</S.StatusValue>
                </S.StatusItem>
                <S.StatusItem>
                  <S.StatusLabel>Database Status</S.StatusLabel>
                  <S.StatusValueSuccess>Connected</S.StatusValueSuccess>
                </S.StatusItem>
              </S.StatusGrid>
            </S.StatusSection>

            {/* Alerts Section - Using Alert Component */}
            {alerts.length > 0 && (
              <S.AlertsSection>
                <S.SectionHeader>
                  <AlertCircle size={20} />
                  <h3>System Alerts</h3>
                </S.SectionHeader>
                
                <S.AlertsList>
                  {alerts.map(alert => (
                    <Alert
                      key={alert.id}
                      type={alert.severity === 'warning' ? 'warning' : alert.severity === 'error' ? 'error' : 'info'}
                      message={alert.message}
                      closable
                      onClose={() => {}}
                    />
                  ))}
                </S.AlertsList>
              </S.AlertsSection>
            )}

            {/* Recent Activity */}
            <S.ActivitySection>
              <S.SectionHeader>
                <Clock size={20} />
                <h3>Recent Activity</h3>
              </S.SectionHeader>
              
              <S.ActivitiesList>
                {paginatedActivities.map(activity => (
                  <S.ActivityItem key={activity.id}>
                    <S.ActivityIcon>
                      {activity.type === 'create' && <CheckCircle size={16} />}
                      {activity.type === 'update' && <TrendingUp size={16} />}
                      {activity.type === 'download' && <Download size={16} />}
                      {activity.type === 'system' && <Activity size={16} />}
                    </S.ActivityIcon>
                    <S.ActivityContent>
                      <S.ActivityUser>{activity.user}</S.ActivityUser>
                      <S.ActivityAction>{activity.action}</S.ActivityAction>
                    </S.ActivityContent>
                    <S.ActivityTime>{activity.time}</S.ActivityTime>
                  </S.ActivityItem>
                ))}
              </S.ActivitiesList>
              
              {activitiesTotalPages > 1 && (
                <S.PaginationContainer>
                  <Pagination 
                    currentPage={currentActivityPage}
                    totalItems={activitiesTotalPages * 10}
                    itemsPerPage={10}
                    onPageChange={setCurrentActivityPage}
                  />
                </S.PaginationContainer>
              )}
            </S.ActivitySection>
          </S.AdminOverview>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <S.AdminUsers>
            <S.SectionHeader>
              <Users size={20} />
              <h3>User Management</h3>
            </S.SectionHeader>
            
            <S.UsersTable>
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
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td><S.RoleBadge $role={user.role}>{user.role}</S.RoleBadge></td>
                    <td><S.StatusBadge $status={user.status}>{user.status}</S.StatusBadge></td>
                    <td>{user.lastActive}</td>
                    <td>
                      <S.ActionBtn>Edit</S.ActionBtn>
                      {user.status === 'active' && (
                        <S.ActionBtn $danger>Suspend</S.ActionBtn>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.UsersTable>
            
            {usersTotalPages > 1 && (
              <S.PaginationContainer>
                <Pagination 
                  currentPage={currentUsersPage}
                  totalItems={usersTotalPages * 10}
                  itemsPerPage={10}
                  onPageChange={setCurrentUsersPage}
                />
              </S.PaginationContainer>
            )}
          </S.AdminUsers>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <S.AdminAnalytics>
            <S.SectionHeader>
              <BarChart3 size={20} />
              <h3>Analytics & Reports</h3>
              <S.FilterSelect 
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                aria-label="Filter analytics by time period"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </S.FilterSelect>
            </S.SectionHeader>

            <S.AnalyticsCharts>
              <S.ChartContainer>
                <h4>User Growth Trend</h4>
                <S.ChartPlaceholder>
                  <S.ChartBar $height="60%" />
                  <S.ChartBar $height="75%" />
                  <S.ChartBar $height="85%" />
                  <S.ChartBar $height="95%" />
                  <S.ChartBar $height="100%" />
                </S.ChartPlaceholder>
              </S.ChartContainer>

              <S.ChartContainer>
                <h4>Transaction Volume</h4>
                <S.ChartPlaceholder>
                  <S.ChartBar $height="70%" />
                  <S.ChartBar $height="80%" />
                  <S.ChartBar $height="65%" />
                  <S.ChartBar $height="85%" />
                  <S.ChartBar $height="90%" />
                </S.ChartPlaceholder>
              </S.ChartContainer>
            </S.AnalyticsCharts>

            <S.ReportActions>
              <S.BtnSecondary>
                <Download size={18} />
                Export Report
              </S.BtnSecondary>
              <S.BtnSecondary>
                <BarChart3 size={18} />
                Full Analytics
              </S.BtnSecondary>
            </S.ReportActions>
          </S.AdminAnalytics>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <S.AdminSettings>
            <S.SectionHeader>
              <Settings size={20} />
              <h3>System Settings</h3>
            </S.SectionHeader>
            
            <S.SettingsGroups as="form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const settings = Object.fromEntries(formData.entries());
              const token = localStorage.getItem('auth_token') ?? '';
              fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ settings }),
              })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    createLogger('AdminDashboard').info('Settings saved successfully', data.data);
                  } else {
                    createLogger('AdminDashboard').warn('Settings save failed', data);
                  }
                })
                .catch(err => createLogger('AdminDashboard').error('Settings POST error', err));
            }}>
              <S.SettingGroup>
                <h4>General Settings</h4>
                <S.SettingItem>
                  <label htmlFor="admin-platform-name">Platform Name</label>
                  <input id="admin-platform-name" name="platformName" type="text" defaultValue="White Caves" required maxLength={100} />
                </S.SettingItem>
                <S.SettingItem>
                  <label htmlFor="admin-support-email">Support Email</label>
                  <input id="admin-support-email" name="supportEmail" type="email" defaultValue="support@whitecaves.ae" required maxLength={254} />
                </S.SettingItem>
              </S.SettingGroup>

              <S.SettingGroup>
                <h4>Performance Settings</h4>
                <S.SettingItem>
                  <label htmlFor="admin-cache-enabled">Cache Enabled</label>
                  <input id="admin-cache-enabled" name="cacheEnabled" type="checkbox" defaultChecked />
                </S.SettingItem>
                <S.SettingItem>
                  <label htmlFor="admin-backup-interval">Auto-backup Interval (hours)</label>
                  <input id="admin-backup-interval" name="backupInterval" type="number" defaultValue="24" min={1} max={168} required />
                </S.SettingItem>
              </S.SettingGroup>

              <S.SettingGroup>
                <h4>Security Settings</h4>
                <S.SettingItem>
                  <label htmlFor="admin-2fa">Two-Factor Authentication</label>
                  <select id="admin-2fa" name="twoFactorAuth" defaultValue="enabled">
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </S.SettingItem>
                <S.SettingItem>
                  <label htmlFor="admin-session-timeout">Session Timeout (minutes)</label>
                  <input id="admin-session-timeout" name="sessionTimeout" type="number" defaultValue="30" min={5} max={1440} required />
                </S.SettingItem>
              </S.SettingGroup>

              <S.SaveBtn type="submit">Save Settings</S.SaveBtn>
            </S.SettingsGroups>
          </S.AdminSettings>
        )}
      </S.AdminContent>
    </S.AdminContainer>
  );
};

export default AdminDashboard;
