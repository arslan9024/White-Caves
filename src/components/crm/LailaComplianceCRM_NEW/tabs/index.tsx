import React, { useState } from 'react';
import { useComplianceData } from '../hooks/useComplianceData';
import KYCTab from './KYCTab';
import ContractsTab from './ContractsTab';
import AMLTab from './AMLTab';
import RegulationsTab from './RegulationsTab';
import AssistantLifecycleTab from '../../shared/AssistantLifecycleTab';
import '../LailaComplianceCRM.css';

const LailaComplianceCRM = () => {
  const [activeTab, setActiveTab] = useState('kyc');
  const {
    kycVerifications,
    contracts,
    amlAlerts,
    complianceStats,
    handleApproveVerification,
    handleRejectVerification,
    handleApproveContract,
    handleAlertResolution,
    features
  } = useComplianceData();

  const tabs = [
    { id: 'kyc', label: 'KYC', icon: '✓' },
    { id: 'contracts', label: 'Contracts', icon: '📄' },
    { id: 'aml', label: 'AML', icon: '⚠️' },
    { id: 'regulations', label: 'Regulations', icon: '📋' },
    { id: 'lifecycle', label: 'Lifecycle', icon: '🔄' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'kyc':
        return <KYCTab verifications={kycVerifications} onApprove={handleApproveVerification} onReject={handleRejectVerification} />;
      case 'contracts':
        return <ContractsTab contracts={contracts} onApprove={handleApproveContract} />;
      case 'aml':
        return <AMLTab alerts={amlAlerts} onResolve={handleAlertResolution} />;
      case 'regulations':
        return <RegulationsTab />;
      case 'lifecycle':
        return <AssistantLifecycleTab assistantId="laila" color="#6366F1" assistantName="Laila" />;
      default:
        return <KYCTab verifications={kycVerifications} onApprove={handleApproveVerification} onReject={handleRejectVerification} />;
    }
  };

  return (
    <div className="crm-container compliance-crm">
      <div className="crm-header">
        <div className="header-title">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--color-6366f1, #6366F1) 0%, var(--accent-purple, #8B5CF6) 100%)' }}>
            <span>🔒</span>
          </div>
          <div>
            <h2>Laila - Compliance & Legal Officer</h2>
            <p>Manages regulatory compliance, legal documentation, KYC/AML processes, and contract reviews</p>
          </div>
        </div>
        <div className="quick-stats">
          <div className="stat-mini">
            <span className="stat-value">{complianceStats.verified}</span>
            <span className="stat-label">Verified</span>
          </div>
          <div className="stat-mini">
            <span className="stat-value">{complianceStats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-mini">
            <span className="stat-value">{complianceStats.amlAlerts}</span>
            <span className="stat-label">AML Alerts</span>
          </div>
        </div>
      </div>

      <div className="tab-navigation" role="tablist" aria-label="Compliance sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="crm-content" role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {renderContent()}
      </div>

      <div className="features-section">
        <h3>Available Features</h3>
        <ul className="features-list">
          {features.map((feature) => (
            <li key={feature} className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LailaComplianceCRM;
