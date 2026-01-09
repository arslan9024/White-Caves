import React, { useState } from 'react';
import { 
  Scale, FileText, AlertTriangle, Shield, BookOpen,
  Search, Filter, Clock, CheckCircle, XCircle,
  TrendingUp, ArrowUp, ArrowDown, Eye, Plus, AlertCircle
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

const LEGAL_RISKS = [
  { id: 1, title: 'Missing NOC for Property Transfer', property: 'Villa 234 - DAMAC Hills', severity: 'high', status: 'open', category: 'transaction', dueDate: '2024-01-25' },
  { id: 2, title: 'Lease Renewal Dispute - Tenant Rights', property: 'Apt 1205 - Marina', severity: 'medium', status: 'investigating', category: 'leasing', dueDate: '2024-01-28' },
  { id: 3, title: 'RERA Registration Pending', property: 'Multiple Units', severity: 'critical', status: 'open', category: 'compliance', dueDate: '2024-01-22' },
  { id: 4, title: 'Commission Agreement Clarification', property: 'Palm Jumeirah Villa', severity: 'low', status: 'resolved', category: 'contracts', dueDate: '2024-01-20' },
  { id: 5, title: 'Developer SPA Review Required', property: 'Off-Plan Tower A', severity: 'high', status: 'open', category: 'contracts', dueDate: '2024-01-24' }
];

const CONTRACTS = [
  { id: 1, type: 'SPA', property: 'Villa 348', client: 'Ahmed Al Rashid', status: 'pending_review', value: 'AED 2.5M', expires: '2024-02-15' },
  { id: 2, type: 'Lease Agreement', property: 'Apt 1205', client: 'James Wilson', status: 'approved', value: 'AED 120K/yr', expires: '2024-12-31' },
  { id: 3, type: 'MOU', property: 'Townhouse 56', client: 'Maria Santos', status: 'signed', value: 'AED 3.2M', expires: '2024-03-01' },
  { id: 4, type: 'Form F', property: 'Penthouse 2501', client: 'Robert Chen', status: 'pending_signature', value: 'AED 8.5M', expires: '2024-02-28' }
];

const REGULATIONS = [
  { id: 1, title: 'RERA Circular 2024/01', category: 'Licensing', effective: '2024-02-01', impact: 'high', status: 'action_required' },
  { id: 2, title: 'DLD Fee Structure Update', category: 'Transactions', effective: '2024-01-15', impact: 'medium', status: 'compliant' },
  { id: 3, title: 'New Escrow Requirements', category: 'Off-Plan', effective: '2024-03-01', impact: 'high', status: 'reviewing' },
  { id: 4, title: 'Tenancy Law Amendment', category: 'Leasing', effective: '2024-04-01', impact: 'medium', status: 'monitoring' }
];

const EvangelineLegalCRM = () => {
  const [activeTab, setActiveTab] = useState('risks');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' },
      investigating: { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
      resolved: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
      pending_review: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' },
      approved: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
      signed: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
      pending_signature: { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
      action_required: { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' },
      compliant: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
      reviewing: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' },
      monitoring: { bg: 'rgba(107, 114, 128, 0.15)', color: '#6B7280' }
    };
    return styles[status] || styles.monitoring;
  };

  return (
    <div className="assistant-dashboard evangeline">
      <div className="assistant-header">
        <div className="assistant-avatar" style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' }}>
          <Scale size={28} />
        </div>
        <div className="assistant-info">
          <h2>Evangeline - Legal Risk Analyst</h2>
          <p>Proactively identifies, documents, and helps resolve legal issues. Monitors contracts, regulations, and transaction compliance</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card highlight">
          <div className="stat-icon" style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#DC2626' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">12</span>
            <span className="stat-label">Open Risks</span>
          </div>
          <span className="stat-change warning">3 critical</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' }}>
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">28</span>
            <span className="stat-label">Pending Contracts</span>
          </div>
          <span className="stat-change">8 this week</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
            <Shield size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">94%</span>
            <span className="stat-label">Compliance Rate</span>
          </div>
          <span className="stat-change positive"><ArrowUp size={14} /> 2%</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4</span>
            <span className="stat-label">Regulatory Updates</span>
          </div>
          <span className="stat-change warning">1 action needed</span>
        </div>
      </div>

      <div className="assistant-tabs">
        {['risks', 'contracts', 'regulations', 'library', 'docs'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'docs' ? 'Documentation' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'risks' && (
          <div className="risks-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search risks..." />
              </div>
              <button className="add-btn"><Plus size={16} /> Log Risk</button>
            </div>
            <div className="risks-list">
              {LEGAL_RISKS.map(risk => (
                <div key={risk.id} className="risk-card">
                  <div className="risk-severity" style={{ background: getSeverityColor(risk.severity) }} />
                  <div className="risk-content">
                    <div className="risk-header">
                      <h4>{risk.title}</h4>
                      <span className="risk-category">{risk.category}</span>
                    </div>
                    <p className="risk-property">{risk.property}</p>
                    <div className="risk-meta">
                      <span 
                        className="status-badge"
                        style={getStatusBadge(risk.status)}
                      >
                        {risk.status.replace('_', ' ')}
                      </span>
                      <span className="due-date"><Clock size={12} /> Due: {risk.dueDate}</span>
                    </div>
                  </div>
                  <button className="action-btn"><Eye size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="contracts-view">
            <div className="view-header">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search contracts..." />
              </div>
              <select className="filter-select">
                <option value="all">All Types</option>
                <option value="spa">SPA</option>
                <option value="lease">Lease Agreement</option>
                <option value="mou">MOU</option>
                <option value="form_f">Form F</option>
              </select>
            </div>
            <div className="contracts-grid">
              {CONTRACTS.map(contract => (
                <div key={contract.id} className="contract-card">
                  <div className="contract-type">{contract.type}</div>
                  <h4>{contract.property}</h4>
                  <p className="contract-client">{contract.client}</p>
                  <div className="contract-value">{contract.value}</div>
                  <div className="contract-footer">
                    <span 
                      className="status-badge"
                      style={getStatusBadge(contract.status)}
                    >
                      {contract.status.replace(/_/g, ' ')}
                    </span>
                    <span className="expires">Expires: {contract.expires}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'regulations' && (
          <div className="regulations-view">
            <h3>Regulatory Updates</h3>
            <div className="regulations-list">
              {REGULATIONS.map(reg => (
                <div key={reg.id} className="regulation-card">
                  <div className="regulation-content">
                    <h4>{reg.title}</h4>
                    <div className="regulation-meta">
                      <span className="category">{reg.category}</span>
                      <span className="effective">Effective: {reg.effective}</span>
                      <span className={`impact ${reg.impact}`}>Impact: {reg.impact}</span>
                    </div>
                  </div>
                  <span 
                    className="status-badge"
                    style={getStatusBadge(reg.status)}
                  >
                    {reg.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="library-view">
            <h3>Best Practices Library</h3>
            <div className="library-grid">
              <div className="library-card">
                <BookOpen size={24} />
                <h4>DLD Transaction Checklist</h4>
                <p>Complete checklist for property transfers</p>
              </div>
              <div className="library-card">
                <FileText size={24} />
                <h4>Lease Agreement Templates</h4>
                <p>Standard lease templates for residential</p>
              </div>
              <div className="library-card">
                <Shield size={24} />
                <h4>RERA Compliance Guide</h4>
                <p>Agent and company licensing requirements</p>
              </div>
              <div className="library-card">
                <Scale size={24} />
                <h4>Dispute Resolution Procedures</h4>
                <p>Step-by-step conflict resolution</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <AssistantDocsTab 
            assistantId="evangeline" 
            assistantName="Evangeline" 
            assistantColor="#DC2626" 
          />
        )}
      </div>
    </div>
  );
};

export default EvangelineLegalCRM;
