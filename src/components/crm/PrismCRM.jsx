import React, { useState } from 'react';
import {
  Layers,
  Home,
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const MATCHES = [
  {
    id: 1,
    lead: 'Ahmad Al Rashidi',
    property: 'Palm Jumeirah Villa G-12',
    matchScore: 97,
    price: 'AED 8.5M',
    beds: 5,
    baths: 6,
    area: 'Palm Jumeirah',
    reasons: ['Budget match', 'Location preference', 'Family size'],
    status: 'Sent',
  },
  {
    id: 2,
    lead: 'Priya Nair',
    property: 'Marina Gate Tower 2 – 2BR',
    matchScore: 91,
    price: 'AED 1.75M',
    beds: 2,
    baths: 2,
    area: 'Dubai Marina',
    reasons: ['Budget match', 'Sea view preference', 'High ROI'],
    status: 'Pending',
  },
  {
    id: 3,
    lead: 'James Whitmore',
    property: 'Emirates Hills Sector E',
    matchScore: 88,
    price: 'AED 18M',
    beds: 7,
    baths: 8,
    area: 'Emirates Hills',
    reasons: ['Privacy', 'Golf view', 'Staff quarters'],
    status: 'Viewed',
  },
  {
    id: 4,
    lead: 'Fatima Al Suwaidi',
    property: 'Downtown Blvd Heights – 3BR',
    matchScore: 82,
    price: 'AED 2.1M',
    beds: 3,
    baths: 3,
    area: 'Downtown',
    reasons: ['Central location', 'Budget within range'],
    status: 'Pending',
  },
  {
    id: 5,
    lead: 'Chen Wei',
    property: 'JVC Bloom Towers Studio',
    matchScore: 74,
    price: 'AED 875K',
    beds: 0,
    baths: 1,
    area: 'JVC',
    reasons: ['Entry price point', 'Investment yield'],
    status: 'Pending',
  },
];

const AREAS = [
  'All',
  'Palm Jumeirah',
  'Dubai Marina',
  'Emirates Hills',
  'Downtown',
  'JVC',
  'Business Bay',
];

const ALGORITHM_STEPS = [
  {
    step: '1',
    title: 'Lead Profile Extraction',
    desc: 'Parse budget, preferred area, property type, timeline, family size from CRM.',
  },
  {
    step: '2',
    title: 'Inventory Vector Build',
    desc: 'Encode each available listing as a feature vector (price, beds, area, amenities, view).',
  },
  {
    step: '3',
    title: 'Cosine Similarity Scoring',
    desc: 'Compute similarity between lead profile and each property vector (0–100).',
  },
  {
    step: '4',
    title: 'Business Rule Overlay',
    desc: 'Apply filters: within ±15% of budget, must match property type, exclude off-market if not VIP.',
  },
  {
    step: '5',
    title: 'Ranked Shortlist',
    desc: 'Return top 5 matches sorted by score, auto-send to Clara for follow-up workflow.',
  },
];

const PrismCRM = () => {
  const [activeTab, setActiveTab] = useState('matches');
  const [areaFilter, setAreaFilter] = useState('All');

  const filtered = areaFilter === 'All' ? MATCHES : MATCHES.filter(m => m.area === areaFilter);

  const tabs = [
    { id: 'matches', label: '🔮 Matches' },
    { id: 'algorithm', label: '⚙️ Algorithm' },
    { id: 'inventory', label: '🏘️ Inventory View' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard prism">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--accent-purple, #8B5CF6) 0%, var(--accent-purple, #6D28D9) 100%)' }}
        >
          <Layers size={28} />
        </div>
        <div className="assistant-info">
          <h2>Prism — AI Property Matching Engine</h2>
          <p>Instant property–lead matching using multi-vector similarity scoring</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Matching Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent-purple, #8B5CF6)' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">5</span>
            <span className="stat-label">Matches Today</span>
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
            <span className="stat-value">87%</span>
            <span className="stat-label">Avg Match Score</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue, #3B82F6)' }}
          >
            <Home size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">124</span>
            <span className="stat-label">Active Listings</span>
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
            <span className="stat-value">62%</span>
            <span className="stat-label">Viewing Conversion</span>
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

      {activeTab === 'matches' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div className="search-box">
              <MapPin size={16} />
              <select
                value={areaFilter}
                onChange={e => setAreaFilter(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 14 }}
              >
                {AREAS.map(a => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>{filtered.length} matches</span>
          </div>
          {filtered.map(m => (
            <div
              key={m.id}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{m.property}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 2 }}>For: {m.lead}</div>
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    background: m.matchScore >= 90 ? '#fff7f7' : '#f0fdf4',
                    border: `1px solid ${m.matchScore >= 90 ? '#fecaca' : '#bbf7d0'}`,
                    borderRadius: 8,
                    padding: '6px 12px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 22,
                      color: m.matchScore >= 90 ? '#E31E24' : '#16A34A',
                    }}
                  >
                    {m.matchScore}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary, #6b7280)' }}>match</div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  fontSize: 13,
                  color: '#374151',
                  marginBottom: 10,
                }}
              >
                <span>
                  <DollarSign size={13} style={{ display: 'inline' }} /> {m.price}
                </span>
                <span>
                  <Bed size={13} style={{ display: 'inline' }} /> {m.beds || 'Studio'}
                </span>
                <span>
                  <Bath size={13} style={{ display: 'inline' }} /> {m.baths}
                </span>
                <span>
                  <MapPin size={13} style={{ display: 'inline' }} /> {m.area}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {m.reasons.map(r => (
                  <span
                    key={r}
                    style={{
                      background: '#EEF2FF',
                      color: '#4F46E5',
                      borderRadius: 20,
                      padding: '2px 10px',
                      fontSize: 11,
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span className="status-badge">{m.status}</span>
                <button
                  className="action-btn primary"
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  Send to Lead
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'algorithm' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>How Prism Matches Properties</h3>
          {ALGORITHM_STEPS.map(s => (
            <div
              key={s.step}
              style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#8B5CF6',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <div>
                <strong>{s.title}</strong>
                <p style={{ fontSize: 13, color: 'var(--text-secondary, #6b7280)', margin: '4px 0 0' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input placeholder="Search inventory…" />
            </div>
            <button className="action-btn" style={{ fontSize: 12 }}>
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {MATCHES.map(m => (
              <div
                key={m.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: 100,
                    background: `linear-gradient(135deg, #8B5CF633, #6D28D933)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Home size={40} color="#8B5CF6" />
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m.property}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-e31e24, #E31E24)', fontWeight: 600 }}>{m.price}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 4 }}>
                    {m.area} · {m.beds || 'Studio'} bed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="prism" color="#8B5CF6" assistantName="Prism" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="prism" color="#8B5CF6" assistantName="Prism" />
      )}
    </div>
  );
};

export default PrismCRM;
