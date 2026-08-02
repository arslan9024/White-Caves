/**
 * app/crm/leads/page.tsx — CRM Lead Management Dashboard (Next.js 15 App Router)
 *
 * SSR Lead Management table displaying active pipeline leads from Prisma.
 * Protected by middleware.ts (/crm/* matcher).
 *
 * Route: GET /crm/leads
 */

import type { Metadata } from 'next';
import { prisma, safeQuery } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'CRM Lead Management | White Caves Real Estate',
  description: 'Manage sales leads, lead scoring, and customer enquiries.',
};

export const dynamic = 'force-dynamic';

interface LeadItem {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  source?: string | null;
  budget?: number | null;
  createdAt?: Date | null;
}

async function getLeads(): Promise<LeadItem[]> {
  return safeQuery(
    async (db) => {
      // @ts-expect-error — model inferred at runtime
      const leads = await db.lead.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          source: true,
          budget: true,
          createdAt: true,
        },
      });
      return leads as LeadItem[];
    },
    []
  );
}

export default async function CrmLeadsPage() {
  const leads = await getLeads();

  const getStatusColor = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case 'new': return { bg: 'rgba(59, 130, 246, 0.1)', fg: '#3B82F6' };
      case 'contacted': return { bg: 'rgba(234, 179, 8, 0.1)', fg: '#EAB308' };
      case 'closed': case 'won': return { bg: 'rgba(34, 197, 94, 0.1)', fg: '#22C55E' };
      default: return { bg: 'rgba(239, 68, 68, 0.1)', fg: '#EF4444' };
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-f8fafc, #F8FAFC)', padding: '32px 24px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Dashboard Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-1e293b, #1E293B)', margin: 0 }}>
              CRM Lead Management
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary, #64748B)', fontSize: '0.9rem' }}>
              Real-time lead pipeline synced with DLD & WhatsApp Assistant
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ padding: '8px 16px', background: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
              {leads.length} Total Leads
            </span>
          </div>
        </header>

        {/* Leads Table Card */}
        <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-f1f5f9, #F1F5F9)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', color: 'var(--color-475569, #475569)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '14px 20px' }}>Name / Contact</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px' }}>Source</th>
                <th style={{ padding: '14px 20px' }}>Budget</th>
                <th style={{ padding: '14px 20px' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map((l) => {
                  const statusStyle = getStatusColor(l.status);
                  return (
                    <tr key={l.id} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>{l.name || 'Anonymous Lead'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>{l.email || l.phone || 'No contact info'}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '20px', backgroundColor: statusStyle.bg, color: statusStyle.fg, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          {l.status || 'NEW'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-475569, #475569)', fontSize: '0.85rem' }}>
                        {l.source || 'Website'}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-red, #EF4444)' }}>
                        {l.budget ? `AED ${l.budget.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.8rem' }}>
                        {l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'var(--color-94a3b8, #94A3B8)' }}>
                    No leads recorded yet in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
