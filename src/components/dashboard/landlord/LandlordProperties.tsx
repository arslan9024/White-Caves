import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardProperty } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const LandlordProperties: React.FC = () => {
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/properties?role=landlord&pageSize=50');
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
        <h2 style={S.headerTitle}>🏘️ My Properties</h2>
        <p style={S.headerSubtitle}>
          {properties.length} rental {properties.length === 1 ? 'property' : 'properties'}
        </p>
      </div>
      {properties.length === 0 ? (
        S.emptyState(
          '🏘️',
          'No properties',
          'Add your rental properties to manage tenants and leases.'
        )
      ) : (
        <div style={S.listGrid}>
          {properties.map(p => (
            <div key={p.id} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{p.title}</h4>
                  <p style={S.headerSubtitle}>📍 {p.location}</p>
                </div>
                <span
                  style={S.badge(
                    p.status === 'active' ? '#16a34a' : '#d97706',
                    p.status === 'active' ? '#dcfce7' : '#fffbeb'
                  )}
                >
                  {S.formatStatus(p.status)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)' }}>
                <span>🛏️ {p.bedrooms ?? 0} BR</span>
                <span>📐 {p.sqft ?? '—'} sqft</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary, #C9A84C)' }}>
                  {S.formatCurrency(p.price)}/yr
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

