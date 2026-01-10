import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Shield, FileText, CheckCircle, AlertTriangle, Clock,
  Search, Filter, Eye, Download, XCircle, User,
  ArrowUp, ArrowDown, AlertCircle, Lock, Unlock, Users, Calendar
} from 'lucide-react';
import { AssistantDocsTab } from './shared';
import {
  selectComplianceEngine,
  selectComplianceMetrics,
  addComplianceAuditLog,
  flagTransaction
} from '../../store/slices/aiAssistantDashboardSlice';
import './AssistantDashboard.css';

const MOCK_KYC_VERIFICATIONS = [
  { id: 1, name: 'Ahmed Al Rashid', type: 'buyer', status: 'verified', date: '2024-01-08', documents: ['passport', 'visa', 'bank_statement'], riskLevel: 'low' },
  { id: 2, name: 'Sarah Johnson', type: 'seller', status: 'pending', date: '2024-01-07', documents: ['passport', 'title_deed'], riskLevel: 'medium' },
  { id: 3, name: 'Mohammed Khan', type: 'buyer', status: 'requires_review', date: '2024-01-06', documents: ['passport', 'visa'], riskLevel: 'high' },
  { id: 4, name: 'Maria Santos', type: 'investor', status: 'verified', date: '2024-01-05', documents: ['passport', 'poa', 'bank_statement'], riskLevel: 'low' },
  { id: 5, name: 'James Wilson', type: 'buyer', status: 'rejected', date: '2024-01-04', documents: ['passport'], riskLevel: 'high' }
];

const MOCK_CONTRACTS = [
  { id: 1, title: 'Sales Agreement - Villa 348', parties: 'White Caves ↔ Al Rashid', status: 'pending_review', type: 'sale', value: 2500000, date: '2024-01-08' },
  { id: 2, title: 'Tenancy Contract - Apt 1205', parties: 'Owner ↔ Tenant', status: 'approved', type: 'lease', value: 120000, date: '2024-01-07' },
  { id: 3, title: 'Agency Agreement - Palm', parties: 'White Caves ↔ Developer', status: 'under_negotiation', type: 'agency', value: 0, date: '2024-01-06' }
];

const LailaComplianceCRM = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('kyc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const complianceEngine = useSelector(selectComplianceEngine);
  const complianceMetrics = useSelector(selectComplianceMetrics);

  const kycProfiles = useMemo(() => {
    const profiles = Object.values(complianceEngine.kycProfiles || {});
    return profiles.length > 0 ? profiles : MOCK_KYC_VERIFICATIONS;
  }, [complianceEngine.kycProfiles]);

  const amlAlerts = useMemo(() => {
    const flagged = complianceEngine.amlMonitor?.flaggedTransactions || [];
    if (flagged.length > 0) return flagged;
    return [
      { id: 1, client: 'Unknown Source', type: 'large_transaction', amount: 5000000, status: 'investigating', date: '2024-01-08' },
      { id: 2, client: 'Mohammed Khan', type: 'pep_flag', amount: 0, status: 'cleared', date: '2024-01-07' }
    ];
  }, [complianceEngine.amlMonitor]);

  const auditLog = useMemo(() => {
    return complianceEngine.auditLog || [];
  }, [complianceEngine.auditLog]);

  const filteredKyc = useMemo(() => {
    let filtered = kycProfiles;
    if (searchQuery) {
      filtered = filtered.filter(k => 
        k.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(k => k.status === statusFilter);
    }
    return filtered;
  }, [kycProfiles, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    verified: kycProfiles.filter(k => k.status === 'verified').length,
    pending: kycProfiles.filter(k => k.status === 'pending' || k.status === 'requires_review').length,
    amlAlerts: amlAlerts.filter(a => a.status !== 'cleared').length,
    contracts: MOCK_CONTRACTS.filter(c => c.status === 'pending_review').length
  }), [kycProfiles, amlAlerts]);

  return (
    <div className="assistant-dashboard laila">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
          <Shield size={28} />
        </div>
        <div className="assistant-info">
          <h2>Laila - Compliance & Legal Officer</h2>
          <p>Manages regulatory compliance, legal documentation, KYC/AML processes, and contract reviews</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.verified}</span>
            <span className="stat-label">Verified</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> {complianceMetrics.verifiedThisWeek || 12}</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <span className="stat-change warning">Review needed</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.amlAlerts}</span>
            <span className="stat-label">AML Alerts</span>
          </div>
          <span className="stat-change negative">Action required</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#6366F1' }}>
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
        {['kyc', 'contracts', 'aml', 'audit', 'regulations', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
            {tab === 'aml' && stats.amlAlerts > 0 && (
              <span className="tab-badge">{stats.amlAlerts}</span>
            )}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'kyc' && (
          <div className="kyc-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Search verifications..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-buttons">
                {['all', 'pending', 'verified', 'rejected'].map(status => (
                  <button 
                    key={status}
                    className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="kyc-table">
              <div className="table-header">
                <span>Client</span>
                <span>Type</span>
                <span>Documents</span>
                <span>Risk Level</span>
                <span>Date</span>
                <span>Status</span>
              </div>
              {filteredKyc.map(kyc => (
                <div key={kyc.id} className="table-row">
                  <span className="client-name"><User size={14} /> {kyc.name}</span>
                  <span className="client-type">{kyc.type}</span>
                  <span className="documents">{kyc.documents?.length || 0} docs</span>
                  <span className={`risk-badge ${kyc.riskLevel}`}>{kyc.riskLevel}</span>
                  <span>{kyc.date}</span>
                  <span className={`status-badge ${kyc.status}`}>{kyc.status?.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
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

        {activeTab === 'aml' && (
          <div className="aml-view">
            <h3>AML Monitoring</h3>
            <div className="aml-alerts">
              {amlAlerts.map(alert => (
                <div key={alert.id} className={`aml-card ${alert.status}`}>
                  <div className="aml-icon">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="aml-details">
                    <h4>{alert.type?.replace('_', ' ')}</h4>
                    <p>Client: {alert.client}</p>
                    {alert.amount > 0 && <p>Amount: AED {alert.amount.toLocaleString()}</p>}
                  </div>
                  <div className={`aml-status ${alert.status}`}>{alert.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="audit-view">
            <h3>Audit Log</h3>
            <div className="audit-timeline">
              {auditLog.length > 0 ? auditLog.slice(0, 20).map((entry, idx) => (
                <div key={idx} className="audit-entry">
                  <div className="audit-time">{new Date(entry.timestamp).toLocaleString()}</div>
                  <div className="audit-content">
                    <span className="audit-action">{entry.action}</span>
                    <span className="audit-user">{entry.performedBy}</span>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <FileText size={48} />
                  <p>No audit entries yet</p>
                </div>
              )}
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

        {activeTab === 'docs' && <AssistantDocsTab assistantId="laila" />}
      </div>
    </div>
  );
};

export default LailaComplianceCRM;
