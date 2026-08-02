/**
 * app/page.tsx — Home Route (Next.js 15 App Router)
 *
 * Entry point for the Next.js-served homepage. Incrementally replaces
 * the Vite SPA's public homepage once migration is complete.
 *
 * SEO: Full structured data + OpenGraph baked into layout.tsx.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Dubai Real Estate | White Caves Real Estate LLC',
  description:
    'Browse ultra-exclusive villas, luxury apartments, and off-plan investment opportunities across DAMAC Hills 2, Palm Jumeirah, and Downtown Dubai. RERA-licensed brokerage.',
};

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 60%, #1E293B 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Brand Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.35)',
          borderRadius: '999px',
          padding: '6px 18px',
          marginBottom: '28px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: '#EF4444',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#EF4444',
            animation: 'pulse 1.5s infinite',
            display: 'inline-block',
          }}
        />
        RERA-Licensed · Dubai Land Dept 2026
      </div>

      {/* Heading */}
      <h1
        id="hero-heading"
        style={{
          fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.1,
          maxWidth: '820px',
          margin: '0 0 20px',
          letterSpacing: '-1.5px',
        }}
      >
        Luxury Dubai Real Estate{' '}
        <span style={{ color: '#EF4444' }}>Redefined</span>
      </h1>

      <p
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: '600px',
          lineHeight: 1.7,
          margin: '0 0 40px',
        }}
      >
        Ultra-exclusive villas in DAMAC Hills 2, Palm Jumeirah, and Downtown Dubai.
        White Caves Real Estate LLC — your trusted partner in premium property investment.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="/properties"
          id="hero-cta-explore"
          style={{
            background: '#EF4444',
            color: '#FFFFFF',
            padding: '14px 32px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          Explore Featured Properties
        </a>
        <a
          href="/contact"
          id="hero-cta-contact"
          style={{
            background: 'transparent',
            color: '#FFFFFF',
            padding: '14px 32px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
        >
          Speak with an Expert Broker
        </a>
      </div>

      <style>{`
        @keyframes pulse {
          0%   { opacity: 1; transform: scale(1); }
          50%  { opacity: 0.5; transform: scale(1.3); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
