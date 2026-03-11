import React, { useState } from 'react';
import './RoleDashboards.css';

export default function TenantDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');

  const leaseInfo = {
    property: 'Marina View Apartment, Unit 1205',
    landlord: 'Emirates Properties LLC',
    managedBy: 'White Caves Real Estate',
    startDate: 'Jan 1, 2024',
    endDate: 'Dec 31, 2024',
    rent: 'AED 95,000/year',
    paymentSchedule: '4 Cheques',
    nextPayment: 'AED 23,750 due Mar 1, 2024',
    securityDeposit: 'AED 5,000',
    ejariNumber: 'EJ-2024-XXXXXX',
  };

  const maintenanceRequests = [
    { id: 1, issue: 'AC not cooling properly', status: 'In Progress', date: 'Feb 15, 2024', priority: 'Medium' },
    { id: 2, issue: 'Kitchen faucet leaking', status: 'Scheduled', date: 'Feb 10, 2024', priority: 'Low' },
    { id: 3, issue: 'Water heater replacement', status: 'Completed', date: 'Feb 5, 2024', priority: 'High' },
  ];

  const documents = [
    { name: 'Tenancy Contract', type: 'PDF', date: 'Jan 1, 2024', category: 'Contract' },
    { name: 'EJARI Certificate', type: 'PDF', date: 'Jan 5, 2024', category: 'Registration' },
    { name: 'Move-in Inspection Report', type: 'PDF', date: 'Jan 1, 2024', category: 'Inspection' },
    { name: 'DEWA Connection Letter', type: 'PDF', date: 'Jan 3, 2024', category: 'Utilities' },
  ];

  const paymentHistory = [
    { date: 'Jan 1, 2024', amount: 'AED 23,750', method: 'Cheque #001', status: 'Cleared' },
    { date: 'Oct 1, 2023', amount: 'AED 23,750', method: 'Cheque #002', status: 'Cleared' },
    { date: 'Jul 1, 2023', amount: 'AED 23,750', method: 'Cheque #003', status: 'Cleared' },
  ];

  const tenantRights = [
    { title: 'Rent Increase Limits', description: 'Landlord must follow RERA Rental Index for any increase' },
    { title: '90-Day Notice', description: 'Required for non-renewal or eviction' },
    { title: 'Maintenance', description: 'Landlord responsible for major repairs' },
    { title: 'Security Deposit', description: 'Must be returned within 30 days of move-out' },
  ];

  const renewalInfo = {
    daysUntilExpiry: 289,
    currentRent: 'AED 95,000',
    marketRate: 'AED 98,000',
    allowedIncrease: '0%',
    recommendation: 'Your rent is below market rate. Expect renewal at same terms.',
  };

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
              <span>Managed by {leaseInfo.managedBy}</span>
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
            <div className="lease-info-item">
              <span className="label">EJARI</span>
              <span className="value">{leaseInfo.ejariNumber}</span>
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
        <button className={`tab ${activeTab === 'renewal' ? 'active' : ''}`} onClick={() => setActiveTab('renewal')}>Lease Renewal</button>
        <button className={`tab ${activeTab === 'rights' ? 'active' : ''}`} onClick={() => setActiveTab('rights')}>Tenant Rights</button>
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
                    <div className="maintenance-meta">
                      <span className={`priority-badge priority-${request.priority.toLowerCase()}`}>{request.priority}</span>
                      <span className={`maintenance-status status-${request.status.toLowerCase().replace(' ', '-')}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-link">View All Requests →</button>
            </div>

            <div className="dashboard-card">
              <h3>Important Documents</h3>
              <div className="documents-list">
                {documents.slice(0, 3).map((doc, index) => (
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
              <button className="btn btn-link">View All Documents →</button>
            </div>

            <div className="dashboard-card">
              <h3>Lease Renewal Status</h3>
              <div className="renewal-preview">
                <div className="renewal-countdown">
                  <span className="countdown-number">{renewalInfo.daysUntilExpiry}</span>
                  <span className="countdown-label">Days until lease expires</span>
                </div>
                <p className="renewal-recommendation">{renewalInfo.recommendation}</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('renewal')}>View Renewal Options</button>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button className="quick-action-btn">
                  <span className="action-icon">🔧</span>
                  <span>Report Issue</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">💳</span>
                  <span>Pay Rent</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">📞</span>
                  <span>Contact Agent</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">📋</span>
                  <span>View Contract</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="dashboard-card full-width">
            <h3>Maintenance Requests</h3>
            <p className="section-description">Submit and track maintenance requests for your property.</p>
            <div className="maintenance-full-list">
              {maintenanceRequests.map(request => (
                <div key={request.id} className="maintenance-full-item">
                  <div className="maintenance-info">
                    <span className="maintenance-issue">{request.issue}</span>
                    <span className="maintenance-date">Submitted: {request.date}</span>
                  </div>
                  <span className={`priority-badge priority-${request.priority.toLowerCase()}`}>{request.priority}</span>
                  <span className={`maintenance-status status-${request.status.toLowerCase().replace(' ', '-')}`}>
                    {request.status}
                  </span>
                  <button className="btn btn-sm">View Details</button>
                </div>
              ))}
            </div>
            <button className="btn btn-primary">+ Submit New Request</button>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="dashboard-card full-width">
            <h3>Payment History</h3>
            <div className="payment-summary">
              <div className="payment-stat">
                <span className="stat-label">Total Annual Rent</span>
                <span className="stat-value">{leaseInfo.rent}</span>
              </div>
              <div className="payment-stat">
                <span className="stat-label">Payment Schedule</span>
                <span className="stat-value">{leaseInfo.paymentSchedule}</span>
              </div>
              <div className="payment-stat highlight">
                <span className="stat-label">Next Payment Due</span>
                <span className="stat-value">{leaseInfo.nextPayment}</span>
              </div>
            </div>
            <div className="payments-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.date}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.method}</td>
                      <td><span className="status-badge received">{payment.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="dashboard-card full-width">
            <h3>Tenancy Documents</h3>
            <div className="documents-grid">
              {documents.map((doc, index) => (
                <div key={index} className="document-card">
                  <span className="doc-icon large">📄</span>
                  <div className="doc-content">
                    <span className="doc-name">{doc.name}</span>
                    <span className="doc-category">{doc.category}</span>
                    <span className="doc-date">{doc.date}</span>
                  </div>
                  <button className="btn btn-primary">Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'renewal' && (
          <div className="dashboard-card full-width">
            <h3>Lease Renewal Information</h3>
            <div className="renewal-details">
              <div className="renewal-info-grid">
                <div className="renewal-info-item">
                  <span className="label">Current Rent</span>
                  <span className="value">{renewalInfo.currentRent}</span>
                </div>
                <div className="renewal-info-item">
                  <span className="label">Market Rate</span>
                  <span className="value">{renewalInfo.marketRate}</span>
                </div>
                <div className="renewal-info-item">
                  <span className="label">Allowed Increase (RERA Index)</span>
                  <span className="value">{renewalInfo.allowedIncrease}</span>
                </div>
                <div className="renewal-info-item">
                  <span className="label">Days Until Expiry</span>
                  <span className="value">{renewalInfo.daysUntilExpiry} days</span>
                </div>
              </div>
              <div className="renewal-recommendation-box">
                <h4>Our Recommendation</h4>
                <p>{renewalInfo.recommendation}</p>
              </div>
              <div className="renewal-actions">
                <button className="btn btn-primary">Request Renewal</button>
                <button className="btn btn-secondary">Contact Landlord</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rights' && (
          <div className="dashboard-card full-width">
            <h3>Know Your Rights as a Tenant in Dubai</h3>
            <div className="rights-grid">
              {tenantRights.map((right, index) => (
                <div key={index} className="right-card">
                  <h4>{right.title}</h4>
                  <p>{right.description}</p>
                </div>
              ))}
            </div>
            <div className="rights-info">
              <h4>Important Dubai Rental Laws</h4>
              <ul>
                <li><strong>EJARI Registration:</strong> All tenancy contracts must be registered within 90 days</li>
                <li><strong>Rent Disputes:</strong> Handled by the Rental Dispute Settlement Centre (RDC)</li>
                <li><strong>Security Deposit:</strong> Maximum 5% of annual rent (10% for furnished)</li>
                <li><strong>Eviction Notice:</strong> Landlord must provide 12 months notice through notary public</li>
                <li><strong>Maintenance:</strong> Landlord responsible for major repairs, tenant for minor maintenance</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
