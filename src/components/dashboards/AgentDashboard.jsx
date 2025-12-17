import React, { useState } from 'react';
import './RoleDashboards.css';

export default function AgentDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [agentType, setAgentType] = useState('leasing');

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

  const stats = agentType === 'leasing' ? leasingStats : salesStats;

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

  const recentLeads = agentType === 'leasing' ? leasingLeads : salesLeads;

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

  const upcomingViewings = agentType === 'leasing' ? leasingViewings : salesViewings;

  const leasingListings = [
    { id: 1, title: 'Marina View 2BR', type: 'Apartment', rent: 'AED 95K/yr', status: 'Available', views: 45, inquiries: 8 },
    { id: 2, title: 'Downtown Studio', type: 'Studio', rent: 'AED 65K/yr', status: 'Available', views: 32, inquiries: 5 },
    { id: 3, title: 'JBR 3BR Apartment', type: 'Apartment', rent: 'AED 180K/yr', status: 'Reserved', views: 28, inquiries: 3 },
  ];

  const salesListings = [
    { id: 1, title: 'Palm Jumeirah Villa', type: 'Villa', price: 'AED 45M', status: 'Available', views: 156, inquiries: 12 },
    { id: 2, title: 'Downtown Penthouse', type: 'Penthouse', price: 'AED 28M', status: 'Under Offer', views: 89, inquiries: 8 },
    { id: 3, title: 'Marina 2BR', type: 'Apartment', price: 'AED 3.5M', status: 'Available', views: 234, inquiries: 15 },
  ];

  const myListings = agentType === 'leasing' ? leasingListings : salesListings;

  const agentResources = [
    { title: 'Commission Structure', description: 'Leasing: 50% of one month rent, Sales: 1-2% of sale price' },
    { title: 'RERA Guidelines', description: 'Follow all RERA regulations for property transactions' },
    { title: 'Client Communication', description: 'Respond to inquiries within 2 hours' },
    { title: 'Documentation', description: 'Ensure all forms (A, B, F) are properly completed' },
  ];

  return (
    <div className="role-dashboard agent-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Agent Dashboard</h1>
          <p>Welcome back, {user?.name || 'Agent'}! Here's your {agentType} performance overview.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Add Listing</button>
          <button className="btn btn-secondary">Schedule Viewing</button>
        </div>
      </div>

      <div className="team-type-selector">
        <button 
          className={`team-type-btn ${agentType === 'leasing' ? 'active' : ''}`}
          onClick={() => setAgentType('leasing')}
        >
          🔑 Leasing Agent
        </button>
        <button 
          className={`team-type-btn ${agentType === 'sales' ? 'active' : ''}`}
          onClick={() => setAgentType('sales')}
        >
          💼 Sales Agent (Secondary)
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
        <button className={`tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>My Listings</button>
        <button className={`tab ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>Leads</button>
        <button className={`tab ${activeTab === 'viewings' ? 'active' : ''}`} onClick={() => setActiveTab('viewings')}>Viewings</button>
        <button className={`tab ${activeTab === 'commission' ? 'active' : ''}`} onClick={() => setActiveTab('commission')}>Commission</button>
        <button className={`tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>Resources</button>
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
                      <span className="lead-budget">Budget: {lead.budget}</span>
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
                      <span className="viewing-owner">{agentType === 'leasing' ? `Landlord: ${viewing.landlord}` : `Seller: ${viewing.seller}`}</span>
                    </div>
                    <span className="viewing-time">{viewing.time}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View Calendar →</button>
            </div>

            <div className="dashboard-card">
              <h3>My Active Listings</h3>
              <div className="listings-preview">
                {myListings.map(listing => (
                  <div key={listing.id} className="listing-preview-item">
                    <div className="listing-info">
                      <span className="listing-title">{listing.title}</span>
                      <span className="listing-type">{listing.type}</span>
                    </div>
                    <div className="listing-meta">
                      <span className="listing-price">{agentType === 'leasing' ? listing.rent : listing.price}</span>
                      <span className={`listing-status ${listing.status.toLowerCase().replace(' ', '-')}`}>{listing.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Listings →</button>
            </div>

            <div className="dashboard-card">
              <h3>Performance This Month</h3>
              <div className="performance-summary">
                <div className="perf-item">
                  <span className="perf-label">Target</span>
                  <span className="perf-value">{agentType === 'leasing' ? '15 Leases' : '10 Sales'}</span>
                </div>
                <div className="perf-item">
                  <span className="perf-label">Achieved</span>
                  <span className="perf-value">{agentType === 'leasing' ? '12 Leases' : '8 Sales'}</span>
                </div>
                <div className="perf-item">
                  <span className="perf-label">Progress</span>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{width: agentType === 'leasing' ? '80%' : '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="dashboard-card full-width">
            <h3>My Property Listings</h3>
            <div className="listings-table">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>{agentType === 'leasing' ? 'Rent' : 'Price'}</th>
                    <th>Views</th>
                    <th>Inquiries</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myListings.map(listing => (
                    <tr key={listing.id}>
                      <td>{listing.title}</td>
                      <td>{listing.type}</td>
                      <td>{agentType === 'leasing' ? listing.rent : listing.price}</td>
                      <td>{listing.views}</td>
                      <td>{listing.inquiries}</td>
                      <td><span className={`status-badge ${listing.status.toLowerCase().replace(' ', '-')}`}>{listing.status}</span></td>
                      <td>
                        <button className="btn btn-sm">Edit</button>
                        <button className="btn btn-sm btn-secondary">Analytics</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="dashboard-card">
            <h3>Lead Management</h3>
            <p className="placeholder-text">Track and manage your {agentType === 'leasing' ? 'tenant' : 'buyer'} leads and client inquiries.</p>
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="dashboard-card">
            <h3>Viewing Schedule</h3>
            <p className="placeholder-text">Manage your property viewing appointments.</p>
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="dashboard-card full-width">
            <h3>Commission Summary</h3>
            <div className="commission-info">
              <div className="commission-stat">
                <span className="stat-label">This Month</span>
                <span className="stat-value">{agentType === 'leasing' ? 'AED 45,000' : 'AED 125,000'}</span>
              </div>
              <div className="commission-stat">
                <span className="stat-label">YTD Total</span>
                <span className="stat-value">{agentType === 'leasing' ? 'AED 180,000' : 'AED 520,000'}</span>
              </div>
              <div className="commission-stat">
                <span className="stat-label">Pending</span>
                <span className="stat-value">{agentType === 'leasing' ? 'AED 12,500' : 'AED 85,000'}</span>
              </div>
            </div>
            <div className="commission-structure">
              <h4>Commission Structure</h4>
              {agentType === 'leasing' ? (
                <ul>
                  <li>Annual Lease: 50% of one month's rent</li>
                  <li>Short-term Lease: 10% of total contract value</li>
                  <li>Renewal: 25% of one month's rent</li>
                </ul>
              ) : (
                <ul>
                  <li>Secondary Sales: 1-2% of sale price (split with company)</li>
                  <li>Off-Plan: Commission varies by developer</li>
                  <li>Referral Bonus: Additional 10% of commission</li>
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="dashboard-card full-width">
            <h3>Agent Resources</h3>
            <div className="resources-grid">
              {agentResources.map((resource, index) => (
                <div key={index} className="resource-card">
                  <h4>{resource.title}</h4>
                  <p>{resource.description}</p>
                </div>
              ))}
            </div>
            <div className="helpful-links">
              <h4>Helpful Links</h4>
              <ul>
                <li>Dubai Land Department (DLD) Portal</li>
                <li>RERA Rental Index Calculator</li>
                <li>Ejari Registration System</li>
                <li>Property Valuation Tools</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
