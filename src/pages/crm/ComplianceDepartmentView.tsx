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

interface ComplianceCheck {
  id: string;
  category: string;
  requirement: string;
  status: 'PASS' | 'WARN' | 'FAIL' | 'PENDING';
  lastChecked: string;
  dueDate: string;
  owner: string;
  notes: string;
}

const COMPLIANCE_CHECKS: ComplianceCheck[] = [
  { id: 'C-001', category: 'RERA Licensing', requirement: 'All active brokers hold valid RERA Broker Card', status: 'PASS', lastChecked: '2026-07-20', dueDate: '2027-03-31', owner: 'Sofia Al-Hassan', notes: '12/12 brokers licensed — renewals tracked in system' },
  { id: 'C-002', category: 'RERA Licensing', requirement: 'Agency RERA ORN number active and registered', status: 'PASS', lastChecked: '2026-07-01', dueDate: '2027-01-01', owner: 'Sofia Al-Hassan', notes: 'ORN: 28491 — valid and verified' },
  { id: 'C-003', category: 'DLD Integration', requirement: 'All transactions registered with DLD within 30 days', status: 'WARN', lastChecked: '2026-07-25', dueDate: '2026-07-30', owner: 'Neva Khalil', notes: '2 pending transactions approaching 30-day window' },
  { id: 'C-004', category: 'DLD Integration', requirement: 'Ejari registrations completed for all active leases', status: 'PASS', lastChecked: '2026-07-22', dueDate: '2026-08-01', owner: 'Victoria Woodhull', notes: '47/47 leases have valid Ejari registration' },
  { id: 'C-005', category: 'UAE PDPL', requirement: 'Client data consent obtained and documented', status: 'PASS', lastChecked: '2026-07-15', dueDate: '2026-12-31', owner: 'Sofia Al-Hassan', notes: 'Consent forms digitally signed in CRM for all clients' },
  { id: 'C-006', category: 'UAE PDPL', requirement: 'Data retention policy enforced (7-year rule)', status: 'PASS', lastChecked: '2026-07-10', dueDate: '2026-12-31', owner: 'Sofia Al-Hassan', notes: 'Automated archival pipeline active' },
  { id: 'C-007', category: 'AML', requirement: 'AML screening completed for all new landlords/buyers', status: 'WARN', lastChecked: '2026-07-26', dueDate: '2026-07-29', owner: 'Neva Khalil', notes: '1 new landlord awaiting AML clearance from compliance team' },
  { id: 'C-008', category: 'AML', requirement: 'Source of funds documentation on file for deals >AED 55,000', status: 'PASS', lastChecked: '2026-07-20', dueDate: '2026-08-15', owner: 'Victoria Woodhull', notes: 'All Q2 2026 transactions verified' },
  { id: 'C-009', category: 'VAT FTA', requirement: 'VAT 5% collected and filed with FTA (quarterly)', status: 'PASS', lastChecked: '2026-07-01', dueDate: '2026-10-28', owner: '@Invoice', notes: 'Q2 2026 VAT return filed — AED 212,450 submitted' },
  { id: 'C-010', category: 'VAT FTA', requirement: 'TRN number displayed on all invoices and contracts', status: 'PASS', lastChecked: '2026-07-15', dueDate: 'Ongoing', owner: '@Invoice', notes: 'TRN: 100-2917-8821-003 auto-stamped on generated docs' },
  { id: 'C-011', category: 'Trakheesi', requirement: 'All property ads have valid Trakheesi permit numbers', status: 'FAIL', lastChecked: '2026-07-27', dueDate: '2026-07-28', owner: 'Neva Khalil', notes: '3 listings on Property Finder missing permit numbers — URGENT' },
  { id: 'C-012', category: 'Trakheesi', requirement: 'Permit renewal pipeline managed for expiring ads', status: 'WARN', lastChecked: '2026-07-24', dueDate: '2026-08-05', owner: 'Clara Osei', notes: '7 permits expire within 30 days — renewal in progress' },
];

const statusConfig = {
  PASS: { bg: '#DEF7EC', color: '#065F46', icon: '✅' },
  WARN: { bg: '#FFFBEB', color: '#92400E', icon: '⚠️' },
  FAIL: { bg: '#FEF2F2', color: '#991B1B', icon: '🔴' },
  PENDING: { bg: '#EFF6FF', color: '#1D4ED8', icon: '⏳' },
};

const categoryColors: Record<string, string> = {
  'RERA Licensing': '#8B5CF6',
  'DLD Integration': BLUE,
  'UAE PDPL': GREEN,
  'AML': ORANGE,
  'VAT FTA': '#F59E0B',
  'Trakheesi': RED,
};

