import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function SellerDashboardPage() {
  const stats = [
    { label: 'Properties Listed', value: '3', icon: '🏠' },
    { label: 'Total Views', value: '1,245', icon: '👁️' },
    { label: 'Inquiries', value: '34', icon: '💬' },
    { label: 'Viewings Completed', value: '12', icon: '📅' },
  ];

  const myListings = [
    { id: 1, title: 'Marina View Apartment', price: 'AED 2.8M', views: 456, inquiries: 12, status: 'Active' },
    { id: 2, title: 'JBR Penthouse', price: 'AED 12.5M', views: 289, inquiries: 8, status: 'Active' },
    { id: 3, title: 'Business Bay Office', price: 'AED 4.2M', views: 147, inquiries: 4, status: 'Under Offer' },
  ];

  const recentInquiries = [
    { buyer: 'Mohammed Al-Rashid', property: 'Marina View Apartment', date: 'Today', status: 'New' },
    { buyer: 'Sarah Johnson', property: 'JBR Penthouse', date: 'Yesterday', status: 'Responded' },
    { buyer: 'Ahmed Hassan', property: 'Business Bay Office', date: '2 days ago', status: 'Viewing Scheduled' },
  ];

  return (
    <div className="role-page">
      <RoleNavigation role="seller" />
      
      <div className="role-page-content">
        <div className="page-header">
          <h1>Seller Dashboard</h1>
          <p>Track your property listings and buyer inquiries</p>
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
          <h3>Seller Tools</h3>
          <div className="links-grid">
            <Link to="/seller/pricing-tools" className="quick-link-card">
              <span className="link-icon">💰</span>
              <span className="link-title">Pricing Tools</span>
              <span className="link-desc">Market analysis & valuation</span>
            </Link>
            <Link to="/seller/commission-calculator" className="quick-link-card">
              <span className="link-icon">🧮</span>
              <span className="link-title">Commission Calculator</span>
              <span className="link-desc">Calculate your net proceeds</span>
            </Link>
            <Link to="/seller/documents" className="quick-link-card">
              <span className="link-icon">📋</span>
              <span className="link-title">Required Documents</span>
              <span className="link-desc">Selling checklist</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>My Listings</h3>
            <div className="items-list">
              {myListings.map(listing => (
                <div key={listing.id} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{listing.title}</span>
                    <span className="item-subtitle">{listing.views} views · {listing.inquiries} inquiries</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-price">{listing.price}</span>
                    <span className={`item-status ${listing.status.toLowerCase().replace(' ', '-')}`}>{listing.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/seller/listings" className="btn btn-link">Manage Listings →</Link>
          </div>

          <div className="dashboard-card">
            <h3>Recent Inquiries</h3>
            <div className="items-list">
              {recentInquiries.map((inquiry, index) => (
                <div key={index} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{inquiry.buyer}</span>
                    <span className="item-subtitle">{inquiry.property}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-date">{inquiry.date}</span>
                    <span className={`item-status ${inquiry.status.toLowerCase().replace(' ', '-')}`}>{inquiry.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/seller/inquiries" className="btn btn-link">View All Inquiries →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
