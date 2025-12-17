import React, { useState } from 'react';
import './RoleDashboards.css';

export default function SellerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Listings', value: '2', icon: '🏠', change: 'On market' },
    { label: 'Total Views', value: '458', icon: '👁️', change: 'Last 30 days' },
    { label: 'Inquiries', value: '12', icon: '💬', change: 'This month' },
    { label: 'Viewings Scheduled', value: '4', icon: '📅', change: 'Upcoming' },
  ];

  const myListings = [
    { 
      id: 1, 
      title: 'Marina View Apartment', 
      price: 'AED 2.8M', 
      views: 234, 
      inquiries: 8, 
      status: 'Active',
      daysOnMarket: 15 
    },
    { 
      id: 2, 
      title: 'JBR Penthouse', 
      price: 'AED 8.5M', 
      views: 156, 
      inquiries: 4, 
      status: 'Active',
      daysOnMarket: 7 
    },
  ];

  const recentInquiries = [
    { buyer: 'Mohammed Al-Rashid', property: 'Marina View Apartment', date: 'Today', status: 'New' },
    { buyer: 'Sarah Johnson', property: 'JBR Penthouse', date: 'Yesterday', status: 'Responded' },
    { buyer: 'Ahmed Hassan', property: 'Marina View Apartment', date: '2 days ago', status: 'Viewing Scheduled' },
  ];

  const scheduledViewings = [
    { property: 'Marina View Apartment', buyer: 'John Smith', date: 'Tomorrow', time: '11:00 AM' },
    { property: 'JBR Penthouse', buyer: 'Emma Wilson', date: 'Mar 5', time: '3:00 PM' },
  ];

  return (
    <div className="role-dashboard seller-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Seller Dashboard</h1>
          <p>Welcome back, {user?.name || 'Seller'}! Track your property listings.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ List Property</button>
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
        <button className={`tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>My Listings</button>
        <button className={`tab ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>Inquiries</button>
        <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card full-width">
              <h3>My Listings Performance</h3>
              <div className="listings-performance">
                {myListings.map(listing => (
                  <div key={listing.id} className="listing-performance-item">
                    <div className="listing-info">
                      <span className="listing-title">{listing.title}</span>
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
                    <span className={`listing-status ${listing.status.toLowerCase()}`}>{listing.status}</span>
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
              <h3>Scheduled Viewings</h3>
              <div className="viewings-list">
                {scheduledViewings.map((viewing, index) => (
                  <div key={index} className="viewing-item">
                    <div className="viewing-info">
                      <span className="viewing-property">{viewing.property}</span>
                      <span className="viewing-buyer">with {viewing.buyer}</span>
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
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="dashboard-card">
            <h3>Manage Listings</h3>
            <p className="placeholder-text">Edit your property listings and update details.</p>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="dashboard-card">
            <h3>All Inquiries</h3>
            <p className="placeholder-text">Respond to buyer inquiries and schedule viewings.</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-card">
            <h3>Listing Analytics</h3>
            <p className="placeholder-text">View detailed performance metrics for your properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}
