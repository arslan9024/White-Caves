import React from 'react';
import { Link } from 'react-router-dom';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function SalesAgentDashboardPage() {
  const stats = [
    { label: 'Active Listings', value: '24', icon: '🏢' },
    { label: 'Viewings This Week', value: '12', icon: '📅' },
    { label: 'Deals Closed (YTD)', value: '15', icon: '✅' },
    { label: 'Commission Earned', value: 'AED 485K', icon: '💰' },
  ];

  const leads = [
    { id: 1, name: 'John Smith', requirement: 'Palm Villa', budget: 'AED 40-50M', status: 'Hot' },
    { id: 2, name: 'Emma Wilson', requirement: 'Downtown Penthouse', budget: 'AED 25-35M', status: 'Warm' },
    { id: 3, name: 'Omar Hassan', requirement: 'Marina 3BR', budget: 'AED 3-5M', status: 'New' },
  ];

  const activeDeals = [
    { property: 'Palm Jumeirah Villa', buyer: 'Michael Brown', price: 'AED 45M', stage: 'Negotiating' },
    { property: 'Downtown Penthouse', buyer: 'Lisa Chen', price: 'AED 28M', stage: 'Documentation' },
  ];

  const myListings = [
    { id: 1, property: 'Palm Jumeirah Villa', price: 'AED 45M', views: 156, inquiries: 12 },
    { id: 2, property: 'Downtown Penthouse', price: 'AED 28M', views: 89, inquiries: 8 },
    { id: 3, property: 'Emirates Hills Villa', price: 'AED 65M', views: 45, inquiries: 4 },
  ];

  return (
    <div className="role-page">
      <RoleNavigation role="secondary-sales-agent" />
      
      <div className="role-page-content">
        <div className="page-header">
          <h1>Sales Agent Dashboard</h1>
          <p>Manage your property sales and buyer leads</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
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
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Active Leads</h3>
            <div className="items-list">
              {leads.map(lead => (
                <div key={lead.id} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{lead.name}</span>
                    <span className="item-subtitle">{lead.requirement} · {lead.budget}</span>
                  </div>
                  <span className={`item-status status-${lead.status.toLowerCase()}`}>{lead.status}</span>
                </div>
              ))}
            </div>
            <Link to="/secondary-sales-agent/leads" className="btn btn-link">View All Leads →</Link>
          </div>

          <div className="dashboard-card">
            <h3>Deals in Progress</h3>
            <div className="items-list">
              {activeDeals.map((deal, index) => (
                <div key={index} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{deal.property}</span>
                    <span className="item-subtitle">Buyer: {deal.buyer}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-price">{deal.price}</span>
                    <span className="item-stage">{deal.stage}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/secondary-sales-agent/sales-pipeline" className="btn btn-link">View Pipeline →</Link>
          </div>

          <div className="dashboard-card">
            <h3>My Listings</h3>
            <div className="items-list">
              {myListings.map(listing => (
                <div key={listing.id} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{listing.property}</span>
                    <span className="item-subtitle">{listing.views} views · {listing.inquiries} inquiries</span>
                  </div>
                  <span className="item-price">{listing.price}</span>
                </div>
              ))}
            </div>
            <Link to="/secondary-sales-agent/listings" className="btn btn-link">Manage Listings →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
