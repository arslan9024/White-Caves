/**
 * app/properties/[id]/page.tsx — Property Detail (Next.js 15 App Router)
 *
 * SSR property detail page with full metadata, enquiry form, and
 * Prisma singleton data fetching. Falls back gracefully when DB is offline.
 *
 * Route: GET /properties/:id
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma, safeQuery } from '@/lib/prisma';
import EnquiryForm from './EnquiryForm';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertyDetail {
  id: string;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  community?: string | null;
  propertyType?: string | null;
  status?: string | null;
  images?: string[];
  agentName?: string | null;
  agentPhone?: string | null;
  agentEmail?: string | null;
  features?: string[];
  createdAt?: Date | string | null;
}

// ─── Dynamic Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) {
    return { title: 'Property Not Found | White Caves' };
  }
  const title = property.title ?? `${property.community ?? 'Dubai'} Property`;
  const price = property.price
    ? `AED ${property.price.toLocaleString()}`
    : 'Price on request';

  return {
    title: `${title} — ${price} | White Caves Real Estate`,
    description: property.description ??
      `${property.bedrooms ?? ''}BR ${property.propertyType ?? 'property'} in ${property.community ?? 'Dubai'}. ${price}. White Caves Real Estate LLC — RERA licensed.`,
    openGraph: {
      title: `${title} | White Caves Real Estate`,
      url: `https://whitecaves.ae/properties/${property.id}`,
      images: property.images?.[0]
        ? [{ url: property.images[0] }]
        : [{ url: '/og-image.jpg' }],
    },
  };
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getProperty(id: string): Promise<PropertyDetail | null> {
  return safeQuery(
    async (db) => {
      const result = await (db.property as any).findUnique({
        where: { id },
        select: {
          id: true, title: true, description: true, price: true,
          bedrooms: true, bathrooms: true, area: true,
          community: true, propertyType: true, status: true,
          images: true, features: true, createdAt: true,
          agentName: true, agentPhone: true, agentEmail: true,
        },
      });
      return result as PropertyDetail | null;
    },
    null
  );
}

// ─── Spec Badge ───────────────────────────────────────────────────────────────

function SpecBadge({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', minWidth: '120px' }}>
      <span style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{icon}</span>
      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>{value}</span>
      <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const formatPrice = (p: number | null | undefined) =>
    p ? `AED ${p.toLocaleString()}` : 'Price on Request';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '48px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" style={{ marginBottom: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</a>
            <span style={{ margin: '0 8px' }}>›</span>
            <a href="/properties" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Properties</a>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: '#FFFFFF' }}>{property.title ?? 'Property Detail'}</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {property.status && (
                <span style={{ background: '#EF4444', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block', marginBottom: '12px' }}>
                  {property.status}
                </span>
              )}
              <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
                {property.title ?? `${property.community ?? 'Dubai'} Property`}
              </h1>
              {property.community && (
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
                  📍 {property.community}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, color: '#EF4444' }}>
                {formatPrice(property.price)}
              </div>
              {property.propertyType && (
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  {property.propertyType}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Placeholder */}
      <div style={{ background: '#1E293B', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '5rem', opacity: 0.3 }}>🏠</span>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>

        {/* Left: Details */}
        <div>
          {/* Spec Row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            {property.bedrooms != null && <SpecBadge icon="🛏" label="Bedrooms" value={String(property.bedrooms)} />}
            {property.bathrooms != null && <SpecBadge icon="🚿" label="Bathrooms" value={String(property.bathrooms)} />}
            {property.area != null && <SpecBadge icon="📐" label="Sq Ft" value={property.area.toLocaleString()} />}
          </div>

          {/* Description */}
          {property.description && (
            <section aria-labelledby="desc-heading" style={{ marginBottom: '40px' }}>
              <h2 id="desc-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
                About This Property
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {property.description}
              </p>
            </section>
          )}

          {/* Features */}
          {Array.isArray(property.features) && property.features.length > 0 && (
            <section aria-labelledby="features-heading" style={{ marginBottom: '40px' }}>
              <h2 id="features-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '16px' }}>
                Key Features
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {property.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#475569' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Agent Info */}
          {property.agentName && (
            <section aria-labelledby="agent-heading" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h2 id="agent-heading" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
                Listing Agent
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
                  {property.agentName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#1E293B' }}>{property.agentName}</div>
                  {property.agentPhone && <div style={{ fontSize: '0.85rem', color: '#64748B' }}>📞 {property.agentPhone}</div>}
                  {property.agentEmail && <div style={{ fontSize: '0.85rem', color: '#64748B' }}>✉ {property.agentEmail}</div>}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right: Enquiry Form */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <EnquiryForm propertyId={property.id} propertyTitle={property.title ?? undefined} />
        </div>
      </div>
    </main>
  );
}
