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

interface LegalCase {
  id: string;
  type: 'Dispute' | 'Eviction' | 'Breach' | 'Title' | 'Commission';
  title: string;
  parties: string;
  status: 'Active' | 'Resolved' | 'Pending Court' | 'Mediation';
  riskLevel: 'High' | 'Medium' | 'Low';
  opened: string;
  nextAction: string;
  counselAssigned: string;
  valueAtRisk: string;
}

const LEGAL_CASES: LegalCase[] = [
  { id: 'CASE-001', type: 'Eviction', title: 'Non-renewal notice enforcement — Al Barsha unit 4B', parties: 'White Caves (Landlord Rep) vs. Omar Al Farsi', status: 'Active', riskLevel: 'High', opened: '2026-06-15', nextAction: 'Court hearing — 2026-08-10', counselAssigned: 'Al Tamimi & Co.', valueAtRisk: 'AED 180,000/yr rent' },
  { id: 'CASE-002', type: 'Commission', title: 'Disputed agent commission — Palm Jumeirah sale', parties: 'Sophia Lin vs. Reem Properties LLC', status: 'Mediation', riskLevel: 'Medium', opened: '2026-07-01', nextAction: 'RERA Mediation session — 2026-07-31', counselAssigned: 'Internal Legal', valueAtRisk: 'AED 82,000' },
  { id: 'CASE-003', type: 'Breach', title: 'Tenant rent bounce — DAMAC Hills 2 Villa', parties: 'Khalid Al Rashidi (Landlord) vs. John Webb', status: 'Pending Court', riskLevel: 'High', opened: '2026-07-10', nextAction: 'Issue Form 12 legal notice', counselAssigned: 'Al Tamimi & Co.', valueAtRisk: 'AED 240,000' },
  { id: 'CASE-004', type: 'Title', title: 'Title deed discrepancy — off-plan handover unit', parties: 'White Caves vs. Emaar Properties', status: 'Active', riskLevel: 'Medium', opened: '2026-05-20', nextAction: 'DLD rectification application pending', counselAssigned: 'Hadef & Partners', valueAtRisk: 'AED 1,250,000' },
  { id: 'CASE-005', type: 'Dispute', title: 'Service charge dispute — Downtown Dubai apartment', parties: 'Mark Stevenson vs. RERA Board', status: 'Resolved', riskLevel: 'Low', opened: '2026-03-01', nextAction: 'Closed — settled in client favour', counselAssigned: 'Internal Legal', valueAtRisk: 'AED 28,000' },
];

interface LegalTemplate {
  id: string;
  icon: string;
  name: string;
  description: string;
  reraForm: string;
}

const LEGAL_TEMPLATES: LegalTemplate[] = [
  { id: 'form6', icon: '📝', name: 'Form 6 — Contract of Sale', description: 'RERA standard purchase agreement for secondary market sales', reraForm: 'Form 6' },
  { id: 'form7', icon: '⚠️', name: 'Form 7 — Eviction Notice', description: 'Legal non-renewal / eviction notice as per Dubai Tenancy Law Article 25', reraForm: 'Form 7' },
  { id: 'form12', icon: '⚖️', name: 'Form 12 — Legal Notice', description: 'Formal legal notice for breach of tenancy obligations', reraForm: 'Form 12' },
  { id: 'noc', icon: '✅', name: 'NOC Letter', description: 'No Objection Certificate for sub-leasing, alterations, or ownership transfer', reraForm: 'NOC' },
  { id: 'mou', icon: '🤝', name: 'MOU / LOI', description: 'Memorandum of Understanding / Letter of Intent for pre-sale agreements', reraForm: 'MOU' },
  { id: 'soa', icon: '💰', name: 'Statement of Account', description: 'Outstanding balance statement for rent arrears enforcement', reraForm: 'SOA' },
];

const statusConfig = {
  Active: { bg: '#FEF2F2', color: RED },
  Resolved: { bg: '#DEF7EC', color: GREEN },
  'Pending Court': { bg: '#FFFBEB', color: ORANGE },
  Mediation: { bg: '#EFF6FF', color: BLUE },
};

const riskConfig = {
  High: { color: RED, icon: '🔴' },
  Medium: { color: ORANGE, icon: '🟡' },
  Low: { color: GREEN, icon: '🟢' },
};

const caseTypeColor: Record<string, string> = {
  Dispute: PURPLE,
  Eviction: RED,
  Breach: ORANGE,
  Title: BLUE,
  Commission: GREEN,
};

