import React from 'react';
import { Key, FileCheck, RefreshCw, Users2, CalendarClock, Home } from 'lucide-react';

const TENANCY_STAGES = [
  { id: 'inquiry', label: 'Inquiry', count: 15, color: '#3B82F6' },
  { id: 'viewing', label: 'Viewing', count: 8, color: '#8B5CF6' },
  { id: 'application', label: 'Application', count: 6, color: '#F59E0B' },
  { id: 'approval', label: 'Approval', count: 4, color: '#EC4899' },
  { id: 'contract', label: 'Contract', count: 3, color: '#10B981' },
  { id: 'active', label: 'Active', count: 245, color: '#059669' },
];

const EJARI_CONTRACTS = [
  { id: 1, tenant: 'Ahmad Hassan', property: 'Marina Apt 1205', status: 'pending-signature', expires: '2024-03-15' },
  { id: 2, tenant: 'Sarah Williams', property: 'JBR Tower B-803', status: 'registered', expires: '2024-12-01' },
  { id: 3, tenant: 'Mohammed Ali', property: 'Downtown Studio', status: 'pending-registration', expires: '2024-02-28' },
];

const RENEWALS = [
  { id: 1, tenant: 'Chen Wei', property: 'Marina View', dueDate: '2024-02-15', status: 'pending' },
  { id: 2, tenant: 'James Wilson', property: 'Palm Jumeirah', dueDate: '2024-02-28', status: 'in-progress' },
];

export default function LeasingView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderTenancyLifecycle = () => (
    <div className="tenancy-lifecycle-view">
      <h2 className="view-title">Tenancy Lifecycle</h2>
      <p className="view-subtitle">Track tenancies through all stages</p>
      
      <div className="lifecycle-stages">
        {TENANCY_STAGES.map(stage => (
          <div key={stage.id} className="lifecycle-stage" style={{ borderTopColor: stage.color }}>
            <div className="stage-count" style={{ color: stage.color }}>{stage.count}</div>
            <div className="stage-label">{stage.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEjariContracts = () => (
    <div className="ejari-view">
      <h2 className="view-title">Ejari Contracts</h2>
      <p className="view-subtitle">Digital tenancy contract management</p>
      
      <div className="ejari-stats">
        <div className="ejari-stat">
          <FileCheck size={24} color="var(--crm-gold)" />
          <div className="ejari-value">245</div>
          <div className="ejari-label">Active Contracts</div>
        </div>
        <div className="ejari-stat">
          <FileCheck size={24} color="#F59E0B" />
          <div className="ejari-value">12</div>
          <div className="ejari-label">Pending Signature</div>
        </div>
      </div>

      <div className="contracts-list">
        <h3>Recent Contracts</h3>
        <div className="data-table">
          <div className="table-header">
            <div className="table-cell">Tenant</div>
            <div className="table-cell">Property</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Expires</div>
          </div>
          {EJARI_CONTRACTS.map(contract => (
            <div key={contract.id} className="table-row">
              <div className="table-cell">{contract.tenant}</div>
              <div className="table-cell">{contract.property}</div>
              <div className="table-cell">
                <span className={`status-badge ${contract.status}`}>{contract.status.replace('-', ' ')}</span>
              </div>
              <div className="table-cell">{contract.expires}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRenewals = () => (
    <div className="renewals-view">
      <h2 className="view-title">Lease Renewals</h2>
      <p className="view-subtitle">Upcoming renewal management</p>
      
      <div className="renewals-list">
        {RENEWALS.map(renewal => (
          <div key={renewal.id} className="renewal-card">
            <RefreshCw size={24} color="var(--crm-gold)" />
            <div className="renewal-info">
              <h4>{renewal.tenant}</h4>
              <p>{renewal.property}</p>
              <span>Due: {renewal.dueDate}</span>
            </div>
            <span className={`renewal-status ${renewal.status}`}>{renewal.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTenantPortal = () => (
    <div className="tenant-portal-view">
      <h2 className="view-title">Tenant Portal</h2>
      <p className="view-subtitle">Tenant communication hub</p>
      <div className="portal-stats">
        <div className="portal-stat">
          <Users2 size={32} color="var(--crm-gold)" />
          <div className="portal-value">245</div>
          <div className="portal-label">Active Tenants</div>
        </div>
      </div>
    </div>
  );

  const renderResidents = () => (
    <div className="residents-view">
      <h2 className="view-title">Residents</h2>
      <p className="view-subtitle">Resident management and services</p>
      <div className="residents-stats">
        <div className="resident-stat">
          <Home size={32} color="var(--crm-gold)" />
          <div className="resident-value">312</div>
          <div className="resident-label">Total Residents</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'ejari-system':
        return renderEjariContracts();
      case 'tenancy-lifecycle':
        return renderTenancyLifecycle();
      case 'renewals':
        return renderRenewals();
      case 'landlord-portal':
        return renderTenantPortal();
      case 'tenant-management':
        return renderResidents();
      default:
        return renderTenancyLifecycle();
    }
  };

  return (
    <div className="view-container leasing-view">
      {renderContent()}
    </div>
  );
}
