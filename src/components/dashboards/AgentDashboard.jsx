import React, { useState } from 'react';
import './RoleDashboards.css';

export default function AgentDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Listings', value: '24', icon: '🏠', change: '+3 this week' },
    { label: 'Pending Viewings', value: '12', icon: '📅', change: '5 today' },
    { label: 'Deals Closed', value: '8', icon: '✅', change: 'This month' },
    { label: 'Commission Earned', value: 'AED 125K', icon: '💰', change: '+15% vs last month' },
  ];

  const recentLeads = [
    { id: 1, name: 'Ahmed Al-Rashid', property: 'Palm Jumeirah Villa', status: 'Hot', date: 'Today' },
    { id: 2, name: 'Sarah Johnson', property: 'Downtown Penthouse', status: 'Warm', date: 'Yesterday' },
    { id: 3, name: 'Mohammed Khan', property: 'Marina Apartment', status: 'New', date: '2 days ago' },
  ];

  const upcomingViewings = [
    { id: 1, property: 'Beachfront Villa', client: 'John Smith', time: 'Today, 2:00 PM' },
    { id: 2, property: 'Downtown Apartment', client: 'Emma Wilson', time: 'Today, 4:30 PM' },
    { id: 3, property: 'Emirates Hills Villa', client: 'Omar Hassan', time: 'Tomorrow, 10:00 AM' },
  ];

  return (
    <div className="role-dashboard agent-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Agent Dashboard</h1>
          <p>Welcome back, {user?.name || 'Agent'}! Here's your performance overview.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Add Listing</button>
          <button className="btn btn-secondary">Schedule Viewing</button>
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
        <button className={`tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>My Listings</button>
        <button className={`tab ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>Leads</button>
        <button className={`tab ${activeTab === 'viewings' ? 'active' : ''}`} onClick={() => setActiveTab('viewings')}>Viewings</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card">
              <h3>Recent Leads</h3>
              <div className="leads-list">
                {recentLeads.map(lead => (
                  <div key={lead.id} className="lead-item">
                    <div className="lead-info">
                      <span className="lead-name">{lead.name}</span>
                      <span className="lead-property">{lead.property}</span>
                    </div>
                    <div className="lead-meta">
                      <span className={`lead-status status-${lead.status.toLowerCase()}`}>{lead.status}</span>
                      <span className="lead-date">{lead.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Leads →</button>
            </div>

            <div className="dashboard-card">
              <h3>Upcoming Viewings</h3>
              <div className="viewings-list">
                {upcomingViewings.map(viewing => (
                  <div key={viewing.id} className="viewing-item">
                    <div className="viewing-info">
                      <span className="viewing-property">{viewing.property}</span>
                      <span className="viewing-client">{viewing.client}</span>
                    </div>
                    <span className="viewing-time">{viewing.time}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View Calendar →</button>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="dashboard-card">
            <h3>My Property Listings</h3>
            <p className="placeholder-text">Manage your active property listings here.</p>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="dashboard-card">
            <h3>Lead Management</h3>
            <p className="placeholder-text">Track and manage your leads and client inquiries.</p>
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="dashboard-card">
            <h3>Viewing Schedule</h3>
            <p className="placeholder-text">Manage your property viewing appointments.</p>
          </div>
        )}
      </div>
    </div>
  );
}
