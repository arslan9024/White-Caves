import React, { useState } from 'react';
import './RoleDashboards.css';

export default function TeamLeaderDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Team Members', value: '8', icon: '👥', change: 'Active agents' },
    { label: 'Total Listings', value: '156', icon: '🏠', change: 'Team portfolio' },
    { label: 'Monthly Revenue', value: 'AED 2.4M', icon: '💰', change: '+22% vs last month' },
    { label: 'Deals This Month', value: '18', icon: '📊', change: 'Target: 20' },
  ];

  const teamMembers = [
    { id: 1, name: 'Ahmed Hassan', listings: 24, deals: 5, performance: 'Excellent' },
    { id: 2, name: 'Sara Ahmed', listings: 18, deals: 3, performance: 'Good' },
    { id: 3, name: 'Mohammed Ali', listings: 22, deals: 4, performance: 'Excellent' },
    { id: 4, name: 'Fatima Khalid', listings: 15, deals: 2, performance: 'Average' },
  ];

  const topDeals = [
    { property: 'Palm Jumeirah Villa', agent: 'Ahmed Hassan', value: 'AED 45M', status: 'Closed' },
    { property: 'Downtown Penthouse', agent: 'Sara Ahmed', value: 'AED 28M', status: 'In Progress' },
    { property: 'Emirates Hills Estate', agent: 'Mohammed Ali', value: 'AED 65M', status: 'Negotiating' },
  ];

  return (
    <div className="role-dashboard team-leader-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Team Leader Dashboard</h1>
          <p>Welcome back, {user?.name || 'Team Leader'}! Monitor your team's performance.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Add Team Member</button>
          <button className="btn btn-secondary">Generate Report</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-change">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team Members</button>
        <button className={`tab ${activeTab === 'deals' ? 'active' : ''}`} onClick={() => setActiveTab('deals')}>Deals</button>
        <button className={`tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card">
              <h3>Team Performance</h3>
              <div className="team-performance-list">
                {teamMembers.map(member => (
                  <div key={member.id} className="team-member-item">
                    <div className="member-avatar">{member.name.charAt(0)}</div>
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-stats">{member.listings} listings · {member.deals} deals</span>
                    </div>
                    <span className={`performance-badge ${member.performance.toLowerCase()}`}>
                      {member.performance}
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View Full Team →</button>
            </div>

            <div className="dashboard-card">
              <h3>Top Deals</h3>
              <div className="deals-list">
                {topDeals.map((deal, index) => (
                  <div key={index} className="deal-item">
                    <div className="deal-info">
                      <span className="deal-property">{deal.property}</span>
                      <span className="deal-agent">Agent: {deal.agent}</span>
                    </div>
                    <div className="deal-meta">
                      <span className="deal-value">{deal.value}</span>
                      <span className={`deal-status status-${deal.status.toLowerCase().replace(' ', '-')}`}>
                        {deal.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Deals →</button>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="dashboard-card">
            <h3>Team Management</h3>
            <p className="placeholder-text">Manage your team members, assign leads, and track performance.</p>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="dashboard-card">
            <h3>Deal Pipeline</h3>
            <p className="placeholder-text">Track all team deals from inquiry to closing.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="dashboard-card">
            <h3>Performance Reports</h3>
            <p className="placeholder-text">Generate and view team performance analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
