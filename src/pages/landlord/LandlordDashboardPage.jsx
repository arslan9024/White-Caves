import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../RolePages.css';
import './LandlordDashboard.css';

export default function LandlordDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Properties', value: '6', icon: '🏢', change: 'Portfolio value: AED 15.2M', positive: true },
    { label: 'Occupied', value: '5', icon: '🔑', change: '83% occupancy', positive: true },
    { label: 'Available', value: '1', icon: '📋', change: 'Ready to rent', positive: false },
    { label: 'Monthly Income', value: 'AED 125K', icon: '💰', change: '+8% vs last month', positive: true },
  ];

  const properties = [
    { id: 1, name: 'Marina View 2BR', location: 'Dubai Marina', status: 'Occupied', rent: 'AED 95,000/yr', tenant: 'Ahmed Al-Rashid', leaseEnd: 'Dec 2024', paymentStatus: 'Paid' },
    { id: 2, name: 'Downtown Studio', location: 'Downtown Dubai', status: 'Occupied', rent: 'AED 65,000/yr', tenant: 'Sarah Johnson', leaseEnd: 'Jun 2024', paymentStatus: 'Due Soon' },
    { id: 3, name: 'JBR 3BR Apartment', location: 'JBR', status: 'Available', rent: 'AED 180,000/yr', tenant: '-', leaseEnd: '-', paymentStatus: '-' },
    { id: 4, name: 'Business Bay Office', location: 'Business Bay', status: 'Occupied', rent: 'AED 250,000/yr', tenant: 'Tech Solutions LLC', leaseEnd: 'Mar 2025', paymentStatus: 'Paid' },
  ];

  const maintenanceRequests = [
    { id: 1, property: 'Marina View 2BR', issue: 'AC maintenance required', priority: 'Medium', date: 'Today', status: 'Pending' },
    { id: 2, property: 'Downtown Studio', issue: 'Water heater replacement', priority: 'High', date: 'Yesterday', status: 'In Progress' },
    { id: 3, property: 'Business Bay Office', issue: 'Parking access card issue', priority: 'Low', date: '3 days ago', status: 'Resolved' },
  ];

  const financialSummary = {
    totalIncome: 'AED 590,000',
    collected: 'AED 495,000',
    pending: 'AED 95,000',
    expenses: 'AED 45,000',
    netIncome: 'AED 450,000',
  };

  const upcomingLeaseEvents = [
    { property: 'Downtown Studio', event: 'Lease Renewal', date: 'Jun 15, 2024', daysLeft: 45 },
    { property: 'Marina View 2BR', event: 'Rent Review', date: 'Nov 1, 2024', daysLeft: 180 },
    { property: 'Business Bay Office', event: 'Lease Expiry', date: 'Mar 15, 2025', daysLeft: 320 },
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <div className="header-content">
            <h1>Landlord Dashboard</h1>
            <p>Manage your rental property portfolio</p>
          </div>
          <div className="header-actions">
            <Link to="/landlord/add-property" className="btn btn-primary">
              <span>➕</span> Add Property
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card enhanced">
              <div className="stat-icon-wrapper landlord">
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
          <h3>Landlord Tools</h3>
          <div className="links-grid">
            <Link to="/landlord/rental-management" className="quick-link-card">
              <span className="link-icon">🏠</span>
              <span className="link-title">Rental Management</span>
              <span className="link-desc">Manage properties & tenants</span>
            </Link>
            <Link to="/landlord/yield-calculator" className="quick-link-card">
              <span className="link-icon">📊</span>
              <span className="link-title">Yield Calculator</span>
              <span className="link-desc">Calculate rental returns</span>
            </Link>
            <Link to="/landlord/ejari" className="quick-link-card">
              <span className="link-icon">📋</span>
              <span className="link-title">Ejari Registration</span>
              <span className="link-desc">Contract registration guide</span>
            </Link>
            <Link to="/landlord/finances" className="quick-link-card">
              <span className="link-icon">💳</span>
              <span className="link-title">Financial Reports</span>
              <span className="link-desc">Income & expense tracking</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>Properties</button>
          <button className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>Maintenance</button>
          <button className={`tab-btn ${activeTab === 'finances' ? 'active' : ''}`} onClick={() => setActiveTab('finances')}>Finances</button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-grid landlord-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>My Properties</h3>
                <Link to="/landlord/properties" className="view-all">View All →</Link>
              </div>
              <div className="properties-list">
                {properties.slice(0, 3).map(property => (
                  <div key={property.id} className="property-row">
                    <div className="property-main">
                      <span className="property-name">{property.name}</span>
                      <span className="property-location">{property.location}</span>
                    </div>
                    <div className="property-tenant">
                      {property.tenant !== '-' ? (
                        <>
                          <span className="tenant-name">{property.tenant}</span>
                          <span className="lease-end">Until {property.leaseEnd}</span>
                        </>
                      ) : (
                        <span className="no-tenant">No tenant</span>
                      )}
                    </div>
                    <div className="property-status-col">
                      <span className={`property-badge ${property.status.toLowerCase()}`}>{property.status}</span>
                      {property.paymentStatus !== '-' && (
                        <span className={`payment-badge ${property.paymentStatus.toLowerCase().replace(' ', '-')}`}>{property.paymentStatus}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Maintenance Requests</h3>
                <Link to="/landlord/maintenance" className="view-all">View All →</Link>
              </div>
              <div className="maintenance-list">
                {maintenanceRequests.slice(0, 3).map(request => (
                  <div key={request.id} className="maintenance-item">
                    <div className="maintenance-info">
                      <span className="maintenance-issue">{request.issue}</span>
                      <span className="maintenance-property">{request.property}</span>
                    </div>
                    <div className="maintenance-meta">
                      <span className={`priority-badge ${request.priority.toLowerCase()}`}>{request.priority}</span>
                      <span className={`status-badge ${request.status.toLowerCase().replace(' ', '-')}`}>{request.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Financial Summary</h3>
                <Link to="/landlord/finances" className="view-all">Full Report →</Link>
              </div>
              <div className="financial-summary">
                <div className="financial-row highlight">
                  <span className="financial-label">Total Annual Income</span>
                  <span className="financial-value">{financialSummary.totalIncome}</span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Collected</span>
                  <span className="financial-value success">{financialSummary.collected}</span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Pending</span>
                  <span className="financial-value warning">{financialSummary.pending}</span>
                </div>
                <div className="financial-row">
                  <span className="financial-label">Expenses</span>
                  <span className="financial-value">{financialSummary.expenses}</span>
                </div>
                <div className="financial-row net">
                  <span className="financial-label">Net Income</span>
                  <span className="financial-value">{financialSummary.netIncome}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>Upcoming Events</h3>
                <Link to="/landlord/calendar" className="view-all">View Calendar →</Link>
              </div>
              <div className="events-list">
                {upcomingLeaseEvents.map((event, index) => (
                  <div key={index} className="event-item">
                    <div className="event-info">
                      <span className="event-type">{event.event}</span>
                      <span className="event-property">{event.property}</span>
                    </div>
                    <div className="event-date">
                      <span className="date-text">{event.date}</span>
                      <span className="days-left">{event.daysLeft} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="properties-section">
            <div className="properties-header">
              <h3>All Properties</h3>
              <Link to="/landlord/add-property" className="btn btn-primary btn-sm">+ Add Property</Link>
            </div>
            <div className="properties-grid">
              {properties.map(property => (
                <div key={property.id} className="property-card-full">
                  <div className="property-card-header">
                    <h4>{property.name}</h4>
                    <span className={`status-badge ${property.status.toLowerCase()}`}>{property.status}</span>
                  </div>
                  <p className="property-card-location">📍 {property.location}</p>
                  <div className="property-card-rent">
                    <span className="rent-label">Annual Rent</span>
                    <span className="rent-value">{property.rent}</span>
                  </div>
                  {property.tenant !== '-' && (
                    <div className="property-card-tenant">
                      <span className="tenant-label">Current Tenant</span>
                      <span className="tenant-value">{property.tenant}</span>
                      <span className="lease-info">Lease ends: {property.leaseEnd}</span>
                    </div>
                  )}
                  <div className="property-card-actions">
                    <button className="btn btn-sm btn-secondary">View Details</button>
                    <button className="btn btn-sm btn-primary">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="maintenance-section">
            <div className="maintenance-header">
              <h3>Maintenance Requests</h3>
              <div className="maintenance-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Pending</button>
                <button className="filter-btn">In Progress</button>
                <button className="filter-btn">Resolved</button>
              </div>
            </div>
            <div className="maintenance-grid">
              {maintenanceRequests.map(request => (
                <div key={request.id} className="maintenance-card">
                  <div className="maintenance-card-header">
                    <span className={`priority-badge ${request.priority.toLowerCase()}`}>{request.priority}</span>
                    <span className={`status-badge ${request.status.toLowerCase().replace(' ', '-')}`}>{request.status}</span>
                  </div>
                  <h4>{request.issue}</h4>
                  <p className="maintenance-card-property">🏠 {request.property}</p>
                  <p className="maintenance-card-date">Reported: {request.date}</p>
                  <div className="maintenance-card-actions">
                    <button className="btn btn-sm btn-secondary">View Details</button>
                    <button className="btn btn-sm btn-primary">Update Status</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="finances-section">
            <div className="finances-header">
              <h3>Financial Overview</h3>
              <div className="finances-period">
                <button className="period-btn">This Month</button>
                <button className="period-btn active">This Year</button>
                <button className="period-btn">All Time</button>
              </div>
            </div>
            <div className="finances-grid">
              <div className="finance-card income">
                <span className="finance-icon">💰</span>
                <div className="finance-info">
                  <span className="finance-label">Total Income</span>
                  <span className="finance-value">{financialSummary.totalIncome}</span>
                </div>
              </div>
              <div className="finance-card collected">
                <span className="finance-icon">✅</span>
                <div className="finance-info">
                  <span className="finance-label">Collected</span>
                  <span className="finance-value">{financialSummary.collected}</span>
                </div>
              </div>
              <div className="finance-card pending">
                <span className="finance-icon">⏳</span>
                <div className="finance-info">
                  <span className="finance-label">Pending</span>
                  <span className="finance-value">{financialSummary.pending}</span>
                </div>
              </div>
              <div className="finance-card expenses">
                <span className="finance-icon">📤</span>
                <div className="finance-info">
                  <span className="finance-label">Expenses</span>
                  <span className="finance-value">{financialSummary.expenses}</span>
                </div>
              </div>
            </div>
            <div className="net-income-card">
              <h4>Net Income</h4>
              <span className="net-value">{financialSummary.netIncome}</span>
              <p>After all expenses and pending payments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
