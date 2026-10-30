import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardSavedSearch } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const PriceAlerts: React.FC = () => {
  const [searches, setSearches] = useState<DashboardSavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/saved-searches');
        const json = await res.json();
        setSearches((json.data ?? []).filter((s: DashboardSavedSearch) => s.alertEnabled));
      } catch (error) {
        log.warn('Failed to fetch saved searches:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔔 Price Alerts</h2>
        <p style={S.headerSubtitle}>Get notified when properties match your criteria</p>
      </div>
      {searches.length === 0 ? (
        S.emptyState(
          '🔔',
          'No price alerts active',
          'Enable alerts on your saved searches to track price changes.'
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {searches.map(s => (
            <div key={s.id} style={S.card}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <h4 style={{ margin: 0 }}>{s.name}</h4>
                  <p style={S.headerSubtitle}>
                    {s.filters?.type ?? 'Any type'} · {s.filters?.location ?? 'Any location'}
                    {s.filters?.bedrooms ? ` · ${s.filters.bedrooms} BR` : ''}
                  </p>
                </div>
                <span style={S.badge('#16a34a', '#dcfce7')}>{s.matchCount} matches</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

