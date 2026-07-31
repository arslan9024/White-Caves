import React, { useState } from 'react';
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Download,
  Share2,
  Map,
  RefreshCw,
  DollarSign,
  Users,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const REPORT_METRICS = [
  { label: 'Total Revenue YTD', value: 'AED 86.4M', change: +22, period: 'vs last year' },
  { label: 'Properties Sold', value: '148', change: +18, period: 'vs last year' },
  { label: 'Active Leads', value: '312', change: +7, period: 'vs last month' },
  { label: 'Avg Deal Size', value: 'AED 3.8M', change: +4, period: 'vs last year' },
];

const CHARTS = [
  {
    name: 'Monthly Revenue',
    type: 'bar',
    data: [4.2, 5.1, 6.3, 7.8, 5.9, 8.1, 9.2, 7.4, 8.8, 10.1, 7.6, 6.9],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  {
    name: 'Lead Sources',
    type: 'pie',
    data: [
      { label: 'WhatsApp', value: 38, color: '#25D366' },
      { label: 'Portal', value: 28, color: '#3B82F6' },
      { label: 'Referral', value: 20, color: '#8B5CF6' },
      { label: 'Social', value: 14, color: '#F59E0B' },
    ],
  },
];

const SAVED_REPORTS = [
  { name: 'Q1 2024 Sales Summary', type: 'Sales', created: '7d ago', format: 'PDF' },
  { name: 'January Agent Performance', type: 'HR', created: '14d ago', format: 'Excel' },
  { name: 'Leasing Portfolio Review', type: 'Leasing', created: '21d ago', format: 'PDF' },
  { name: 'Marketing ROI Report', type: 'Marketing', created: '1mo ago', format: 'PDF' },
];

const maxBar = Math.max(...CHARTS[0].data);

const LumenCRM = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'charts', label: '📈 Charts' },
    { id: 'reports', label: '📋 Saved Reports' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard lumen">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--accent-gold, #F59E0B) 0%, var(--accent-gold, #D97706) 100%)' }}
        >
          <BarChart2 size={28} />
        </div>
        <div className="assistant-info">
          <h2>Lumen — Visual Analytics & Reporting Engine</h2>
          <p>Auto-refreshing charts, exportable dashboards and board-level reports</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Live
        </div>
      </div>

      <div className="quick-stats">
        {REPORT_METRICS.map(m => (
          <div className="stat-card" key={m.label}>
            <div
              className="stat-icon"
              style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-gold, #F59E0B)' }}
            >
              <TrendingUp size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{m.value}</span>
              <span className="stat-label">{m.label}</span>
            </div>
            <span className="stat-change positive">+{m.change}%</span>
          </div>
        ))}
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

      {activeTab === 'dashboard' && (
        <div className="tab-content">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 16,
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0 }}>Executive Overview</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="action-btn" style={{ fontSize: 12 }}>
                <RefreshCw size={12} /> Refresh
              </button>
              <button className="action-btn primary" style={{ fontSize: 12 }}>
                <Download size={12} /> Export PDF
              </button>
            </div>
          </div>
          <div
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong>Monthly Revenue (AED M)</strong>
              <span style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>Jan – Dec 2024</span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 }}>
              {CHARTS[0].data.map((v, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${(v / maxBar) * 80}px`,
                      background: '#E31E24',
                      borderRadius: '3px 3px 0 0',
                      opacity: 0.8 + (v / maxBar) * 0.2,
                    }}
                  />
                  {/* eslint-disable-next-line security/detect-object-injection */}
                  <span style={{ fontSize: 9, color: 'var(--text-secondary, #9ca3af)' }}>{CHARTS[0].labels[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <strong style={{ marginBottom: 12, display: 'block' }}>Lead Sources</strong>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {CHARTS[1].data.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13 }}>
                    {d.label}: <strong>{d.value}%</strong>
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                height: 12,
                borderRadius: 6,
                overflow: 'hidden',
                marginTop: 12,
              }}
            >
              {CHARTS[1].data.map(d => (
                <div
                  key={d.label}
                  style={{ width: `${d.value}%`, height: '100%', background: d.color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="tab-content">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {[
              { name: 'Revenue by Department', icon: DollarSign, color: '#E31E24' },
              { name: 'Agent Performance Matrix', icon: Users, color: '#3B82F6' },
              { name: 'Geographic Heat Map', icon: Map, color: '#10B981' },
              { name: 'Lead Pipeline Funnel', icon: TrendingUp, color: '#8B5CF6' },
              { name: 'Lease vs Sales Mix', icon: PieChart, color: '#F59E0B' },
              { name: 'Monthly KPI Trend', icon: BarChart2, color: '#0D9488' },
            ].map(c => (
              <div
                key={c.name}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 20,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${c.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <c.icon size={22} color={c.color} />
                </div>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <button
                  className="action-btn primary"
                  style={{ marginTop: 12, fontSize: 12, width: '100%' }}
                >
                  View Chart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <button className="action-btn primary" style={{ fontSize: 12 }}>
              <BarChart2 size={14} /> New Report
            </button>
          </div>
          {SAVED_REPORTS.map((r, i) => (
            <div
              key={i}
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
              <BarChart2 size={18} color="#F59E0B" />
              <div style={{ flex: 1 }}>
                <strong>{r.name}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 2 }}>
                  {r.type} · {r.format} · {r.created}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="action-btn" style={{ fontSize: 11, padding: '4px 10px' }}>
                  <Download size={11} />
                </button>
                <button className="action-btn" style={{ fontSize: 11, padding: '4px 10px' }}>
                  <Share2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="lumen" color="#F59E0B" assistantName="Lumen" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="lumen" color="#F59E0B" assistantName="Lumen" />
      )}
    </div>
  );
};

export default LumenCRM;
