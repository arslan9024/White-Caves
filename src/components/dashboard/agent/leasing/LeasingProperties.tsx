import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardProperty } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const LeasingProperties: React.FC = () => {
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/properties?type=rent&pageSize=50');
        const json = await res.json();
        setProperties(json.data ?? json.properties ?? []);
      } catch (error) {
        log.warn('Failed to fetch properties:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🏠 Leasing Properties</h2>
        <p style={S.headerSubtitle}>{properties.length} rental listings</p>
      </div>
      {properties.length === 0 ? (
        S.emptyState('🏠', 'No rental properties', 'Add rental properties to start leasing.')
      ) : (
        <div style={S.listGrid}>
          {properties.map(p => (
            <div key={p.id} style={S.card}>
              <h4 style={{ margin: '0 0 0.25rem 0' }}>{p.title}</h4>
              <p style={{ ...S.headerSubtitle, margin: 0 }}>📍 {p.location}</p>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#6b7280',
                }}
              >
                <span>🛏️ {p.bedrooms ?? 0} BR</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary, #E31E24)' }}>
                  {S.formatCurrency(p.price)}/yr
                </span>
                <span
                  style={S.badge(
                    p.status === 'available' ? '#16a34a' : '#d97706',
                    p.status === 'available' ? '#dcfce7' : '#fffbeb'
                  )}
                >
                  {S.formatStatus(p.status ?? 'available')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

