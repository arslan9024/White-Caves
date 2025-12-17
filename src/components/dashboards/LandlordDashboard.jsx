import React, { useState } from 'react';
import './RoleDashboards.css';

export default function LandlordDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [propertyFilter, setPropertyFilter] = useState('all');

  const stats = [
    { label: 'Total Properties', value: '8', icon: '🏢', change: 'In portfolio' },
    { label: 'Occupied', value: '6', icon: '🔑', change: '75% occupancy' },
    { label: 'Available', value: '2', icon: '📋', change: 'Ready for rent' },
    { label: 'Monthly Income', value: 'AED 145K', icon: '💰', change: 'Rental income' },
  ];

  const properties = [
    { 
      id: 1, 
      name: 'Marina View Apt 1205', 
      type: 'Apartment',
      beds: 2,
      area: '1,200 sqft',
      rent: 'AED 95K/yr', 
      status: 'Occupied',
      tenant: 'Ahmed Al-Rashid',
      leaseEnd: 'Dec 31, 2024',
      category: 'residential'
    },
    { 
      id: 2, 
      name: 'Downtown Studio 804', 
      type: 'Studio',
      beds: 0,
      area: '550 sqft',
      rent: 'AED 65K/yr', 
      status: 'Occupied',
      tenant: 'Sarah Johnson',
      leaseEnd: 'Jun 30, 2024',
      category: 'residential'
    },
    { 
      id: 3, 
      name: 'JBR 3BR Apartment', 
      type: 'Apartment',
      beds: 3,
      area: '2,100 sqft',
      rent: 'AED 180K/yr', 
      status: 'Available',
      tenant: '-',
      leaseEnd: '-',
      category: 'residential'
    },
    { 
      id: 4, 
      name: 'Business Bay Office', 
      type: 'Office',
      beds: '-',
      area: '1,800 sqft',
      rent: 'AED 250K/yr', 
      status: 'Occupied',
      tenant: 'Tech Solutions LLC',
      leaseEnd: 'Mar 31, 2025',
      category: 'commercial'
    },
    { 
      id: 5, 
      name: 'Palm Jumeirah Villa', 
      type: 'Villa',
      beds: 5,
      area: '6,500 sqft',
      rent: 'AED 450K/yr', 
      status: 'Occupied',
      tenant: 'Mohammed Hassan',
      leaseEnd: 'Sep 30, 2024',
      category: 'luxury'
    },
    { 
      id: 6, 
      name: 'Dubai Hills Townhouse', 
      type: 'Townhouse',
      beds: 4,
      area: '3,200 sqft',
      rent: 'AED 220K/yr', 
      status: 'Available',
      tenant: '-',
      leaseEnd: '-',
      category: 'residential'
    },
    { 
      id: 7, 
      name: 'JLT Office Suite', 
      type: 'Office',
      beds: '-',
      area: '2,500 sqft',
      rent: 'AED 180K/yr', 
      status: 'Occupied',
      tenant: 'Global Trade Co.',
      leaseEnd: 'Jul 31, 2024',
      category: 'commercial'
    },
    { 
      id: 8, 
      name: 'Marina Retail Shop', 
      type: 'Retail',
      beds: '-',
      area: '800 sqft',
      rent: 'AED 320K/yr', 
      status: 'Occupied',
      tenant: 'Fashion Boutique',
      leaseEnd: 'Nov 30, 2024',
      category: 'commercial'
    },
  ];

  const filteredProperties = propertyFilter === 'all' 
    ? properties 
    : properties.filter(p => p.category === propertyFilter);

  const availableProperties = properties.filter(p => p.status === 'Available');
  const occupiedProperties = properties.filter(p => p.status === 'Occupied');

  const recentPayments = [
    { property: 'Marina View Apt', tenant: 'Ahmed Al-Rashid', amount: 'AED 23,750', date: 'Feb 1, 2024', status: 'Received' },
    { property: 'Downtown Studio', tenant: 'Sarah Johnson', amount: 'AED 16,250', date: 'Feb 15, 2024', status: 'Received' },
    { property: 'Palm Jumeirah Villa', tenant: 'Mohammed Hassan', amount: 'AED 112,500', date: 'Feb 1, 2024', status: 'Received' },
    { property: 'Business Bay Office', tenant: 'Tech Solutions LLC', amount: 'AED 62,500', date: 'Feb 1, 2024', status: 'Pending' },
  ];

  const maintenanceRequests = [
    { property: 'Marina View Apt', issue: 'AC maintenance required', priority: 'Medium', date: 'Feb 18, 2024' },
    { property: 'Palm Jumeirah Villa', issue: 'Pool cleaning service', priority: 'Low', date: 'Feb 15, 2024' },
    { property: 'Downtown Studio', issue: 'Water heater replacement', priority: 'High', date: 'Feb 20, 2024' },
  ];

  return (
    <div className="role-dashboard landlord-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Landlord Dashboard</h1>
          <p>Welcome back, {user?.name || 'Landlord'}! Manage your rental property portfolio.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ List New Property</button>
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
        <button className={`tab ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>My Properties</button>
        <button className={`tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>Available for Rent</button>
        <button className={`tab ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>Tenants</button>
        <button className={`tab ${activeTab === 'finances' ? 'active' : ''}`} onClick={() => setActiveTab('finances')}>Finances</button>
        <button className={`tab ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>Maintenance</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card">
              <h3>Properties Available for Rent</h3>
              <div className="available-properties-list">
                {availableProperties.length > 0 ? (
                  availableProperties.map(property => (
                    <div key={property.id} className="available-property-item">
                      <div className="property-thumb">🏠</div>
                      <div className="property-info">
                        <span className="property-title">{property.name}</span>
                        <span className="property-details">{property.type} · {property.beds !== '-' ? `${property.beds} beds ·` : ''} {property.area}</span>
                      </div>
                      <div className="property-meta">
                        <span className="property-price">{property.rent}</span>
                        <button className="btn btn-sm btn-primary">Find Tenant</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">All properties are currently occupied</p>
                )}
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
                      <span className={`payment-status status-${payment.status.toLowerCase()}`}>{payment.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Payments →</button>
            </div>

            <div className="dashboard-card">
              <h3>Upcoming Lease Renewals</h3>
              <div className="renewals-list">
                {occupiedProperties.slice(0, 3).map(property => (
                  <div key={property.id} className="renewal-item">
                    <div className="renewal-info">
                      <span className="renewal-property">{property.name}</span>
                      <span className="renewal-tenant">{property.tenant}</span>
                    </div>
                    <div className="renewal-meta">
                      <span className="renewal-date">Expires: {property.leaseEnd}</span>
                      <button className="btn btn-sm">Renew</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Maintenance Requests</h3>
              <div className="maintenance-list">
                {maintenanceRequests.map((request, index) => (
                  <div key={index} className="maintenance-item">
                    <div className="maintenance-info">
                      <span className="maintenance-property">{request.property}</span>
                      <span className="maintenance-issue">{request.issue}</span>
                    </div>
                    <span className={`priority-badge priority-${request.priority.toLowerCase()}`}>
                      {request.priority}
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Requests →</button>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="dashboard-card full-width">
            <div className="properties-header">
              <h3>Property Portfolio</h3>
              <div className="property-filters">
                <button className={`filter-btn ${propertyFilter === 'all' ? 'active' : ''}`} onClick={() => setPropertyFilter('all')}>All</button>
                <button className={`filter-btn ${propertyFilter === 'residential' ? 'active' : ''}`} onClick={() => setPropertyFilter('residential')}>Residential</button>
                <button className={`filter-btn ${propertyFilter === 'commercial' ? 'active' : ''}`} onClick={() => setPropertyFilter('commercial')}>Commercial</button>
                <button className={`filter-btn ${propertyFilter === 'luxury' ? 'active' : ''}`} onClick={() => setPropertyFilter('luxury')}>Luxury</button>
              </div>
            </div>
            <div className="properties-table">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Area</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Tenant</th>
                    <th>Lease End</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map(property => (
                    <tr key={property.id}>
                      <td>{property.name}</td>
                      <td>{property.type}</td>
                      <td>{property.area}</td>
                      <td>{property.rent}</td>
                      <td>
                        <span className={`status-badge ${property.status.toLowerCase()}`}>
                          {property.status}
                        </span>
                      </td>
                      <td>{property.tenant}</td>
                      <td>{property.leaseEnd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'available' && (
          <div className="dashboard-card full-width">
            <h3>Properties Available for Rent</h3>
            <p className="section-description">These properties are ready to be leased. Contact your leasing agent to find tenants.</p>
            <div className="available-grid">
              {availableProperties.map(property => (
                <div key={property.id} className="available-card">
                  <div className="available-card-image">🏠</div>
                  <div className="available-card-content">
                    <h4>{property.name}</h4>
                    <p className="property-specs">{property.type} · {property.beds !== '-' ? `${property.beds} Beds ·` : ''} {property.area}</p>
                    <p className="property-rent">{property.rent}</p>
                    <div className="available-card-actions">
                      <button className="btn btn-primary">Find Tenant</button>
                      <button className="btn btn-secondary">Edit Listing</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="dashboard-card">
            <h3>Current Tenants</h3>
            <div className="tenants-list">
              {occupiedProperties.map(property => (
                <div key={property.id} className="tenant-row">
                  <div className="tenant-info">
                    <span className="tenant-name">{property.tenant}</span>
                    <span className="tenant-property">{property.name}</span>
                  </div>
                  <div className="tenant-meta">
                    <span className="tenant-rent">{property.rent}</span>
                    <span className="tenant-lease">Until {property.leaseEnd}</span>
                  </div>
                  <button className="btn btn-sm">View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="dashboard-card">
            <h3>Financial Overview</h3>
            <div className="finance-summary">
              <div className="finance-item">
                <span className="finance-label">Total Annual Rental Income</span>
                <span className="finance-value">AED 1,760,000</span>
              </div>
              <div className="finance-item">
                <span className="finance-label">YTD Collections</span>
                <span className="finance-value">AED 290,000</span>
              </div>
              <div className="finance-item">
                <span className="finance-label">Pending Payments</span>
                <span className="finance-value warning">AED 62,500</span>
              </div>
              <div className="finance-item">
                <span className="finance-label">Maintenance Expenses (YTD)</span>
                <span className="finance-value">AED 18,500</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="dashboard-card">
            <h3>Maintenance Requests</h3>
            <p className="placeholder-text">Track and manage maintenance requests for all your properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}
