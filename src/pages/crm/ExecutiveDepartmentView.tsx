import React, { FC, useState, useEffect } from 'react';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const SLATE_LIGHT = '#334155';
const BORDER = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';
const GOLD = '#D4AF37';

// ─── Mock Data ────────────────────────────────────────────────────────
const monthlyRevenue = [
  { month: 'Jan', aed: 2100000 }, { month: 'Feb', aed: 3400000 }, { month: 'Mar', aed: 4200000 },
  { month: 'Apr', aed: 3800000 }, { month: 'May', aed: 5100000 }, { month: 'Jun', aed: 4900000 },
  { month: 'Jul', aed: 6200000 }, { month: 'Aug', aed: 4800000 }, { month: 'Sep', aed: 5200000 },
  { month: 'Oct', aed: 0 }, { month: 'Nov', aed: 0 }, { month: 'Dec', aed: 0 },
];
const ytdTotal = monthlyRevenue.reduce((a, m) => a + m.aed, 0);

const kpis = [
  { label: 'Revenue (YTD)', value: '39.7M', unit: 'AED', sparkline: [10, 20, 15, 30, 25, 40, 50], color: RED },
  { label: 'Active Listings', value: '412', unit: 'Props', sparkline: [400, 405, 410, 408, 415, 412, 420], color: BLUE },
  { label: 'New Leads (7d)', value: '1,284', unit: 'Leads', sparkline: [100, 120, 150, 130, 180, 200, 250], color: ORANGE },
  { label: 'Conversion Rate', value: '4.2', unit: '%', sparkline: [3.8, 3.9, 4.0, 4.1, 4.0, 4.2, 4.3], color: GREEN },
];

const podiumAgents = [
  { rank: 2, name: 'Sarah M.', rev: '8.2M', tier: 'Silver', color: '#C0C0C0' },
  { rank: 1, name: 'Ahmed A.', rev: '12.5M', tier: 'Gold', color: GOLD },
  { rank: 3, name: 'Elena V.', rev: '6.4M', tier: 'Bronze', color: '#CD7F32' },
];

const kanbanStages = [
  { name: 'Prospect', count: 145, value: '28M' },
  { name: 'Viewing', count: 84, value: '16M' },
  { name: 'Offer', count: 32, value: '8.5M' },
  { name: 'SPA / Escrow', count: 14, value: '4.2M' },
  { name: 'Closed Won', count: 8, value: '2.1M' },
];

const activities = [
  { time: '10m ago', text: 'Ahmed A. closed Villa 14 at Palm Jumeirah (12M AED)' },
  { time: '25m ago', text: 'Sarah M. secured exclusive listing for Downtown Penthouse' },
  { time: '1h ago', text: 'Elena V. received 5 viewing requests for Dubai Hills' },
  { time: '2h ago', text: 'New Lead assigned to Ahmed A. (Priority: High)' },
];

// ─── Components ───────────────────────────────────────────────────────

