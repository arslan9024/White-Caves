import React, { FC, useState, useRef } from 'react';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  details: string;
  ipAddress: string;
}

const SEED_EVENTS: AuditEvent[] = [
  { id: 'AUD-001', timestamp: '2026-07-28 04:38:12', actor: 'Arslan Malik', actorRole: 'MD / Level 5', action: 'IMPERSONATE_USER', entity: 'User', entityId: 'usr-089', severity: 'WARN', details: 'MD activated ghost impersonation for agent Nadia Yusuf', ipAddress: '192.168.1.1' },
  { id: 'AUD-002', timestamp: '2026-07-28 04:22:05', actor: 'Nadia Yusuf', actorRole: 'Senior Broker', action: 'LEAD_STATUS_CHANGE', entity: 'Lead', entityId: 'LDX-7821', severity: 'INFO', details: 'Lead status changed from Contacted → Negotiation', ipAddress: '10.0.2.45' },
  { id: 'AUD-003', timestamp: '2026-07-28 04:14:30', actor: 'Clara Osei', actorRole: 'Associate Broker', action: 'CONTRACT_GENERATED', entity: 'Document', entityId: 'DOC-3391', severity: 'INFO', details: 'Tenancy contract generated for unit DH2-Villa-09', ipAddress: '10.0.2.67' },
  { id: 'AUD-004', timestamp: '2026-07-28 03:55:44', actor: 'System', actorRole: 'Scheduler', action: 'CRON_VIEWING_REMINDER', entity: 'Viewing', entityId: 'VW-2021', severity: 'INFO', details: 'WhatsApp reminder dispatched to 3 clients for tomorrow viewings', ipAddress: 'internal' },
  { id: 'AUD-005', timestamp: '2026-07-28 03:31:10', actor: 'Fatima Al Sayed', actorRole: 'Tenant (Level 1)', action: 'LEASING_WIZARD_COMPLETE', entity: 'LeasingTx', entityId: 'LTX-019', severity: 'INFO', details: 'Tenant completed digital signature step — transaction advanced to Pending Agent Review', ipAddress: '41.250.3.12' },
  { id: 'AUD-006', timestamp: '2026-07-28 02:48:00', actor: 'Arslan Malik', actorRole: 'MD / Level 5', action: 'EMPLOYEE_DEACTIVATED', entity: 'User', entityId: 'usr-044', severity: 'WARN', details: 'Staff account deactivated for terminated employee', ipAddress: '192.168.1.1' },
  { id: 'AUD-007', timestamp: '2026-07-28 02:30:18', actor: 'Mark Stevenson', actorRole: 'Client (Level 1)', action: 'PORTAL_LOGIN', entity: 'Session', entityId: 'SES-8821', severity: 'INFO', details: 'Client logged in to tenant portal — Dubai Hills property view', ipAddress: '87.112.4.9' },
  { id: 'AUD-008', timestamp: '2026-07-28 02:15:52', actor: 'System', actorRole: 'DLD Sync', action: 'DLD_API_SYNC', entity: 'Property', entityId: 'PROP-034', severity: 'INFO', details: 'DLD title deed auto-fetched and cached for property DAMAC-Hills-Unit-34', ipAddress: 'internal' },
  { id: 'AUD-009', timestamp: '2026-07-27 23:58:00', actor: 'Sophia Lin', actorRole: 'Senior Broker', action: 'COMMISSION_CLAIMED', entity: 'Commission', entityId: 'COM-5512', severity: 'INFO', details: 'Commission claim submitted: AED 58,000 for deal REF-2026-Q2-012', ipAddress: '10.0.2.88' },
  { id: 'AUD-010', timestamp: '2026-07-27 23:40:30', actor: 'Unknown', actorRole: '-', action: 'LOGIN_FAILED', entity: 'Auth', entityId: '-', severity: 'CRITICAL', details: '5 consecutive failed login attempts from IP 185.234.219.4 — account locked', ipAddress: '185.234.219.4' },
  { id: 'AUD-011', timestamp: '2026-07-27 22:14:09', actor: 'Arslan Malik', actorRole: 'MD / Level 5', action: 'RBAC_ROLE_UPDATED', entity: 'User', entityId: 'usr-112', severity: 'WARN', details: 'User role elevated from Associate → Senior Broker for Nadia Yusuf', ipAddress: '192.168.1.1' },
  { id: 'AUD-012', timestamp: '2026-07-27 21:05:00', actor: 'System', actorRole: 'VAT Engine', action: 'VAT_REPORT_GENERATED', entity: 'FinancialReport', entityId: 'RPT-9901', severity: 'INFO', details: 'Q2 2026 VAT 5% reconciliation report auto-generated and archived', ipAddress: 'internal' },
  { id: 'AUD-013', timestamp: '2026-07-27 20:30:14', actor: 'Khalid Al Rashidi', actorRole: 'Client (Level 1)', action: 'PDC_CHEQUE_UPLOADED', entity: 'Document', entityId: 'PDC-4400', severity: 'INFO', details: 'Post-dated cheque scan uploaded for Q3 rent — Dubai Marina unit', ipAddress: '78.56.3.201' },
  { id: 'AUD-014', timestamp: '2026-07-27 19:55:22', actor: 'System', actorRole: 'Scheduler', action: 'EJARI_RENEWAL_ALERT', entity: 'Lease', entityId: 'EJR-9901', severity: 'WARN', details: 'Ejari contract expiry in 30 days — renewal alert dispatched to landlord', ipAddress: 'internal' },
  { id: 'AUD-015', timestamp: '2026-07-27 18:12:44', actor: 'Clara Osei', actorRole: 'Associate Broker', action: 'PROPERTY_LISTED', entity: 'Property', entityId: 'PROP-099', severity: 'INFO', details: 'New property listed on Bayut/Property Finder portals — DAMAC Hills 2 Villa', ipAddress: '10.0.2.67' },
];

