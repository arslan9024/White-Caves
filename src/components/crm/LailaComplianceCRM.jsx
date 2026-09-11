import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Shield, FileText, CheckCircle, AlertTriangle, Clock,
  Search, Filter, Eye, Download, XCircle, User,
  ArrowUp, ArrowDown, AlertCircle, Lock, Unlock, Users, Calendar
} from 'lucide-react';
import { AssistantDocsTab } from './shared';
import KYCAMLDashboard from './shared/KYCAMLDashboard';
import { RERAFormWidget } from '../compliance/RERAFormWidget/RERAFormWidget';
import { MortgageRegistrationWidget } from '../compliance/MortgageRegistrationWidget/MortgageRegistrationWidget';
import { TitleDeedVerificationWidget } from '../compliance/TitleDeedVerificationWidget/TitleDeedVerificationWidget';
import { SPAComplianceWidget } from '../compliance/SPAComplianceWidget/SPAComplianceWidget';
import { OqoodRegistrationWidget } from '../compliance/OqoodRegistrationWidget/OqoodRegistrationWidget';
import { KYCGateWidget } from '../compliance/KYCGateWidget/KYCGateWidget';
import { AMLPolicyScreeningWidget } from '../compliance/AMLPolicyScreeningWidget/AMLPolicyScreeningWidget';
import { GoAMLRegistrationWidget } from '../compliance/GoAMLRegistrationWidget/GoAMLRegistrationWidget';
import { UAE_PDPL_DataPrivacyWidget } from '../compliance/UAE_PDPL_DataPrivacyWidget/UAE_PDPL_DataPrivacyWidget';
import { RERACertificateTrackerWidget } from '../compliance/RERACertificateTrackerWidget/RERACertificateTrackerWidget';
import { ICPEstablishmentCardWidget } from '../compliance/ICPEstablishmentCardWidget/ICPEstablishmentCardWidget';
import { HQEjariRenewalWidget } from '../compliance/HQEjariRenewalWidget/HQEjariRenewalWidget';
import { RERAORNAutoRenewalWidget } from '../compliance/RERAORNAutoRenewalWidget/RERAORNAutoRenewalWidget';
import { DETLicenseMonitorWidget } from '../compliance/DETLicenseMonitorWidget/DETLicenseMonitorWidget';
import { ComplianceArchitectureWidget } from '../compliance/ComplianceArchitectureWidget/ComplianceArchitectureWidget';
import {
  selectComplianceEngine,
  selectComplianceMetrics,
  addComplianceAuditLog,
  flagTransaction
} from '../../store/slices/aiAssistantDashboardSlice';
import './AssistantDashboard.css';

const MOCK_CONTRACTS = [
  { id: 1, title: 'Sales Agreement - Villa 348', parties: 'White Caves ↔ Al Rashid', status: 'pending_review', type: 'sale', value: 2500000, date: '2024-01-08' },
  { id: 2, title: 'Tenancy Contract - Apt 1205', parties: 'Owner ↔ Tenant', status: 'approved', type: 'lease', value: 120000, date: '2024-01-07' },
  { id: 3, title: 'Agency Agreement - Palm', parties: 'White Caves ↔ Developer', status: 'under_negotiation', type: 'agency', value: 0, date: '2024-01-06' }
];

