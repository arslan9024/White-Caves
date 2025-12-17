import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoleNavigation from '../../components/RoleNavigation';
import '../RolePages.css';

export default function LeasingAgentDashboardPage() {
  const stats = [
    { label: 'Active Listings', value: '18', icon: '🏠' },
    { label: 'Viewings Today', value: '4', icon: '📅' },
    { label: 'Leases This Month', value: '8', icon: '✅' },
    { label: 'Commission Earned', value: 'AED 32K', icon: '💰' },
  ];

  const leads = [
    { id: 1, name: 'Ahmed Al-Rashid', requirement: '2BR Marina', budget: 'AED 80-100K/yr', status: 'Hot' },
    { id: 2, name: 'Sarah Johnson', requirement: 'Studio Downtown', budget: 'AED 50-70K/yr', status: 'Warm' },
    { id: 3, name: 'Mohammed Khan', requirement: '3BR JBR', budget: 'AED 150-180K/yr', status: 'New' },
  ];

  const upcomingViewings = [
    { property: 'Marina View 2BR', client: 'Ahmed Al-Rashid', time: '2:00 PM', landlord: 'Emirates Properties' },
    { property: 'Downtown Studio', client: 'Sarah Johnson', time: '4:30 PM', landlord: 'Dubai Holdings' },
  ];

  const myListings = [
    { id: 1, property: 'Marina View 2BR', rent: 'AED 95K/yr', views: 45, inquiries: 8 },
    { id: 2, property: 'Downtown Studio', rent: 'AED 65K/yr', views: 32, inquiries: 5 },
    { id: 3, property: 'JBR 3BR Apt', rent: 'AED 180K/yr', views: 28, inquiries: 3 },
  ];

  return (
    <div className="role-page">
      <RoleNavigation role="leasing-agent" />
      
      <div className="role-page-content">
        <div className="page-header">
          <h1>Leasing Agent Dashboard</h1>
          <p>Manage your rental listings and tenant leads</p>
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
              <span className="link-desc">Tenancy agreements</span>
            </Link>
            <Link to="/leasing-agent/commission" className="quick-link-card">
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
            <Link to="/leasing-agent/leads" className="btn btn-link">View All Leads →</Link>
          </div>

          <div className="dashboard-card">
            <h3>Today's Viewings</h3>
            <div className="items-list">
              {upcomingViewings.map((viewing, index) => (
                <div key={index} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{viewing.property}</span>
                    <span className="item-subtitle">Client: {viewing.client}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-time">{viewing.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/leasing-agent/calendar" className="btn btn-link">View Calendar →</Link>
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
                  <span className="item-price">{listing.rent}</span>
                </div>
              ))}
            </div>
            <Link to="/leasing-agent/listings" className="btn btn-link">Manage Listings →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