const Sparkline: FC<{ data: number[], color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 100;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ExecutiveDepartmentView: FC = () => {
  const [layout, setLayout] = useState('grid');
  
  // Real-time SLA simulation
  const [slaTime, setSlaTime] = useState(14 * 60 + 59); // 14:59
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSlaTime(prev => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSLA = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isUrgent = slaTime < 300; // < 5 mins

  return (
    <div style={{ padding: '24px', background: SLATE, minHeight: '80vh', color: WHITE, fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: `2px solid ${SLATE_LIGHT}`, paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: WHITE }}>
            👑 Executive Command Center V2
          </h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.9rem' }}>
            MD Sovereign Hub · Live Deal Flow · AI Forecasts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', padding: '12px 20px', borderRadius: '8px', border: `1px solid ${isUrgent ? RED : GREEN}` }}>
            <div style={{ fontSize: '0.7rem', color: isUrgent ? RED : GREEN, fontWeight: 700, textTransform: 'uppercase' }}>SLA Watchdog (Avg Response)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isUrgent ? RED : GREEN, display: 'flex', gap: '8px', alignItems: 'center' }}>
              ⏱ {formatSLA(slaTime)}
              {isUrgent && <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, boxShadow: `0 0 10px ${RED}` }} className="pulse-dot" />}
            </div>
          </div>
          <button onClick={() => setLayout(l => l === 'grid' ? 'list' : 'grid')} style={{ padding: '10px 16px', background: SLATE_LIGHT, color: WHITE, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            Toggle Layout
          </button>
                </div>
              ))}
            </div>

            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
              <h4 style={{ margin: '0 0 14px 0', color: RED }}>Board-Level KPI Scorecard</h4>
              {[
                { kpi: 'Transaction Volume Target', current: '184', target: '240', pct: 77 },
                { kpi: 'Revenue Target', current: '29.7M', target: '52M', pct: 57 },
                { kpi: 'Client NPS Score', current: '72', target: '75', pct: 96 },
                { kpi: 'RERA Compliance Score', current: '75%', target: '95%', pct: 79 },
                { kpi: 'Staff Retention Rate', current: '91%', target: '90%', pct: 101 },
              ].map(kpi => (
                <div key={kpi.kpi} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: SLATE, fontWeight: 600 }}>{kpi.kpi}</span>
                    <span style={{ color: kpi.pct >= 100 ? GREEN : kpi.pct >= 75 ? ORANGE : RED, fontWeight: 700 }}>
                      {kpi.current} / {kpi.target} ({kpi.pct}%)
                    </span>
                  </div>
                  <div style={{ background: 'var(--color-e2e8f0, #E2E8F0)', borderRadius: '99px', height: '6px' }}>
                    <div style={{ background: kpi.pct >= 100 ? GREEN : kpi.pct >= 75 ? ORANGE : RED, width: `${Math.min(kpi.pct, 100)}%`, height: '100%', borderRadius: '99px', transition: 'width 0.4s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MARKET POSITION */}
      {activeSection === 'market' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'Dubai Market Share (Est.)', value: '2.3%', note: 'Residential transactions in DAMAC Hills 2 + Dubai Hills area', color: RED },
              { label: 'Market Rank (Area Agents)', value: '#4 / 48', note: 'By transaction volume in primary operating zones', color: BLUE },
              { label: 'Average Days to Close', value: '18.2 days', note: 'Sale: 24.1d | Lease: 8.4d — industry avg 28d', color: GREEN },
            ].map(m => (
              <div key={m.label} style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', borderTop: `5px solid ${m.color}` }}>
                <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>{m.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: m.color, margin: '8px 0' }}>{m.value}</div>
                <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>{m.note}</div>
              </div>
            ))}
          </div>

          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <h4 style={{ margin: '0 0 16px 0', color: RED }}>Competitive Landscape — Primary Zone</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#E2E8F0', borderBottom: `2px solid ${RED}` }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Agency</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Market Share</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>YTD Transactions</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Avg Deal (AED)</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Fäm Properties', share: '8.1%', txn: 641, avg: '2.8M', trend: '→' },
                  { name: 'Betterhomes', share: '6.4%', txn: 508, avg: '3.1M', trend: '↓' },
                  { name: 'Allsopp & Allsopp', share: '4.7%', txn: 372, avg: '4.2M', trend: '↑' },
                  { name: '⭐ White Caves (Us)', share: '2.3%', txn: 184, avg: '3.8M', trend: '↑↑', highlight: true },
                  { name: 'Haus & Haus', share: '1.9%', txn: 151, avg: '5.1M', trend: '→' },
                ].map(row => (
                  <tr key={row.name} style={{ borderBottom: '1px solid var(--text-secondary, #E2E8F0)', background: row.highlight ? 'var(--color-fef2f2, #FEF2F2)' : 'transparent' }}>
                    <td style={{ padding: '10px 12px', fontWeight: row.highlight ? 800 : 600, color: row.highlight ? RED : SLATE }}>{row.name}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{row.share}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{row.txn}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>{row.avg}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: row.trend.includes('↑') ? GREEN : row.trend === '↓' ? RED : TEXT_MUTED, fontWeight: 700 }}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PIPELINE */}
      {activeSection === 'pipeline' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
              <h4 style={{ margin: '0 0 14px 0', color: RED }}>🚀 Strategic Growth Initiatives</h4>
              {[
                { initiative: 'Off-Plan Agency Partnership — Emaar', status: 'Active', value: '18M AED pipeline', color: GREEN },
                { initiative: 'DAMAC Hills 2 Master Portfolio Contract', status: 'Negotiation', value: '9,378 units under management', color: ORANGE },
                { initiative: 'Palm Jumeirah Luxury Segment Expansion', status: 'Planning', value: '15M AED Q4 target', color: BLUE },
                { initiative: 'Dubai Creek Harbour Pre-Launch Rights', status: 'Prospecting', value: '200+ units off-plan', color: PURPLE },
              ].map(row => (
                <div key={row.initiative} style={{ background: WHITE, padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '10px', borderLeft: `4px solid ${row.color}` }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: SLATE, marginBottom: '4px' }}>{row.initiative}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ background: `${row.color}20`, color: row.color, padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{row.status}</span>
                    <span style={{ color: TEXT_MUTED }}>{row.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
              <h4 style={{ margin: '0 0 14px 0', color: RED }}>👥 Leadership Succession & HR Pipeline</h4>
              {[
                { name: 'Nadia Yusuf', role: 'Senior Broker → Team Lead (Q4)', readiness: 90, color: GREEN },
                { name: 'Sophia Lin', role: 'Team Lead → Branch Manager', readiness: 72, color: ORANGE },
                { name: 'Clara Osei', role: 'Associate → Senior Broker', readiness: 85, color: BLUE },
                { name: 'Mark Stevenson', role: 'Senior → Leasing Head', readiness: 65, color: ORANGE },
              ].map(person => (
                <div key={person.name} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: SLATE }}>{person.name}</span>
                      <span style={{ color: TEXT_MUTED, marginLeft: '8px' }}>{person.role}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: person.color }}>{person.readiness}%</span>
                  </div>
                  <div style={{ background: 'var(--color-e2e8f0, #E2E8F0)', borderRadius: '99px', height: '8px' }}>
                    <div style={{ background: person.color, width: `${person.readiness}%`, height: '100%', borderRadius: '99px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveDepartmentView;
