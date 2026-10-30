/**
 * FounderHeroBanner.tsx
 * Sovereign Founder Hero Banner displaying Level 7 Sovereign Access, DET/RERA/Ejari statutory credentials,
 * and AI Zoe Chief AI Assistant live status telemetry card.
 */

import React, { FC } from 'react';

export const FounderHeroBanner: FC = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        borderRadius: '20px',
        padding: '2rem',
        color: '#FFFFFF',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '1.75rem',
      }}
    >
      {/* Subtle Decorative Luxury Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Level 7 (Ultimate Sovereign Access)
            </span>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              Office of the Managing Director (MD Suite) — Floor 13
            </span>
          </div>

          <h1 style={{ margin: '0 0 8px 0', fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
            👑 Arslan Malik Bashir Ahmad
          </h1>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#CBD5E1', maxWidth: '650px', lineHeight: 1.5 }}>
            Founder & Managing Director — White Caves Real Estate LLC. Supreme command over global investments,
            the 1-12-108 AI grid, and Dubai luxury property assets.
          </p>

          {/* Official Statutory Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#F1F5F9' }}>
              📜 DET License: <strong>1388443</strong>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#F1F5F9' }}>
              🏛️ RERA ORN: <strong>44483</strong>
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#F1F5F9' }}>
              🏢 Ejari: <strong>0120250814005322</strong>
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#6EE7B7' }}>
              🛡️ LLC - Single Owner (SO)
            </span>
          </div>
        </div>

        {/* AI Zoe Strategic Executive Telemetry Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '1.25rem',
            minWidth: '280px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🤖 AI Zoe (Chief AI Assistant)
            </span>
            <span style={{ background: '#10B981', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
              ONLINE
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#E2E8F0', lineHeight: 1.4, marginBottom: '10px' }}>
            "Good day, Managing Director Arslan. All 12 departments are operating at peak efficiency. 108 supervisors are synchronized with 0 open compliance blockers."
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
            <span>15-Min SLA: <strong style={{ color: '#10B981' }}>100%</strong></span>
            <span>1-12-108 Mesh: <strong style={{ color: '#60A5FA' }}>121 Active</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderHeroBanner;

