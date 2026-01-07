import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../RolePages.css';
import './LeasingAgentDashboard.css';

export default function LeasingAgentDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Listings', value: '18', icon: '🏠', change: '+3 this week', positive: true },
    { label: 'Viewings Today', value: '4', icon: '📅', change: '2 confirmed', positive: true },
    { label: 'Leases This Month', value: '8', icon: '✅', change: '+25% vs last month', positive: true },
    { label: 'Commission Earned', value: 'AED 32K', icon: '💰', change: 'YTD: AED 285K', positive: true },
  ];

  const leads = [
    { id: 1, name: 'Ahmed Al-Rashid', requirement: '2BR Marina', budget: 'AED 80-100K/yr', status: 'Hot', lastContact: 'Today', score: 92 },
    { id: 2, name: 'Sarah Johnson', requirement: 'Studio Downtown', budget: 'AED 50-70K/yr', status: 'Warm', lastContact: 'Yesterday', score: 75 },
    { id: 3, name: 'Mohammed Khan', requirement: '3BR JBR', budget: 'AED 150-180K/yr', status: 'New', lastContact: '2 days ago', score: 60 },
    { id: 4, name: 'Emily Chen', requirement: '1BR Business Bay', budget: 'AED 60-75K/yr', status: 'Warm', lastContact: '3 days ago', score: 70 },
  ];

  const upcomingViewings = [
    { property: 'Marina View 2BR', client: 'Ahmed Al-Rashid', time: '2:00 PM', landlord: 'Emirates Properties', status: 'Confirmed' },
    { property: 'Downtown Studio', client: 'Sarah Johnson', time: '4:30 PM', landlord: 'Dubai Holdings', status: 'Pending' },
    { property: 'JBR 3BR Apartment', client: 'Mohammed Khan', time: '6:00 PM', landlord: 'White Caves', status: 'Confirmed' },
  ];

  const myListings = [
    { id: 1, property: 'Marina View 2BR', location: 'Dubai Marina', rent: 'AED 95K/yr', views: 45, inquiries: 8, daysListed: 12 },
    { id: 2, property: 'Downtown Studio', location: 'Downtown Dubai', rent: 'AED 65K/yr', views: 32, inquiries: 5, daysListed: 8 },
    { id: 3, property: 'JBR 3BR Apt', location: 'JBR', rent: 'AED 180K/yr', views: 28, inquiries: 3, daysListed: 5 },
  ];

  const recentContracts = [
    { tenant: 'James Wilson', property: 'Marina 1BR', rent: 'AED 75K/yr', signedDate: 'Mar 1, 2024', status: 'Active' },
    { tenant: 'Fatima Ali', property: 'Business Bay 2BR', rent: 'AED 110K/yr', signedDate: 'Feb 25, 2024', status: 'Active' },
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <div className="header-content">
            <h1>Leasing Agent Dashboard</h1>
            <p>Manage your rental listings and tenant leads</p>
          </div>
          <div className="header-actions">
            <Link to="/leasing-agent/add-listing" className="btn btn-primary">
              <span>➕</span> Add Listing
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card enhanced">
              <div className="stat-icon-wrapper agent">
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
          <h3>Agent Tools</h3>
          <div className="links-grid">
            <Link to="/leasing-agent/tenant-screening" className="quick-link-card">
              <span className="link-icon">👤</span>
              <span className="link-title">Tenant Screening</span>
              <span className="link-desc">Verify tenant credentials</span>
            </Link>
            <Link to="/leasing-agent/contracts" className="quick-link-card">
              <span className="link-icon">📋</span>
              <span className="link-title">Contract Templates</span>
              <span className="link-desc">Tenancy agreements & Ejari</span>
            </Link>
            <Link to="/leasing-agent/commission" className="quick-link-card">
              <span className="link-icon">💰</span>
              <span className="link-title">Commission Tracker</span>
              <span className="link-desc">Track your earnings</span>
            </Link>
            <Link to="/leasing-agent/calendar" className="quick-link-card">
              <span className="link-icon">📅</span>
              <span className="link-title">Viewing Calendar</span>
              <span className="link-desc">Schedule & manage viewings</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>Leads</button>
          <button className={`tab-btn ${activeTab === 'viewings' ? 'active' : ''}`} onClick={() => setActiveTab('viewings')}>Viewings</button>
          <button className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>Listings</button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Active Leads</h3>
                <Link to="/leasing-agent/leads" className="view-all">View All →</Link>
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
                <h3>Today's Viewings</h3>
                <Link to="/leasing-agent/calendar" className="view-all">View Calendar →</Link>
              </div>
              <div className="viewings-list">
                {upcomingViewings.slice(0, 3).map((viewing, index) => (
                  <div key={index} className="viewing-item">
                    <div className="viewing-time-badge">{viewing.time}</div>
                    <div className="viewing-info">
                      <span className="viewing-property">{viewing.property}</span>
                      <span className="viewing-client">Client: {viewing.client}</span>
                    </div>
                    <span className={`viewing-status ${viewing.status.toLowerCase()}`}>{viewing.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>My Listings</h3>
                <Link to="/leasing-agent/listings" className="view-all">Manage Listings →</Link>
              </div>
              <div className="listings-list">
                {myListings.map(listing => (
                  <div key={listing.id} className="listing-item">
                    <div className="listing-info">
                      <span className="listing-property">{listing.property}</span>
                      <span className="listing-location">{listing.location}</span>
                    </div>
                    <div className="listing-stats">
                      <span className="stat-item">👁️ {listing.views}</span>
                      <span className="stat-item">💬 {listing.inquiries}</span>
                    </div>
                    <span className="listing-rent">{listing.rent}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Contracts</h3>
                <Link to="/leasing-agent/contracts" className="view-all">View All →</Link>
              </div>
              <div className="contracts-list">
                {recentContracts.map((contract, index) => (
                  <div key={index} className="contract-item">
                    <div className="contract-info">
                      <span className="contract-tenant">{contract.tenant}</span>
                      <span className="contract-property">{contract.property}</span>
                    </div>
                    <div className="contract-meta">
                      <span className="contract-rent">{contract.rent}</span>
                      <span className={`contract-status ${contract.status.toLowerCase()}`}>{contract.status}</span>
                    </div>
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
                    <p className="lead-requirement">Looking for: {lead.requirement}</p>
                    <p className="lead-budget">Budget: {lead.budget}</p>
                    <p className="lead-contact">Last contact: {lead.lastContact}</p>
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

        {activeTab === 'viewings' && (
          <div className="viewings-section">
            <div className="viewings-header">
              <h3>Viewing Schedule</h3>
              <button className="btn btn-primary btn-sm">+ Schedule Viewing</button>
            </div>
            <div className="viewings-grid">
              {upcomingViewings.map((viewing, index) => (
                <div key={index} className="viewing-card">
                  <div className="viewing-card-time">
                    <span className="time-display">{viewing.time}</span>
                    <span className={`status-badge ${viewing.status.toLowerCase()}`}>{viewing.status}</span>
                  </div>
                  <div className="viewing-card-details">
                    <h4>{viewing.property}</h4>
                    <p>Client: {viewing.client}</p>
                    <p>Landlord: {viewing.landlord}</p>
                  </div>
                  <div className="viewing-card-actions">
                    <button className="btn btn-sm btn-secondary">Reschedule</button>
                    <button className="btn btn-sm btn-primary">Confirm</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="listings-section">
            <div className="listings-header">
              <h3>My Rental Listings</h3>
              <Link to="/leasing-agent/add-listing" className="btn btn-primary btn-sm">+ Add Listing</Link>
            </div>
            <div className="listings-grid">
              {myListings.map(listing => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-card-image">🏠</div>
                  <div className="listing-card-content">
                    <h4>{listing.property}</h4>
                    <p className="listing-location">📍 {listing.location}</p>
                    <p className="listing-rent">{listing.rent}</p>
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