export const ComplianceDepartmentView: FC = () => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const categories = ['ALL', ...Array.from(new Set(COMPLIANCE_CHECKS.map(c => c.category)))];
  const statuses = ['ALL', 'PASS', 'WARN', 'FAIL', 'PENDING'];

  const filtered = COMPLIANCE_CHECKS.filter(c => {
    const matchCat = filterCategory === 'ALL' || c.category === filterCategory;
    const matchStat = filterStatus === 'ALL' || c.status === filterStatus;
    return matchCat && matchStat;
  });

  const score = Math.round((COMPLIANCE_CHECKS.filter(c => c.status === 'PASS').length / COMPLIANCE_CHECKS.length) * 100);
  const scoreColor = score >= 90 ? GREEN : score >= 70 ? ORANGE : RED;

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>⚖️ RERA & Regulatory Compliance</h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Real-time compliance dashboard — RERA 2024 | DLD | UAE PDPL | AML | VAT FTA | Trakheesi
          </p>
        </div>
        <div style={{ textAlign: 'center', background: CARD_BG, padding: '16px 24px', borderRadius: '12px', border: `3px solid ${scoreColor}` }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: scoreColor }}>{score}%</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase' }}>Compliance Score</div>
          <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, marginTop: '2px' }}>
            {score >= 90 ? '🟢 EXCELLENT' : score >= 70 ? '🟡 NEEDS ATTENTION' : '🔴 CRITICAL'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'PASS', count: COMPLIANCE_CHECKS.filter(c => c.status === 'PASS').length, ...statusConfig.PASS },
          { label: 'WARN', count: COMPLIANCE_CHECKS.filter(c => c.status === 'WARN').length, ...statusConfig.WARN },
          { label: 'FAIL', count: COMPLIANCE_CHECKS.filter(c => c.status === 'FAIL').length, ...statusConfig.FAIL },
          { label: 'PENDING', count: COMPLIANCE_CHECKS.filter(c => c.status === 'PENDING').length, ...statusConfig.PENDING },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, padding: '14px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${s.color}30` }}
            onClick={() => setFilterStatus(filterStatus === s.label ? 'ALL' : s.label)}>
            <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            style={{ background: filterCategory === cat ? (categoryColors[cat] || SLATE) : WHITE, color: filterCategory === cat ? WHITE : SLATE, border: `1px solid ${BORDER}`, padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Table + Detail Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedCheck ? '1.6fr 1fr' : '1fr', gap: '20px' }}>
        <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: SLATE, color: WHITE }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>STATUS</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>CATEGORY</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>REQUIREMENT</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>OWNER</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>DUE DATE</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((check, idx) => {
                const sc = statusConfig[check.status];
                return (
                  <tr key={check.id} onClick={() => setSelectedCheck(check === selectedCheck ? null : check)}
                    style={{ borderBottom: '1px solid #E2E8F0', background: selectedCheck?.id === check.id ? '#FEF2F2' : idx % 2 === 0 ? WHITE : CARD_BG, cursor: 'pointer' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: '12px', fontWeight: 700, fontSize: '0.7rem' }}>
                        {sc.icon} {check.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: `${categoryColors[check.category] || SLATE}20`, color: categoryColors[check.category] || SLATE, padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                        {check.category}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, maxWidth: '300px' }}>{check.requirement}</td>
                    <td style={{ padding: '10px 12px', color: TEXT_MUTED }}>{check.owner}</td>
                    <td style={{ padding: '10px 12px', color: check.dueDate === '2026-07-28' ? RED : TEXT_MUTED, fontWeight: check.dueDate === '2026-07-28' ? 700 : 400 }}>{check.dueDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {selectedCheck && (
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `2px solid ${statusConfig[selectedCheck.status].color}50` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>Check Detail</h3>
              <button onClick={() => setSelectedCheck(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED }}>✕</button>
            </div>
            {[
              { label: 'Check ID', value: selectedCheck.id },
              { label: 'Category', value: selectedCheck.category },
              { label: 'Status', value: `${statusConfig[selectedCheck.status].icon} ${selectedCheck.status}` },
              { label: 'Owner', value: selectedCheck.owner },
              { label: 'Last Checked', value: selectedCheck.lastChecked },
              { label: 'Due Date', value: selectedCheck.dueDate },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', padding: '8px 0', fontSize: '0.8rem' }}>
                <span style={{ color: TEXT_MUTED, fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontWeight: 700, color: SLATE }}>{row.value}</span>
              </div>
            ))}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: TEXT_MUTED, fontWeight: 600, marginBottom: '6px' }}>Notes</div>
              <div style={{ background: WHITE, padding: '10px', borderRadius: '6px', fontSize: '0.8rem', lineHeight: 1.5, border: '1px solid #E2E8F0' }}>{selectedCheck.notes}</div>
            </div>
            {selectedCheck.status !== 'PASS' && (
              <button style={{ marginTop: '14px', width: '100%', padding: '10px', background: RED, color: WHITE, border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
                onClick={() => showToast(`🚨 Escalation triggered for: ${selectedCheck.requirement}`)}>
                🚨 Escalate to Compliance Officer
              </button>
            )}
          </div>
        )}
      </div>
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{ background: RED, color: WHITE, padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', maxWidth: '360px' }}>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplianceDepartmentView;