const severityColor = {
  INFO: { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  WARN: { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  CRITICAL: { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' },
};

export const AuditTrailPanel: FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>(SEED_EVENTS);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'CRITICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isLive, setIsLive] = useState(true);
  const liveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate live event stream
  React.useEffect(() => {
    if (!isLive) {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
      return;
    }
    const LIVE_POOL: Partial<AuditEvent>[] = [
      { actor: 'System', actorRole: 'AI Engine', action: 'LEAD_SCORED', entity: 'Lead', severity: 'INFO', details: 'AI auto-scored 3 new inbound leads via WhatsApp', ipAddress: 'internal' },
      { actor: 'Nadia Yusuf', actorRole: 'Senior Broker', action: 'VIEWING_BOOKED', entity: 'Viewing', severity: 'INFO', details: 'Viewing booked — Emirates Hills Villa for Mark Stevenson', ipAddress: '10.0.2.45' },
      { actor: 'System', actorRole: 'Portal Sync', action: 'BAYUT_SYNC', entity: 'Property', severity: 'INFO', details: 'Property feed synced to Bayut — 5 new listings published', ipAddress: 'internal' },
      { actor: 'Unknown', actorRole: '-', action: 'SUSPICIOUS_ACCESS', entity: 'Auth', severity: 'CRITICAL', details: 'Unusual access pattern detected from new device — MFA triggered', ipAddress: '91.122.14.200' },
    ];
    liveIntervalRef.current = setInterval(() => {
      const template = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
      const newEvent: AuditEvent = {
        id: `AUD-${String(Date.now()).slice(-5)}`,
        timestamp: new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(',', ''),
        actor: template.actor || 'System',
        actorRole: template.actorRole || 'System',
        action: template.action || 'SYSTEM_EVENT',
        entity: template.entity || 'System',
        entityId: `SYS-${Math.floor(Math.random() * 9000) + 1000}`,
        severity: template.severity || 'INFO',
        details: template.details || 'Automated system event',
        ipAddress: template.ipAddress || 'internal',
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 99)]);
    }, 8000);
    return () => { if (liveIntervalRef.current) clearInterval(liveIntervalRef.current); };
  }, [isLive]);

  const filtered = events.filter(e => {
    const matchSev = severityFilter === 'ALL' || e.severity === severityFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || e.actor.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.details.toLowerCase().includes(q);
    return matchSev && matchSearch;
  });

  const criticalCount = events.filter(e => e.severity === 'CRITICAL').length;
  const warnCount = events.filter(e => e.severity === 'WARN').length;

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Entity ID', 'Severity', 'Details', 'IP Address'],
      ...filtered.map(e => [e.id, e.timestamp, e.actor, e.actorRole, e.action, e.entity, e.entityId, e.severity, e.details, e.ipAddress])
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `white-caves-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: WHITE, color: SLATE, minHeight: '80vh', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>
            🔐 RERA Audit Trail
          </h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Immutable, append-only audit log of all CRM actions — 7-year RERA retention compliant
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsLive(l => !l)}
              style={{
                background: isLive ? GREEN : '#E2E8F0',
                color: isLive ? WHITE : SLATE,
                border: 'none',
                padding: '6px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: WHITE, display: 'inline-block', boxShadow: isLive ? '0 0 6px rgba(255,255,255,0.8)' : 'none' }} />
              {isLive ? 'LIVE FEED ON' : 'LIVE FEED OFF'}
            </button>
            <button
              onClick={handleExportCSV}
              style={{ background: SLATE, color: WHITE, border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
            >
              📥 Export CSV
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: TEXT_MUTED }}>
            {events.length} total events logged
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Events', value: events.length, color: SLATE },
          { label: 'Info Events', value: events.filter(e => e.severity === 'INFO').length, color: '#3B82F6' },
          { label: 'Warnings', value: warnCount, color: ORANGE },
          { label: 'Critical Alerts', value: criticalCount, color: RED },
        ].map(stat => (
          <div key={stat.label} style={{ background: CARD_BG, padding: '14px', borderRadius: '8px', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color, marginTop: '4px' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search by actor, action, or details..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.875rem', minWidth: '260px' }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ALL', 'INFO', 'WARN', 'CRITICAL'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              style={{
                background: severityFilter === sev ? (sev === 'CRITICAL' ? RED : sev === 'WARN' ? ORANGE : sev === 'INFO' ? '#3B82F6' : SLATE) : WHITE,
                color: severityFilter === sev ? WHITE : SLATE,
                border: `1px solid ${BORDER}`,
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              {sev}
            </button>
          ))}
        </div>
        <span style={{ color: TEXT_MUTED, fontSize: '0.8rem', marginLeft: 'auto' }}>
          Showing {filtered.length} of {events.length} events
        </span>
      </div>

      {/* Audit Table + Detail Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedEvent ? '1.5fr 1fr' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: SLATE, color: WHITE }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>SEVERITY</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>TIMESTAMP</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>ACTOR</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>ACTION</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>ENTITY</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, idx) => {
                const sc = severityColor[event.severity];
                return (
                  <tr
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    style={{
                      borderBottom: '1px solid #E2E8F0',
                      background: selectedEvent?.id === event.id ? '#FEF2F2' : (idx % 2 === 0 ? WHITE : CARD_BG),
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        background: sc.bg,
                        color: sc.text,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                        {event.severity}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: TEXT_MUTED, fontSize: '0.75rem' }}>{event.timestamp}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{event.actor}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', color: '#475569' }}>
                        {event.action}
                      </code>
                    </td>
                    <td style={{ padding: '10px 12px', color: TEXT_MUTED }}>{event.entity}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: TEXT_MUTED }}>
                    No events match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Panel */}
        {selectedEvent && (
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `2px solid ${severityColor[selectedEvent.severity].dot}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: SLATE }}>Event Detail</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Event ID', value: selectedEvent.id },
                { label: 'Timestamp', value: selectedEvent.timestamp },
                { label: 'Actor', value: selectedEvent.actor },
                { label: 'Role', value: selectedEvent.actorRole },
                { label: 'Action', value: selectedEvent.action },
                { label: 'Entity Type', value: selectedEvent.entity },
                { label: 'Entity ID', value: selectedEvent.entityId },
                { label: 'IP Address', value: selectedEvent.ipAddress },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: TEXT_MUTED, fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: SLATE, fontFamily: row.label === 'Event ID' || row.label === 'IP Address' || row.label === 'Entity ID' ? 'monospace' : undefined }}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div>
                <div style={{ fontSize: '0.78rem', color: TEXT_MUTED, fontWeight: 600, marginBottom: '6px' }}>Description</div>
                <div style={{ background: WHITE, padding: '10px', borderRadius: '6px', fontSize: '0.8rem', color: SLATE, border: '1px solid #E2E8F0', lineHeight: 1.5 }}>
                  {selectedEvent.details}
                </div>
              </div>
              <div>
                <span style={{
                  background: severityColor[selectedEvent.severity].bg,
                  color: severityColor[selectedEvent.severity].text,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                }}>
                  Severity: {selectedEvent.severity}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrailPanel;
