import React, { memo } from 'react';
import { MessageSquare, PhoneCall, ShieldCheck, Workflow } from 'lucide-react';

const statCardStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.62)',
  border: '1px solid rgba(37, 211, 102, 0.28)',
  borderRadius: 12,
  padding: 14,
  minHeight: 92,
};

const LindaWhatsAppCRM = memo(() => {
  return (
    <section aria-label="Linda WhatsApp CRM" style={{ display: 'grid', gap: 16 }}>
      <header
        style={{
          background: 'linear-gradient(135deg, rgba(37,211,102,0.18), rgba(15,23,42,0.72))',
          border: '1px solid rgba(37, 211, 102, 0.32)',
          borderRadius: 14,
          padding: 16,
        }}
      >
        <h2 style={{ margin: 0, color: '#ECFDF5' }}>Linda — WhatsApp Command Hub</h2>
        <p style={{ margin: '8px 0 0 0', color: '#A7F3D0', fontSize: 13 }}>
          Internal command center for chat routing, lead intake quality, and conversation handoffs.
          Mounted directly in White Caves with no external runtime dependency.
        </p>
      </header>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div style={statCardStyle}>
          <MessageSquare size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>Active Conversations</p>
          <strong style={{ color: '#86EFAC', fontSize: 24 }}>42</strong>
        </div>
        <div style={statCardStyle}>
          <PhoneCall size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>Handoffs to Sales</p>
          <strong style={{ color: '#86EFAC', fontSize: 24 }}>17</strong>
        </div>
        <div style={statCardStyle}>
          <Workflow size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>Automation Flows</p>
          <strong style={{ color: '#86EFAC', fontSize: 24 }}>11</strong>
        </div>
        <div style={statCardStyle}>
          <ShieldCheck size={18} color="#34D399" />
          <p style={{ margin: '8px 0 0 0', color: '#E2E8F0', fontWeight: 600 }}>Policy Compliance</p>
          <strong style={{ color: '#86EFAC', fontSize: 24 }}>99.1%</strong>
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
        <h3 style={{ marginTop: 0, color: '#E2E8F0' }}>Collaboration Contracts</h3>
        <ul style={{ margin: 0, paddingLeft: 18, color: '#CBD5E1', fontSize: 13, lineHeight: 1.6 }}>
          <li>CONSUMES ← Nina conversation intents, Mary inventory snapshots</li>
          <li>FEEDS → Clara lead qualification stream, Henry immutable audit events</li>
          <li>Fallback rule: if confidence &lt; 70%, route to human agent queue in under 2 minutes</li>
        </ul>
      </article>
    </section>
  );
});

LindaWhatsAppCRM.displayName = 'LindaWhatsAppCRM';

export default LindaWhatsAppCRM;
