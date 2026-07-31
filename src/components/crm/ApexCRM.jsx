import React, { useState } from 'react';
import { Award, TrendingUp, Target, ArrowUp, ArrowDown, Phone, Calendar } from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const AGENTS = [
  {
    id: 1,
    name: 'Omar Siddiqui',
    deals: 8,
    revenue: 'AED 2.4M',
    calls: 45,
    viewings: 22,
    convRate: '36%',
    rank: 1,
    trend: +2,
  },
  {
    id: 2,
    name: 'Lena Petrov',
    deals: 6,
    revenue: 'AED 1.9M',
    calls: 38,
    viewings: 18,
    convRate: '33%',
    rank: 2,
    trend: +1,
  },
  {
    id: 3,
    name: 'Ahmed Al Mansouri',
    deals: 5,
    revenue: 'AED 3.1M',
    calls: 28,
    viewings: 12,
    convRate: '42%',
    rank: 3,
    trend: 0,
  },
  {
    id: 4,
    name: 'Rina Tanaka',
    deals: 4,
    revenue: 'AED 1.1M',
    calls: 52,
    viewings: 15,
    convRate: '27%',
    rank: 4,
    trend: -1,
  },
  {
    id: 5,
    name: 'Carlos Rivera',
    deals: 3,
    revenue: 'AED 0.8M',
    calls: 31,
    viewings: 9,
    convRate: '33%',
    rank: 5,
    trend: +1,
  },
];

const COACHING_PLANS = [
  {
    agent: 'Rina Tanaka',
    focus: 'Conversion Rate',
    action: 'Role-play objection handling with Apex',
    dueDate: '2024-02-15',
    priority: 'high',
  },
  {
    agent: 'Carlos Rivera',
    focus: 'Activity Volume',
    action: 'Increase daily call targets to 45',
    dueDate: '2024-02-10',
    priority: 'medium',
  },
];

const METRICS = [
  { label: 'Avg Calls/Agent', value: '38.8', icon: Phone },
  { label: 'Avg Viewings/Agent', value: '15.2', icon: Calendar },
  { label: 'Team Conversion', value: '34%', icon: Target },
  { label: 'Monthly Revenue', value: 'AED 9.3M', icon: TrendingUp },
];

const ApexCRM = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const tabs = [
    { id: 'leaderboard', label: '🏆 Leaderboard' },
    { id: 'coaching', label: '🎯 Coaching Plans' },
    { id: 'metrics', label: '📊 Team Metrics' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard apex">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'var(--primary-gradient)' }}
        >
          <Award size={28} />
        </div>
        <div className="assistant-info">
          <h2>Apex — Agent Performance Coach</h2>
          <p>Real-time agent rankings, coaching plans, and performance interventions</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Monitoring
        </div>
      </div>

      <div className="quick-stats">
        {METRICS.map(m => (
          <div className="stat-card" key={m.label}>
            <div
              className="stat-icon"
              style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}
            >
              <m.icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{m.value}</span>
              <span className="stat-label">{m.label}</span>
            </div>
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

      {activeTab === 'leaderboard' && (
        <div className="tab-content">
          {AGENTS.map(a => (
            <div
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                background: a.rank === 1 ? '#fff7ed' : '#f9fafb',
                border: `1px solid ${a.rank === 1 ? '#fed7aa' : '#e5e7eb'}`,
                borderRadius: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: a.rank <= 3 ? '#F97316' : '#6b7280',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {a.rank === 1 ? '🥇' : a.rank === 2 ? '🥈' : a.rank === 3 ? '🥉' : a.rank}
              </div>
              <div style={{ flex: 1 }}>
                <strong>{a.name}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {a.deals} deals · {a.revenue} · {a.calls} calls · {a.convRate} conv.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                {a.trend > 0 ? (
                  <ArrowUp size={12} color="#22C55E" />
                ) : a.trend < 0 ? (
                  <ArrowDown size={12} color="#EF4444" />
                ) : null}
                <span
                  style={{ color: a.trend > 0 ? 'var(--success-color)' : a.trend < 0 ? 'var(--error-color)' : 'var(--text-secondary)' }}
                >
                  {a.trend === 0
                    ? 'Stable'
                    : `${Math.abs(a.trend)} rank${Math.abs(a.trend) > 1 ? 's' : ''}`}
                </span>
              </div>
              <button className="action-btn" style={{ fontSize: 11, padding: '5px 12px' }}>
                Coach
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'coaching' && (
        <div className="tab-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3>Active Coaching Plans</h3>
            <button className="action-btn primary" style={{ fontSize: 12 }}>
              + New Plan
            </button>
          </div>
          {COACHING_PLANS.map((p, i) => (
            <div
              key={i}
              style={{
                background: p.priority === 'high' ? '#fff7ed' : '#f9fafb',
                border: `1px solid ${p.priority === 'high' ? '#fed7aa' : '#e5e7eb'}`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{p.agent}</strong>
                <span
                  className="status-badge"
                  style={{
                    background: p.priority === 'high' ? '#fff0e8' : '#f0fdf4',
                    color: p.priority === 'high' ? '#F97316' : '#22C55E',
                  }}
                >
                  {p.priority}
                </span>
              </div>
              <div style={{ fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Focus: </span>
                {p.focus}
              </div>
              <div style={{ fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Action: </span>
                {p.action}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Due: {p.dueDate}</div>
            </div>
          ))}
          {AGENTS.filter(a => !COACHING_PLANS.find(p => p.agent === a.name)).map(a => (
            <div
              key={a.id}
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{a.name}</strong>
                <span className="status-badge" style={{ background: 'var(--success-light)', color: 'var(--success-color)' }}>
                  On Track
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                No coaching intervention needed · {a.convRate} conversion rate
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Team Performance Breakdown</h3>
          {AGENTS.map(a => (
            <div
              key={a.id}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{a.name}</strong>
                <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{a.revenue}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  ['Deals', a.deals],
                  ['Calls', a.calls],
                  ['Viewings', a.viewings],
                  ['Conv.', a.convRate],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      textAlign: 'center',
                      background: '#fff',
                      borderRadius: 6,
                      padding: '6px 8px',
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="apex" color="#F97316" assistantName="Apex" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="apex" color="#F97316" assistantName="Apex" />
      )}
    </div>
  );
};

export default ApexCRM;
