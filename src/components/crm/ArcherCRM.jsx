import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Zap,
  Star,
  Filter,
  Search,
  AlertCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const SCORED_LEADS = [
  {
    id: 1,
    name: 'Ahmad Al Rashidi',
    score: 94,
    budget: 'AED 3.5M',
    source: 'WhatsApp',
    interest: 'Palm Jumeirah Villa',
    velocity: 'High',
    change: +4,
  },
  {
    id: 2,
    name: 'Priya Nair',
    score: 88,
    budget: 'AED 1.8M',
    source: 'Web Form',
    interest: 'Dubai Marina Apt',
    velocity: 'High',
    change: +12,
  },
  {
    id: 3,
    name: 'James Whitmore',
    score: 76,
    budget: 'AED 5M+',
    source: 'Referral',
    interest: 'Emirates Hills',
    velocity: 'Medium',
    change: -3,
  },
  {
    id: 4,
    name: 'Fatima Al Suwaidi',
    score: 71,
    budget: 'AED 2.2M',
    source: 'Portal',
    interest: 'Downtown Dubai',
    velocity: 'Medium',
    change: +8,
  },
  {
    id: 5,
    name: 'Chen Wei',
    score: 62,
    budget: 'AED 900K',
    source: 'Social',
    interest: 'JVC Studio',
    velocity: 'Low',
    change: -1,
  },
  {
    id: 6,
    name: 'Sara Müller',
    score: 55,
    budget: 'AED 1.2M',
    source: 'Email',
    interest: 'Business Bay',
    velocity: 'Low',
    change: +2,
  },
  {
    id: 7,
    name: 'Ravi Patel',
    score: 48,
    budget: 'AED 750K',
    source: 'Cold',
    interest: 'Al Barsha',
    velocity: 'Low',
    change: -5,
  },
];

const SCORING_FACTORS = [
  { factor: 'Enquiry Channel', weight: 20, description: 'WhatsApp direct = high intent signal' },
  {
    factor: 'Budget Specificity',
    weight: 18,
    description: 'Precise AED figure vs. "flexible" range',
  },
  {
    factor: 'Community Match',
    weight: 22,
    description: 'Desired area vs. available inventory overlap',
  },
  {
    factor: 'Engagement Velocity',
    weight: 25,
    description: 'Response time, message count, viewing requests',
  },
  {
    factor: 'Historical Patterns',
    weight: 15,
    description: 'Similar lead profile win-rate from past data',
  },
];

const QUEUE_STATS = [
  { label: 'Hot Leads (80+)', value: 2, color: 'var(--error-color)' },
  { label: 'Warm Leads (60–79)', value: 3, color: '#F97316' },
  { label: 'Cold Leads (<60)', value: 2, color: '#6B7280' },
];

const getScoreColor = score => {
  if (score >= 80) return '#E31E24';
  if (score >= 60) return '#F97316';
  return '#6B7280';
};

const getVelocityBadge = v => {
  const map = { High: '#22C55E', Medium: '#F59E0B', Low: '#6B7280' };
  // eslint-disable-next-line security/detect-object-injection
  return map[v] || '#6B7280';
};

const ArcherCRM = () => {
  const [activeTab, setActiveTab] = useState('scores');
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState(0);

  const filtered = SCORED_LEADS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  ).filter(l => l.score >= minScore);

  const tabs = [
    { id: 'scores', label: '🎯 Lead Scores' },
    { id: 'factors', label: '⚖️ Scoring Model' },
    { id: 'queue', label: '📋 Agent Queue' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard archer">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'var(--error-gradient)' }}
        >
          <Target size={28} />
        </div>
        <div className="assistant-info">
          <h2>Archer — Lead Scoring Engine</h2>
          <p>Real-time conversion probability scoring for every lead in the pipeline</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Scoring Active
        </div>
      </div>

      <div className="quick-stats">
        {QUEUE_STATS.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>
              <Star size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'var(--success-light)', color: 'var(--success-color)' }}
          >
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">91%</span>
            <span className="stat-label">Score Accuracy</span>
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

      {activeTab === 'scores' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads…"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={16} />
              <select
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                }}
              >
                <option value={0}>All Scores</option>
                <option value={80}>Hot only (80+)</option>
                <option value={60}>Warm+ (60+)</option>
              </select>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Score</th>
                <th>Δ</th>
                <th>Budget</th>
                <th>Source</th>
                <th>Interest</th>
                <th>Velocity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.name}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div
                        style={{
                          width: 40,
                          height: 8,
                          borderRadius: 4,
                          background: '#f3f4f6',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${l.score}%`,
                            height: '100%',
                            background: getScoreColor(l.score),
                            borderRadius: 4,
                          }}
                        />
                      </div>
                      <strong style={{ color: getScoreColor(l.score) }}>{l.score}</strong>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        color: l.change >= 0 ? '#22C55E' : '#EF4444',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {l.change >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {Math.abs(l.change)}
                    </span>
                  </td>
                  <td>{l.budget}</td>
                  <td>
                    <span className="status-badge">{l.source}</span>
                  </td>
                  <td>{l.interest}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: `${getVelocityBadge(l.velocity)}22`,
                        color: getVelocityBadge(l.velocity),
                      }}
                    >
                      {l.velocity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'factors' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Scoring Model Weights</h3>
          {SCORING_FACTORS.map(f => (
            <div
              key={f.factor}
              style={{
                background: '#f9fafb',
                borderRadius: 10,
                padding: '14px 18px',
                marginBottom: 12,
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <strong>{f.factor}</strong>
                <span style={{ color: 'var(--error-color)', fontWeight: 700 }}>{f.weight}%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--border-color)', borderRadius: 4 }}>
                <div
                  style={{
                    width: `${f.weight * 4}%`,
                    height: '100%',
                    background: 'var(--error-color)',
                    borderRadius: 4,
                  }}
                />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>{f.description}</p>
            </div>
          ))}
          <div
            style={{
              background: '#fff7f7',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: 14,
              marginTop: 8,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <AlertCircle size={16} color="#E31E24" />
            <p style={{ fontSize: 12, color: 'var(--error-color)', margin: 0 }}>
              Model is retrained weekly against closed/lost deal outcomes. Seasonal adjustments
              applied for Ramadan & summer markets.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Agent Work Queue (Priority Order)</h3>
          {[...SCORED_LEADS]
            .sort((a, b) => b.score - a.score)
            .map((l, i) => (
              <div
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  background: i === 0 ? '#fff7f7' : '#f9fafb',
                  border: `1px solid ${i === 0 ? '#fecaca' : '#e5e7eb'}`,
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: getScoreColor(l.score),
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{l.name}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {l.interest} · {l.budget}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: getScoreColor(l.score), fontSize: 18 }}>
                    {l.score}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>score</div>
                </div>
                <button
                  className="action-btn primary"
                  style={{ fontSize: 12, padding: '6px 12px' }}
                >
                  <Zap size={12} /> Contact
                </button>
              </div>
            ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="archer" color="#EF4444" assistantName="Archer" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="archer" color="#EF4444" assistantName="Archer" />
      )}
    </div>
  );
};

export default ArcherCRM;
