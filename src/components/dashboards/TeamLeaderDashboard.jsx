import React, { useState } from 'react';
import './RoleDashboards.css';

export default function TeamLeaderDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [teamType, setTeamType] = useState('leasing');

  const leasingStats = [
    { label: 'Leasing Agents', value: '6', icon: '👥', change: 'Active agents' },
    { label: 'Active Listings', value: '89', icon: '🏠', change: 'Properties for rent' },
    { label: 'Monthly Leases', value: '24', icon: '📝', change: 'Signed this month' },
    { label: 'Commission Pool', value: 'AED 180K', icon: '💰', change: '+18% vs last month' },
  ];

  const salesStats = [
    { label: 'Sales Agents', value: '8', icon: '👥', change: 'Active agents' },
    { label: 'Active Listings', value: '156', icon: '🏢', change: 'Properties for sale' },
    { label: 'Deals Closed', value: '12', icon: '✅', change: 'This month' },
    { label: 'Sales Volume', value: 'AED 85M', icon: '💰', change: '+22% vs last month' },
  ];

  const stats = teamType === 'leasing' ? leasingStats : salesStats;

  const leasingAgents = [
    { id: 1, name: 'Fatima Al-Rashid', listings: 18, deals: 8, performance: 'Excellent', specialty: 'Residential' },
    { id: 2, name: 'Omar Hassan', listings: 15, deals: 6, performance: 'Good', specialty: 'Commercial' },
    { id: 3, name: 'Aisha Mohammed', listings: 22, deals: 10, performance: 'Excellent', specialty: 'Residential' },
    { id: 4, name: 'Khalid Ahmed', listings: 12, deals: 4, performance: 'Average', specialty: 'Short-term' },
    { id: 5, name: 'Noura Saeed', listings: 16, deals: 5, performance: 'Good', specialty: 'Luxury' },
    { id: 6, name: 'Youssef Ali', listings: 14, deals: 7, performance: 'Good', specialty: 'Residential' },
  ];

  const salesAgents = [
    { id: 1, name: 'Ahmed Hassan', listings: 24, deals: 5, performance: 'Excellent', specialty: 'Secondary Sales' },
    { id: 2, name: 'Sara Ahmed', listings: 18, deals: 3, performance: 'Good', specialty: 'Off-Plan' },
    { id: 3, name: 'Mohammed Ali', listings: 22, deals: 4, performance: 'Excellent', specialty: 'Luxury Villas' },
    { id: 4, name: 'Layla Khalid', listings: 15, deals: 2, performance: 'Average', specialty: 'Apartments' },
    { id: 5, name: 'Hassan Omar', listings: 20, deals: 3, performance: 'Good', specialty: 'Secondary Sales' },
    { id: 6, name: 'Mariam Saeed', listings: 19, deals: 4, performance: 'Good', specialty: 'Commercial' },
    { id: 7, name: 'Ali Mahmoud', listings: 17, deals: 3, performance: 'Good', specialty: 'Townhouses' },
    { id: 8, name: 'Nadia Hassan', listings: 21, deals: 5, performance: 'Excellent', specialty: 'Penthouses' },
  ];

  const teamMembers = teamType === 'leasing' ? leasingAgents : salesAgents;

  const leasingDeals = [
    { property: 'Marina View 2BR', agent: 'Fatima Al-Rashid', value: 'AED 95K/yr', status: 'Signed', type: 'Annual Lease' },
    { property: 'Downtown Studio', agent: 'Aisha Mohammed', value: 'AED 65K/yr', status: 'In Progress', type: 'Annual Lease' },
    { property: 'JBR 3BR Apt', agent: 'Omar Hassan', value: 'AED 180K/yr', status: 'Negotiating', type: 'Annual Lease' },
    { property: 'Business Bay Office', agent: 'Omar Hassan', value: 'AED 250K/yr', status: 'Signed', type: 'Commercial' },
  ];

  const salesDeals = [
    { property: 'Palm Jumeirah Villa', agent: 'Ahmed Hassan', value: 'AED 45M', status: 'Closed', type: 'Secondary Sale' },
    { property: 'Downtown Penthouse', agent: 'Sara Ahmed', value: 'AED 28M', status: 'In Progress', type: 'Off-Plan' },
    { property: 'Emirates Hills Estate', agent: 'Mohammed Ali', value: 'AED 65M', status: 'Negotiating', type: 'Secondary Sale' },
    { property: 'Marina Apartment', agent: 'Nadia Hassan', value: 'AED 3.5M', status: 'Closed', type: 'Secondary Sale' },
  ];

  const topDeals = teamType === 'leasing' ? leasingDeals : salesDeals;

  return (
    <div className="role-dashboard team-leader-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Team Leader Dashboard</h1>
          <p>Welcome back, {user?.name || 'Team Leader'}! Manage your {teamType} team.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Add Team Member</button>
          <button className="btn btn-secondary">Generate Report</button>
        </div>
      </div>

      <div className="team-type-selector">
        <button 
          className={`team-type-btn ${teamType === 'leasing' ? 'active' : ''}`}
          onClick={() => setTeamType('leasing')}
        >
          🔑 Leasing Team
        </button>
        <button 
          className={`team-type-btn ${teamType === 'sales' ? 'active' : ''}`}
          onClick={() => setTeamType('sales')}
        >
          💼 Secondary Sales Team
        </button>
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
        <button className={`tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
          {teamType === 'leasing' ? 'Leasing Agents' : 'Sales Agents'}
        </button>
        <button className={`tab ${activeTab === 'deals' ? 'active' : ''}`} onClick={() => setActiveTab('deals')}>
          {teamType === 'leasing' ? 'Lease Pipeline' : 'Sales Pipeline'}
        </button>
        <button className={`tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports</button>
        <button className={`tab ${activeTab === 'targets' ? 'active' : ''}`} onClick={() => setActiveTab('targets')}>Targets</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card">
              <h3>{teamType === 'leasing' ? 'Leasing Team Performance' : 'Sales Team Performance'}</h3>
              <div className="team-performance-list">
                {teamMembers.slice(0, 4).map(member => (
                  <div key={member.id} className="team-member-item">
                    <div className="member-avatar">{member.name.charAt(0)}</div>
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-stats">{member.listings} listings · {member.deals} {teamType === 'leasing' ? 'leases' : 'sales'}</span>
                      <span className="member-specialty">{member.specialty}</span>
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
              <h3>{teamType === 'leasing' ? 'Recent Leases' : 'Top Deals'}</h3>
              <div className="deals-list">
                {topDeals.map((deal, index) => (
                  <div key={index} className="deal-item">
                    <div className="deal-info">
                      <span className="deal-property">{deal.property}</span>
                      <span className="deal-agent">Agent: {deal.agent}</span>
                      <span className="deal-type">{deal.type}</span>
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
              <button className="btn btn-link">View All {teamType === 'leasing' ? 'Leases' : 'Deals'} →</button>
            </div>

            <div className="dashboard-card">
              <h3>Team Targets</h3>
              <div className="targets-summary">
                <div className="target-item">
                  <span className="target-label">Monthly {teamType === 'leasing' ? 'Leases' : 'Sales'}</span>
                  <div className="target-progress">
                    <div className="progress-bar" style={{width: teamType === 'leasing' ? '80%' : '60%'}}></div>
                  </div>
                  <span className="target-value">{teamType === 'leasing' ? '24/30' : '12/20'}</span>
                </div>
                <div className="target-item">
                  <span className="target-label">Revenue Target</span>
                  <div className="target-progress">
                    <div className="progress-bar" style={{width: teamType === 'leasing' ? '75%' : '85%'}}></div>
                  </div>
                  <span className="target-value">{teamType === 'leasing' ? 'AED 180K/240K' : 'AED 85M/100M'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="dashboard-card full-width">
            <h3>{teamType === 'leasing' ? 'Leasing Agents Management' : 'Sales Agents Management'}</h3>
            <div className="team-table">
              <table>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Specialty</th>
                    <th>Active Listings</th>
                    <th>{teamType === 'leasing' ? 'Leases Signed' : 'Deals Closed'}</th>
                    <th>Performance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div className="agent-cell">
                          <div className="member-avatar small">{member.name.charAt(0)}</div>
                          {member.name}
                        </div>
                      </td>
                      <td>{member.specialty}</td>
                      <td>{member.listings}</td>
                      <td>{member.deals}</td>
                      <td>
                        <span className={`performance-badge ${member.performance.toLowerCase()}`}>
                          {member.performance}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm">View Profile</button>
                        <button className="btn btn-sm btn-secondary">Assign Lead</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="dashboard-card">
            <h3>{teamType === 'leasing' ? 'Lease Pipeline' : 'Sales Pipeline'}</h3>
            <div className="pipeline-stages">
              <div className="pipeline-stage">
                <h4>Inquiry</h4>
                <span className="stage-count">15</span>
              </div>
              <div className="pipeline-stage">
                <h4>Viewing</h4>
                <span className="stage-count">8</span>
              </div>
              <div className="pipeline-stage">
                <h4>Negotiating</h4>
                <span className="stage-count">5</span>
              </div>
              <div className="pipeline-stage">
                <h4>{teamType === 'leasing' ? 'Contract' : 'Documentation'}</h4>
                <span className="stage-count">3</span>
              </div>
              <div className="pipeline-stage">
                <h4>{teamType === 'leasing' ? 'Signed' : 'Closed'}</h4>
                <span className="stage-count">{teamType === 'leasing' ? '24' : '12'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="dashboard-card">
            <h3>Performance Reports</h3>
            <div className="reports-grid">
              <div className="report-item">
                <span className="report-icon">📊</span>
                <span className="report-name">Monthly Performance Report</span>
                <button className="btn btn-sm">Generate</button>
              </div>
              <div className="report-item">
                <span className="report-icon">📈</span>
                <span className="report-name">Agent Commission Report</span>
                <button className="btn btn-sm">Generate</button>
              </div>
              <div className="report-item">
                <span className="report-icon">📋</span>
                <span className="report-name">{teamType === 'leasing' ? 'Lease Summary' : 'Sales Summary'}</span>
                <button className="btn btn-sm">Generate</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'targets' && (
          <div className="dashboard-card">
            <h3>Team Targets & KPIs</h3>
            <p className="placeholder-text">Set and track team targets, individual KPIs, and performance bonuses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
