import React, { useState } from 'react';
import {
  Rocket,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Search,
  Eye,
  Star,
  Plus,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const DEVELOPMENTS = [
  {
    id: 1,
    name: 'Emaar Harbour Views III',
    developer: 'Emaar',
    location: 'Dubai Creek Harbour',
    launchDate: '2024-Q2',
    handover: '2027-Q4',
    units: 420,
    startPrice: 'AED 1.2M',
    soldPct: 72,
    status: 'selling',
  },
  {
    id: 2,
    name: 'Damac Islands',
    developer: 'Damac',
    location: 'Dubailand',
    launchDate: '2024-Q1',
    handover: '2028-Q2',
    units: 800,
    startPrice: 'AED 1.8M',
    soldPct: 45,
    status: 'selling',
  },
  {
    id: 3,
    name: 'Sobha Hartland II Phase 3',
    developer: 'Sobha',
    location: 'MBR City',
    launchDate: '2024-Q3',
    handover: '2027-Q3',
    units: 280,
    startPrice: 'AED 2.4M',
    soldPct: 0,
    status: 'upcoming',
  },
  {
    id: 4,
    name: 'Meraas Haven Views',
    developer: 'Meraas',
    location: 'City Walk',
    launchDate: '2024-Q2',
    handover: '2026-Q4',
    units: 180,
    startPrice: 'AED 3.5M',
    soldPct: 88,
    status: 'almost_sold',
  },
];

const PIPELINE = [
  { name: 'Aldar Yas Beach Phase 2', est: 'Q3 2024', units: 350, developer: 'Aldar' },
  { name: 'Nakheel Palm Jebel Ali Villas', est: 'Q4 2024', units: 120, developer: 'Nakheel' },
  { name: 'Emaar Hills Park', est: 'Q1 2025', units: 600, developer: 'Emaar' },
];

const statusColors = { selling: '#22C55E', upcoming: '#3B82F6', almost_sold: '#E31E24' };

const NovaCRM = () => {
  const [activeTab, setActiveTab] = useState('developments');
  const [search, setSearch] = useState('');

  const filtered = DEVELOPMENTS.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.developer.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'developments', label: '🏗️ Active Launches' },
    { id: 'pipeline', label: '🚀 Coming Soon' },
    { id: 'tracker', label: '📊 Sales Tracker' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard nova">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--accent-gold, #F59E0B) 0%, var(--color-b45309, #B45309) 100%)' }}
        >
          <Rocket size={28} />
        </div>
        <div className="assistant-info">
          <h2>Nova — New Development & Off-Plan Tracker</h2>
          <p>Live monitoring of Dubai off-plan launches, developer pipelines, and sales rates</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Tracking
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-gold, #F59E0B)' }}
          >
            <Building2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{DEVELOPMENTS.length}</span>
            <span className="stat-label">Active Launches</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue, #3B82F6)' }}
          >
            <Rocket size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{PIPELINE.length}</span>
            <span className="stat-label">Pipeline Projects</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green, #22C55E)' }}
          >
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">64%</span>
            <span className="stat-label">Avg Sold Rate</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: 'var(--color-e31e24, #E31E24)' }}
          >
            <Star size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">1,680</span>
            <span className="stat-label">Total Units Tracked</span>
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

      {activeTab === 'developments' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search developments…"
              />
            </div>
            <button className="action-btn primary" style={{ fontSize: 12 }}>
              <Plus size={14} /> Track New
            </button>
          </div>
          {filtered.map(d => (
            <div
              key={d.id}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>{d.name}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 2 }}>
                    {d.developer} · <MapPin size={11} style={{ display: 'inline' }} /> {d.location}
                  </div>
                </div>
                <span
                  className="status-badge"
                  style={{
                    background: `${statusColors[d.status]}22`,
                    color: statusColors[d.status],
                  }}
                >
                  {d.status.replace('_', ' ')}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  fontSize: 13,
                  marginBottom: 12,
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  <Calendar size={12} style={{ display: 'inline' }} /> Launch: {d.launchDate}
                </span>
                <span>Handover: {d.handover}</span>
                <span>
                  <Users size={12} style={{ display: 'inline' }} /> {d.units} units
                </span>
                <span>
                  <DollarSign size={12} style={{ display: 'inline' }} /> From {d.startPrice}
                </span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>Sold</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{d.soldPct}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-e5e7eb, #e5e7eb)', borderRadius: 4 }}>
                  <div
                    style={{
                      width: `${d.soldPct}%`,
                      height: '100%',
                      background: d.soldPct >= 80 ? '#E31E24' : '#22C55E',
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Expected Launches</h3>
          {PIPELINE.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(245,158,11,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={22} color="#F59E0B" />
              </div>
              <div style={{ flex: 1 }}>
                <strong>{p.name}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 2 }}>
                  {p.developer} · {p.units} units · Est. {p.est}
                </div>
              </div>
              <button className="action-btn" style={{ fontSize: 11, padding: '5px 12px' }}>
                <Eye size={12} /> Watch
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tracker' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Sales Rate Overview</h3>
          {DEVELOPMENTS.map(d => (
            <div
              key={d.id}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{d.name}</strong>
                <span style={{ fontWeight: 700, color: d.soldPct >= 80 ? 'var(--color-e31e24, #E31E24)' : 'var(--accent-green, #22C55E)' }}>
                  {d.soldPct}% sold
                </span>
              </div>
              <div style={{ height: 10, background: 'var(--color-e5e7eb, #e5e7eb)', borderRadius: 5 }}>
                <div
                  style={{
                    width: `${d.soldPct}%`,
                    height: '100%',
                    background: d.soldPct >= 80 ? '#E31E24' : '#22C55E',
                    borderRadius: 5,
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary, #9ca3af)', marginTop: 6 }}>
                {Math.round((d.units * d.soldPct) / 100)} / {d.units} units
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="nova" color="#F59E0B" assistantName="Nova" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="nova" color="#F59E0B" assistantName="Nova" />
      )}
    </div>
  );
};

export default NovaCRM;
