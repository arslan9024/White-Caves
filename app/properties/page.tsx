/**
 * app/properties/page.tsx — Properties Listing (Next.js 15 App Router)
 *
 * First real App Router route migrated from Vite SPA.
 * Uses Prisma singleton for SSR data fetching — no client-side fetch waterfall.
 *
 * Route: GET /properties
 * Rendering: Dynamic SSR (reads DB per request for live inventory)
 */

import type { Metadata } from 'next';
import { prisma, safeQuery } from '@/lib/prisma';

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Luxury Properties Dubai | White Caves Real Estate',
  description:
    'Browse ultra-exclusive villas, luxury apartments, and off-plan investment opportunities in DAMAC Hills 2, Palm Jumeirah, and Downtown Dubai.',
  openGraph: {
    title: 'Luxury Properties Dubai | White Caves Real Estate',
    description: 'Ultra-exclusive Dubai real estate — RERA-licensed brokerage.',
    url: 'https://whitecaves.ae/properties',
  },
};

// ─── Force dynamic rendering (live DB data) ───────────────────────────────────
export const dynamic = 'force-dynamic';

// ─── Data Fetching ────────────────────────────────────────────────────────────

interface PropertyListing {
  id: string;
  title?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  community?: string | null;
  propertyType?: string | null;
  status?: string | null;
  images?: string[];
}

async function getProperties(): Promise<PropertyListing[]> {
  return safeQuery(
    async (db) => {
      const results = await (db.property as any).findMany({
        take: 24,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          price: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          community: true,
          propertyType: true,
          status: true,
          images: true,
        },
      });
      return results as PropertyListing[];
    },
    [] // fallback: empty array when DB is offline
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PropertyCard({ property }: { property: PropertyListing }) {
  const formatPrice = (price: number | null | undefined) =>
    price ? `AED ${price.toLocaleString()}` : 'Price on request';

  return (
    <article
      style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Image Placeholder */}
      <div
        style={{
          height: '200px',
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '2.5rem' }}>🏠</span>
        {property.status && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: '#EF4444',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {property.status}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h3
          style={{
            margin: '0 0 6px',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1E293B',
            lineHeight: 1.3,
          }}
        >
          {property.title || `${property.community ?? 'Dubai'} Property`}
        </h3>

        <p
          style={{
            margin: '0 0 14px',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#EF4444',
          }}
        >
          {formatPrice(property.price)}
        </p>

        {/* Spec Row */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '0.82rem',
            color: '#64748B',
            marginBottom: '16px',
          }}
        >
          {property.bedrooms != null && (
            <span>🛏 {property.bedrooms} Bed</span>
          )}
          {property.bathrooms != null && (
            <span>🚿 {property.bathrooms} Bath</span>
          )}
          {property.area != null && (
            <span>📐 {property.area.toLocaleString()} sqft</span>
          )}
        </div>

        {property.community && (
          <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#94A3B8' }}>
            📍 {property.community}
          </p>
        )}

        <a
          href={`/properties/${property.id}`}
          id={`property-view-${property.id}`}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px',
            borderRadius: '8px',
            background: '#EF4444',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'opacity 0.15s ease',
          }}
        >
          View Property
        </a>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '80px 24px',
        color: '#94A3B8',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏙️</div>
      <h2 style={{ color: '#1E293B', marginBottom: '8px' }}>
        Properties Loading Soon
      </h2>
      <p style={{ fontSize: '0.95rem' }}>
        Our live Dubai inventory is being synced from DLD. Check back shortly.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          padding: '64px 24px 48px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: '999px',
            padding: '6px 18px',
            marginBottom: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent-red, #EF4444)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-red, #EF4444)',
              display: 'inline-block',
            }}
          />
          Live DLD Inventory · RERA Licensed
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 900,
            color: 'var(--white, #FFFFFF)',
            margin: '0 0 12px',
            letterSpacing: '-1px',
          }}
        >
          Dubai Luxury <span style={{ color: 'var(--accent-red, #EF4444)' }}>Properties</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', margin: 0 }}>
          {properties.length > 0
            ? `${properties.length} exclusive listings available`
            : 'Live inventory syncing with Dubai Land Department'}
        </p>
      </section>

      {/* Properties Grid */}
      <section
        aria-label="Property listings"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {properties.length > 0 ? (
            properties.map((p) => <PropertyCard key={p.id} property={p} />)
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </main>
  );
}
