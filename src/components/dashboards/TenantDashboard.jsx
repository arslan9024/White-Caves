import React, { useState } from 'react';
import './RoleDashboards.css';

export default function TenantDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const leaseInfo = {
    property: 'Marina View Apartment, Unit 1205',
    landlord: 'Emirates Properties LLC',
    startDate: 'Jan 1, 2024',
    endDate: 'Dec 31, 2024',
    rent: 'AED 95,000/year',
    nextPayment: 'AED 23,750 due Mar 1, 2024',
  };

  const maintenanceRequests = [
    { id: 1, issue: 'AC not cooling properly', status: 'In Progress', date: 'Feb 15, 2024' },
    { id: 2, issue: 'Kitchen faucet leaking', status: 'Scheduled', date: 'Feb 10, 2024' },
    { id: 3, issue: 'Parking gate remote', status: 'Completed', date: 'Feb 5, 2024' },
  ];

  const documents = [
    { name: 'Tenancy Contract', type: 'PDF', date: 'Jan 1, 2024' },
    { name: 'EJARI Certificate', type: 'PDF', date: 'Jan 5, 2024' },
    { name: 'Move-in Inspection', type: 'PDF', date: 'Jan 1, 2024' },
  ];

  return (
    <div className="role-dashboard tenant-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h1>Tenant Dashboard</h1>
          <p>Welcome back, {user?.name || 'Tenant'}! Manage your tenancy here.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Maintenance Request</button>
          <button className="btn btn-secondary">Pay Rent</button>
        </div>
      </div>

      <div className="lease-summary-card">
        <h3>Current Lease</h3>
        <div className="lease-details">
          <div className="lease-property">
            <span className="property-icon">🏠</span>
            <div>
              <strong>{leaseInfo.property}</strong>
              <span>Managed by {leaseInfo.landlord}</span>
            </div>
          </div>
          <div className="lease-info-grid">
            <div className="lease-info-item">
              <span className="label">Lease Period</span>
              <span className="value">{leaseInfo.startDate} - {leaseInfo.endDate}</span>
            </div>
            <div className="lease-info-item">
              <span className="label">Annual Rent</span>
              <span className="value">{leaseInfo.rent}</span>
            </div>
            <div className="lease-info-item highlight">
              <span className="label">Next Payment</span>
              <span className="value">{leaseInfo.nextPayment}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>Maintenance</button>
        <button className={`tab ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>Payments</button>
        <button className={`tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>Documents</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="dashboard-card">
              <h3>Recent Maintenance Requests</h3>
              <div className="maintenance-list">
                {maintenanceRequests.map(request => (
                  <div key={request.id} className="maintenance-item">
                    <div className="maintenance-info">
                      <span className="maintenance-issue">{request.issue}</span>
                      <span className="maintenance-date">{request.date}</span>
                    </div>
                    <span className={`maintenance-status status-${request.status.toLowerCase().replace(' ', '-')}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Requests →</button>
            </div>

            <div className="dashboard-card">
              <h3>Important Documents</h3>
              <div className="documents-list">
                {documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <span className="doc-icon">📄</span>
                    <div className="doc-info">
                      <span className="doc-name">{doc.name}</span>
                      <span className="doc-date">{doc.date}</span>
                    </div>
                    <button className="btn btn-sm">Download</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="dashboard-card">
            <h3>Maintenance Requests</h3>
            <p className="placeholder-text">Submit and track maintenance requests for your property.</p>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="dashboard-card">
            <h3>Payment History</h3>
            <p className="placeholder-text">View your rent payments and upcoming dues.</p>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="dashboard-card">
            <h3>Documents</h3>
            <p className="placeholder-text">Access your tenancy documents and contracts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
