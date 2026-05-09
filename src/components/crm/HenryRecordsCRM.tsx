import React, { memo } from 'react';
import { BookOpenCheck, FileSearch, ShieldAlert, TimerReset } from 'lucide-react';

const cardStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.62)',
  border: '1px solid rgba(124, 58, 237, 0.35)',
  borderRadius: 12,
  padding: 14,
  minHeight: 92,
};

const HenryRecordsCRM = memo(() => {
  return (
    <section aria-label="Henry Records and Compliance" style={{ display: 'grid', gap: 16 }}>
      <header
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(15,23,42,0.72))',
          border: '1px solid rgba(124, 58, 237, 0.35)',
          borderRadius: 14,
          padding: 16,
        }}
      >
        <h2 style={{ margin: 0, color: '#F5F3FF' }}>Henry — Record Keeper & Compliance</h2>
        <p style={{ margin: '8px 0 0 0', color: '#DDD6FE', fontSize: 13 }}>
          Internal compliance cockpit for audit trails, document integrity checks, and timeline risk signals.
          Runs as a native White Caves module.
        </p>
      </header>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div style={cardStyle}>
          <BookOpenCheck size={18} color="#A78BFA" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>Audit Events</p>
          <strong style={{ color: '#C4B5FD', fontSize: 24 }}>12,847</strong>
        </div>
        <div style={cardStyle}>
          <FileSearch size={18} color="#A78BFA" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>Compliance Reviews</p>
          <strong style={{ color: '#C4B5FD', fontSize: 24 }}>286</strong>
        </div>
        <div style={cardStyle}>
          <TimerReset size={18} color="#A78BFA" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>SLA-safe Turnaround</p>
          <strong style={{ color: '#C4B5FD', fontSize: 24 }}>98.7%</strong>
        </div>
        <div style={cardStyle}>
          <ShieldAlert size={18} color="#A78BFA" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>Open Risk Flags</p>
          <strong style={{ color: '#C4B5FD', fontSize: 24 }}>3</strong>
        </div>
      </div>

      <article
        style={{
          background: 'rgba(15, 23, 42, 0.62)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: 12,
          padding: 14,
        }}
      >
        <h3 style={{ marginTop: 0, color: '#E2E8F0' }}>Cross-Assistant Governance</h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#CBD5E1', fontSize: 13, lineHeight: 1.6 }}>
          <li>CONSUMES ← Linda message events, Daisy tenancy updates, Theodora finance logs</li>
          <li>FEEDS → Katherine QA runtime checks, Sofia compliance packet, Margaret sprint sign-off</li>
          <li>All critical anomalies create immutable timeline items with owner visibility</li>
        </ul>
      </article>
    </section>
  );
});

HenryRecordsCRM.displayName = 'HenryRecordsCRM';

export default HenryRecordsCRM;
