import React, { FC, useState, useMemo, useCallback } from 'react';

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

interface CommissionRecord {
  id: string;
  dealReference: string;
  agentName: string;
  agentRole: string;
  propertyTitle: string;
  transactionType: 'Sale' | 'Lease' | 'Off-Plan';
  transactionValueAED: number;
  commissionRatePct: number;
  grossCommissionAED: number;
  agentSplitPct: number;
  agentEarningsAED: number;
  companyRetentionAED: number;
  vatAED: number;
  totalPayableAED: number;
  status: 'Pending' | 'Approved' | 'Paid' | 'Disputed';
  closedDate: string;
  paymentDate: string | null;
}

function buildRecord(
  id: string, dealRef: string, agent: string, role: string,
  propTitle: string, txType: CommissionRecord['transactionType'],
  txValue: number, commissionRate: number, agentSplit: number,
  status: CommissionRecord['status'], closedDate: string, paymentDate: string | null
): CommissionRecord {
  const grossCommission = Math.round(txValue * (commissionRate / 100));
  const agentEarnings = Math.round(grossCommission * (agentSplit / 100));
  const companyRetention = grossCommission - agentEarnings;
  const vat = Math.round(grossCommission * 0.05);
  return {
    id, dealReference: dealRef, agentName: agent, agentRole: role, propertyTitle: propTitle,
    transactionType: txType, transactionValueAED: txValue, commissionRatePct: commissionRate,
    grossCommissionAED: grossCommission, agentSplitPct: agentSplit, agentEarningsAED: agentEarnings,
    companyRetentionAED: companyRetention, vatAED: vat, totalPayableAED: agentEarnings + vat,
    status, closedDate, paymentDate,
  };
}

const COMMISSION_LEDGER: CommissionRecord[] = [
  buildRecord('COM-001', 'DEAL-2026-Q2-001', 'Nadia Yusuf', 'Senior Broker', 'Luxury Property 14 — Palm Jumeirah', 'Sale', 5200000, 2, 70, 'Paid', '2026-05-15', '2026-06-01'),
  buildRecord('COM-002', 'DEAL-2026-Q2-002', 'Sophia Lin', 'Senior Broker', 'Luxury Property 33 — Dubai Marina', 'Lease', 220000, 5, 65, 'Paid', '2026-06-01', '2026-06-15'),
  buildRecord('COM-003', 'DEAL-2026-Q2-003', 'Clara Osei', 'Associate Broker', 'Luxury Property 7 — DAMAC Hills 2', 'Sale', 3800000, 2, 60, 'Paid', '2026-06-10', '2026-07-01'),
  buildRecord('COM-004', 'DEAL-2026-Q2-004', 'Nadia Yusuf', 'Senior Broker', 'Luxury Property 55 — Business Bay', 'Off-Plan', 2100000, 4, 70, 'Approved', '2026-07-01', null),
  buildRecord('COM-005', 'DEAL-2026-Q2-005', 'Mark Johnson', 'Associate Broker', 'Luxury Property 22 — Downtown Dubai', 'Lease', 185000, 5, 60, 'Pending', '2026-07-12', null),
  buildRecord('COM-006', 'DEAL-2026-Q2-006', 'Sophia Lin', 'Senior Broker', 'Luxury Property 78 — Palm Jumeirah', 'Sale', 9100000, 2, 65, 'Disputed', '2026-07-15', null),
  buildRecord('COM-007', 'DEAL-2026-Q2-007', 'Clara Osei', 'Associate Broker', 'Luxury Property 41 — DAMAC Hills 2', 'Off-Plan', 1750000, 3.5, 60, 'Pending', '2026-07-20', null),
  buildRecord('COM-008', 'DEAL-2026-Q2-008', 'Laila Hassan', 'Junior Broker', 'Luxury Property 19 — Business Bay', 'Lease', 150000, 5, 50, 'Approved', '2026-07-22', null),
  buildRecord('COM-009', 'DEAL-2026-Q2-009', 'Nadia Yusuf', 'Senior Broker', 'Luxury Property 62 — Downtown Dubai', 'Sale', 4500000, 2, 70, 'Pending', '2026-07-25', null),
  buildRecord('COM-010', 'DEAL-2026-Q2-010', 'Mark Johnson', 'Associate Broker', 'Luxury Property 5 — Dubai Marina', 'Lease', 195000, 5, 60, 'Pending', '2026-07-27', null),
];

