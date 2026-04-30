import React from 'react';
import { ActiveLease, PDCCheque, RentalInquiry, LEASING_STAGE_LABELS, LeasingStage } from '../data/leasing';

type PnLSummary = {
  totalMRR: number;
  totalAnnualRent: number;
  totalCommission: number;
  totalMaintenanceCost: number;
  netIncome: number;
};

interface AnalyticsTabProps {
  leases: ActiveLease[];
  pdcCheques: PDCCheque[];
  inquiries: RentalInquiry[];
  pnl: PnLSummary;
}

const KPICard: React.FC<{ label: string; value: string; sub?: string; color: string }> = ({ label, value, sub, color }) => (
  <div style={{
    background: 'var(--rgba-white-05)',
    border: `1px solid ${color}33`,
    borderRadius: '12px',
    padding: '18px',
    borderLeft: `3px solid ${color}`,
  }}>
    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: 700, color, marginBottom: '4px' }}>{value}</div>
    {sub && <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{sub}</div>}
  </div>
);

const ProgressBar: React.FC<{ label: string; pct: number; color: string; value?: string }> = ({ label, pct, color, value }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '12px', color, fontWeight: 600 }}>{value ?? `${pct.toFixed(1)}%`}</span>
    </div>
    <div style={{ height: '8px', background: 'var(--rgba-white-10)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.3s' }} />
    </div>
  </div>
);

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ leases, pdcCheques, inquiries, pnl }) => {
  const totalLeases = leases.length;
  const activeLeases = leases.filter(l => l.status === 'active').length;
  const occupancyRate = totalLeases > 0 ? (activeLeases / totalLeases) * 100 : 0;
  const expiringCount = leases.filter(l => l.daysRemaining < 60).length;

  const pdcTotal = pdcCheques.length;
  const pdcCleared = pdcCheques.filter(c => c.status === 'cleared').length;
  const pdcPending = pdcCheques.filter(c => c.status === 'pending').length;
  const pdcBounced = pdcCheques.filter(c => c.status === 'bounced').length;
  const pdcClearedPct = pdcTotal > 0 ? (pdcCleared / pdcTotal) * 100 : 0;
  const pdcPendingPct = pdcTotal > 0 ? (pdcPending / pdcTotal) * 100 : 0;
  const pdcBouncedPct = pdcTotal > 0 ? (pdcBounced / pdcTotal) * 100 : 0;

  const due30 = leases.filter(l => l.daysRemaining <= 30).length;
  const due60 = leases.filter(l => l.daysRemaining <= 60 && l.daysRemaining > 30).length;
  const due90 = leases.filter(l => l.daysRemaining <= 90 && l.daysRemaining > 60).length;

  const ejariRegistered = leases.filter(l => l.ejariStatus === 'registered').length;
  const ejariPending   = leases.filter(l => l.ejariStatus === 'pending').length;
  const ejariExpired   = leases.filter(l => l.ejariStatus === 'expired').length;

  const stageStats: Record<number, number> = {};
  for (let s = 1; s <= 10; s++) stageStats[s] = 0;
  inquiries.forEach(inq => { stageStats[inq.leasingStage]++; });
  const maxStageCount = Math.max(...Object.values(stageStats), 1);

  return (
    <div className="analytics-view">
      <div className="view-header" style={{ marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Analytics & P&L</h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Live portfolio performance summary
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <KPICard
          label="Total MRR"
          value={`AED ${pnl.totalMRR.toLocaleString()}`}
          sub="Monthly Recurring Revenue"
          color="#14B8A6"
        />
        <KPICard
          label="Annual Revenue"
          value={`AED ${(pnl.totalAnnualRent / 1000).toFixed(0)}K`}
          sub={`From ${activeLeases} active leases`}
          color="#10B981"
        />
        <KPICard
          label="Net Income"
          value={`AED ${(pnl.netIncome / 1000).toFixed(0)}K`}
          sub="After commission & maintenance"
          color="#60A5FA"
        />
        <KPICard
          label="Occupancy Rate"
          value={`${occupancyRate.toFixed(1)}%`}
          sub={`${activeLeases} of ${totalLeases} units occupied`}
          color="#F59E0B"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
        {/* P&L Breakdown */}
        <div style={{
          background: 'var(--rgba-white-05)',
          border: '1px solid var(--rgba-white-10)',
          borderRadius: '12px',
          padding: '18px',
        }}>
          <h4 style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--color-text-primary)' }}>P&L Breakdown</h4>
          {[
            { label: 'Annual Rent Revenue', value: pnl.totalAnnualRent, color: '#10B981' },
            { label: 'Agent Commission',    value: -pnl.totalCommission, color: '#F59E0B' },
            { label: 'Maintenance Costs',   value: -pnl.totalMaintenanceCost, color: '#EF4444' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '8px 10px', background: `${item.color}11`, borderRadius: '6px' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: item.color }}>
                {item.value < 0 ? '−' : '+'} AED {Math.abs(item.value).toLocaleString()}
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--rgba-white-10)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Net Income</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: pnl.netIncome >= 0 ? '#10B981' : '#EF4444' }}>
              AED {pnl.netIncome.toLocaleString()}
            </span>
          </div>
        </div>

        {/* PDC Health */}
        <div style={{
          background: 'var(--rgba-white-05)',
          border: '1px solid var(--rgba-white-10)',
          borderRadius: '12px',
          padding: '18px',
        }}>
          <h4 style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--color-text-primary)' }}>PDC Health</h4>
          <ProgressBar label={`Cleared (${pdcCleared})`} pct={pdcClearedPct} color="#10B981" />
          <ProgressBar label={`Pending (${pdcPending})`} pct={pdcPendingPct} color="#F59E0B" />
          <ProgressBar label={`Bounced (${pdcBounced})`} pct={pdcBouncedPct} color="#EF4444" />
          <div style={{ marginTop: '12px', padding: '10px', background: 'var(--rgba-white-05)', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Total cheques: {pdcTotal} · Value: AED {pdcCheques.reduce((s, c) => s + c.amount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '20px' }}>
        {/* Pipeline Funnel */}
        <div style={{
          background: 'var(--rgba-white-05)',
          border: '1px solid var(--rgba-white-10)',
          borderRadius: '12px',
          padding: '18px',
        }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '14px', color: 'var(--color-text-primary)' }}>Pipeline Funnel</h4>
          {(Array.from({ length: 10 }, (_, i) => i + 1) as LeasingStage[]).map(s => {
            const count = stageStats[s] ?? 0;
            const pct = (count / maxStageCount) * 100;
            const colors: Record<number, string> = {
              1: '#3B82F6', 2: '#3B82F6', 3: '#3B82F6',
              4: '#F59E0B', 5: '#F59E0B',
              6: '#14B8A6', 7: '#14B8A6',
              8: '#10B981', 9: '#10B981', 10: '#10B981',
            };
            return (
              <ProgressBar
                key={s}
                label={`${s}. ${LEASING_STAGE_LABELS[s]}`}
                pct={pct}
                color={colors[s]}
                value={`${count}`}
              />
            );
          })}
        </div>

        {/* Renewal Forecast & Ejari */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{
            background: 'var(--rgba-white-05)',
            border: '1px solid var(--rgba-white-10)',
            borderRadius: '12px',
            padding: '18px',
            flex: 1,
          }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--color-text-primary)' }}>Renewal Forecast</h4>
            {[
              { label: 'Due in 30 days', value: due30, color: '#EF4444' },
              { label: 'Due in 60 days', value: due60, color: '#F59E0B' },
              { label: 'Due in 90 days', value: due90, color: '#60A5FA' },
              { label: 'Expiring ≤60 days', value: expiringCount, color: '#F59E0B' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--rgba-white-05)',
            border: '1px solid var(--rgba-white-10)',
            borderRadius: '12px',
            padding: '18px',
          }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--color-text-primary)' }}>Ejari Status</h4>
            {[
              { label: 'Registered', value: ejariRegistered, color: '#10B981' },
              { label: 'Pending',    value: ejariPending,    color: '#F59E0B' },
              { label: 'Expired',    value: ejariExpired,    color: '#EF4444' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
