/**
 * app/properties/search/page.tsx — Properties Search & Filter (Next.js 15 App Router)
 *
 * URL-parameter driven search page for properties.
 * Supports filtering by community, propertyType, bedrooms, minPrice, maxPrice.
 *
 * Route: GET /properties/search?community=...&type=...&beds=...&minPrice=...&maxPrice=...
 */

import type { Metadata } from 'next';
import { prisma, safeQuery } from '@/lib/prisma';
import PropertySearchForm from './PropertySearchForm';

export const metadata: Metadata = {
  title: 'Search Luxury Properties Dubai | White Caves Real Estate',
  description: 'Filter and search exclusive Dubai properties by community, bedrooms, and price range.',
};

export const dynamic = 'force-dynamic';

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

interface SearchParams {
  community?: string;
  type?: string;
  beds?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}

async function searchProperties(params: SearchParams): Promise<PropertyListing[]> {
  const where: Record<string, unknown> = {};

  if (params.community && params.community !== 'All') {
    where.community = { contains: params.community, mode: 'insensitive' };
  }
  if (params.type && params.type !== 'All') {
    where.propertyType = { equals: params.type, mode: 'insensitive' };
  }
  if (params.beds && params.beds !== 'All') {
    const bedsNum = parseInt(params.beds, 10);
    if (!isNaN(bedsNum)) where.bedrooms = { gte: bedsNum };
  }
  if (params.minPrice || params.maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (params.minPrice) priceFilter.gte = parseInt(params.minPrice, 10);
    if (params.maxPrice) priceFilter.lte = parseInt(params.maxPrice, 10);
    where.price = priceFilter;
  }
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { community: { contains: params.q, mode: 'insensitive' } },
    ];
  }

  return safeQuery(
    async (db) => {
      // @ts-expect-error — model inferred at runtime
      const results = await db.property.findMany({
        where,
        take: 36,
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
    []
  );
}

export default async function PropertySearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const properties = await searchProperties(resolvedParams);

  const formatPrice = (p: number | null | undefined) =>
    p ? `AED ${p.toLocaleString()}` : 'Price on request';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: "'Inter', sans-serif" }}>

      {/* Search Header */}
      <section style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 24px' }}>
            Find Your <span style={{ color: '#EF4444' }}>Dubai Property</span>
          </h1>

          <PropertySearchForm initialParams={resolvedParams} />
        </div>
      </section>

      {/* Results Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
            {properties.length} Properties Found
          </h2>
        </div>

        {properties.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {properties.map((p) => (
              <article key={p.id} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ height: '180px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: '2.5rem' }}>🏠</span>
                  {p.status && (
                    <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#EF4444', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
                      {p.status}
                    </span>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
                    {p.title || `${p.community ?? 'Dubai'} Property`}
                  </h3>
                  <p style={{ margin: '0 0 14px', fontSize: '1.2rem', fontWeight: 800, color: '#EF4444' }}>
                    {formatPrice(p.price)}
                  </p>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>
                    {p.bedrooms != null && <span>🛏 {p.bedrooms} Bed</span>}
                    {p.bathrooms != null && <span>🚿 {p.bathrooms} Bath</span>}
                    {p.area != null && <span>📐 {p.area.toLocaleString()} sqft</span>}
                  </div>
                  <a href={`/properties/${p.id}`} style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: '8px', background: '#EF4444', color: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
                    View Property
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#94A3B8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: '#1E293B', marginBottom: '8px' }}>No Properties Matched Your Filter</h3>
            <p>Try adjusting your search criteria or resetting filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}