const statusConfig = {
  Pending: { bg: '#FFFBEB', color: ORANGE, icon: '⏳' },
  Approved: { bg: '#EFF6FF', color: BLUE, icon: '✔️' },
  Paid: { bg: '#DEF7EC', color: GREEN, icon: '💰' },
  Disputed: { bg: '#FEF2F2', color: RED, icon: '⚠️' },
};

const txTypeColor: Record<string, string> = {
  Sale: BLUE,
  Lease: GREEN,
  'Off-Plan': PURPLE,
};

export const CommissionManagementPanel: FC = () => {
  const [records, setRecords] = useState<CommissionRecord[]>(COMMISSION_LEDGER);
  const [filterAgent, setFilterAgent] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'ledger' | 'summary'>('ledger');
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; color: string }>>([]);

  const showToast = useCallback((message: string, color = SLATE) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const agents = Array.from(new Set(COMMISSION_LEDGER.map(r => r.agentName)));

  const filtered = useMemo(() => records.filter(r => {
    const matchAgent = filterAgent === 'ALL' || r.agentName === filterAgent;
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchType = filterType === 'ALL' || r.transactionType === filterType;
    return matchAgent && matchStatus && matchType;
  }), [records, filterAgent, filterStatus, filterType]);

  const totalGross = records.reduce((a, r) => a + r.grossCommissionAED, 0);
  const totalPaid = records.filter(r => r.status === 'Paid').reduce((a, r) => a + r.agentEarningsAED, 0);
  const totalPending = records.filter(r => r.status !== 'Paid').reduce((a, r) => a + r.agentEarningsAED, 0);
  const totalVAT = records.reduce((a, r) => a + r.vatAED, 0);

  const handleApprove = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r));
    if (selectedRecord?.id === id) setSelectedRecord(prev => prev ? { ...prev, status: 'Approved' as const } : null);
  };
  const handleMarkPaid = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Paid' as const, paymentDate: today } : r));
    if (selectedRecord?.id === id) setSelectedRecord(prev => prev ? { ...prev, status: 'Paid' as const, paymentDate: today } : null);
  };

  // Agent summary
  const agentSummary = agents.map(agent => {
    const agentRecords = records.filter(r => r.agentName === agent);
    return {
      agent,
      role: agentRecords[0]?.agentRole || '',
      deals: agentRecords.length,
      totalGross: agentRecords.reduce((a, r) => a + r.grossCommissionAED, 0),
      totalEarnings: agentRecords.reduce((a, r) => a + r.agentEarningsAED, 0),
      paid: agentRecords.filter(r => r.status === 'Paid').reduce((a, r) => a + r.agentEarningsAED, 0),
      pending: agentRecords.filter(r => r.status !== 'Paid').reduce((a, r) => a + r.agentEarningsAED, 0),
      avgSplit: Math.round(agentRecords.reduce((a, r) => a + r.agentSplitPct, 0) / agentRecords.length),
    };
  });

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>💰 Commission Management</h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Agent commission ledger · Split calculations · VAT 5% · Payout approval workflow
          </p>
        </div>
        <button onClick={() => showToast('📥 Generating Q3 commission statement PDFs for all agents...', RED)}
          style={{ background: RED, color: WHITE, border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
          📥 Export All Statements
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Gross Commission', value: `AED ${(totalGross / 1000).toFixed(0)}K`, color: SLATE },
          { label: 'Paid Out YTD', value: `AED ${(totalPaid / 1000).toFixed(0)}K`, color: GREEN },
          { label: 'Pending Payouts', value: `AED ${(totalPending / 1000).toFixed(0)}K`, color: ORANGE },
          { label: 'VAT Collected (5%)', value: `AED ${(totalVAT / 1000).toFixed(0)}K`, color: RED },
        ].map(s => (
          <div key={s.label} style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${BORDER}`, marginBottom: '20px' }}>
        {(['ledger', 'summary'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? `3px solid ${RED}` : '3px solid transparent', padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? RED : TEXT_MUTED, fontSize: '0.9rem', marginBottom: '-2px' }}>
            {tab === 'ledger' ? '📊 Commission Ledger' : '👥 Agent Summary'}
          </button>
        ))}
      </div>

      {/* LEDGER TAB */}
      {activeTab === 'ledger' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)}
              style={{ padding: '7px 10px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.8rem' }}>
              <option value="ALL">All Agents</option>
              {agents.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '7px 10px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.8rem' }}>
              <option value="ALL">All Statuses</option>
              {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              style={{ padding: '7px 10px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.8rem' }}>
              <option value="ALL">All Types</option>
              <option>Sale</option>
              <option>Lease</option>
              <option>Off-Plan</option>
            </select>
            <span style={{ fontSize: '0.8rem', color: TEXT_MUTED, alignSelf: 'center', marginLeft: 'auto' }}>
              {filtered.length} records
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedRecord ? '1.4fr 1fr' : '1fr', gap: '20px' }}>
            <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: SLATE, color: WHITE }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>DEAL REF</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>AGENT</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>TYPE</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>TX VALUE</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>GROSS COMM</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>AGENT SHARE</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>VAT</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => {
                    const sc = statusConfig[r.status];
                    return (
                      <tr key={r.id} onClick={() => setSelectedRecord(r === selectedRecord ? null : r)}
                        style={{ borderBottom: '1px solid #E2E8F0', background: selectedRecord?.id === r.id ? '#FEF2F2' : idx % 2 === 0 ? WHITE : CARD_BG, cursor: 'pointer' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.72rem', color: TEXT_MUTED }}>{r.dealReference}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.agentName}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: `${txTypeColor[r.transactionType]}20`, color: txTypeColor[r.transactionType], padding: '2px 7px', borderRadius: '8px', fontWeight: 700, fontSize: '0.7rem' }}>
                            {r.transactionType}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                          {(r.transactionValueAED / 1000000).toFixed(2)}M
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: SLATE }}>
                          {r.grossCommissionAED.toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: GREEN }}>
                          {r.agentEarningsAED.toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: ORANGE }}>
                          {r.vatAED.toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: '2px 7px', borderRadius: '10px', fontWeight: 700, fontSize: '0.7rem' }}>
                            {sc.icon} {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: SLATE, color: WHITE }}>
                    <td colSpan={4} style={{ padding: '10px 12px', fontWeight: 700 }}>TOTALS ({filtered.length} records)</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900 }}>
                      {filtered.reduce((a, r) => a + r.grossCommissionAED, 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#6EE7B7' }}>
                      {filtered.reduce((a, r) => a + r.agentEarningsAED, 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: '#FCD34D' }}>
                      {filtered.reduce((a, r) => a + r.vatAED, 0).toLocaleString()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Detail Panel */}
            {selectedRecord && (
              <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `2px solid ${statusConfig[selectedRecord.status].color}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>{selectedRecord.dealReference}</h3>
                  <button onClick={() => setSelectedRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED }}>✕</button>
                </div>

                {/* Commission Breakdown */}
                <div style={{ background: WHITE, padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: RED, textTransform: 'uppercase', marginBottom: '10px' }}>Commission Breakdown</div>
                  {[
                    { label: 'Transaction Value', value: `AED ${selectedRecord.transactionValueAED.toLocaleString()}`, bold: false },
                    { label: `Commission Rate (${selectedRecord.commissionRatePct}%)`, value: `AED ${selectedRecord.grossCommissionAED.toLocaleString()}`, bold: false },
                    { label: `Agent Split (${selectedRecord.agentSplitPct}%)`, value: `AED ${selectedRecord.agentEarningsAED.toLocaleString()}`, bold: true, color: GREEN },
                    { label: `Company Retention (${100 - selectedRecord.agentSplitPct}%)`, value: `AED ${selectedRecord.companyRetentionAED.toLocaleString()}`, bold: false },
                    { label: 'VAT 5%', value: `AED ${selectedRecord.vatAED.toLocaleString()}`, bold: false, color: ORANGE },
                    { label: 'Total Payable to Agent', value: `AED ${selectedRecord.totalPayableAED.toLocaleString()}`, bold: true, color: RED },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0', fontSize: '0.8rem' }}>
                      <span style={{ color: TEXT_MUTED }}>{row.label}</span>
                      <span style={{ fontWeight: row.bold ? 900 : 600, color: (row as any).color || SLATE }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedRecord.status === 'Pending' && (
                    <button onClick={() => handleApprove(selectedRecord.id)}
                      style={{ padding: '9px', background: BLUE, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                      ✔️ Approve Commission
                    </button>
                  )}
                  {selectedRecord.status === 'Approved' && (
                    <button onClick={() => handleMarkPaid(selectedRecord.id)}
                      style={{ padding: '9px', background: GREEN, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                      💰 Mark as Paid
                    </button>
                  )}
                  <button onClick={() => showToast(`📄 Generating statement PDF for ${selectedRecord.agentName}...`, PURPLE)}
                    style={{ padding: '9px', background: SLATE, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                    📄 Generate Statement PDF
                  </button>
                  {selectedRecord.status === 'Pending' && (
                    <button onClick={() => { setRecords(prev => prev.map(r => r.id === selectedRecord.id ? { ...r, status: 'Disputed' as const } : r)); setSelectedRecord(null); }}
                      style={{ padding: '9px', background: '#FEF2F2', color: RED, border: `1px solid ${RED}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                      ⚠️ Flag as Disputed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* AGENT SUMMARY TAB */}
      {activeTab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {agentSummary.map(a => (
            <div key={a.agent} style={{ background: CARD_BG, padding: '20px', borderRadius: '12px', border: `1px solid ${BORDER}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, color: SLATE, fontSize: '1rem', fontWeight: 800 }}>{a.agent}</h3>
                  <div style={{ fontSize: '0.78rem', color: TEXT_MUTED }}>{a.role} · {a.deals} deals closed</div>
                </div>
                <div style={{ background: '#FEF2F2', padding: '6px 12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: RED, fontWeight: 700 }}>SPLIT</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: RED }}>{a.avgSplit}%</div>
                </div>
              </div>

              {[
                { label: 'Gross Commission', value: `AED ${a.totalGross.toLocaleString()}`, color: SLATE },
                { label: 'Agent Earnings', value: `AED ${a.totalEarnings.toLocaleString()}`, color: GREEN },
                { label: 'Paid Out', value: `AED ${a.paid.toLocaleString()}`, color: GREEN },
                { label: 'Pending', value: `AED ${a.pending.toLocaleString()}`, color: ORANGE },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                  <span style={{ color: TEXT_MUTED, fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
                </div>
              ))}

              {/* Progress bar: paid vs total */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, fontWeight: 700, marginBottom: '4px' }}>
                  Payout Progress: {Math.round((a.paid / (a.totalEarnings || 1)) * 100)}% paid
                </div>
                <div style={{ background: '#E2E8F0', borderRadius: '99px', height: '8px' }}>
                  <div style={{ background: GREEN, width: `${Math.min(100, Math.round((a.paid / (a.totalEarnings || 1)) * 100))}%`, height: '100%', borderRadius: '99px', transition: 'width 0.4s' }} />
                </div>
              </div>

              <button onClick={() => showToast(`📄 Agent statement generated for ${a.agent}`, GREEN)}
                style={{ marginTop: '14px', width: '100%', padding: '8px', background: SLATE, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                📄 Generate Agent Statement
              </button>
            </div>
          ))}
        </div>
      )}
      {/* ── Toast Notification Stack ── */}
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{ background: t.color, color: WHITE, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', maxWidth: '360px' }}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommissionManagementPanel;
