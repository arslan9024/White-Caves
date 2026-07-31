import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
  Upload,
  Clock,
  XCircle,
  Eye,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const DOCUMENTS = [
  {
    id: 1,
    client: 'Ahmad Al Rashidi',
    type: 'Passport',
    issuer: 'UAE',
    expiry: '2028-03-15',
    status: 'verified',
    risk: 'low',
  },
  {
    id: 2,
    client: 'Ahmad Al Rashidi',
    type: 'Emirates ID',
    issuer: 'ICA',
    expiry: '2026-09-01',
    status: 'verified',
    risk: 'low',
  },
  {
    id: 3,
    client: 'Priya Nair',
    type: 'Passport',
    issuer: 'India',
    expiry: '2024-12-31',
    status: 'expiring',
    risk: 'medium',
  },
  {
    id: 4,
    client: 'James Whitmore',
    type: 'Visa',
    issuer: 'GDRFA',
    expiry: '2027-06-01',
    status: 'verified',
    risk: 'low',
  },
  {
    id: 5,
    client: 'Fatima Al Suwaidi',
    type: 'Title Deed',
    issuer: 'DLD',
    expiry: null,
    status: 'verified',
    risk: 'low',
  },
  {
    id: 6,
    client: 'Chen Wei',
    type: 'Bank Statement',
    issuer: 'ICBC',
    expiry: null,
    status: 'flagged',
    risk: 'high',
  },
];

const CHECKS = [
  { rule: 'Passport validity (≥6 months)', pass: 4, fail: 1 },
  { rule: 'Source of funds declaration', pass: 5, fail: 1 },
  { rule: 'PEP screening', pass: 6, fail: 0 },
  { rule: 'Sanctions list cross-check', pass: 6, fail: 0 },
  { rule: 'RERA registration (agents)', pass: 3, fail: 0 },
];

const statusColors = {
  verified: '#22C55E',
  expiring: '#F59E0B',
  flagged: '#E31E24',
  pending: '#6B7280',
};
const riskColors = { low: '#22C55E', medium: '#F59E0B', high: '#E31E24' };

const RexCRM = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [search, setSearch] = useState('');

  const filtered = DOCUMENTS.filter(
    d =>
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'documents', label: '📄 Documents' },
    { id: 'checks', label: '✅ Compliance Checks' },
    { id: 'alerts', label: '⚠️ Alerts' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  const flagged = DOCUMENTS.filter(d => d.status === 'flagged' || d.status === 'expiring');

  return (
    <div className="assistant-dashboard rex">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--color-6366f1, #6366F1) 0%, var(--color-4338ca, #4338CA) 100%)' }}
        >
          <ShieldCheck size={28} />
        </div>
        <div className="assistant-info">
          <h2>Rex — Regulatory Document Verifier</h2>
          <p>Automated KYC document verification and regulatory compliance checks</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Scanning
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--color-6366f1, #6366F1)' }}
          >
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{DOCUMENTS.length}</span>
            <span className="stat-label">Documents</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green, #22C55E)' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {DOCUMENTS.filter(d => d.status === 'verified').length}
            </span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: 'var(--color-e31e24, #E31E24)' }}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{flagged.length}</span>
            <span className="stat-label">Needs Attention</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-gold, #F59E0B)' }}
          >
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4m</span>
            <span className="stat-label">Avg Verify Time</span>
          </div>
        </div>
      </div>

      <div className="crm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`crm-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'documents' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search documents…"
              />
            </div>
            <button className="action-btn primary" style={{ fontSize: 12 }}>
              <Upload size={14} /> Upload Doc
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Document</th>
                <th>Issuer</th>
                <th>Expiry</th>
                <th>Risk</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.client}</strong>
                  </td>
                  <td>{d.type}</td>
                  <td>{d.issuer}</td>
                  <td style={{ fontSize: 12 }}>{d.expiry || '—'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ background: `${riskColors[d.risk]}22`, color: riskColors[d.risk] }}
                    >
                      {d.risk}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: `${statusColors[d.status]}22`,
                        color: statusColors[d.status],
                      }}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn" style={{ fontSize: 11, padding: '4px 10px' }}>
                      <Eye size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'checks' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Compliance Rule Results</h3>
          {CHECKS.map(c => (
            <div
              key={c.rule}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 10,
              }}
            >
              {c.fail === 0 ? (
                <CheckCircle size={18} color="#22C55E" />
              ) : (
                <AlertTriangle size={18} color="#F59E0B" />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.rule}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>
                  {c.pass} passed · {c.fail} failed
                </div>
              </div>
              <span style={{ fontWeight: 700, color: c.fail === 0 ? 'var(--accent-green, #22C55E)' : 'var(--accent-gold, #F59E0B)' }}>
                {c.fail === 0 ? '100%' : `${Math.round((c.pass / (c.pass + c.fail)) * 100)}%`}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="tab-content">
          {flagged.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--accent-green, #22C55E)' }}>
              <CheckCircle size={48} />
              <p style={{ marginTop: 12 }}>No active alerts — all documents in order.</p>
            </div>
          ) : (
            flagged.map(d => (
              <div
                key={d.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  background: d.status === 'flagged' ? '#fff7f7' : '#fffbeb',
                  border: `1px solid ${d.status === 'flagged' ? '#fecaca' : '#fde68a'}`,
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                {d.status === 'flagged' ? (
                  <XCircle size={20} color="#E31E24" />
                ) : (
                  <AlertTriangle size={20} color="#F59E0B" />
                )}
                <div>
                  <strong>
                    {d.client} — {d.type}
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary, #6b7280)' }}>
                    {d.status === 'flagged'
                      ? 'Document flagged for manual review — possible inconsistency detected'
                      : `Expiring on ${d.expiry} — renewal required`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="rex" color="#6366F1" assistantName="Rex" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="rex" color="#6366F1" assistantName="Rex" />
      )}
    </div>
  );
};

export default RexCRM;
