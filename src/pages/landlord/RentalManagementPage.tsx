import React, { FC, useState, ChangeEvent } from 'react';
import '../RolePages.css';

interface RentalProperty {
  id: number;
  name: string;
  type: string;
  location: string;
  rent: string;
  status: string;
  tenant: string | null;
  tenantPhone: string | null;
  leaseStart: string | null;
  leaseEnd: string | null;
  ejariNumber: string | null;
  lastPayment: string | null;
}

interface RentalManagementPageProps {}

const RentalManagementPage: FC<RentalManagementPageProps> = () => {
  const [filter, setFilter] = useState<string>('all');

  const properties: RentalProperty[] = [
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
  ];

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(p => p.status.toLowerCase() === filter);

  const handleFilterChange = (newFilter: string): void => {
    setFilter(newFilter);
  };

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Rental Management</h1>
          <p>Manage your rental properties and tenants</p>
        </div>

        <div className="filter-bar">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilterChange('all')}>All Properties</button>
          <button className={`filter-btn ${filter === 'occupied' ? 'active' : ''}`} onClick={() => handleFilterChange('occupied')}>Occupied</button>
          <button className={`filter-btn ${filter === 'available' ? 'active' : ''}`} onClick={() => handleFilterChange('available')}>Available</button>
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
                  <span className="detail-value">{property.rent}</span>
                </div>
                {property.tenant && (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Tenant</span>
                      <span className="detail-value">{property.tenant}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Lease End</span>
                      <span className="detail-value">{property.leaseEnd}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="property-actions">
                <button className="btn-secondary">View Details</button>
                <button className="btn-outline">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentalManagementPage;
