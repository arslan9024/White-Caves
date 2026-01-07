import React from 'react';
import { Link } from 'react-router-dom';
import '../RolePages.css';

export default function TenantDashboardPage() {
  const stats = [
    { label: 'Active Lease', value: '1', icon: '📋' },
    { label: 'Days Remaining', value: '245', icon: '📅' },
    { label: 'Next Payment', value: 'Jan 1', icon: '💰' },
    { label: 'Maintenance Requests', value: '0', icon: '🔧' }
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="dashboard-header">
          <h1>Tenant Dashboard</h1>
          <p>Manage your rental and stay connected with your landlord</p>
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

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Current Rental</h3>
            <div className="rental-info">
              <p className="rental-address">No active rental found</p>
              <p className="rental-detail">Browse available properties to find your next home</p>
              <Link to="/" className="btn btn-primary">Browse Properties</Link>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Payment History</h3>
            <div className="empty-state">
              <span className="empty-icon">💳</span>
              <p>No payment history yet</p>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Maintenance Requests</h3>
            <div className="empty-state">
              <span className="empty-icon">🔧</span>
              <p>No maintenance requests</p>
              <button className="btn btn-secondary">Submit Request</button>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Documents</h3>
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <p>No documents available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
