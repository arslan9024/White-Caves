import React from 'react';
import { Shield, CheckCircle, Lock, UserCheck, History, AlertTriangle } from 'lucide-react';

const KYC_PROFILES = [
  { id: 1, name: 'Ahmad Hassan', status: 'verified', level: 'enhanced', date: '2024-01-05' },
  { id: 2, name: 'Chen Wei', status: 'pending', level: 'standard', date: '2024-01-10' },
  { id: 3, name: 'James Wilson', status: 'in-review', level: 'standard', date: '2024-01-08' },
];

const AML_ALERTS = [
  { id: 1, type: 'High Value Transaction', client: 'Mohammed Ali', amount: 'AED 5M+', status: 'review' },
  { id: 2, type: 'PEP Match', client: 'Sarah Ahmed', status: 'cleared' },
];

const AUDIT_ENTRIES = [
  { id: 1, action: 'Property Listed', user: 'Agent Sarah', timestamp: '2024-01-10 14:32' },
  { id: 2, action: 'Contract Signed', user: 'Admin Max', timestamp: '2024-01-10 12:15' },
  { id: 3, action: 'KYC Approved', user: 'Compliance Leo', timestamp: '2024-01-10 10:45' },
];

export default function ComplianceView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderKYCProfiles = () => (
    <div className="kyc-view">
      <h2 className="view-title">KYC Profiles</h2>
      <p className="view-subtitle">Know Your Customer verification</p>
      
      <div className="kyc-stats">
        <div className="kyc-stat">
          <UserCheck size={24} color="#10B981" />
          <div className="kyc-value">245</div>
          <div className="kyc-label">Verified</div>
        </div>
        <div className="kyc-stat">
          <UserCheck size={24} color="#F59E0B" />
          <div className="kyc-value">12</div>
          <div className="kyc-label">Pending</div>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <div className="table-cell">Client</div>
          <div className="table-cell">Status</div>
          <div className="table-cell">Level</div>
          <div className="table-cell">Date</div>
        </div>
        {KYC_PROFILES.map(profile => (
          <div key={profile.id} className="table-row">
            <div className="table-cell">{profile.name}</div>
            <div className="table-cell">
              <span className={`status-badge ${profile.status}`}>{profile.status}</span>
            </div>
            <div className="table-cell">{profile.level}</div>
            <div className="table-cell">{profile.date}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAMLMonitoring = () => (
    <div className="aml-view">
      <h2 className="view-title">AML Monitoring</h2>
      <p className="view-subtitle">Anti-Money Laundering checks</p>
      
      <div className="aml-alerts">
        {AML_ALERTS.map(alert => (
          <div key={alert.id} className={`aml-alert ${alert.status}`}>
            <AlertTriangle size={20} color={alert.status === 'review' ? '#F59E0B' : '#10B981'} />
            <div className="alert-info">
              <h4>{alert.type}</h4>
              <p>{alert.client} {alert.amount && `- ${alert.amount}`}</p>
            </div>
            <span className={`alert-status ${alert.status}`}>{alert.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfidentialVault = () => (
    <div className="vault-view">
      <h2 className="view-title">Confidential Vault</h2>
      <p className="view-subtitle">Secure document storage with dual-approval access</p>
      <div className="vault-stats">
        <div className="vault-stat">
          <Lock size={32} color="var(--crm-gold)" />
          <div className="vault-value">156</div>
          <div className="vault-label">Secured Documents</div>
        </div>
        <div className="vault-stat">
          <Lock size={32} color="#EF4444" />
          <div className="vault-value">3</div>
          <div className="vault-label">Access Requests</div>
        </div>
      </div>
    </div>
  );

  const renderVerificationQueue = () => (
    <div className="verification-view">
      <h2 className="view-title">Verification Queue</h2>
      <p className="view-subtitle">Pending verifications</p>
      <div className="queue-stats">
        <div className="queue-stat">
          <CheckCircle size={32} color="#F59E0B" />
          <div className="queue-value">8</div>
          <div className="queue-label">Pending Review</div>
        </div>
      </div>
    </div>
  );

  const renderAuditLog = () => (
    <div className="audit-view">
      <h2 className="view-title">Audit Log</h2>
      <p className="view-subtitle">System activity tracking</p>
      <div className="audit-list">
        {AUDIT_ENTRIES.map(entry => (
          <div key={entry.id} className="audit-entry">
            <History size={16} color="var(--text-muted)" />
            <div className="audit-info">
              <span className="audit-action">{entry.action}</span>
              <span className="audit-user">{entry.user}</span>
            </div>
            <span className="audit-time">{entry.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'rera-audits':
        return renderVerificationQueue();
      case 'document-vault':
        return renderConfidentialVault();
      case 'kyc-aml':
        return renderKYCProfiles();
      case 'audit-log':
        return renderAuditLog();
      default:
        return renderKYCProfiles();
    }
  };

  return (
    <div className="view-container compliance-view">
      {renderContent()}
    </div>
  );
}
