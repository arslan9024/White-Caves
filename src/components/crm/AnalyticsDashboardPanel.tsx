import React, { FC, useState, useCallback } from 'react';

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

export const AnalyticsDashboardPanel: FC = () => {
  const [forecastMonths, setForecastMonths] = useState<number>(6);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  // Seed metrics
  const conversionFunnel = [
    { stage: 'Inbound Leads', count: 1840, pct: 100, color: SLATE },
    { stage: 'Contacted / Engaged', count: 1240, pct: 67, color: BLUE },
    { stage: 'Property Viewings', count: 480, pct: 26, color: PURPLE },
    { stage: 'Offers Submitted', count: 112, pct: 6, color: ORANGE },
    { stage: 'Deals Closed (Contracts)', count: 47, pct: 2.5, color: GREEN },
  ];

  const leadSources = [
    { source: 'Property Finder syndication', leads: 780, deals: 18, rate: '2.3%', color: BLUE },
    { source: 'Bayut syndication', leads: 540, deals: 12, rate: '2.2%', color: ORANGE },
    { source: 'WhatsApp Inbound Automation', leads: 320, deals: 14, rate: '4.3%', color: GREEN },
    { source: 'Direct Website / Referrals', leads: 200, deals: 3, rate: '1.5%', color: PURPLE },
  ];

  // Rolling Forecast math
  const historicalAvgAED = 4900000; // Q2 monthly average
  const projectedGrowthPct = 8; // 8% monthly growth target
  
  const forecastData = Array.from({ length: forecastMonths }, (_, i) => {
    const monthIndex = (new Date().getMonth() + 1 + i) % 12;
    const year = new Date().getFullYear() + (new Date().getMonth() + 1 + i >= 12 ? 1 : 0);
    const monthName = new Date(year, monthIndex).toLocaleString('en-GB', { month: 'short' });
    const projectedAED = Math.round(historicalAvgAED * Math.pow(1 + (projectedGrowthPct / 100), i + 1));
    return { month: `${monthName} ${year}`, projectedAED };
  });

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>📈 Executive Analytics & Forecast</h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Real-time lead conversions · Channel metrics · Rolling revenue projection model
          </p>
        </div>
        <div style={{ background: '#EFF6FF', border: `1px solid ${BLUE}`, padding: '10px 16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: BLUE, fontWeight: 800, textTransform: 'uppercase' }}>Avg Close Cycle</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: BLUE }}>18.2 Days</div>
          <div style={{ fontSize: '0.72rem', color: TEXT_MUTED }}>Industry standard: 28 Days</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* FUNNEL & LEAD SOURCES */}
        <div>
          {/* Conversion Funnel */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '12px', border: `1px solid ${BORDER}`, marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: SLATE }}>🎯 Lead Conversion Funnel (YTD)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {conversionFunnel.map((item, idx) => (
                <div key={item.stage} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: WHITE, border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px', position: 'relative', zIndex: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.stage}</span>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: SLATE }}>{item.count.toLocaleString()}</span>
                      <span style={{ background: `${item.color}20`, color: item.color, padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                  {/* Visual funnel overlay backing */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${item.pct}%`,
                    background: item.color,
                    opacity: 0.05,
                    borderRadius: '8px',
                    zIndex: 1,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Lead Sources */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '12px', border: `1px solid ${BORDER}` }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', color: SLATE }}>🌍 Channel Performance Matrix</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: SLATE, color: WHITE }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left' }}>CHANNEL</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>INBOUND LEADS</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>DEALS CLOSED</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>CONVERSION %</th>
                </tr>
              </thead>
              <tbody>
                {leadSources.map((ls, idx) => (
                  <tr key={ls.source} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? WHITE : CARD_BG }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{ls.source}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>{ls.leads}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: GREEN }}>{ls.deals}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: ls.color }}>{ls.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REVENUE FORECASTING */}
        <div>
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '12px', border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: SLATE }}>🔮 Rolling Revenue Forecast Model</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Interval:</span>
                <select value={forecastMonths} onChange={e => setForecastMonths(Number(e.target.value))}
                  style={{ padding: '4px 6px', border: `1px solid ${BORDER}`, borderRadius: '4px', fontSize: '0.75rem' }}>
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>
            </div>

            <div style={{ background: WHITE, padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px', fontSize: '0.8rem', lineHeight: 1.5 }}>
              📊 **Forecasting Logic:** Baseline monthly gross revenue set at **AED 4,900,000** (historical Q2 average), adjusted with a conservative rolling compounding growth rate of **{projectedGrowthPct}%** MoM.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {forecastData.map(f => (
                <div key={f.month} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                    <span style={{ color: SLATE }}>{f.month}</span>
                    <span style={{ color: RED, fontWeight: 800 }}>AED {f.projectedAED.toLocaleString()}</span>
                  </div>
                  <div style={{ background: '#E2E8F0', borderRadius: '99px', height: '8px' }}>
                    {/* Width scale based on max forecasted item */}
                    <div style={{
                      background: RED,
                      width: `${Math.round((f.projectedAED / forecastData[forecastData.length - 1].projectedAED) * 100)}%`,
                      height: '100%',
                      borderRadius: '99px',
                      transition: 'width 0.4s'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => showToast('📥 Exporting complete forecast projection data sheet to Excel...')}
              style={{ width: '100%', marginTop: '20px', padding: '10px', background: RED, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
              📥 Export Forecast Data Sheet
            </button>
          </div>
        </div>
      </div>
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{ background: GREEN, color: WHITE, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', maxWidth: '360px' }}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboardPanel;
