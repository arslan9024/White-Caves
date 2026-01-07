import React, { useState } from 'react';
import '../RolePages.css';

export default function RentalManagementPage() {
  const [filter, setFilter] = useState('all');

  const properties = [
    { 
      id: 1, 
      name: 'Marina View 2BR Apartment', 
      type: 'Apartment',
      location: 'Dubai Marina',
      rent: 'AED 95,000/yr',
      status: 'Occupied',
      tenant: 'Ahmed Al-Rashid',
      tenantPhone: '+971 50 123 4567',
      leaseStart: 'Jan 1, 2024',
      leaseEnd: 'Dec 31, 2024',
      ejariNumber: 'EJ-2024-XXXXX',
      lastPayment: 'Feb 1, 2024'
    },
    { 
      id: 2, 
      name: 'Downtown Studio', 
      type: 'Studio',
      location: 'Downtown Dubai',
      rent: 'AED 65,000/yr',
      status: 'Occupied',
      tenant: 'Sarah Johnson',
      tenantPhone: '+971 55 987 6543',
      leaseStart: 'Jul 1, 2023',
      leaseEnd: 'Jun 30, 2024',
      ejariNumber: 'EJ-2023-XXXXX',
      lastPayment: 'Feb 15, 2024'
    },
    { 
      id: 3, 
      name: 'JBR 3BR Apartment', 
      type: 'Apartment',
      location: 'JBR',
      rent: 'AED 180,000/yr',
      status: 'Available',
      tenant: null,
      tenantPhone: null,
      leaseStart: null,
      leaseEnd: null,
      ejariNumber: null,
      lastPayment: null
    },
    { 
      id: 4, 
      name: 'Business Bay Office', 
      type: 'Commercial',
      location: 'Business Bay',
      rent: 'AED 250,000/yr',
      status: 'Occupied',
      tenant: 'Tech Solutions LLC',
      tenantPhone: '+971 4 123 4567',
      leaseStart: 'Apr 1, 2023',
      leaseEnd: 'Mar 31, 2025',
      ejariNumber: 'EJ-2023-XXXXX',
      lastPayment: 'Feb 1, 2024'
    },
  ];

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.status.toLowerCase() === filter);

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Rental Management</h1>
          <p>Manage your rental properties and tenants</p>
        </div>

        <div className="filter-bar">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Properties</button>
          <button className={`filter-btn ${filter === 'occupied' ? 'active' : ''}`} onClick={() => setFilter('occupied')}>Occupied</button>
          <button className={`filter-btn ${filter === 'available' ? 'active' : ''}`} onClick={() => setFilter('available')}>Available</button>
        </div>

        <div className="properties-grid">
          {filteredProperties.map(property => (
            <div key={property.id} className={`property-card ${property.status.toLowerCase()}`}>
              <div className="property-card-header">
                <h3>{property.name}</h3>
                <span className={`status-badge ${property.status.toLowerCase()}`}>{property.status}</span>
              </div>
              
              <div className="property-details">
                <div className="detail-row">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{property.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type</span>
                  <span className="detail-value">{property.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Rent</span>
                  <span className="detail-value highlight">{property.rent}</span>
                </div>
              </div>

              {property.tenant && (
                <div className="tenant-section">
                  <h4>Current Tenant</h4>
                  <div className="detail-row">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{property.tenant}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{property.tenantPhone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Lease Period</span>
                    <span className="detail-value">{property.leaseStart} - {property.leaseEnd}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">EJARI</span>
                    <span className="detail-value">{property.ejariNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Payment</span>
                    <span className="detail-value">{property.lastPayment}</span>
                  </div>
                </div>
              )}

              <div className="property-card-actions">
                {property.status === 'Available' ? (
                  <>
                    <button className="btn btn-primary">Find Tenant</button>
                    <button className="btn btn-secondary">Edit Listing</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary">View Details</button>
                    <button className="btn btn-secondary">Contact Tenant</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="info-section">
          <h3>Landlord Responsibilities in Dubai</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>📋 EJARI Registration</h4>
              <p>All tenancy contracts must be registered with EJARI within 60 days of signing.</p>
            </div>
            <div className="info-card">
              <h4>🔧 Maintenance</h4>
              <p>Landlords are responsible for major repairs and maintaining the property in good condition.</p>
            </div>
            <div className="info-card">
              <h4>📊 Rent Increases</h4>
              <p>Follow RERA Rental Index when increasing rent. Notice must be given 90 days before renewal.</p>
            </div>
            <div className="info-card">
              <h4>🏛️ Service Charges</h4>
              <p>Landlords typically pay the annual service charges to the building management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
