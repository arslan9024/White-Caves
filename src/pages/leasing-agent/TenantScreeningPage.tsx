import React, { FC, useState } from 'react';
import '../RolePages.css';

interface ScreeningChecklistItem {
  id: number;
  name: string;
  required: boolean;
}

interface ChecklistSection {
  category: string;
  items: ScreeningChecklistItem[];
}

interface ApplicationData {
  id: number;
  name: string;
  property: string;
  salary: string;
  status: string;
  progress: number;
}

interface TenantScreeningPageProps {}

const TenantScreeningPage: FC<TenantScreeningPageProps> = () => {
  const [activeTab, setActiveTab] = useState<string>('checklist');

  const screeningChecklist: ChecklistSection[] = [
    { category: 'Identity Verification', items: [
      { id: 1, name: 'Valid Emirates ID', required: true },
      { id: 2, name: 'Valid Passport with UAE Visa', required: true },
      { id: 3, name: 'Visa validity check (min 6 months remaining)', required: true },
    ]},
    { category: 'Employment & Income', items: [
      { id: 4, name: 'Salary Certificate (dated within 30 days)', required: true },
      { id: 5, name: 'Employment Contract', required: false },
      { id: 6, name: 'Bank Statements (last 3 months)', required: true },
    ]},
    { category: 'Rental History', items: [
      { id: 8, name: 'Previous landlord reference', required: false },
      { id: 9, name: 'Previous tenancy contract', required: false },
      { id: 10, name: 'No rental dispute history (RDC check)', required: true },
    ]},
  ];

  const pendingApplications: ApplicationData[] = [
    { id: 1, name: 'Ahmed Al-Rashid', property: 'Marina View 2BR', salary: 'AED 25,000/mo', status: 'Documents Pending', progress: 60 },
    { id: 2, name: 'Sarah Johnson', property: 'Downtown Studio', salary: 'AED 18,000/mo', status: 'Under Review', progress: 80 },
    { id: 3, name: 'Mohammed Khan', property: 'JBR 3BR', salary: 'AED 45,000/mo', status: 'Approved', progress: 100 },
  ];

  const redFlags: string[] = [
    'Salary less than 3x monthly rent',
    'Visa expiring within 6 months',
    'Previous rental disputes or evictions',
    'Bounced cheques history',
    'Inconsistent employment history',
  ];

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
  };

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Tenant Screening</h1>
          <p>Verify tenant credentials and manage applications</p>
        </div>

        <div className="tabs-bar">
          <button className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => handleTabChange('checklist')}>Screening Checklist</button>
          <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => handleTabChange('applications')}>Pending Applications</button>
          <button className={`tab-btn ${activeTab === 'guidelines' ? 'active' : ''}`} onClick={() => handleTabChange('guidelines')}>Guidelines</button>
        </div>

        {activeTab === 'checklist' && (
          <div className="screening-checklist">
            {screeningChecklist.map((section) => (
              <div key={section.category} className="checklist-section">
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
              </div>
            ))}
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div className="guidelines-section">
            <h3>Red Flags to Watch</h3>
            <div className="red-flags-list">
              {redFlags.map((flag) => (
                <div key={flag} className="red-flag-item">
                  <span className="flag-icon">⚠️</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>

            <h3>Best Practices</h3>
            <ul className="best-practices">
              <li>Always verify original documents before accepting copies</li>
              <li>Check visa validity and employment status independently</li>
              <li>Contact previous landlords for references</li>
              <li>Verify salary through employment letter</li>
              <li>Run basic background check through DED</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantScreeningPage;
