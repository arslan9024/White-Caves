import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer style={{ backgroundColor: 'var(--wc-surface-dark, #0F172A)', color: 'var(--wc-text-inverse, #FFFFFF)', paddingTop: '60px', paddingBottom: '30px', borderTop: '2px solid var(--wc-red-primary, #EF4444)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
        {/* Column 1: Corporate Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--wc-red-primary, #EF4444)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--wc-text-inverse, #FFFFFF)' }}>WC</div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px' }}>WHITE CAVES</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--wc-text-muted, #94A3B8)', lineHeight: '1.6', marginBottom: '20px' }}>
            Dubai's premier luxury real estate agency delivering high-yield secondary market, off-plan, and property management portfolios.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', color: 'var(--wc-red-primary, #EF4444)', fontSize: '11px', fontWeight: 'bold' }}>
            <ShieldCheck size={14} /> RERA License #108920
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--wc-text-inverse, #FFFFFF)', marginBottom: '16px', borderBottom: '1px solid var(--wc-border-dark, #334155)', paddingBottom: '8px' }}>Properties</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--wc-text-light, #CBD5E1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="/sales" style={{ color: 'inherit', textDecoration: 'none' }}>Luxury Villas</a></li>
            <li><a href="/offplan" style={{ color: 'inherit', textDecoration: 'none' }}>Off-Plan Developments</a></li>
            <li><a href="/leasing" style={{ color: 'inherit', textDecoration: 'none' }}>Penthouses & Apartments</a></li>
            <li><a href="/damac-hills-2" style={{ color: 'inherit', textDecoration: 'none' }}>DAMAC Hills 2 Cluster</a></li>
            <li><a href="/palm-jumeirah" style={{ color: 'inherit', textDecoration: 'none' }}>Palm Jumeirah Resales</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--wc-text-inverse, #FFFFFF)', marginBottom: '16px', borderBottom: '1px solid var(--wc-border-dark, #334155)', paddingBottom: '8px' }}>Contact Head Office</h4>
          <div style={{ fontSize: '13px', color: 'var(--wc-text-light, #CBD5E1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color="var(--wc-red-primary, #EF4444)" />
              <span>Level 42, Marina Plaza, Dubai Marina, UAE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={16} color="var(--wc-red-primary, #EF4444)" />
              <span>+971 4 800 94483 (WHITE)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={16} color="var(--wc-red-primary, #EF4444)" />
              <span>vip@whitecaves.ae</span>
            </div>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--wc-text-inverse, #FFFFFF)', marginBottom: '16px', borderBottom: '1px solid var(--wc-border-dark, #334155)', paddingBottom: '8px' }}>Dubai Market Intelligence</h4>
          <p style={{ fontSize: '12px', color: 'var(--wc-text-muted, #94A3B8)', marginBottom: '12px' }}>
            Subscribe to receive quarterly RERA price index reports & high-yield investment digests.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              placeholder="Enter investor email..."
              style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--wc-border-dark, #334155)', backgroundColor: 'var(--wc-text-primary, #1E293B)', color: 'var(--wc-text-inverse, #FFFFFF)', fontSize: '12px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '10px 16px', backgroundColor: 'var(--wc-red-primary, #EF4444)', color: 'var(--wc-text-inverse, #FFFFFF)', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
              Join
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '40px auto 0 auto', padding: '20px 24px 0 24px', borderTop: '1px solid var(--wc-text-primary, #1E293B)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)' }}>
        <div>© 2026 White Caves Real Estate LLC. All rights reserved. Registered under Dubai Land Department (DLD).</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/rera-disclaimer" style={{ color: 'inherit', textDecoration: 'none' }}>RERA Disclaimer</a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
