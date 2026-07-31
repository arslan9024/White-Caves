import React, { FC, useState } from 'react';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTIVE DEPARTMENT VIEW
// Board-level KPI deck, market position, YTD financials, succession pipeline
// ─────────────────────────────────────────────────────────────────────────────

const monthlyRevenue = [
  { month: 'Jan', aed: 2100000 }, { month: 'Feb', aed: 3400000 }, { month: 'Mar', aed: 4200000 },
  { month: 'Apr', aed: 3800000 }, { month: 'May', aed: 5100000 }, { month: 'Jun', aed: 4900000 },
  { month: 'Jul', aed: 6200000 }, { month: 'Aug', aed: 0 }, { month: 'Sep', aed: 0 },
  { month: 'Oct', aed: 0 }, { month: 'Nov', aed: 0 }, { month: 'Dec', aed: 0 },
];
const ytdTotal = monthlyRevenue.reduce((a, m) => a + m.aed, 0);
const maxRev = Math.max(...monthlyRevenue.map(m => m.aed));

export const ExecutiveDepartmentView: FC = () => {
  const [activeSection, setActiveSection] = useState<'board' | 'market' | 'pipeline'>('board');

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: `3px solid ${RED}`, paddingBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, color: SLATE }}>
              👑 Executive Control Centre
            </h2>
            <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
              Board-level KPIs · YTD Financial Summary · Market Intelligence · Growth Pipeline
            </p>
          </div>
          <div style={{ background: '#FEF2F2', border: `2px solid ${RED}`, padding: '12px 20px', borderRadius: '10px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: RED, fontWeight: 800, textTransform: 'uppercase' }}>YTD Revenue 2026</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: RED }}>
              {(ytdTotal / 1000000).toFixed(1)}M AED
            </div>
            <div style={{ fontSize: '0.72rem', color: TEXT_MUTED }}>Target: 52M AED · {Math.round((ytdTotal / 52000000) * 100)}% achieved</div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: `2px solid ${BORDER}`, marginBottom: '24px' }}>
        {(['board', 'market', 'pipeline'] as const).map(sec => (
          <button key={sec} onClick={() => setActiveSection(sec)}
            style={{ background: 'none', border: 'none', borderBottom: activeSection === sec ? `3px solid ${RED}` : '3px solid transparent', padding: '10px 24px', cursor: 'pointer', fontWeight: activeSection === sec ? 700 : 500, color: activeSection === sec ? RED : TEXT_MUTED, fontSize: '0.9rem', marginBottom: '-2px' }}>
            {sec === 'board' ? '📊 Board KPIs' : sec === 'market' ? '🌍 Market Position' : '🚀 Growth Pipeline'}
          </button>
        ))}
      </div>

      {/* BOARD KPIs */}
      {activeSection === 'board' && (
        <div>
          {/* Top-level metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Transactions (YTD)', value: '184', sub: '+23% vs 2025', color: RED },
              { label: 'Avg Deal Size', value: '3.8M AED', sub: 'Sale: 5.2M | Lease: 185K', color: BLUE },
              { label: 'Net Commission Income', value: '4.27M AED', sub: 'VAT-inclusive', color: GREEN },
              { label: 'Active Staff Headcount', value: '34 FTE', sub: '12 Brokers · 22 Support', color: PURPLE },
            ].map(m => (
              <div key={m.label} style={{ background: CARD_BG, padding: '18px', borderRadius: '10px', borderLeft: `5px solid ${m.color}` }}>
                <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>{m.label}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, marginTop: '4px' }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Revenue Bar Chart */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}`, marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: SLATE }}>Monthly Revenue Trend (AED)</h3>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '140px' }}>
              {monthlyRevenue.map(m => {
                const height = m.aed > 0 ? Math.round((m.aed / maxRev) * 120) : 4;
                const isFuture = m.aed === 0;
                return (
                  <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    {m.aed > 0 && (
                      <div style={{ fontSize: '0.6rem', color: TEXT_MUTED, fontWeight: 600 }}>
                        {(m.aed / 1000000).toFixed(1)}M
                      </div>
                    )}
                    <div style={{ width: '100%', background: isFuture ? '#E2E8F0' : RED, height: `${height}px`, borderRadius: '4px 4px 0 0', opacity: isFuture ? 0.4 : 1, transition: 'height 0.3s' }} />
                    <div style={{ fontSize: '0.65rem', color: TEXT_MUTED, fontWeight: 600 }}>{m.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* P&L Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
              <h4 style={{ margin: '0 0 14px 0', color: RED }}>P&L Summary — YTD 2026</h4>
              {[
                { label: 'Gross Commission Revenue', value: '4,272,000', type: 'income' },
                { label: 'Staff Costs (Salaries + Commission)', value: '(2,136,000)', type: 'expense' },
                { label: 'Office & Operations', value: '(348,000)', type: 'expense' },
                { label: 'Marketing & Portal Fees', value: '(212,000)', type: 'expense' },
                { label: 'Net Operating Profit', value: '1,576,000', type: 'net' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', fontSize: '0.85rem' }}>
                  <span style={{ color: SLATE }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.type === 'income' ? GREEN : row.type === 'expense' ? RED : BLUE }}>
                    AED {row.value}
                  </span>
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
