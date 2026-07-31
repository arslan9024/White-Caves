import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Users, TrendingUp, CheckCircle2, Clock, Phone, MessageSquare,
  Filter, Download, Plus, ChevronRight, AlertCircle, Zap
} from 'lucide-react';
import './AgentDashboard.css';

/**
 * Agent Dashboard - For Clara (Leads CRM Manager)
 * 
 * Key Responsibilities:
 * - Lead management and qualification
 * - Sales pipeline tracking
 * - Daily lead activities
 * - Team performance on leads
 * - Lead conversion metrics
 * - Follow-up reminders and tasks
 */

export default function AgentDashboard({ user }) {
  const dispatch = useDispatch();

  // Redux state
  const auth = useSelector(state => state.auth);
  const leads = useSelector(state => state.leads);

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewType, setViewType] = useState('list'); // list, kanban, table

  // Mock data
  const agentMetrics = {
    totalLeads: 342,
    hotLeads: 87,
    warmLeads: 145,
    coldLeads: 110,
    conversionRate: '28%',
    avgResponseTime: '2.5 min',
    closureRate: '22%',
    weeklyTarget: 85,
    weeklyAchieved: 92
  };

  const leadsByStatus = [
    { name: 'New', value: 45, color: '#3B82F6' },
    { name: 'Contacted', value: 78, color: '#8B5CF6' },
    { name: 'Qualified', value: 65, color: '#F59E0B' },
    { name: 'Negotiating', value: 89, color: '#10B981' },
    { name: 'Closed', value: 65, color: '#06B6D4' }
  ];

  const conversionFunnel = [
    { stage: 'New Leads', count: 342, percentage: 100 },
    { stage: 'Contacted', count: 287, percentage: 84 },
    { stage: 'Qualified', count: 198, percentage: 58 },
    { stage: 'Interested', count: 142, percentage: 41 },
    { stage: 'Proposal', count: 89, percentage: 26 },
    { stage: 'Closed', count: 65, percentage: 19 }
  ];

  const dailyActivity = [
    { day: 'Mon', calls: 24, messages: 45, emails: 12, meetings: 3 },
    { day: 'Tue', calls: 28, messages: 52, emails: 15, meetings: 4 },
    { day: 'Wed', calls: 31, messages: 58, emails: 18, meetings: 5 },
    { day: 'Thu', calls: 26, messages: 49, emails: 14, meetings: 3 },
    { day: 'Fri', calls: 22, messages: 41, emails: 11, meetings: 2 }
  ];

  const topLeads = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      email: 'ahmed.h@example.com',
      phone: '+971501234567',
      property: 'Damac Hills 2 - Villa Unit 2456',
      budget: 'AED 2.4M',
      status: 'negotiating',
      score: 95,
      lastContact: '15 mins ago',
      nextAction: 'Send proposal',
      priority: 'hot'
    },
    {
      id: 2,
      name: 'Fatima Al-Mansouri',
      email: 'fatima.m@example.com',
      phone: '+971501234568',
      property: 'Damac Hills 2 - Apartment 5678',
      budget: 'AED 1.8M',
      status: 'qualified',
      score: 88,
      lastContact: '2 hours ago',
      nextAction: 'Schedule meeting',
      priority: 'warm'
    },
    {
      id: 3,
      name: 'Mohammed Al-Ali',
      email: 'mohammed.a@example.com',
      phone: '+971501234569',
      property: 'Damac Hills 2 - Penthouse 1234',
      budget: 'AED 3.2M',
      status: 'proposal',
      score: 92,
      lastContact: '4 hours ago',
      nextAction: 'Follow up',
      priority: 'hot'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+971501234570',
      property: 'Damac Hills 2 - Villa Unit 3456',
      budget: 'AED 2.1M',
      status: 'interested',
      score: 75,
      lastContact: '1 day ago',
      nextAction: 'Send brochure',
      priority: 'warm'
    },
    {
      id: 5,
      name: 'Ali Khan',
      email: 'ali.k@example.com',
      phone: '+971501234571',
      property: 'Damac Hills 2 - Studio 7890',
      budget: 'AED 0.9M',
      status: 'new',
      score: 62,
      lastContact: '2 days ago',
      nextAction: 'Initial call',
      priority: 'cold'
    }
  ];

  const todayTasks = [
    {
      id: 1,
      type: 'call',
      lead: 'Ahmed Hassan',
      action: 'Follow-up call',
      time: '10:00 AM',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 2,
      type: 'message',
      lead: 'Fatima Al-Mansouri',
      action: 'Send property photos',
      time: '11:30 AM',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 3,
      type: 'meeting',
      lead: 'Mohammed Al-Ali',
      action: 'Site visit',
      time: '2:00 PM',
      priority: 'high',
      status: 'confirmed'
    },
    {
      id: 4,
      type: 'email',
      lead: 'Sarah Johnson',
      action: 'Send contract draft',
      time: '3:30 PM',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 5,
      type: 'call',
      lead: 'Ali Khan',
      action: 'Initial consultation',
      time: '4:00 PM',
      priority: 'low',
      status: 'pending'
    }
  ];

  const pipelineStages = [
    {
      stage: 'New',
      count: 45,
      color: '#3B82F6',
      leads: topLeads.filter(l => l.status === 'new')
    },
    {
      stage: 'Contacted',
      count: 78,
      color: '#8B5CF6',
      leads: topLeads.filter(l => l.status === 'contacted')
    },
    {
      stage: 'Interested',
      count: 89,
      color: '#F59E0B',
      leads: topLeads.filter(l => l.status === 'interested')
    },
    {
      stage: 'Proposal',
      count: 54,
      color: '#10B981',
      leads: topLeads.filter(l => l.status === 'proposal')
    },
    {
      stage: 'Closed',
      count: 65,
      color: '#06B6D4',
      leads: topLeads.filter(l => l.status === 'closed')
    }
  ];

  const performanceMetrics = [
    { metric: 'Response Time', value: '2.5 min', target: '3 min', status: 'excellent' },
    { metric: 'Lead Quality', value: '92%', target: '85%', status: 'excellent' },
    { metric: 'Follow-up Rate', value: '94%', target: '90%', status: 'excellent' },
    { metric: 'Conversion Rate', value: '28%', target: '20%', status: 'excellent' },
    { metric: 'Deal Size Avg', value: 'AED 1.8M', target: 'AED 1.5M', status: 'excellent' },
    { metric: 'Customer Rating', value: '4.8/5', target: '4.5/5', status: 'excellent' }
  ];

  const leasingStats = [
    { label: 'Active Listings', value: '18', icon: '🏠', change: 'Properties for rent' },
    { label: 'Pending Viewings', value: '8', icon: '📅', change: '3 today' },
    { label: 'Leases Signed', value: '12', icon: '✅', change: 'This month' },
    { label: 'Commission Earned', value: 'AED 45K', icon: '💰', change: '+12% vs last month' },
  ];

  const salesStats = [
    { label: 'Active Listings', value: '24', icon: '🏢', change: 'Properties for sale' },
    { label: 'Pending Viewings', value: '12', icon: '📅', change: '5 today' },
    { label: 'Deals Closed', value: '8', icon: '✅', change: 'This month' },
    { label: 'Commission Earned', value: 'AED 125K', icon: '💰', change: '+15% vs last month' },
  ];

  const leasingLeads = [
    { id: 1, name: 'Ahmed Al-Rashid', property: 'Marina 2BR Apartment', budget: 'AED 80-100K/yr', status: 'Hot', date: 'Today' },
    { id: 2, name: 'Sarah Johnson', property: 'Downtown Studio', budget: 'AED 50-70K/yr', status: 'Warm', date: 'Yesterday' },
    { id: 3, name: 'Mohammed Khan', property: 'JBR 3BR Apartment', budget: 'AED 150-180K/yr', status: 'New', date: '2 days ago' },
  ];

  const salesLeads = [
    { id: 1, name: 'John Smith', property: 'Palm Jumeirah Villa', budget: 'AED 40-50M', status: 'Hot', date: 'Today' },
    { id: 2, name: 'Emma Wilson', property: 'Downtown Penthouse', budget: 'AED 25-35M', status: 'Warm', date: 'Yesterday' },
    { id: 3, name: 'Omar Hassan', property: 'Marina Apartment', budget: 'AED 3-5M', status: 'New', date: '2 days ago' },
  ];

  const stats = salesStats;
  const recentLeads = salesLeads;

  const leasingViewings = [
    { id: 1, property: 'Marina View 2BR', client: 'Ahmed Al-Rashid', time: 'Today, 2:00 PM', landlord: 'Emirates Properties' },
    { id: 2, property: 'Downtown Studio', client: 'Sarah Johnson', time: 'Today, 4:30 PM', landlord: 'Dubai Holdings' },
    { id: 3, property: 'JBR 3BR Apartment', client: 'Mohammed Khan', time: 'Tomorrow, 10:00 AM', landlord: 'Private Owner' },
  ];

  const salesViewings = [
    { id: 1, property: 'Palm Jumeirah Villa', client: 'John Smith', time: 'Today, 2:00 PM', seller: 'Private Owner' },
    { id: 2, property: 'Downtown Penthouse', client: 'Emma Wilson', time: 'Today, 4:30 PM', seller: 'Investment Group' },
    { id: 3, property: 'Emirates Hills Estate', client: 'Omar Hassan', time: 'Tomorrow, 10:00 AM', seller: 'Private Owner' },
  ];

  const upcomingViewings = salesViewings;

  const getStatusColor = (status) => {
    const colors = {
      new: '#3B82F6',
      contacted: '#8B5CF6',
      interested: '#F59E0B',
      qualified: '#10B981',
      proposal: '#06B6D4',
      negotiating: '#EC4899',
      closed: '#059669'
    };
    return colors[status] || '#6B7280';
  };

  const getPriorityIcon = (priority) => {
    return priority === 'hot' ? '🔥' : priority === 'warm' ? '⚠️' : '❄️';
  };

  return (
    <div className="agent-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Lead Management Dashboard</h1>
          <p>Leads Manager - Clara | Total Leads: {agentMetrics.totalLeads}</p>
        </div>
        <div className="header-actions">
          <button className="btn-action btn-primary">
            <Plus size={18} /> New Lead
          </button>
          <button className="btn-action btn-secondary">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="kpi-section">
        <div className="kpi-card hot">
          <div className="kpi-label">🔥 Hot Leads</div>
          <div className="kpi-value">{agentMetrics.hotLeads}</div>
          <div className="kpi-sublabel">Needs immediate action</div>
        </div>
        <div className="kpi-card warm">
          <div className="kpi-label">⚠️ Warm Leads</div>
          <div className="kpi-value">{agentMetrics.warmLeads}</div>
          <div className="kpi-sublabel">In progress</div>
        </div>
        <div className="kpi-card cold">
          <div className="kpi-label">❄️ Cold Leads</div>
          <div className="kpi-value">{agentMetrics.coldLeads}</div>
          <div className="kpi-sublabel">Future potential</div>
        </div>
        <div className="kpi-card conversion">
          <div className="kpi-label">📈 Conversion Rate</div>
          <div className="kpi-value">{agentMetrics.conversionRate}</div>
          <div className="kpi-sublabel">+3% from last month</div>
        </div>
        <div className="kpi-card response">
          <div className="kpi-label">⚡ Avg Response</div>
          <div className="kpi-value">{agentMetrics.avgResponseTime}</div>
          <div className="kpi-sublabel">Industry leading</div>
        </div>
        <div className="kpi-card closure">
          <div className="kpi-label">✅ Closure Rate</div>
          <div className="kpi-value">{agentMetrics.closureRate}</div>
          <div className="kpi-sublabel">+2% from target</div>
        </div>
      </section>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['overview', 'leads', 'pipeline', 'tasks', 'analytics'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content overview-tab">
          <div className="grid-2col">
            {/* Daily Activity */}
            <div className="card">
              <h3>Daily Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="calls" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
                  <Area type="monotone" dataKey="messages" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="emails" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Conversion Funnel */}
            <div className="card">
              <h3>Conversion Funnel</h3>
              <div className="funnel-chart">
                {conversionFunnel.map((item, idx) => (
                  <div key={idx} className="funnel-item" style={{ width: `${item.percentage}%` }}>
                    <div className="funnel-label">
                      <span className="stage">{item.stage}</span>
                      <span className="count">{item.count}</span>
                    </div>
                    <div className="funnel-bar" style={{ width: '100%', height: '40px', background: `linear-gradient(90deg, var(--accent-purple, #8B5CF6) 0%, var(--accent-blue, #3B82F6) 100%)`, borderRadius: '4px' }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card">
            <h3>Performance Metrics</h3>
            <div className="performance-grid">
              {performanceMetrics.map((perf, idx) => (
                <div key={idx} className="perf-item">
                  <div className="perf-header">
                    <span className="perf-metric">{perf.metric}</span>
                    <span className={`perf-status ${perf.status}`}>✓</span>
                  </div>
                  <div className="perf-values">
                    <span className="perf-value">{perf.value}</span>
                    <span className="perf-target">Target: {perf.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leads Tab */}
      {activeTab === 'leads' && (
        <div className="tab-content leads-tab">
          <div className="leads-controls">
            <input
              type="text"
              placeholder="Search leads..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="filter-select" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option value="all">All Leads</option>
              <option value="hot">Hot Leads</option>
              <option value="warm">Warm Leads</option>
              <option value="cold">Cold Leads</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">In Proposal</option>
            </select>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="score">Highest Score</option>
              <option value="budget">Highest Budget</option>
              <option value="contacted">Least Contacted</option>
            </select>
          </div>

          <div className="leads-list">
            {topLeads.map(lead => (
              <div key={lead.id} className={`lead-card priority-${lead.priority}`}>
                <div className="lead-priority">{getPriorityIcon(lead.priority)}</div>
                <div className="lead-info">
                  <h4>{lead.name}</h4>
                  <p className="lead-property">{lead.property}</p>
                  <div className="lead-meta">
                    <span className="lead-contact">{lead.phone}</span>
                    <span className="lead-contact">{lead.email}</span>
                  </div>
                </div>
                <div className="lead-status">
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(lead.status) }}>
                    {lead.status}
                  </span>
                  <div className="lead-score">
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${lead.score}%` }}></div>
                    </div>
                    <span className="score-text">{lead.score}%</span>
                  </div>
                </div>
                <div className="lead-actions">
                  <div className="lead-details">
                    <div className="detail-item">
                      <span className="label">Budget</span>
                      <span className="value">{lead.budget}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Last Contact</span>
                      <span className="value">{lead.lastContact}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Next Action</span>
                      <span className="value action-tag">{lead.nextAction}</span>
                    </div>
                  </div>
                  <button className="action-btn">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline Tab (Kanban) */}
      {activeTab === 'pipeline' && (
        <div className="tab-content pipeline-tab">
          <div className="kanban-board">
            {pipelineStages.map((stage, idx) => (
              <div key={idx} className="kanban-column">
                <div className="column-header">
                  <h4>{stage.stage}</h4>
                  <span className="column-count">{stage.count}</span>
                </div>
                <div className="column-cards">
                  {stage.leads.slice(0, 3).map(lead => (
                    <div key={lead.id} className="kanban-card">
                      <div className="card-priority">{getPriorityIcon(lead.priority)}</div>
                      <h5>{lead.name}</h5>
                      <p className="card-detail">{lead.property}</p>
                      <div className="card-footer">
                        <span className="card-score">{lead.score}%</span>
                        <span className="card-budget">{lead.budget}</span>
                      </div>
                    </div>
                  ))}
                  {stage.count > 3 && (
                    <div className="more-items">+{stage.count - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="tab-content tasks-tab">
          <h3>Today's Tasks & Follow-ups</h3>
          <div className="tasks-list">
            {todayTasks.map(task => (
              <div key={task.id} className={`task-item priority-${task.priority}`}>
                <div className="task-checkbox">
                  <input type="checkbox" defaultChecked={task.status === 'completed'} />
                </div>
                <div className="task-icon">
                  {task.type === 'call' && <Phone size={18} />}
                  {task.type === 'message' && <MessageSquare size={18} />}
                  {task.type === 'meeting' && <Clock size={18} />}
                  {task.type === 'email' && <MessageSquare size={18} />}
                </div>
                <div className="task-info">
                  <div className="task-lead">{task.lead}</div>
                  <div className="task-action">{task.action}</div>
                </div>
                <div className="task-time">{task.time}</div>
                <div className="task-status">
                  <span className={`status-badge status-${task.status}`}>{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="tab-content analytics-tab">
          <div className="grid-2col">
            <div className="card">
              <h3>Weekly Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="calls" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="messages" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Lead Sources</h3>
              <div className="source-list">
                <div className="source-item">
                  <span className="source-name">Bayut</span>
                  <div className="source-bar"><div style={{ width: '35%', background: 'var(--accent-purple, #8B5CF6)' }}></div></div>
                  <span className="source-count">120 leads</span>
                </div>
                <div className="source-item">
                  <span className="source-name">PropertyFinder</span>
                  <div className="source-bar"><div style={{ width: '28%', background: 'var(--accent-blue, #3B82F6)' }}></div></div>
                  <span className="source-count">95 leads</span>
                </div>
                <div className="source-item">
                  <span className="source-name">Dubizzle</span>
                  <div className="source-bar"><div style={{ width: '22%', background: 'var(--accent-gold, #F59E0B)' }}></div></div>
                  <span className="source-count">75 leads</span>
                </div>
                <div className="source-item">
                  <span className="source-name">Direct</span>
                  <div className="source-bar"><div style={{ width: '15%', background: 'var(--accent-green, #10B981)' }}></div></div>
                  <span className="source-count">52 leads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
