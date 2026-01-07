import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../RolePages.css';
import './SalesAgentDashboard.css';

export default function SalesAgentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Listings', value: '24', icon: '🏢', change: '+5 this month', positive: true },
    { label: 'Viewings This Week', value: '12', icon: '📅', change: '3 today', positive: true },
    { label: 'Deals Closed (YTD)', value: '15', icon: '✅', change: 'AED 125M total', positive: true },
    { label: 'Commission Earned', value: 'AED 485K', icon: '💰', change: '+18% vs last year', positive: true },
  ];

  const leads = [
    { id: 1, name: 'John Smith', requirement: 'Palm Villa', budget: 'AED 40-50M', status: 'Hot', source: 'Website', score: 95 },
    { id: 2, name: 'Emma Wilson', requirement: 'Downtown Penthouse', budget: 'AED 25-35M', status: 'Warm', source: 'Referral', score: 78 },
    { id: 3, name: 'Omar Hassan', requirement: 'Marina 3BR', budget: 'AED 3-5M', status: 'New', source: 'Walk-in', score: 65 },
    { id: 4, name: 'Lisa Chen', requirement: 'Emirates Hills', budget: 'AED 60-80M', status: 'Hot', source: 'Partner', score: 92 },
  ];

  const activeDeals = [
    { property: 'Palm Jumeirah Villa', buyer: 'Michael Brown', price: 'AED 45M', stage: 'Negotiating', progress: 60 },
    { property: 'Downtown Penthouse', buyer: 'Lisa Chen', price: 'AED 28M', stage: 'Documentation', progress: 75 },
    { property: 'Emirates Hills Mansion', buyer: 'Robert Taylor', price: 'AED 65M', stage: 'Due Diligence', progress: 40 },
  ];

  const myListings = [
    { id: 1, property: 'Palm Jumeirah Villa', location: 'Palm Jumeirah', price: 'AED 45M', views: 156, inquiries: 12, daysListed: 18 },
    { id: 2, property: 'Downtown Penthouse', location: 'Downtown Dubai', price: 'AED 28M', views: 89, inquiries: 8, daysListed: 12 },
    { id: 3, property: 'Emirates Hills Villa', location: 'Emirates Hills', price: 'AED 65M', views: 45, inquiries: 4, daysListed: 8 },
  ];

  const pipelineStages = [
    { stage: 'Lead', count: 12, value: 'AED 180M' },
    { stage: 'Qualified', count: 8, value: 'AED 120M' },
    { stage: 'Viewing', count: 5, value: 'AED 85M' },
    { stage: 'Negotiation', count: 3, value: 'AED 138M' },
    { stage: 'Documentation', count: 2, value: 'AED 73M' },
    { stage: 'Closing', count: 1, value: 'AED 45M' },
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <div className="header-content">
            <h1>Sales Agent Dashboard</h1>
            <p>Manage your property sales and buyer leads</p>
          </div>
          <div className="header-actions">
            <Link to="/secondary-sales-agent/add-listing" className="btn btn-primary">
              <span>➕</span> Add Listing
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card enhanced">
              <div className="stat-icon-wrapper sales">
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <span className={`stat-change ${stat.positive ? 'positive' : 'neutral'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-links">
          <h3>Sales Tools</h3>
          <div className="links-grid">
            <Link to="/secondary-sales-agent/sales-pipeline" className="quick-link-card">
              <span className="link-icon">📊</span>
              <span className="link-title">Sales Pipeline</span>
              <span className="link-desc">Track deal progress</span>
            </Link>
            <Link to="/secondary-sales-agent/contracts" className="quick-link-card">
              <span className="link-icon">📋</span>
              <span className="link-title">Sales Contracts</span>
              <span className="link-desc">Form F, MOU templates</span>
            </Link>
            <Link to="/secondary-sales-agent/commission" className="quick-link-card">
              <span className="link-icon">💰</span>
              <span className="link-title">Commission Tracker</span>
              <span className="link-desc">Track your earnings</span>
            </Link>
            <Link to="/secondary-sales-agent/calendar" className="quick-link-card">
              <span className="link-icon">📅</span>
              <span className="link-title">Viewing Calendar</span>
              <span className="link-desc">Schedule property viewings</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>Leads</button>
          <button className={`tab-btn ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>Pipeline</button>
          <button className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>Listings</button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Active Leads</h3>
                <Link to="/secondary-sales-agent/leads" className="view-all">View All →</Link>
              </div>
              <div className="leads-list">
                {leads.slice(0, 3).map(lead => (
                  <div key={lead.id} className="lead-item">
                    <div className="lead-score">
                      <span className={`score ${lead.score >= 80 ? 'high' : lead.score >= 60 ? 'medium' : 'low'}`}>{lead.score}</span>
                    </div>
                    <div className="lead-info">
                      <span className="lead-name">{lead.name}</span>
                      <span className="lead-requirement">{lead.requirement} · {lead.budget}</span>
                    </div>
                    <span className={`lead-status status-${lead.status.toLowerCase()}`}>{lead.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Deals in Progress</h3>
                <Link to="/secondary-sales-agent/sales-pipeline" className="view-all">View Pipeline →</Link>
              </div>
              <div className="deals-list">
                {activeDeals.map((deal, index) => (
                  <div key={index} className="deal-item">
                    <div className="deal-info">
                      <span className="deal-property">{deal.property}</span>
                      <span className="deal-buyer">Buyer: {deal.buyer}</span>
                    </div>
                    <div className="deal-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${deal.progress}%` }}></div>
                      </div>
                      <span className="deal-stage">{deal.stage}</span>
                    </div>
                    <span className="deal-price">{deal.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card full-width">
              <div className="card-header">
                <h3>Sales Pipeline Overview</h3>
                <Link to="/secondary-sales-agent/sales-pipeline" className="view-all">Full Pipeline →</Link>
              </div>
              <div className="pipeline-overview">
                {pipelineStages.map((stage, index) => (
                  <div key={index} className="pipeline-stage">
                    <div className="stage-header">
                      <span className="stage-name">{stage.stage}</span>
                      <span className="stage-count">{stage.count}</span>
                    </div>
                    <span className="stage-value">{stage.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="leads-section">
            <div className="leads-header">
              <h3>All Leads</h3>
              <div className="leads-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Hot</button>
                <button className="filter-btn">Warm</button>
                <button className="filter-btn">New</button>
              </div>
            </div>
            <div className="leads-grid">
              {leads.map(lead => (
                <div key={lead.id} className="lead-card">
                  <div className="lead-card-header">
                    <div className="lead-avatar">{lead.name.charAt(0)}</div>
                    <div className="lead-header-info">
                      <span className="lead-name">{lead.name}</span>
                      <span className={`lead-status status-${lead.status.toLowerCase()}`}>{lead.status}</span>
                    </div>
                    <span className={`lead-score-badge ${lead.score >= 80 ? 'high' : lead.score >= 60 ? 'medium' : 'low'}`}>{lead.score}</span>
                  </div>
                  <div className="lead-card-body">
                    <p>Looking for: {lead.requirement}</p>
                    <p>Budget: {lead.budget}</p>
                    <p>Source: {lead.source}</p>
                  </div>
                  <div className="lead-card-actions">
                    <button className="btn btn-sm btn-secondary">View</button>
                    <button className="btn btn-sm btn-primary">Contact</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="pipeline-section">
            <div className="pipeline-header">
              <h3>Sales Pipeline</h3>
              <div className="pipeline-summary">
                <span>Total Value: <strong>AED 641M</strong></span>
                <span>31 Active Deals</span>
              </div>
            </div>
            <div className="pipeline-board">
              {pipelineStages.map((stage, index) => (
                <div key={index} className="pipeline-column">
                  <div className="column-header">
                    <span className="column-name">{stage.stage}</span>
                    <span className="column-count">{stage.count}</span>
                  </div>
                  <div className="column-value">{stage.value}</div>
                  <div className="column-deals">
                    {activeDeals.filter((_, i) => i <= index && i >= index - 1).slice(0, 2).map((deal, i) => (
                      <div key={i} className="pipeline-deal-card">
                        <span className="deal-name">{deal.property}</span>
                        <span className="deal-amount">{deal.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="listings-section">
            <div className="listings-header">
              <h3>My Property Listings</h3>
              <Link to="/secondary-sales-agent/add-listing" className="btn btn-primary btn-sm">+ Add Listing</Link>
            </div>
            <div className="listings-grid">
              {myListings.map(listing => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-card-image">🏢</div>
                  <div className="listing-card-content">
                    <h4>{listing.property}</h4>
                    <p className="listing-location">📍 {listing.location}</p>
                    <p className="listing-price">{listing.price}</p>
                    <div className="listing-metrics">
                      <span>👁️ {listing.views} views</span>
                      <span>💬 {listing.inquiries} inquiries</span>
                    </div>
                    <p className="listing-days">Listed {listing.daysListed} days ago</p>
                    <div className="listing-actions">
                      <button className="btn btn-sm btn-secondary">Edit</button>
                      <button className="btn btn-sm btn-primary">View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