const LailaComplianceCRM = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('kyc_verification');

  const complianceEngine = useSelector(selectComplianceEngine);
  const complianceMetrics = useSelector(selectComplianceMetrics);

  const stats = useMemo(() => ({
    verified: complianceMetrics?.verifiedThisWeek || 12,
    pending: complianceMetrics?.pendingVerifications || 5,
    amlAlerts: complianceEngine?.amlMonitor?.flaggedTransactions?.length || 2,
    contracts: MOCK_CONTRACTS.filter(c => c.status === 'pending_review').length
  }), [complianceEngine, complianceMetrics]);

  return (
    <div className="assistant-dashboard laila">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, var(--color-6366f1, #6366F1) 0%, var(--accent-purple, #8B5CF6) 100%)' }}>
          <Shield size={28} />
        </div>
        <div className="assistant-info">
          <h2>Laila - Arabic Communications & Document Verification</h2>
          <p>Document verification specialist for KYC process, Arabic document OCR, customer communication, and translation services</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green, #10B981)' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.verified}</span>
            <span className="stat-label">Docs Verified</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> This week</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-gold, #F59E0B)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <span className="stat-change warning">Review needed</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red, #EF4444)' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.amlAlerts}</span>
            <span className="stat-label">Flagged Docs</span>
          </div>
          <span className="stat-change negative">Needs attention</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--color-6366f1, #6366F1)' }}>
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.contracts}</span>
            <span className="stat-label">Contracts</span>
          </div>
          <span className="stat-change">Under review</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['pdpl', 'aml_policy', 'goaml', 'kyc_gate', 'kyc_verification', 'contracts', 'regulations', 'rera_cert', 'rera_forms', 'rera_orn', 'det_license', 'icp_card', 'hq_ejari', 'mortgage', 'title_deed', 'spa', 'oqood', 'docs', 'arch_spec'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'pdpl' ? 'UAE PDPL' :
             tab === 'aml_policy' ? 'AML Policy' :
             tab === 'goaml' ? 'goAML FIU' :
             tab === 'kyc_gate' ? 'KYC Gate' :
             tab === 'kyc_verification' ? 'KYC Review' :
             tab === 'rera_cert' ? 'RERA Cert Tracker' :
             tab === 'rera_forms' ? 'RERA Forms' :
             tab === 'rera_orn' ? 'RERA ORN Renewal' :
             tab === 'det_license' ? 'DET License' :
             tab === 'icp_card' ? 'ICP Est. Card' :
             tab === 'hq_ejari' ? 'HQ Ejari' :
             tab === 'mortgage' ? 'Mortgage Reg.' :
             tab === 'title_deed' ? 'Title Deed Verifier' :
             tab === 'spa' ? 'SPA Filing' :
             tab === 'oqood' ? 'OQOOD Reg.' :
             tab === 'arch_spec' ? 'Architecture' :
             tab === 'docs' ? 'Documentation' :
             tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'pdpl' && (
          <div style={{ marginTop: '24px' }}>
            <UAE_PDPL_DataPrivacyWidget />
          </div>
        )}

        {activeTab === 'aml_policy' && (
          <div style={{ marginTop: '24px' }}>
            <AMLPolicyScreeningWidget />
          </div>
        )}

        {activeTab === 'goaml' && (
          <div style={{ marginTop: '24px' }}>
            <GoAMLRegistrationWidget />
          </div>
        )}

        {activeTab === 'kyc_gate' && (
          <div style={{ marginTop: '24px' }}>
            <KYCGateWidget />
          </div>
        )}

        {activeTab === 'kyc_verification' && (
          <KYCAMLDashboard 
            assistant="laila"
            accessLevel="limited"
            showTabs={['queue', 'profiles', 'pep']}
          />
        )}

        {activeTab === 'contracts' && (
          <div className="contracts-view">
            <h3>Contract Reviews</h3>
            <div className="contract-cards">
              {MOCK_CONTRACTS.map(contract => (
                <div key={contract.id} className="contract-card">
                  <div className="contract-header">
                    <h4>{contract.title}</h4>
                    <span className={`status-badge ${contract.status}`}>{contract.status.replace('_', ' ')}</span>
                  </div>
                  <div className="contract-details">
                    <span><Users size={14} /> {contract.parties}</span>
                    {contract.value > 0 && <span>AED {contract.value.toLocaleString()}</span>}
                    <span><Calendar size={14} /> {contract.date}</span>
                  </div>
                  <div className="contract-actions">
                    <button><Eye size={14} /> Review</button>
                    <button><Download size={14} /> Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'regulations' && (
          <div className="regulations-view">
            <h3>Regulatory Compliance</h3>
            <div className="compliance-checklist">
              <div className="compliance-item passed">
                <CheckCircle size={20} />
                <span>RERA Registration - Valid until Dec 2024</span>
              </div>
              <div className="compliance-item passed">
                <CheckCircle size={20} />
                <span>AML Policy - Last updated Jan 2024</span>
              </div>
              <div className="compliance-item warning">
                <AlertCircle size={20} />
                <span>Staff Training - Due in 30 days</span>
              </div>
              <div className="compliance-item passed">
                <CheckCircle size={20} />
                <span>Data Protection - GDPR Compliant</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rera_cert' && (
          <div style={{ marginTop: '24px' }}>
            <RERACertificateTrackerWidget />
          </div>
        )}

        {activeTab === 'rera_forms' && (
          <div style={{ marginTop: '24px' }}>
            <RERAFormWidget />
          </div>
        )}

        {activeTab === 'rera_orn' && (
          <div style={{ marginTop: '24px' }}>
            <RERAORNAutoRenewalWidget />
          </div>
        )}

        {activeTab === 'det_license' && (
          <div style={{ marginTop: '24px' }}>
            <DETLicenseMonitorWidget />
          </div>
        )}

        {activeTab === 'arch_spec' && (
          <div style={{ marginTop: '24px' }}>
            <ComplianceArchitectureWidget />
          </div>
        )}

        {activeTab === 'icp_card' && (
          <div style={{ marginTop: '24px' }}>
            <ICPEstablishmentCardWidget />
          </div>
        )}

        {activeTab === 'hq_ejari' && (
          <div style={{ marginTop: '24px' }}>
            <HQEjariRenewalWidget />
          </div>
        )}

        {activeTab === 'mortgage' && (
          <div style={{ marginTop: '24px' }}>
            <MortgageRegistrationWidget />
          </div>
        )}

        {activeTab === 'title_deed' && (
          <div style={{ marginTop: '24px' }}>
            <TitleDeedVerificationWidget />
          </div>
        )}

        {activeTab === 'spa' && (
          <div style={{ marginTop: '24px' }}>
            <SPAComplianceWidget />
          </div>
        )}

        {activeTab === 'oqood' && (
          <div style={{ marginTop: '24px' }}>
            <OqoodRegistrationWidget />
          </div>
        )}

        {activeTab === 'docs' && <AssistantDocsTab assistantId="laila" />}
      </div>
    </div>
  );
};

export default LailaComplianceCRM;
