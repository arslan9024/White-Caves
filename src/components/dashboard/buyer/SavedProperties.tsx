import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardFavorite } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const SavedProperties: React.FC = () => {
  const [properties, setProperties] = useState<DashboardFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/favorites?pageSize=50');
        const json = await res.json();
        setProperties(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch saved properties:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💾 Saved Properties</h2>
        <p style={S.headerSubtitle}>
          {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}
        </p>
      </div>
      {properties.length === 0 ? (
        S.emptyState(
          '💾',
          'No saved properties',
          'Browse listings and tap the heart icon to save properties here.'
        )
      ) : (
        <div style={S.listGrid}>
          {properties.map(fav => (
            <div key={fav.id} style={S.card}>
              <h4 style={{ margin: 0 }}>{fav.property?.title ?? 'Property'}</h4>
              <p style={S.headerSubtitle}>📍 {fav.property?.location ?? '—'}</p>
              <p style={{ fontWeight: 600, color: 'var(--color-primary, #E31E24)' }}>
                {S.formatCurrency(fav.property?.price)}
              </p>
              {fav.property?.bedrooms != null && (
                <span style={S.badge('#6b7280', '#f3f4f6')}>
                  🛏️ {fav.property.bedrooms} BR · 🚿 {fav.property.bathrooms ?? 0}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
