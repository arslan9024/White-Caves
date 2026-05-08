import React, { useState } from 'react';
import {
  FileEdit,
  Download,
  Send,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Eye,
  FileText,
  Layers,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const TEMPLATES = [
  {
    id: 1,
    name: 'Sale & Purchase Agreement (RERA)',
    category: 'Sales',
    lang: 'EN/AR',
    lastUsed: '2h ago',
    uses: 48,
  },
  {
    id: 2,
    name: 'Memorandum of Understanding (MOU)',
    category: 'Sales',
    lang: 'EN',
    lastUsed: '4h ago',
    uses: 122,
  },
  {
    id: 3,
    name: 'Ejari Tenancy Contract',
    category: 'Leasing',
    lang: 'EN/AR',
    lastUsed: '1d ago',
    uses: 87,
  },
  {
    id: 4,
    name: 'NOC Request Letter',
    category: 'Admin',
    lang: 'EN/AR',
    lastUsed: '3d ago',
    uses: 31,
  },
  {
    id: 5,
    name: 'Commission Statement',
    category: 'Finance',
    lang: 'EN',
    lastUsed: '1d ago',
    uses: 56,
  },
  {
    id: 6,
    name: 'Investor Portfolio Report',
    category: 'Finance',
    lang: 'EN',
    lastUsed: '5d ago',
    uses: 14,
  },
];

const RECENT_DOCS = [
  {
    id: 1,
    title: 'SPA — Ahmad Al Rashidi × Palm Villa G-12',
    type: 'SPA',
    status: 'signed',
    created: '2h ago',
  },
  {
    id: 2,
    title: 'MOU — Priya Nair × Marina Gate 2BR',
    type: 'MOU',
    status: 'pending',
    created: '5h ago',
  },
  {
    id: 3,
    title: 'Commission Statement — Omar Siddiqui Jan 2024',
    type: 'Finance',
    status: 'sent',
    created: '1d ago',
  },
  {
    id: 4,
    title: 'Ejari — Fatima Al Suwaidi × JVC Studio',
    type: 'Lease',
    status: 'signed',
    created: '2d ago',
  },
];

const statusColors = { signed: '#22C55E', pending: '#F59E0B', sent: '#3B82F6', draft: '#6B7280' };

const QuillCRM = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const cats = ['All', 'Sales', 'Leasing', 'Finance', 'Admin'];
  const filteredTpl = TEMPLATES.filter(t => catFilter === 'All' || t.category === catFilter).filter(
    t => t.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'recent', label: '📄 Recent Docs' },
    { id: 'templates', label: '📋 Templates' },
    { id: 'generate', label: '✨ Generate' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard quill">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, #64748B 0%, #334155 100%)' }}
        >
          <FileEdit size={28} />
        </div>
        <div className="assistant-info">
          <h2>Quill — Document Generator Engine</h2>
          <p>RERA-compliant document generation from CRM data in seconds</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Ready
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(100,116,139,0.15)', color: '#64748B' }}
          >
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{RECENT_DOCS.length}</span>
            <span className="stat-label">Docs This Week</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {RECENT_DOCS.filter(d => d.status === 'signed').length}
            </span>
            <span className="stat-label">Signed</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
          >
            <Layers size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{TEMPLATES.length}</span>
            <span className="stat-label">Templates</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
          >
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">8s</span>
            <span className="stat-label">Avg Gen Time</span>
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

      {activeTab === 'recent' && (
        <div className="tab-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_DOCS.map(d => (
                <tr key={d.id}>
                  <td
                    style={{
                      maxWidth: 240,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <strong>{d.title}</strong>
                  </td>
                  <td>
                    <span className="status-badge">{d.type}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{d.created}</td>
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
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="action-btn" style={{ fontSize: 11, padding: '4px 8px' }}>
                        <Eye size={11} />
                      </button>
                      <button className="action-btn" style={{ fontSize: 11, padding: '4px 8px' }}>
                        <Download size={11} />
                      </button>
                      <button className="action-btn" style={{ fontSize: 11, padding: '4px 8px' }}>
                        <Send size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search templates…"
              />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    border: `1px solid ${catFilter === c ? '#64748B' : '#e5e7eb'}`,
                    background: catFilter === c ? '#64748B' : '#fff',
                    color: catFilter === c ? '#fff' : '#374151',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {filteredTpl.map(t => (
            <div
              key={t.id}
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
              <FileText size={18} color="#64748B" />
              <div style={{ flex: 1 }}>
                <strong>{t.name}</strong>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                  {t.category} · {t.lang} · {t.uses} uses
                </div>
              </div>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>Used {t.lastUsed}</span>
              <button className="action-btn primary" style={{ fontSize: 12, padding: '6px 14px' }}>
                <Plus size={12} /> Generate
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Quick Document Generator</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            {[
              { label: 'Document Template', type: 'select', options: TEMPLATES.map(t => t.name) },
              { label: 'Client Name', type: 'text', placeholder: 'e.g. Ahmad Al Rashidi' },
              { label: 'Property', type: 'text', placeholder: 'e.g. Palm Villa G-12' },
              { label: 'Transaction Amount (AED)', type: 'text', placeholder: 'e.g. 8500000' },
              {
                label: 'Output Language',
                type: 'select',
                options: ['English', 'Arabic', 'Bilingual EN/AR'],
              },
            ].map(f => (
              <div key={f.label}>
                <label
                  style={{ fontSize: 13, color: '#6b7280', marginBottom: 6, display: 'block' }}
                >
                  {f.label}
                </label>
                {f.type === 'select' ? (
                  <select
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 14,
                    }}
                  >
                    {f.options.map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 14,
                    }}
                  />
                )}
              </div>
            ))}
            <button
              className="action-btn primary"
              style={{ marginTop: 4, padding: '10px 20px', fontSize: 14 }}
            >
              <FileEdit size={16} /> Generate Document
            </button>
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="quill" color="#64748B" assistantName="Quill" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="quill" color="#64748B" assistantName="Quill" />
      )}
    </div>
  );
};

export default QuillCRM;
