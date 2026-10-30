import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardOffer } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const SalesPipeline: React.FC = () => {
  const [offers, setOffers] = useState<DashboardOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers?pageSize=100');
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch offers:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const stages = ['new', 'negotiation', 'accepted', 'closing', 'completed'];
  const grouped = stages.map(s => ({
    stage: s,
    items: offers.filter(o => o.status === s),
  }));
  const totalValue = offers.reduce((sum, o) => sum + (o.amount ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Sales Pipeline</h2>
        <p style={S.headerSubtitle}>
          {offers.length} deals — {S.formatCurrency(totalValue)} total value
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${stages.length}, minmax(200px, 1fr))`,
          gap: '0.75rem',
          overflowX: 'auto',
        }}
      >
        {grouped.map(g => (
          <div
            key={g.stage}
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '0.75rem',
              minHeight: '200px',
            }}
          >
            <h4
              style={{
                textTransform: 'capitalize',
                fontSize: '0.85rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              {g.stage} ({g.items.length})
            </h4>
            {g.items.map(o => (
              <div key={o.id} style={{ ...S.card, marginBottom: '0.5rem', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>{o.property?.title ?? '—'}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #6b7280)', margin: '0.25rem 0 0 0' }}>
                  {S.formatCurrency(o.amount)}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

