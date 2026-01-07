import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../RolePages.css';
import './SellerDashboard.css';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Listings', value: '3', icon: '🏠', change: '+1 this month', positive: true },
    { label: 'Total Views', value: '1,245', icon: '👁️', change: '+15% vs last week', positive: true },
    { label: 'Inquiries', value: '34', icon: '💬', change: '8 new', positive: true },
    { label: 'Viewings Completed', value: '12', icon: '📅', change: '3 this week', positive: true },
  ];

  const myListings = [
    { id: 1, title: 'Marina View Apartment', price: 'AED 2,800,000', views: 456, inquiries: 12, viewings: 5, status: 'Active', daysListed: 15 },
    { id: 2, title: 'JBR Penthouse', price: 'AED 12,500,000', views: 289, inquiries: 8, viewings: 3, status: 'Active', daysListed: 8 },
    { id: 3, title: 'Business Bay Office', price: 'AED 4,200,000', views: 147, inquiries: 4, viewings: 2, status: 'Under Offer', daysListed: 22 },
  ];

  const recentInquiries = [
    { id: 1, buyer: 'Mohammed Al-Rashid', property: 'Marina View Apartment', message: 'Interested in scheduling a viewing...', date: 'Today', status: 'New', qualified: true },
    { id: 2, buyer: 'Sarah Johnson', property: 'JBR Penthouse', message: 'Can you provide more details about...', date: 'Yesterday', status: 'Responded', qualified: true },
    { id: 3, buyer: 'Ahmed Hassan', property: 'Business Bay Office', message: 'What is the service charge for...', date: '2 days ago', status: 'Viewing Scheduled', qualified: false },
    { id: 4, buyer: 'Emily Chen', property: 'Marina View Apartment', message: 'Is the price negotiable?', date: '3 days ago', status: 'New', qualified: true },
  ];

  const marketInsights = [
    { area: 'Dubai Marina', avgPrice: 'AED 1,850/sqft', trend: '+3.2%', demand: 'High' },
    { area: 'JBR', avgPrice: 'AED 2,100/sqft', trend: '+5.1%', demand: 'Very High' },
    { area: 'Business Bay', avgPrice: 'AED 1,650/sqft', trend: '+1.8%', demand: 'Medium' },
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <div className="header-content">
            <h1>Seller Dashboard</h1>
            <p>Track your property listings and buyer inquiries</p>
          </div>
          <div className="header-actions">
            <Link to="/seller/add-listing" className="btn btn-primary">
              <span>➕</span> Add New Listing
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card enhanced">
              <div className="stat-icon-wrapper seller">
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
          <h3>Seller Tools</h3>
          <div className="links-grid">
            <Link to="/seller/pricing-tools" className="quick-link-card">
              <span className="link-icon">💰</span>
              <span className="link-title">Pricing Tools</span>
              <span className="link-desc">Market analysis & property valuation</span>
            </Link>
            <Link to="/seller/commission-calculator" className="quick-link-card">
              <span className="link-icon">🧮</span>
              <span className="link-title">Net Proceeds Calculator</span>
              <span className="link-desc">Calculate your sale proceeds</span>
            </Link>
            <Link to="/seller/documents" className="quick-link-card">
              <span className="link-icon">📋</span>
              <span className="link-title">Required Documents</span>
              <span className="link-desc">Selling checklist & documents</span>
            </Link>
            <Link to="/seller/marketing" className="quick-link-card">
              <span className="link-icon">📢</span>
              <span className="link-title">Marketing Insights</span>
              <span className="link-desc">Listing performance analytics</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>My Listings</button>
          <button className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>Inquiries</button>
          <button className={`tab-btn ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>Market Insights</button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>My Listings</h3>
                <Link to="/seller/listings" className="view-all">Manage Listings →</Link>
              </div>
              <div className="listings-table">
                <div className="table-header">
                  <span>Property</span>
                  <span>Views</span>
                  <span>Inquiries</span>
                  <span>Status</span>
                </div>
                {myListings.map(listing => (
                  <div key={listing.id} className="table-row">
                    <div className="listing-info">
                      <span className="listing-title">{listing.title}</span>
                      <span className="listing-price">{listing.price}</span>
                    </div>
                    <span className="listing-views">{listing.views}</span>
                    <span className="listing-inquiries">{listing.inquiries}</span>
                    <span className={`listing-status ${listing.status.toLowerCase().replace(' ', '-')}`}>{listing.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Inquiries</h3>
                <Link to="/seller/inquiries" className="view-all">View All →</Link>
              </div>
              <div className="inquiries-list">
                {recentInquiries.slice(0, 3).map(inquiry => (
                  <div key={inquiry.id} className="inquiry-item">
                    <div className="inquiry-header">
                      <span className="buyer-name">{inquiry.buyer}</span>
                      {inquiry.qualified && <span className="qualified-badge">Qualified</span>}
                    </div>
                    <span className="inquiry-property">{inquiry.property}</span>
                    <p className="inquiry-message">{inquiry.message}</p>
                    <div className="inquiry-footer">
                      <span className="inquiry-date">{inquiry.date}</span>
                      <span className={`inquiry-status ${inquiry.status.toLowerCase().replace(' ', '-')}`}>{inquiry.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card full-width">
              <div className="card-header">
                <h3>Market Insights</h3>
                <Link to="/seller/market" className="view-all">Full Report →</Link>
              </div>
              <div className="market-grid">
                {marketInsights.map((area, index) => (
                  <div key={index} className="market-card">
                    <h4>{area.area}</h4>
                    <div className="market-stats">
                      <div className="market-stat">
                        <span className="market-label">Avg. Price</span>
                        <span className="market-value">{area.avgPrice}</span>
                      </div>
                      <div className="market-stat">
                        <span className="market-label">Trend</span>
                        <span className={`market-value trend ${area.trend.startsWith('+') ? 'positive' : 'negative'}`}>{area.trend}</span>
                      </div>
                      <div className="market-stat">
                        <span className="market-label">Demand</span>
                        <span className={`market-value demand ${area.demand.toLowerCase().replace(' ', '-')}`}>{area.demand}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="listings-section">
            <div className="listings-header">
              <h3>All Listings</h3>
              <Link to="/seller/add-listing" className="btn btn-primary btn-sm">+ Add Listing</Link>
            </div>
            <div className="listings-grid">
              {myListings.map(listing => (
                <div key={listing.id} className="listing-card">
                  <div className="listing-card-image">🏠</div>
                  <div className="listing-card-content">
                    <div className="listing-card-header">
                      <h4>{listing.title}</h4>
                      <span className={`status-badge ${listing.status.toLowerCase().replace(' ', '-')}`}>{listing.status}</span>
                    </div>
                    <p className="listing-card-price">{listing.price}</p>
                    <div className="listing-card-stats">
                      <span>👁️ {listing.views} views</span>
                      <span>💬 {listing.inquiries} inquiries</span>
                      <span>📅 {listing.viewings} viewings</span>
                    </div>
                    <p className="listing-card-days">Listed {listing.daysListed} days ago</p>
                    <div className="listing-card-actions">
                      <button className="btn btn-sm btn-secondary">Edit</button>
                      <button className="btn btn-sm btn-primary">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="inquiries-section">
            <div className="inquiries-header">
              <h3>All Inquiries</h3>
              <div className="inquiries-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">New</button>
                <button className="filter-btn">Responded</button>
                <button className="filter-btn">Qualified</button>
              </div>
            </div>
            <div className="inquiries-grid">
              {recentInquiries.map(inquiry => (
                <div key={inquiry.id} className="inquiry-card">
                  <div className="inquiry-card-header">
                    <div className="buyer-info">
                      <span className="buyer-avatar">{inquiry.buyer.charAt(0)}</span>
                      <div>
                        <span className="buyer-name">{inquiry.buyer}</span>
                        {inquiry.qualified && <span className="qualified-badge">Qualified Buyer</span>}
                      </div>
                    </div>
                    <span className={`inquiry-status ${inquiry.status.toLowerCase().replace(' ', '-')}`}>{inquiry.status}</span>
                  </div>
                  <div className="inquiry-card-body">
                    <span className="inquiry-property">Re: {inquiry.property}</span>
                    <p className="inquiry-message">{inquiry.message}</p>
                  </div>
                  <div className="inquiry-card-footer">
                    <span className="inquiry-date">{inquiry.date}</span>
                    <div className="inquiry-actions">
                      <button className="btn btn-sm btn-secondary">View</button>
                      <button className="btn btn-sm btn-primary">Respond</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="market-section">
            <div className="market-header">
              <h3>Dubai Real Estate Market Insights</h3>
              <p>Stay informed about market trends to price your property competitively</p>
            </div>
            <div className="market-insights-grid">
              {marketInsights.map((area, index) => (
                <div key={index} className="market-insight-card">
                  <h4>{area.area}</h4>
                  <div className="insight-details">
                    <div className="insight-row">
                      <span className="insight-label">Average Price per sqft</span>
                      <span className="insight-value">{area.avgPrice}</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">Price Trend (3 months)</span>
                      <span className={`insight-value trend ${area.trend.startsWith('+') ? 'positive' : 'negative'}`}>{area.trend}</span>
                    </div>
                    <div className="insight-row">
                      <span className="insight-label">Market Demand</span>
                      <span className={`insight-value demand-badge ${area.demand.toLowerCase().replace(' ', '-')}`}>{area.demand}</span>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline w-full">View Full Analysis</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
