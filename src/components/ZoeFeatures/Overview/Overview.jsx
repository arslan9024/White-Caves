import React from 'react';
import { 
  TrendingUp, TrendingDown, Building2, Users, DollarSign, 
  Target, ChartPie, Activity, ArrowUpRight, ArrowDownRight,
  Bell, Star, Calendar
} from 'lucide-react';

const STATS = [
  { id: 'properties', label: 'Active Listings', value: '156', change: '+12%', trend: 'up', icon: Building2, color: '#10B981' },
  { id: 'leads', label: 'New Leads', value: '52', change: '+5%', trend: 'up', icon: Users, color: '#8B5CF6' },
  { id: 'revenue', label: 'Monthly Revenue', value: 'AED 2,450,000', change: '+18%', trend: 'up', icon: DollarSign, color: '#059669' },
  { id: 'deals', label: 'Active Deals', value: '89', change: '+25%', trend: 'up', icon: Target, color: '#F59E0B' },
  { id: 'viewings', label: 'Scheduled Viewings', value: '34', change: '+15%', trend: 'up', icon: Calendar, color: '#3B82F6' },
  { id: 'conversions', label: 'Conversion Rate', value: '24.5%', change: '+30%', trend: 'up', icon: ChartPie, color: '#EC4899' },
];

const ANNOUNCEMENTS = [
  { id: 1, title: 'Q1 2024 Performance Review Meeting', date: 'Today, 3:00 PM', priority: 'high' },
  { id: 2, title: 'New Ejari Integration Live', date: 'Yesterday', priority: 'normal' },
  { id: 3, title: 'Team Building Event - March 15', date: '2 days ago', priority: 'low' },
];

const QUICK_ACTIONS = [
  { id: 'add-listing', label: 'Add Listing', icon: '+' },
  { id: 'add-lead', label: 'New Lead', icon: '👤' },
  { id: 'reports', label: 'View Reports', icon: '📊' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'kyc', label: 'KYC Queue', icon: '🆔' },
];

const TOP_AGENTS = [
  { id: 1, name: 'Sarah Ahmed', deals: 12, revenue: 'AED 850K', avatar: 'SA' },
  { id: 2, name: 'Mohammed Ali', deals: 10, revenue: 'AED 720K', avatar: 'MA' },
  { id: 3, name: 'Fatima Khan', deals: 9, revenue: 'AED 680K', avatar: 'FK' },
];

export default function ExecutiveOverview({ activeSubItem, subItemConfig, assistantContext }) {
  const renderMDDashboard = () => (
    <div className="executive-dashboard">
      <div className="stats-grid">
        {STATS.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card quick-actions-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map(action => (
              <button key={action.id} className="quick-action-btn">
                <span className="quick-action-icon">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-card announcements-card">
          <h3 className="card-title">
            <Bell size={18} />
            Announcements
          </h3>
          <div className="announcements-list">
            {ANNOUNCEMENTS.map(ann => (
              <div key={ann.id} className={`announcement-item ${ann.priority}`}>
                <div className="announcement-title">{ann.title}</div>
                <div className="announcement-date">{ann.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card chart-card">
          <h3 className="card-title">Revenue Trend (2024)</h3>
          <div className="chart-placeholder">
            <Activity size={48} color="var(--crm-gold)" />
            <p>Revenue chart visualization</p>
          </div>
        </div>

        <div className="dashboard-card top-agents-card">
          <h3 className="card-title">
            <Star size={18} />
            Top Performing Agents
          </h3>
          <div className="agents-list">
            {TOP_AGENTS.map((agent, index) => (
              <div key={agent.id} className="agent-row">
                <div className="agent-rank">#{index + 1}</div>
                <div className="agent-avatar">{agent.avatar}</div>
                <div className="agent-info">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-stats">{agent.deals} deals • {agent.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {assistantContext && assistantContext.isRelevant && (
        <div className="ai-insight-banner">
          <div className="ai-insight-icon">🤖</div>
          <div className="ai-insight-content">
            <strong>{assistantContext.assistantName}</strong> can help with {activeSubItem}
            <p>{assistantContext.assistantRole}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStrategicKPIs = () => (
    <div className="strategic-kpis">
      <h2 className="view-title">Strategic KPIs</h2>
      <p className="view-subtitle">Track key performance indicators across all departments</p>
      <div className="kpi-grid">
        {['Sales Velocity', 'Customer Satisfaction', 'Agent Productivity', 'Revenue per Lead', 'Time to Close', 'Listing Quality Score'].map(kpi => (
          <div key={kpi} className="kpi-card">
            <div className="kpi-name">{kpi}</div>
            <div className="kpi-value">{Math.floor(Math.random() * 100)}%</div>
            <div className="kpi-trend up">+{Math.floor(Math.random() * 20)}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="announcements-view">
      <h2 className="view-title">Company Announcements</h2>
      <p className="view-subtitle">Internal communications and updates</p>
      <div className="announcements-full-list">
        {ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className={`announcement-full-item ${ann.priority}`}>
            <div className="announcement-priority-badge">{ann.priority}</div>
            <div className="announcement-content">
              <h4>{ann.title}</h4>
              <p>{ann.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompanyOverview = () => (
    <div className="company-overview">
      <h2 className="view-title">Company Overview</h2>
      <p className="view-subtitle">White Caves Real Estate organizational structure</p>
      <div className="org-stats">
        <div className="org-stat">
          <div className="org-stat-value">11</div>
          <div className="org-stat-label">Departments</div>
        </div>
        <div className="org-stat">
          <div className="org-stat-value">38</div>
          <div className="org-stat-label">AI Assistants</div>
        </div>
        <div className="org-stat">
          <div className="org-stat-value">40</div>
          <div className="org-stat-label">Services</div>
        </div>
        <div className="org-stat">
          <div className="org-stat-value">6</div>
          <div className="org-stat-label">User Types</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'md-dashboard':
        return renderMDDashboard();
      case 'strategic-kpis':
        return renderStrategicKPIs();
      case 'announcements':
        return renderAnnouncements();
      case 'company-overview':
        return renderCompanyOverview();
      default:
        return renderMDDashboard();
    }
  };

  return (
    <div className="view-container executive-view">
      {renderContent()}
    </div>
  );
}
