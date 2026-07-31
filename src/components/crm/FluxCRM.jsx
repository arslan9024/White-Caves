import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  Bell,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Wifi,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const LIVE_FEED = [
  {
    id: 1,
    type: 'transaction',
    msg: 'Downtown 2BR sold — AED 2.1M · Bayut',
    time: '2m ago',
    change: '+2.8%',
  },
  {
    id: 2,
    type: 'listing',
    msg: 'New off-plan unit listed — Business Bay · Emaar',
    time: '5m ago',
    change: null,
  },
  {
    id: 3,
    type: 'price',
    msg: 'JVC Studio avg price down -0.3% this week',
    time: '12m ago',
    change: '-0.3%',
  },
  {
    id: 4,
    type: 'transaction',
    msg: 'Palm Jumeirah villa closed — AED 14.5M',
    time: '18m ago',
    change: '+1.2%',
  },
  {
    id: 5,
    type: 'news',
    msg: 'DLD: Q1 transactions up 42% YoY in Dubai',
    time: '1h ago',
    change: null,
  },
  {
    id: 6,
    type: 'price',
    msg: 'Marina Gate PSF up +0.6% after weekend surge',
    time: '2h ago',
    change: '+0.6%',
  },
];

const INDEX_CARDS = [
  { name: 'Dubai Property Index', value: '1,842', change: +2.1, unit: 'pts' },
  { name: 'Luxury Index (5M+)', value: '4,210', change: +3.4, unit: 'AED/sqft' },
  { name: 'Rental Yield Index', value: '6.8%', change: -0.1, unit: '' },
  { name: 'Off-Plan Volume', value: '3,210', change: +18.2, unit: 'units/mo' },
];

const typeConfig = {
  transaction: { color: '#22C55E', icon: Activity },
  listing: { color: '#3B82F6', icon: Zap },
  price: { color: '#F59E0B', icon: BarChart2 },
  news: { color: '#8B5CF6', icon: Bell },
};

const FluxCRM = () => {
  const [activeTab, setActiveTab] = useState('feed');

  const tabs = [
    { id: 'feed', label: '⚡ Live Feed' },
    { id: 'indices', label: '📊 Market Indices' },
    { id: 'alerts', label: '🔔 Alert Rules' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard flux">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--accent-purple, #7C3AED) 0%, var(--color-5b21b6, #5B21B6) 100%)' }}
        >
          <Activity size={28} />
        </div>
        <div className="assistant-info">
          <h2>Flux — Real-Time Market Data Feed</h2>
          <p>Live Dubai property transaction feeds, price movements, and market indices</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Live
        </div>
      </div>

      <div className="quick-stats">
        {INDEX_CARDS.map(c => (
          <div className="stat-card" key={c.name}>
            <div
              className="stat-icon"
              style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--accent-purple, #7C3AED)' }}
            >
              <Wifi size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{c.value}</span>
              <span className="stat-label">{c.name}</span>
            </div>
            <span
              style={{
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: c.change >= 0 ? '#22C55E' : '#E31E24',
              }}
            >
              {c.change >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {Math.abs(c.change)}%
            </span>
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

      {activeTab === 'feed' && (
        <div className="tab-content">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0 }}>Live Market Events</h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: '#22C55E',
                background: '#f0fdf4',
                padding: '4px 10px',
                borderRadius: 20,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#22C55E',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }}
              />
              Live updating
            </div>
          </div>
          {LIVE_FEED.map(e => {
            const cfg = typeConfig[e.type];
            const Icon = cfg.icon;
            return (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${cfg.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13 }}>{e.msg}</p>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary, #9ca3af)' }}>{e.time}</span>
                </div>
                {e.change && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: e.change.startsWith('+') ? '#22C55E' : '#E31E24',
                      alignSelf: 'center',
                    }}
                  >
                    {e.change}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'indices' && (
        <div className="tab-content">
          {INDEX_CARDS.map(c => (
            <div
              key={c.name}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '16px 18px',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <strong>{c.name}</strong>
                <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--accent-purple, #7C3AED)' }}>
                  {c.value}
                  {c.unit && ` ${c.unit}`}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {c.change >= 0 ? (
                  <TrendingUp size={14} color="#22C55E" />
                ) : (
                  <TrendingDown size={14} color="#E31E24" />
                )}
                <span
                  style={{
                    fontSize: 13,
                    color: c.change >= 0 ? '#22C55E' : '#E31E24',
                    fontWeight: 600,
                  }}
                >
                  {c.change >= 0 ? '+' : ''}
                  {c.change}% this month
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Alert Configuration</h3>
          {[
            { rule: 'Price movement > 1% in any tracked area', active: true },
            { rule: 'Transaction volume spike > 20%', active: true },
            { rule: 'New off-plan launch in premium areas', active: false },
            { rule: 'Daily DLD transaction summary', active: true },
          ].map((a, i) => (
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
              <div
                style={{
                  width: 32,
                  height: 16,
                  borderRadius: 8,
                  background: a.active ? '#22C55E' : '#e5e7eb',
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    [a.active ? 'right' : 'left']: 2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: '#fff',
                  }}
                />
              </div>
              <span style={{ fontSize: 13, color: a.active ? 'var(--color-111827, #111827)' : 'var(--text-secondary, #9ca3af)' }}>
                {a.rule}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="flux" color="#7C3AED" assistantName="Flux" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="flux" color="#7C3AED" assistantName="Flux" />
      )}
    </div>
  );
};

export default FluxCRM;
