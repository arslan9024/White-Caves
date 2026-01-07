import React, { useState } from 'react';
import '../RolePages.css';

export default function TenantScreeningPage() {
  const [activeTab, setActiveTab] = useState('checklist');

  const screeningChecklist = [
    { category: 'Identity Verification', items: [
      { id: 1, name: 'Valid Emirates ID', required: true },
      { id: 2, name: 'Valid Passport with UAE Visa', required: true },
      { id: 3, name: 'Visa validity check (min 6 months remaining)', required: true },
    ]},
    { category: 'Employment & Income', items: [
      { id: 4, name: 'Salary Certificate (dated within 30 days)', required: true },
      { id: 5, name: 'Employment Contract', required: false },
      { id: 6, name: 'Bank Statements (last 3 months)', required: true },
      { id: 7, name: 'Trade License (for business owners)', required: false },
    ]},
    { category: 'Rental History', items: [
      { id: 8, name: 'Previous landlord reference', required: false },
      { id: 9, name: 'Previous tenancy contract', required: false },
      { id: 10, name: 'No rental dispute history (RDC check)', required: true },
    ]},
    { category: 'Financial Verification', items: [
      { id: 11, name: 'Salary ≥ 3x monthly rent', required: true },
      { id: 12, name: 'Security deposit capability', required: true },
      { id: 13, name: 'Post-dated cheques', required: true },
    ]},
  ];

  const pendingApplications = [
    { id: 1, name: 'Ahmed Al-Rashid', property: 'Marina View 2BR', salary: 'AED 25,000/mo', status: 'Documents Pending', progress: 60 },
    { id: 2, name: 'Sarah Johnson', property: 'Downtown Studio', salary: 'AED 18,000/mo', status: 'Under Review', progress: 80 },
    { id: 3, name: 'Mohammed Khan', property: 'JBR 3BR', salary: 'AED 45,000/mo', status: 'Approved', progress: 100 },
  ];

  const redFlags = [
    'Salary less than 3x monthly rent',
    'Visa expiring within 6 months',
    'Previous rental disputes or evictions',
    'Bounced cheques history',
    'Inconsistent employment history',
    'Unable to provide required documents',
  ];

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Tenant Screening</h1>
          <p>Verify tenant credentials and manage applications</p>
        </div>

        <div className="tabs-bar">
          <button className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>Screening Checklist</button>
          <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>Pending Applications</button>
          <button className={`tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`} onClick={() => setActiveTab('guidelines')}>Guidelines</button>
        </div>

        {activeTab === 'checklist' && (
          <div className="screening-checklist">
            {screeningChecklist.map((section, index) => (
              <div key={index} className="checklist-section">
                <h3>{section.category}</h3>
                <div className="checklist-items">
                  {section.items.map(item => (
                    <div key={item.id} className="checklist-item">
                      <input type="checkbox" id={`check-${item.id}`} />
                      <label htmlFor={`check-${item.id}`}>
                        {item.name}
                        {item.required && <span className="required-badge">Required</span>}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-list">
            <h3>Pending Tenant Applications</h3>
            {pendingApplications.map(app => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <div className="applicant-info">
                    <h4>{app.name}</h4>
                    <span className="property-name">{app.property}</span>
                  </div>
                  <span className={`status-badge ${app.status.toLowerCase().replace(' ', '-')}`}>{app.status}</span>
                </div>
                <div className="application-details">
                  <span className="detail">Salary: {app.salary}</span>
                  <div className="progress-container">
                    <span>Verification Progress: {app.progress}%</span>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{width: `${app.progress}%`}}></div>
                    </div>
                  </div>
                </div>
                <div className="application-actions">
                  <button className="btn btn-primary">View Documents</button>
                  <button className="btn btn-secondary">Contact Applicant</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="guidelines-section">
            <div className="info-card warning">
              <h3>⚠️ Red Flags to Watch For</h3>
              <ul className="red-flags-list">
                {redFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>

            <div className="info-section">
              <h3>Best Practices</h3>
              <div className="info-grid">
                <div className="info-card">
                  <h4>📞 Verify Employment</h4>
                  <p>Always call the employer directly to verify the salary certificate. Use the company's official contact number, not the one provided by the tenant.</p>
                </div>
                <div className="info-card">
                  <h4>🏦 Bank Statement Review</h4>
                  <p>Look for consistent salary deposits, check for any bounced transactions, and ensure the ending balance supports the rental payment.</p>
                </div>
                <div className="info-card">
                  <h4>📋 Previous Landlord</h4>
                  <p>Contact the previous landlord to ask about payment history, property condition, and if they would rent to this tenant again.</p>
                </div>
                <div className="info-card">
                  <h4>🔍 RDC Check</h4>
                  <p>Verify that the tenant has no ongoing or past disputes with the Rental Dispute Centre.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
