import React, { useState } from 'react';
import './RoleDashboards.css';

export default function SellerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [propertyFilter, setPropertyFilter] = useState('all');

  const stats = [
    { label: 'Properties Listed', value: '3', icon: '🏠', change: 'For sale' },
    { label: 'Total Views', value: '892', icon: '👁️', change: 'Last 30 days' },
    { label: 'Inquiries', value: '24', icon: '💬', change: 'This month' },
    { label: 'Viewings Done', value: '8', icon: '📅', change: 'Completed' },
  ];

  const myListings = [
    { 
      id: 1, 
      title: 'Marina View Apartment', 
      type: 'Apartment',
      beds: 2,
      baths: 2,
      area: '1,200 sqft',
      price: 'AED 2.8M', 
      views: 456, 
      inquiries: 12, 
      status: 'Active',
      daysOnMarket: 15,
      category: 'residential'
    },
    { 
      id: 2, 
      title: 'JBR Penthouse', 
      type: 'Penthouse',
      beds: 4,
      baths: 5,
      area: '4,500 sqft',
      price: 'AED 12.5M', 
      views: 289, 
      inquiries: 8, 
      status: 'Active',
      daysOnMarket: 7,
      category: 'luxury'
    },
    { 
      id: 3, 
      title: 'Business Bay Office', 
      type: 'Office',
      beds: '-',
      baths: 2,
      area: '2,000 sqft',
      price: 'AED 4.2M', 
      views: 147, 
      inquiries: 4, 
      status: 'Under Offer',
      daysOnMarket: 30,
      category: 'commercial'
    },
  ];

  const filteredListings = propertyFilter === 'all' 
    ? myListings 
    : myListings.filter(p => p.category === propertyFilter);

  const recentInquiries = [
    { buyer: 'Mohammed Al-Rashid', property: 'Marina View Apartment', date: 'Today', status: 'New', budget: 'AED 2.5-3M' },
    { buyer: 'Sarah Johnson', property: 'JBR Penthouse', date: 'Yesterday', status: 'Responded', budget: 'AED 10-15M' },
    { buyer: 'Ahmed Hassan', property: 'Marina View Apartment', date: '2 days ago', status: 'Viewing Scheduled', budget: 'AED 2.8M' },
    { buyer: 'Emma Wilson', property: 'Business Bay Office', date: '3 days ago', status: 'Negotiating', budget: 'AED 4M' },
  ];

  const scheduledViewings = [
    { property: 'Marina View Apartment', buyer: 'John Smith', date: 'Tomorrow', time: '11:00 AM', agent: 'Ahmed Agent' },
    { property: 'JBR Penthouse', buyer: 'Michael Brown', date: 'Mar 5', time: '3:00 PM', agent: 'Sara Agent' },
    { property: 'Marina View Apartment', buyer: 'Lisa Chen', date: 'Mar 6', time: '10:00 AM', agent: 'Ahmed Agent' },
  ];

  const marketInsights = [
    { metric: 'Average Price/sqft (Marina)', value: 'AED 2,350', trend: '+5%' },
    { metric: 'Average Price/sqft (JBR)', value: 'AED 2,780', trend: '+3%' },
    { metric: 'Days on Market (Avg)', value: '45 days', trend: '-10%' },
    { metric: 'Similar Properties Sold', value: '12', trend: 'This month' },
  ];

  return (
    <div className="role-dashboard seller-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Seller Dashboard</h1>
          <p>Welcome back, {user?.name || 'Seller'}! Track your property sales.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ List New Property</button>
          <button className="btn btn-secondary">Get Valuation</button>
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
        <button className={`tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>My Properties for Sale</button>
        <button className={`tab ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>Buyer Inquiries</button>
        <button className={`tab ${activeTab === 'viewings' ? 'active' : ''}`} onClick={() => setActiveTab('viewings')}>Viewings</button>
        <button className={`tab ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>Market Insights</button>
        <button className={`tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>Documents</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card full-width">
              <div className="properties-header">
                <h3>Properties for Sale</h3>
                <div className="property-filters">
                  <button className={`filter-btn ${propertyFilter === 'all' ? 'active' : ''}`} onClick={() => setPropertyFilter('all')}>All</button>
                  <button className={`filter-btn ${propertyFilter === 'residential' ? 'active' : ''}`} onClick={() => setPropertyFilter('residential')}>Residential</button>
                  <button className={`filter-btn ${propertyFilter === 'luxury' ? 'active' : ''}`} onClick={() => setPropertyFilter('luxury')}>Luxury</button>
                  <button className={`filter-btn ${propertyFilter === 'commercial' ? 'active' : ''}`} onClick={() => setPropertyFilter('commercial')}>Commercial</button>
                </div>
              </div>
              <div className="listings-performance">
                {filteredListings.map(listing => (
                  <div key={listing.id} className="listing-performance-item">
                    <div className="listing-info">
                      <span className="listing-title">{listing.title}</span>
                      <span className="listing-specs">{listing.type} · {listing.beds !== '-' ? `${listing.beds} Beds ·` : ''} {listing.area}</span>
                      <span className="listing-price">{listing.price}</span>
                    </div>
                    <div className="listing-metrics">
                      <div className="metric">
                        <span className="metric-value">{listing.views}</span>
                        <span className="metric-label">Views</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{listing.inquiries}</span>
                        <span className="metric-label">Inquiries</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{listing.daysOnMarket}</span>
                        <span className="metric-label">Days Listed</span>
                      </div>
                    </div>
                    <span className={`listing-status ${listing.status.toLowerCase().replace(' ', '-')}`}>{listing.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Recent Inquiries</h3>
              <div className="inquiries-list">
                {recentInquiries.map((inquiry, index) => (
                  <div key={index} className="inquiry-item">
                    <div className="inquiry-info">
                      <span className="inquiry-buyer">{inquiry.buyer}</span>
                      <span className="inquiry-property">{inquiry.property}</span>
                      <span className="inquiry-budget">Budget: {inquiry.budget}</span>
                    </div>
                    <div className="inquiry-meta">
                      <span className={`inquiry-status status-${inquiry.status.toLowerCase().replace(' ', '-')}`}>
                        {inquiry.status}
                      </span>
                      <span className="inquiry-date">{inquiry.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Inquiries →</button>
            </div>

            <div className="dashboard-card">
              <h3>Upcoming Viewings</h3>
              <div className="viewings-list">
                {scheduledViewings.map((viewing, index) => (
                  <div key={index} className="viewing-item">
                    <div className="viewing-info">
                      <span className="viewing-property">{viewing.property}</span>
                      <span className="viewing-buyer">Buyer: {viewing.buyer}</span>
                      <span className="viewing-agent">Agent: {viewing.agent}</span>
                    </div>
                    <div className="viewing-time">
                      <span className="viewing-date">{viewing.date}</span>
                      <span>{viewing.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View Calendar →</button>
            </div>

            <div className="dashboard-card">
              <h3>Market Insights</h3>
              <div className="market-insights">
                {marketInsights.map((insight, index) => (
                  <div key={index} className="insight-item">
                    <span className="insight-metric">{insight.metric}</span>
                    <div className="insight-data">
                      <span className="insight-value">{insight.value}</span>
                      <span className="insight-trend">{insight.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="dashboard-card full-width">
            <h3>My Properties for Sale</h3>
            <p className="section-description">Manage your property listings, update prices, and track performance.</p>
            <div className="listings-grid">
              {myListings.map(listing => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-card-image">🏠</div>
                  <div className="listing-card-content">
                    <h4>{listing.title}</h4>
                    <p className="listing-specs">{listing.type} · {listing.beds !== '-' ? `${listing.beds} Beds · ${listing.baths} Baths ·` : ''} {listing.area}</p>
                    <p className="listing-price">{listing.price}</p>
                    <span className={`listing-status ${listing.status.toLowerCase().replace(' ', '-')}`}>{listing.status}</span>
                    <div className="listing-card-actions">
                      <button className="btn btn-primary">Edit Listing</button>
                      <button className="btn btn-secondary">View Analytics</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="dashboard-card">
            <h3>All Buyer Inquiries</h3>
            <p className="placeholder-text">Respond to buyer inquiries and schedule viewings.</p>
          </div>
        )}

        {activeTab === 'viewings' && (
          <div className="dashboard-card">
            <h3>Viewing Schedule</h3>
            <p className="placeholder-text">View and manage all scheduled property viewings.</p>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="dashboard-card">
            <h3>Market Analysis</h3>
            <div className="market-analysis">
              <p>Understanding the Dubai real estate market helps you price your property competitively.</p>
              <div className="market-tips">
                <h4>Selling Tips:</h4>
                <ul>
                  <li>Price competitively based on recent sales in your area</li>
                  <li>Professional photography increases inquiries by 40%</li>
                  <li>Properties priced correctly sell 50% faster</li>
                  <li>Stage your property for viewings</li>
                  <li>Be flexible with viewing times</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="dashboard-card">
            <h3>Required Documents for Sale</h3>
            <div className="documents-checklist">
              <div className="doc-item">
                <span className="doc-check">✅</span>
                <span>Title Deed Copy</span>
              </div>
              <div className="doc-item">
                <span className="doc-check">✅</span>
                <span>Owner's Emirates ID</span>
              </div>
              <div className="doc-item">
                <span className="doc-check">⏳</span>
                <span>NOC from Developer (Form F)</span>
              </div>
              <div className="doc-item">
                <span className="doc-check">⏳</span>
                <span>Mortgage Clearance Letter (if applicable)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
