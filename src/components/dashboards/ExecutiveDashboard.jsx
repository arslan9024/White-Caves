import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, AlertCircle, Users, DollarSign, Building2,
  Activity, Calendar, Clock, CheckCircle2, Phone, Mail, MessageSquare
} from 'lucide-react';
import PlanManager from '../plans/PlanManager';
import './ExecutiveDashboard.css';

/**
 * Executive Dashboard - For Zoe (MD Executive Assistant)
 * 
 * Key Responsibilities:
 * - High-level business metrics and KPIs
 * - Executive reporting and intelligence
 * - Strategic decision support
 * - Team oversight and delegation
 * - Revenue and profitability tracking
 * - Risk and opportunity alerts
 */

export default function ExecutiveDashboard() {
  const dispatch = useDispatch();

  // Redux state
  const auth = useSelector(state => state.auth);
  const dashboard = useSelector(state => state.dashboard);
  const deals = useSelector(state => state.deals);
  const analytics = useSelector(state => state.analytics);

  // Local state
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, quarter, year
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - will be replaced with real Redux state
  const kpis = [
    {
      label: 'Total Properties',
      value: '9,378+',
      change: '+12.5%',
      trend: 'up',
      color: 'primary',
      icon: Building2
    },
    {
      label: 'Active Leads',
      value: '2,847',
      change: '+28.3%',
      trend: 'up',
      color: 'success',
      icon: Users
    },
    {
      label: 'Monthly Revenue',
      value: 'AED 4.2M',
      change: '+18.7%',
      trend: 'up',
      color: 'warning',
      icon: DollarSign
    },
    {
      label: 'Conversion Rate',
      value: '24.5%',
      change: '+3.2%',
      trend: 'up',
      color: 'info',
      icon: TrendingUp
    }
  ];

  const teamMetrics = [
    { name: 'Clara', role: 'Leads Manager', leads: 342, conversion: '28%', status: 'excellent' },
    { name: 'Mary', role: 'Inventory Manager', properties: 1245, active: '98%', status: 'excellent' },
    { name: 'Sophia', role: 'Sales Pipeline', deals: 187, closureRate: '22%', status: 'good' },
    { name: 'Linda', role: 'WhatsApp Manager', conversations: 5234, responseTime: '2m', status: 'excellent' },
    { name: 'Theodora', role: 'Finance Director', revenue: 'AED 4.2M', margin: '18.5%', status: 'good' },
    { name: 'Aurora', role: 'CTO', systems: 'All Green', uptime: '99.97%', status: 'excellent' }
  ];

  const departmentMetrics = [
    { name: 'Sales', kpis: 'Lead Gen', value: 2847, target: 2500, color: '#8B5CF6' },
    { name: 'Operations', kpis: 'Properties', value: 9378, target: 9000, color: '#3B82F6' },
    { name: 'Finance', kpis: 'Revenue', value: 4.2, target: 4.0, color: '#F59E0B' },
    { name: 'Marketing', kpis: 'Impressions', value: 184000, target: 150000, color: '#EC4899' },
    { name: 'Tech', kpis: 'Uptime %', value: 99.97, target: 99.5, color: '#06B6D4' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 3.2, target: 3.5, expense: 1.8 },
    { month: 'Feb', revenue: 3.5, target: 3.5, expense: 1.9 },
    { month: 'Mar', revenue: 3.8, target: 3.8, expense: 2.0 },
    { month: 'Apr', revenue: 4.1, target: 4.0, expense: 2.1 },
    { month: 'May', revenue: 4.2, target: 4.2, expense: 2.2 }
  ];

  const leadsQualityData = [
    { name: 'Hot', value: 45, color: '#10B981' },
    { name: 'Warm', value: 35, color: '#F59E0B' },
    { name: 'Cold', value: 20, color: '#6B7280' }
  ];

  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Inventory Alert',
      message: 'Low stock of premium villa listings in Damac Hills',
      timestamp: 'Just now',
      action: 'Review'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Performance Alert',
      message: 'Dubizzle integration experiencing delays',
      timestamp: '15 min ago',
      action: 'Investigate'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Opportunity',
      message: 'PropertyFinder integration showing 35% increase in leads',
      timestamp: '1 hour ago',
      action: 'Analyze'
    },
    {
      id: 4,
      type: 'success',
      title: 'Target Achieved',
      message: 'Monthly revenue target exceeded by 5%',
      timestamp: '2 hours ago',
      action: 'View'
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Weekly Executive Sync',
      attendees: ['Theodora', 'Aurora', 'Olivia'],
      time: '10:00 AM',
      date: 'Today',
      duration: '1 hour'
    },
    {
      id: 2,
      title: 'Board Review - Q1 Results',
      attendees: ['All Executives'],
      time: '2:00 PM',
      date: 'Today',
      duration: '2 hours'
    },
    {
      id: 3,
      title: 'Strategic Planning - H2 2026',
      attendees: ['Executive Team'],
      time: '10:00 AM',
      date: 'Tomorrow',
      duration: '3 hours'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      actor: 'Clara',
      action: 'Closed deal',
      target: 'Villa Unit 2456',
      value: 'AED 2.4M',
      timestamp: '2 min ago'
    },
    {
      id: 2,
      actor: 'Linda',
      action: 'Sent WhatsApp',
      target: 'Leads Follow-up',
      count: '187 messages',
      timestamp: '5 min ago'
    },
    {
      id: 3,
      actor: 'Mary',
      action: 'Updated inventory',
      target: 'New Listings',
      count: '24 properties',
      timestamp: '12 min ago'
    },
    {
      id: 4,
      actor: 'Theodora',
      action: 'Generated report',
      target: 'Monthly P&L',
      value: 'AED 4.2M revenue',
      timestamp: '45 min ago'
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <div className="executive-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Executive Dashboard</h1>
          <p>Welcome back, Managing Director</p>
        </div>
        <div className="dashboard-controls">
          <div className="time-range-selector">
            {['day', 'week', 'month', 'quarter', 'year'].map(range => (
              <button
                key={range}
                className={`range-btn ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <button
            className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <Activity size={16} className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="kpi-section">
        <h2>Key Performance Indicators</h2>
        <div className="kpi-grid">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className={`kpi-card ${kpi.color}`}>
                <div className="kpi-header">
                  <Icon size={24} />
                  <span className={`trend-badge ${kpi.trend}`}>{kpi.change}</span>
                </div>
                <div className="kpi-content">
                  <h3>{kpi.label}</h3>
                  <p className="kpi-value">{kpi.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['overview', 'analytics', 'team', 'alerts', 'plans'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'plans' ? '📋 Strategic Plans' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      {activeTab === 'overview' && (
        <div className="overview-section">
          {/* Revenue Trend */}
          <div className="chart-card">
            <h3>Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Actual (M AED)" />
                <Line type="monotone" dataKey="target" stroke="#6B7280" name="Target (M AED)" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expenses (M AED)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Performance */}
          <div className="chart-card">
            <h3>Department Performance vs Target</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8B5CF6" name="Actual" />
                <Bar dataKey="target" fill="#CBD5E1" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lead Quality */}
          <div className="chart-card">
            <h3>Lead Quality Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leadsQualityData} cx="50%" cy="50%" labelLine={false} label>
                  {leadsQualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <div className="grid-2col">
            {/* Recent Activities */}
            <div className="card">
              <h3>Recent Activities</h3>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-info">
                      <strong>{activity.actor}</strong>
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-target">{activity.target}</span>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-value">{activity.value || activity.count}</span>
                      <small>{activity.timestamp}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3>Quick Stats</h3>
              <div className="stats-list">
                <div className="stat-row">
                  <span>Avg Deal Size</span>
                  <strong>AED 1.8M</strong>
                </div>
                <div className="stat-row">
                  <span>Win Rate</span>
                  <strong>24.5%</strong>
                </div>
                <div className="stat-row">
                  <span>Sales Pipeline</span>
                  <strong>AED 89M</strong>
                </div>
                <div className="stat-row">
                  <span>Avg Deal Cycle</span>
                  <strong>24 days</strong>
                </div>
                <div className="stat-row">
                  <span>Customer Satisfaction</span>
                  <strong>4.8/5</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="team-section">
          <h2>Team Performance</h2>
          <div className="team-grid">
            {teamMetrics.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-header">
                  <div className="team-avatar">{member.name.charAt(0)}</div>
                  <div>
                    <h4>{member.name}</h4>
                    <p className="role">{member.role}</p>
                  </div>
                  <span className={`status-badge ${member.status}`}>{member.status}</span>
                </div>
                <div className="team-metrics">
                  {Object.entries(member).map(([key, value]) => {
                    if (['name', 'role', 'status'].includes(key)) return null;
                    return (
                      <div key={key} className="metric">
                        <span className="label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                        <span className="value">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="alerts-section">
          <h2>Alerts & Notifications</h2>
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                <div className="alert-icon">
                  {alert.type === 'critical' && <AlertCircle size={20} />}
                  {alert.type === 'warning' && <AlertCircle size={20} />}
                  {alert.type === 'success' && <CheckCircle2 size={20} />}
                  {alert.type === 'info' && <AlertCircle size={20} />}
                </div>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                  <small>{alert.timestamp}</small>
                </div>
                <button className="alert-action">{alert.action}</button>
              </div>
            ))}
          </div>

          {/* Upcoming Meetings */}
          <div className="meetings-section">
            <h3>Upcoming Meetings</h3>
            <div className="meetings-list">
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="meeting-item">
                  <Calendar size={20} />
                  <div className="meeting-info">
                    <h4>{meeting.title}</h4>
                    <p>{meeting.attendees.join(', ')}</p>
                  </div>
                  <div className="meeting-time">
                    <div className="time">{meeting.time}</div>
                    <div className="date">{meeting.date}</div>
                  </div>
                  <Clock size={16} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="plans-section">
          <PlanManager />
        </div>
      )}
    </div>
  );
}
