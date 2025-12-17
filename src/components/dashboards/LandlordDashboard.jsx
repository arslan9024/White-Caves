import React, { useState } from 'react';
import './RoleDashboards.css';

export default function LandlordDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Properties Owned', value: '5', icon: '🏢', change: 'Total portfolio' },
    { label: 'Occupied Units', value: '4', icon: '🔑', change: '80% occupancy' },
    { label: 'Monthly Income', value: 'AED 85K', icon: '💰', change: 'Rental income' },
    { label: 'Pending Payments', value: 'AED 12K', icon: '⏳', change: '1 tenant' },
  ];

  const properties = [
    { id: 1, name: 'Marina View Apt 1205', tenant: 'Ahmed Al-Rashid', rent: 'AED 95K/yr', status: 'Occupied', nextPayment: 'Mar 1' },
    { id: 2, name: 'Downtown Studio 804', tenant: 'Sarah Johnson', rent: 'AED 65K/yr', status: 'Occupied', nextPayment: 'Mar 15' },
    { id: 3, name: 'JBR Apartment 302', tenant: 'John Smith', rent: 'AED 120K/yr', status: 'Occupied', nextPayment: 'Apr 1' },
    { id: 4, name: 'Business Bay 1BR', tenant: '-', rent: 'AED 80K/yr', status: 'Vacant', nextPayment: '-' },
  ];

  const recentPayments = [
    { property: 'Marina View Apt', tenant: 'Ahmed Al-Rashid', amount: 'AED 23,750', date: 'Feb 1, 2024', status: 'Received' },
    { property: 'Downtown Studio', tenant: 'Sarah Johnson', amount: 'AED 16,250', date: 'Feb 15, 2024', status: 'Received' },
    { property: 'JBR Apartment', tenant: 'John Smith', amount: 'AED 30,000', date: 'Jan 1, 2024', status: 'Received' },
  ];

  return (
    <div className="role-dashboard landlord-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Landlord Dashboard</h1>
          <p>Welcome back, {user?.name || 'Landlord'}! Manage your property portfolio.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Add Property</button>
          <button className="btn btn-secondary">Financial Report</button>
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
        <button className={`tab ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>Properties</button>
        <button className={`tab ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>Tenants</button>
        <button className={`tab ${activeTab === 'finances' ? 'active' : ''}`} onClick={() => setActiveTab('finances')}>Finances</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card full-width">
              <h3>My Properties</h3>
              <div className="properties-table">
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Tenant</th>
                      <th>Rent</th>
                      <th>Status</th>
                      <th>Next Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id}>
                        <td>{property.name}</td>
                        <td>{property.tenant}</td>
                        <td>{property.rent}</td>
                        <td>
                          <span className={`status-badge ${property.status.toLowerCase()}`}>
                            {property.status}
                          </span>
                        </td>
                        <td>{property.nextPayment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Recent Payments</h3>
              <div className="payments-list">
                {recentPayments.map((payment, index) => (
                  <div key={index} className="payment-item">
                    <div className="payment-info">
                      <span className="payment-property">{payment.property}</span>
                      <span className="payment-tenant">{payment.tenant}</span>
                    </div>
                    <div className="payment-meta">
                      <span className="payment-amount">{payment.amount}</span>
                      <span className="payment-date">{payment.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Payments →</button>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="dashboard-card">
            <h3>Property Management</h3>
            <p className="placeholder-text">Manage your property listings and availability.</p>
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="dashboard-card">
            <h3>Tenant Management</h3>
            <p className="placeholder-text">View tenant information and lease details.</p>
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="dashboard-card">
            <h3>Financial Overview</h3>
            <p className="placeholder-text">Track income, expenses, and generate reports.</p>
          </div>
        )}
      </div>
    </div>
  );
}
