import React, { useEffect, useState, useMemo, FC } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import { useTranslation, Text } from '../../../../context/TranslationContext';
import { CurrencyViewer } from '../../../ui/CurrencyViewer';
import type { DashboardLease } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export interface LeasingPipelineProps {}

export const LeasingPipeline: FC<LeasingPipelineProps> = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?pageSize=100');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch leases:', error);
      }
      setLoading(false);
    })();
  }, []);

  const grouped = useMemo(() => {
    const stages = ['inquiry', 'viewing', 'application', 'contract', 'signed', 'active'];
    return stages.map(s => ({
      stage: s,
      items: leases.filter(l => l.stage === s || l.status === s),
    }));
  }, [leases]);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>
          📊 <Text tid="agent.leasing.pipeline" />
        </h2>
        <p style={S.headerSubtitle}>
          {t('agent.leasing.active_transactions').replace('{count}', leases.length.toString())}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grouped.length}, minmax(200px, 1fr))`,
          gap: '0.75rem',
          overflowX: 'auto',
        }}
      >
        {grouped.map(g => (
          <div
            key={g.stage}
            style={{
              background: 'var(--bg-secondary, #f9fafb)',
              borderRadius: '12px',
              padding: '0.75rem',
              minHeight: '200px',
            }}
          >
            <h4
              style={{
                textTransform: 'capitalize',
                fontSize: '0.85rem',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary, #6b7280)',
              }}
            >
              <Text tid={`agent.leasing.${g.stage}`} /> ({g.items.length})
            </h4>
            {g.items.map(l => (
              <div key={l.id} style={{ ...S.card, marginBottom: '0.5rem', padding: '0.75rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>
                  {l.property?.title ?? l.propertyId ?? '—'}
                </strong>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary, #6b7280)',
                    margin: '0.25rem 0 0 0',
                  }}
                >
                  {l.tenant?.name ?? <Text tid="agent.leasing.pending" />} —{' '}
                  <CurrencyViewer value={l.monthlyRent ?? 0} />
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