export const LegalDepartmentView: FC = () => {
  const [activeTab, setActiveTab] = useState<'cases' | 'templates' | 'obligations'>('cases');
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; color: string }>>([]);

  const showToast = useCallback((message: string, color = RED) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const filteredCases = LEGAL_CASES.filter(c =>
    filterStatus === 'ALL' || c.status === filterStatus
  );

  const activeCases = LEGAL_CASES.filter(c => c.status !== 'Resolved').length;
  const highRisk = LEGAL_CASES.filter(c => c.riskLevel === 'High' && c.status !== 'Resolved').length;

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>⚖️ Legal & Case Management</h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Active disputes · Eviction filings · Legal form library · Compliance obligations register
          </p>
        </div>
        {highRisk > 0 && (
          <div style={{ background: '#FEF2F2', border: `2px solid ${RED}`, padding: '10px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: RED, fontWeight: 800, textTransform: 'uppercase' }}>🚨 High-Risk Cases</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: RED }}>{highRisk}</div>
            <div style={{ fontSize: '0.72rem', color: TEXT_MUTED }}>Require immediate attention</div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Cases', value: LEGAL_CASES.length, color: SLATE },
          { label: 'Active / In-Progress', value: activeCases, color: RED },
          { label: 'Resolved This Quarter', value: LEGAL_CASES.filter(c => c.status === 'Resolved').length, color: GREEN },
          { label: 'Mediation / RERA', value: LEGAL_CASES.filter(c => c.status === 'Mediation').length, color: BLUE },
        ].map(s => (
          <div key={s.label} style={{ background: CARD_BG, padding: '14px', borderRadius: '8px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color, marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `2px solid ${BORDER}`, marginBottom: '20px' }}>
        {(['cases', 'templates', 'obligations'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? `3px solid ${RED}` : '3px solid transparent', padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? RED : TEXT_MUTED, fontSize: '0.9rem', marginBottom: '-2px' }}>
            {tab === 'cases' ? '📁 Active Cases' : tab === 'templates' ? '📋 Legal Form Library' : '📅 Obligations Calendar'}
          </button>
        ))}
      </div>

      {/* CASES TAB */}
      {activeTab === 'cases' && (
        <>
          {/* Status filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['ALL', 'Active', 'Mediation', 'Pending Court', 'Resolved'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ background: filterStatus === s ? SLATE : WHITE, color: filterStatus === s ? WHITE : SLATE, border: `1px solid ${BORDER}`, padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                {s}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedCase ? '1.4fr 1fr' : '1fr', gap: '20px' }}>
            {/* Cases Table */}
            <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: SLATE, color: WHITE }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>RISK</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>CASE</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>TYPE</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>STATUS</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left' }}>NEXT ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((c, idx) => {
                    const sc = statusConfig[c.status];
                    const rc = riskConfig[c.riskLevel];
                    return (
                      <tr key={c.id} onClick={() => setSelectedCase(c === selectedCase ? null : c)}
                        style={{ borderBottom: '1px solid #E2E8F0', background: selectedCase?.id === c.id ? '#FEF2F2' : idx % 2 === 0 ? WHITE : CARD_BG, cursor: 'pointer' }}>
                        <td style={{ padding: '10px 14px', fontSize: '1rem', textAlign: 'center' }}>{rc.icon}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: SLATE }}>{c.title}</div>
                          <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, marginTop: '2px' }}>{c.id} · {c.parties}</div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: `${caseTypeColor[c.type]}20`, color: caseTypeColor[c.type], padding: '2px 8px', borderRadius: '8px', fontWeight: 700, fontSize: '0.72rem' }}>
                            {c.type}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ background: sc.bg, color: sc.color, padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.72rem' }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: '0.78rem', color: TEXT_MUTED }}>{c.nextAction}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Case Detail Panel */}
            {selectedCase && (
              <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `2px solid ${caseTypeColor[selectedCase.type]}40` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: SLATE }}>Case Detail</h3>
                  <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED }}>✕</button>
                </div>
                {[
                  { label: 'Case ID', value: selectedCase.id },
                  { label: 'Type', value: selectedCase.type },
                  { label: 'Status', value: selectedCase.status },
                  { label: 'Risk Level', value: `${riskConfig[selectedCase.riskLevel].icon} ${selectedCase.riskLevel}` },
                  { label: 'Parties', value: selectedCase.parties },
                  { label: 'Opened', value: selectedCase.opened },
                  { label: 'Counsel Assigned', value: selectedCase.counselAssigned },
                  { label: 'Value at Risk', value: selectedCase.valueAtRisk },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', padding: '7px 0', fontSize: '0.8rem' }}>
                    <span style={{ color: TEXT_MUTED, fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontWeight: 700, color: SLATE, textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: TEXT_MUTED, marginBottom: '6px' }}>Next Action</div>
                  <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', color: RED, fontWeight: 600, border: `1px solid ${RED}30` }}>
                    {selectedCase.nextAction}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button onClick={() => showToast(`📄 Opening document generator for ${selectedCase.title}...`, RED)}
                    style={{ flex: 1, padding: '9px', background: RED, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                    📄 Generate Legal Doc
                  </button>
                  <button onClick={() => showToast(`📨 Escalating ${selectedCase.id} to counsel...`, SLATE)}
                    style={{ flex: 1, padding: '9px', background: SLATE, color: WHITE, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                    📨 Escalate
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {LEGAL_TEMPLATES.map(tmpl => (
            <div key={tmpl.id} style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}`, cursor: 'pointer', transition: 'border-color 0.2s' }}
              onClick={() => showToast(`📄 Opening ${tmpl.name} in Document Generation Centre...`, BLUE)}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{tmpl.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: SLATE, marginBottom: '4px' }}>{tmpl.name}</div>
              <div style={{ fontSize: '0.78rem', color: TEXT_MUTED, lineHeight: 1.5, marginBottom: '12px' }}>{tmpl.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: 'var(--color-eff6ff, #EFF6FF)', color: BLUE, padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {tmpl.reraForm}
                </span>
                <span style={{ fontSize: '0.78rem', color: RED, fontWeight: 700 }}>Generate →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OBLIGATIONS TAB */}
      {activeTab === 'obligations' && (
        <div>
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}`, marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 14px 0', color: RED }}>⏰ Upcoming Legal Deadlines</h4>
            {[
              { date: '2026-07-29', obligation: 'AML clearance — new landlord onboarding (3 clients)', priority: 'HIGH', assigned: 'Neva Khalil' },
              { date: '2026-07-30', obligation: 'DLD registration deadline — 2 pending transactions', priority: 'HIGH', assigned: 'Victoria Woodhull' },
              { date: '2026-07-31', obligation: 'RERA Mediation session — CASE-002 commission dispute', priority: 'HIGH', assigned: 'Al Tamimi & Co.' },
              { date: '2026-08-01', obligation: 'Ejari renewal batch — 7 contracts expiring', priority: 'MEDIUM', assigned: 'Victoria Woodhull' },
              { date: '2026-08-05', obligation: 'Trakheesi permit renewals — 7 listings', priority: 'MEDIUM', assigned: 'Clara Osei' },
              { date: '2026-08-10', obligation: 'Court hearing — CASE-001 eviction proceeding', priority: 'HIGH', assigned: 'Al Tamimi & Co.' },
              { date: '2026-08-15', obligation: 'Source of funds verification — 3 sale transactions', priority: 'MEDIUM', assigned: 'Neva Khalil' },
              { date: '2026-10-28', obligation: 'Q3 2026 VAT return filing — FTA portal', priority: 'LOW', assigned: '@Invoice' },
            ].map(o => {
              const pColor = o.priority === 'HIGH' ? RED : o.priority === 'MEDIUM' ? ORANGE : GREEN;
              return (
                <div key={o.date + o.obligation} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--text-secondary, #E2E8F0)' }}>
                  <div style={{ minWidth: '80px', textAlign: 'center', background: o.priority === 'HIGH' ? 'var(--color-fef2f2, #FEF2F2)' : CARD_BG, padding: '6px 8px', borderRadius: '6px', border: `1px solid ${pColor}30` }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: pColor, textTransform: 'uppercase' }}>{o.date.slice(5)}</div>
                    <div style={{ fontSize: '0.6rem', color: TEXT_MUTED }}>{o.date.slice(0, 4)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: SLATE }}>{o.obligation}</div>
                    <div style={{ fontSize: '0.75rem', color: TEXT_MUTED, marginTop: '2px' }}>Assigned: {o.assigned}</div>
                  </div>
                  <span style={{ background: `${pColor}20`, color: pColor, padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                    {o.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
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

export default LegalDepartmentView;
