import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../RolePages.css';

export default function LandlordDashboardPage() {
  const stats = [
    { label: 'Total Properties', value: '6', icon: '🏢' },
    { label: 'Occupied', value: '5', icon: '🔑' },
    { label: 'Available', value: '1', icon: '📋' },
    { label: 'Monthly Income', value: 'AED 125K', icon: '💰' },
  ];

  const properties = [
    { id: 1, name: 'Marina View 2BR', status: 'Occupied', rent: 'AED 95K/yr', tenant: 'Ahmed Al-Rashid', leaseEnd: 'Dec 2024' },
    { id: 2, name: 'Downtown Studio', status: 'Occupied', rent: 'AED 65K/yr', tenant: 'Sarah Johnson', leaseEnd: 'Jun 2024' },
    { id: 3, name: 'JBR 3BR Apartment', status: 'Available', rent: 'AED 180K/yr', tenant: '-', leaseEnd: '-' },
    { id: 4, name: 'Business Bay Office', status: 'Occupied', rent: 'AED 250K/yr', tenant: 'Tech Solutions LLC', leaseEnd: 'Mar 2025' },
  ];

  const maintenanceRequests = [
    { property: 'Marina View 2BR', issue: 'AC maintenance', priority: 'Medium', date: 'Today' },
    { property: 'Downtown Studio', issue: 'Water heater', priority: 'High', date: 'Yesterday' },
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Landlord Dashboard</h1>
          <p>Manage your rental property portfolio</p>
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
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>My Rental Properties</h3>
            <div className="items-list">
              {properties.map(property => (
                <div key={property.id} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{property.name}</span>
                    <span className="item-subtitle">{property.tenant !== '-' ? `Tenant: ${property.tenant}` : 'No tenant'}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-price">{property.rent}</span>
                    <span className={`item-status ${property.status.toLowerCase()}`}>{property.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/landlord/properties" className="btn btn-link">Manage Properties →</Link>
          </div>

          <div className="dashboard-card">
            <h3>Maintenance Requests</h3>
            <div className="items-list">
              {maintenanceRequests.map((request, index) => (
                <div key={index} className="list-item">
                  <div className="item-info">
                    <span className="item-title">{request.issue}</span>
                    <span className="item-subtitle">{request.property}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-date">{request.date}</span>
                    <span className={`item-priority priority-${request.priority.toLowerCase()}`}>{request.priority}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/landlord/maintenance" className="btn btn-link">View All →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
