import React, { useState } from 'react';
import {
  Heart,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const NPS_DATA = [
  { range: 'Promoters (9–10)', count: 38, color: '#22C55E', icon: ThumbsUp },
  { range: 'Passives (7–8)', count: 14, color: '#F59E0B', icon: Minus },
  { range: 'Detractors (0–6)', count: 8, color: '#E31E24', icon: ThumbsDown },
];

const REVIEWS = [
  {
    id: 1,
    client: 'Ahmad Al Rashidi',
    score: 10,
    comment: 'White Caves made buying our dream villa seamless. Exceptional service throughout.',
    date: '2d ago',
    sentiment: 'positive',
  },
  {
    id: 2,
    client: 'Priya Nair',
    score: 9,
    comment: 'Very professional team. Nadia responded within minutes on WhatsApp!',
    date: '3d ago',
    sentiment: 'positive',
  },
  {
    id: 3,
    client: 'James Whitmore',
    score: 7,
    comment: 'Good experience overall, but paperwork took longer than expected.',
    date: '5d ago',
    sentiment: 'neutral',
  },
  {
    id: 4,
    client: 'Fatima Al Suwaidi',
    score: 10,
    comment: 'Best agency in Dubai. Would recommend to all my family and friends.',
    date: '1w ago',
    sentiment: 'positive',
  },
  {
    id: 5,
    client: 'Liu Yang',
    score: 5,
    comment: 'Translation of documents was delayed. Communication could be improved.',
    date: '1w ago',
    sentiment: 'negative',
  },
];

const sentimentColors = { positive: '#22C55E', neutral: '#F59E0B', negative: '#E31E24' };

const total = NPS_DATA.reduce((s, d) => s + d.count, 0);
const npsScore = Math.round(((NPS_DATA[0].count - NPS_DATA[2].count) / total) * 100);

const HaloCRM = () => {
  const [activeTab, setActiveTab] = useState('nps');

  const tabs = [
    { id: 'nps', label: '📊 NPS Overview' },
    { id: 'reviews', label: '⭐ Reviews' },
    { id: 'alerts', label: '🔔 Alerts' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard halo">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, #EC4899 0%, #9D174D 100%)' }}
        >
          <Heart size={28} />
        </div>
        <div className="assistant-info">
          <h2>Halo — Client Satisfaction & NPS Tracker</h2>
          <p>Net Promoter Score tracking, sentiment analysis, and satisfaction alerts</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Listening
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
          >
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value" style={{ color: npsScore >= 50 ? '#22C55E' : '#F59E0B' }}>
              {npsScore}
            </span>
            <span className="stat-label">NPS Score</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899' }}
          >
            <Star size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">9.1</span>
            <span className="stat-label">Avg Rating</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: '#E31E24' }}
          >
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {REVIEWS.filter(r => r.sentiment === 'negative').length}
            </span>
            <span className="stat-label">Detractor Alerts</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
          >
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Responses</span>
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

      {activeTab === 'nps' && (
        <div className="tab-content">
          <div
            style={{
              textAlign: 'center',
              padding: '20px 0 28px',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: npsScore >= 50 ? '#22C55E' : '#F59E0B',
                lineHeight: 1,
              }}
            >
              {npsScore}
            </div>
            <div style={{ fontSize: 16, color: '#6b7280', marginTop: 8 }}>Net Promoter Score</div>
            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
              World-class: 70+ · Excellent: 50–69 · Good: 30–49
            </div>
          </div>
          {NPS_DATA.map(d => (
            <div
              key={d.range}
              style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}
            >
              <d.icon size={18} color={d.color} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.range}</span>
                  <span style={{ fontWeight: 700, color: d.color }}>
                    {d.count} ({Math.round((d.count / total) * 100)}%)
                  </span>
                </div>
                <div
                  style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}
                >
                  <div
                    style={{
                      width: `${(d.count / total) * 100}%`,
                      height: '100%',
                      background: d.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="tab-content">
          {REVIEWS.map(r => (
            <div
              key={r.id}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{r.client}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < Math.round(r.score / 2) ? '#F59E0B' : 'none'}
                        color="#F59E0B"
                      />
                    ))}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{r.score}/10</span>
                </div>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 13, fontStyle: 'italic', color: '#374151' }}>
                &ldquo;{r.comment}&rdquo;
              </p>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{r.date}</span>
                <span
                  className="status-badge"
                  style={{
                    background: `${sentimentColors[r.sentiment]}22`,
                    color: sentimentColors[r.sentiment],
                  }}
                >
                  {r.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Action Required</h3>
          {REVIEWS.filter(r => r.sentiment === 'negative' || r.score <= 6).map(r => (
            <div
              key={r.id}
              style={{
                background: '#fff7f7',
                border: '1px solid #fecaca',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertCircle size={18} color="#E31E24" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>{r.client}</strong> — Score {r.score}/10
                  <p style={{ margin: '4px 0', fontSize: 13, color: '#374151' }}>
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <button
                    className="action-btn primary"
                    style={{ fontSize: 12, padding: '6px 14px', marginTop: 6 }}
                  >
                    <MessageSquare size={12} /> Reach Out
                  </button>
                </div>
              </div>
            </div>
          ))}
          {REVIEWS.filter(r => r.sentiment !== 'negative' && r.score > 6).length > 0 && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <CheckCircle size={18} color="#22C55E" />
                <span style={{ fontSize: 13 }}>
                  {REVIEWS.filter(r => r.sentiment !== 'negative').length} promoters — consider
                  requesting Google/Bayut reviews.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="halo" color="#EC4899" assistantName="Halo" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="halo" color="#EC4899" assistantName="Halo" />
      )}
    </div>
  );
};

export default HaloCRM;
