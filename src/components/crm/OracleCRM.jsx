import React, { useState } from 'react';
import {
  Eye,
  TrendingUp,
  BarChart2,
  MapPin,
  DollarSign,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const MARKET_DATA = [
  { area: 'Palm Jumeirah', avgPsf: 4250, change: +8.2, transactions: 42, demand: 'Very High' },
  { area: 'Downtown Dubai', avgPsf: 3100, change: +5.4, transactions: 68, demand: 'High' },
  { area: 'Dubai Marina', avgPsf: 1950, change: +3.8, transactions: 115, demand: 'High' },
  { area: 'Emirates Hills', avgPsf: 2800, change: +1.2, transactions: 12, demand: 'Medium' },
  { area: 'Business Bay', avgPsf: 1600, change: +6.1, transactions: 94, demand: 'Very High' },
  { area: 'JVC', avgPsf: 850, change: +4.5, transactions: 188, demand: 'High' },
];

const PREDICTIONS = [
  { area: 'Palm Jumeirah', q2Outlook: 'Bullish', confidence: 87, signal: 'up' },
  { area: 'Downtown Dubai', q2Outlook: 'Stable', confidence: 72, signal: 'stable' },
  { area: 'Business Bay', q2Outlook: 'Bullish', confidence: 81, signal: 'up' },
  { area: 'JVC', q2Outlook: 'Cautious', confidence: 64, signal: 'down' },
];

const ALERTS = [
  { msg: 'Palm Jumeirah transaction volume +40% vs last quarter', type: 'opportunity' },
  { msg: 'JVC off-plan supply spike — monitor for price pressure', type: 'warning' },
  { msg: 'Mortgage rate cut expected Q2 — buyer demand may surge', type: 'opportunity' },
];

const demandColors = { 'Very High': '#E31E24', High: '#F97316', Medium: '#F59E0B', Low: '#6B7280' };

const OracleCRM = () => {
  const [activeTab, setActiveTab] = useState('market');

  const tabs = [
    { id: 'market', label: '📈 Market Data' },
    { id: 'predictions', label: '🔮 Predictions' },
    { id: 'alerts', label: '🚨 Alerts' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard oracle">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)' }}
        >
          <Eye size={28} />
        </div>
        <div className="assistant-info">
          <h2>Oracle — Market Analyst Bot</h2>
          <p>Dubai real estate market intelligence, trends and forward-looking predictions</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Analysing
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(13,148,136,0.15)', color: '#0D9488' }}
          >
            <BarChart2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{MARKET_DATA.length}</span>
            <span className="stat-label">Areas Tracked</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
          >
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">+4.9%</span>
            <span className="stat-label">Avg YoY Growth</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: '#E31E24' }}
          >
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 2,092</span>
            <span className="stat-label">Market Avg PSF</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
          >
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{ALERTS.length}</span>
            <span className="stat-label">Market Alerts</span>
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

      {activeTab === 'market' && (
        <div className="tab-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Avg PSF (AED)</th>
                <th>YoY Change</th>
                <th>Transactions</th>
                <th>Demand</th>
              </tr>
            </thead>
            <tbody>
              {MARKET_DATA.map(d => (
                <tr key={d.area}>
                  <td>
                    <strong>{d.area}</strong>
                  </td>
                  <td>AED {d.avgPsf.toLocaleString()}</td>
                  <td>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: d.change >= 0 ? '#22C55E' : '#E31E24',
                        fontWeight: 600,
                      }}
                    >
                      {d.change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      {Math.abs(d.change)}%
                    </span>
                  </td>
                  <td>{d.transactions}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: `${demandColors[d.demand]}22`,
                        color: demandColors[d.demand],
                      }}
                    >
                      {d.demand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Q2 2024 Outlook</h3>
          {PREDICTIONS.map(p => (
            <div
              key={p.area}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 12,
              }}
            >
              <MapPin size={16} color="#0D9488" />
              <div style={{ flex: 1 }}>
                <strong>{p.area}</strong>
                <div style={{ marginTop: 4 }}>
                  <div
                    style={{
                      height: 6,
                      background: '#e5e7eb',
                      borderRadius: 4,
                      overflow: 'hidden',
                      marginTop: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${p.confidence}%`,
                        height: '100%',
                        background:
                          p.signal === 'up'
                            ? '#22C55E'
                            : p.signal === 'down'
                              ? '#EF4444'
                              : '#F59E0B',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                    {p.confidence}% confidence
                  </div>
                </div>
              </div>
              <span
                className="status-badge"
                style={{
                  background:
                    p.signal === 'up' ? '#f0fdf4' : p.signal === 'down' ? '#fff7f7' : '#fffbeb',
                  color:
                    p.signal === 'up' ? '#16a34a' : p.signal === 'down' ? '#E31E24' : '#B45309',
                }}
              >
                {p.q2Outlook}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="tab-content">
          {ALERTS.map((a, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                background: a.type === 'warning' ? '#fffbeb' : '#f0fdf4',
                border: `1px solid ${a.type === 'warning' ? '#fde68a' : '#bbf7d0'}`,
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
              }}
            >
              {a.type === 'warning' ? (
                <AlertCircle size={18} color="#F59E0B" style={{ flexShrink: 0 }} />
              ) : (
                <TrendingUp size={18} color="#22C55E" style={{ flexShrink: 0 }} />
              )}
              <p style={{ margin: 0, fontSize: 13 }}>{a.msg}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="oracle" color="#0D9488" assistantName="Oracle" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="oracle" color="#0D9488" assistantName="Oracle" />
      )}
    </div>
  );
};

export default OracleCRM;
