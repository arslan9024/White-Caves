import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import '../RolePages.css';
import './LandlordDashboard.css';

interface LandlordDashboardPageProps {}

interface Property {
  id: number;
  name: string;
  location: string;
  status: string;
  rent: string;
  tenant: string;
  leaseEnd: string;
  paymentStatus: string;
}

interface MaintenanceRequest {
  id: number;
  property: string;
  issue: string;
  priority: string;
  date: string;
  status: string;
}

const LandlordDashboardPage: FC<LandlordDashboardPageProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const user = useSelector((state: any) => state.auth?.user);

  const PROPERTIES: Property[] = [
    { id: 1, name: 'Marina View 2BR', location: 'Dubai Marina', status: 'Occupied', rent: 'AED 95,000/yr', tenant: 'Ahmed Al-Rashid', leaseEnd: 'Dec 2024', paymentStatus: 'Paid' },
    { id: 2, name: 'Downtown Studio', location: 'Downtown Dubai', status: 'Occupied', rent: 'AED 65,000/yr', tenant: 'Sarah Johnson', leaseEnd: 'Jun 2024', paymentStatus: 'Due Soon' },
    { id: 3, name: 'JBR 3BR Apartment', location: 'JBR', status: 'Available', rent: 'AED 180,000/yr', tenant: '-', leaseEnd: '-', paymentStatus: '-' },
  ];

  const MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
    { id: 1, property: 'Marina View 2BR', issue: 'AC maintenance required', priority: 'Medium', date: 'Today', status: 'Pending' },
    { id: 2, property: 'Downtown Studio', issue: 'Water heater replacement', priority: 'High', date: 'Yesterday', status: 'In Progress' },
  ];

  const handleLogout = (): void => {
    console.log('Logout initiated');
  };

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    sessionStorage.setItem('landlordDashboardTab', tabId);
  };

  return (
    <div className="landlord-dashboard no-sidebar">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Landlord Dashboard</h1>
          <p>Manage your rental properties and maximize returns</p>
        </div>

        <div className="tabs-navigation">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => handleTabChange('properties')}
          >
            Properties
          </button>
          <button
            className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => handleTabChange('maintenance')}
          >
            Maintenance
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Properties</h3>
                <p className="stat-value">6</p>
              </div>
              <div className="stat-card">
                <h3>Occupied</h3>
                <p className="stat-value">5</p>
              </div>
              <div className="stat-card">
                <h3>Monthly Income</h3>
                <p className="stat-value">AED 125K</p>
              </div>
            </div>

            <div className="properties-list">
              <h3>Recent Properties</h3>
              {PROPERTIES.slice(0, 3).map(property => (
                <div key={property.id} className="property-item">
                  <h4>{property.name}</h4>
                  <p>{property.location} • {property.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="dashboard-content">
            <h3>All Properties</h3>
            <div className="properties-table">
              {PROPERTIES.map(property => (
                <div key={property.id} className="table-row">
                  <span>{property.name}</span>
                  <span>{property.location}</span>
                  <span>{property.status}</span>
                  <span>{property.rent}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="dashboard-content">
            <h3>Maintenance Requests</h3>
            <div className="maintenance-list">
              {MAINTENANCE_REQUESTS.map(request => (
                <div key={request.id} className="maintenance-item">
                  <h4>{request.issue}</h4>
                  <p>{request.property} • {request.priority} Priority</p>
                  <span className="status">{request.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboardPage;
