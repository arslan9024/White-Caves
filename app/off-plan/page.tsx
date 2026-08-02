/**
 * app/off-plan/page.tsx — Off-Plan Projects Showcase (Next.js 15 App Router)
 *
 * Displays Dubai off-plan developments (DAMAC, Emaar, Nakheel).
 * SSR powered with Prisma safeQuery fallback.
 *
 * Route: GET /off-plan
 */

import type { Metadata } from 'next';
import { prisma, safeQuery } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Dubai Off-Plan Projects | White Caves Real Estate',
  description: 'Explore new off-plan villa and apartment launches in DAMAC Hills 2, Palm Jebel Ali, and Downtown Dubai.',
  openGraph: {
    title: 'Dubai Off-Plan Projects | White Caves Real Estate',
    description: 'Exclusive off-plan investment opportunities with flexible payment plans.',
  },
};

export const dynamic = 'force-dynamic';

interface OffPlanProject {
  id: string;
  name?: string | null;
  developer?: string | null;
  location?: string | null;
  startingPrice?: number | null;
  completionDate?: string | null;
  paymentPlan?: string | null;
  status?: string | null;
}

async function getOffPlanProjects(): Promise<OffPlanProject[]> {
  return safeQuery(
    async (db) => {
      // @ts-expect-error — model inferred at runtime
      const projects = await db.offPlanProject.findMany({
        take: 12,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          developer: true,
          location: true,
          startingPrice: true,
          completionDate: true,
          paymentPlan: true,
          status: true,
        },
      });
      return projects as OffPlanProject[];
    },
    [
      {
        id: 'proj-1',
        name: 'Violet at DAMAC Hills 2',
        developer: 'DAMAC Properties',
        location: 'DAMAC Hills 2, Dubai',
        startingPrice: 1870000,
        completionDate: 'Q2 2026',
        paymentPlan: '60/40 Payment Plan',
        status: 'NEW LAUNCH',
      },
      {
        id: 'proj-2',
        name: 'Camelia Townhouses',
        developer: 'DAMAC Properties',
        location: 'DAMAC Hills 2, Dubai',
        startingPrice: 1600000,
        completionDate: 'Q4 2025',
        paymentPlan: '70/30 Payment Plan',
        status: 'UNDER CONSTRUCTION',
      },
    ]
  );
}

export default async function OffPlanPage() {
  const projects = await getOffPlanProjects();

  const formatPrice = (p: number | null | undefined) =>
    p ? `AED ${p.toLocaleString()}` : 'Price on Request';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-f8fafc, #F8FAFC)', fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '64px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '999px', padding: '6px 18px', marginBottom: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red, #EF4444)', textTransform: 'uppercase' }}>
          ✨ Exclusive Developer Direct Access
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, color: 'var(--white, #FFFFFF)', margin: '0 0 12px', letterSpacing: '-1px' }}>
          Dubai <span style={{ color: 'var(--accent-red, #EF4444)' }}>Off-Plan</span> Launches
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Invest early in high-ROI residential communities with flexible post-handover payment plans.
        </p>
      </section>

      {/* Project Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '28px' }}>
          {projects.map((proj) => (
            <article key={proj.id} style={{ background: 'var(--white, #FFFFFF)', borderRadius: '16px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>

              {/* Cover Banner */}
              <div style={{ height: '220px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                {proj.status && (
                  <span style={{ alignSelf: 'flex-start', background: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {proj.status}
                  </span>
                )}
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-red, #EF4444)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {proj.developer || 'Developer Project'}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: 'var(--white, #FFFFFF)' }}>
                    {proj.name}
                  </h3>
                </div>
              </div>

              {/* Project Metadata */}
              <div style={{ padding: '24px' }}>
                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-secondary, #64748B)' }}>
                  📍 {proj.location || 'Dubai, UAE'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', background: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', marginBottom: '20px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', fontWeight: 700 }}>Starting Price</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-red, #EF4444)' }}>{formatPrice(proj.startingPrice)}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', fontWeight: 700 }}>Completion</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>{proj.completionDate || 'TBA'}</span>
                  </div>
                </div>

                {proj.paymentPlan && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-475569, #475569)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-red, #EF4444)', fontWeight: 700 }}>💳</span> {proj.paymentPlan}
                  </div>
                )}

                <a
                  href={`/properties/search?q=${encodeURIComponent(proj.name || '')}`}
                  style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '10px', background: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  Explore Available Units →
                </a>
              </div>

            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
