import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardProperty } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const SellerListings: React.FC = () => {
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/properties?role=seller&pageSize=50');
        const json = await res.json();
        setProperties(json.data ?? json.properties ?? []);
      } catch (error) { log.warn('Failed to fetch properties:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📋 My Listings</h2>
        <p style={S.headerSubtitle}>{properties.length} active {properties.length === 1 ? 'listing' : 'listings'}</p>
      </div>
      {properties.length === 0
        ? S.emptyState('📋', 'No listings yet', 'Add your first property listing to get started.')
        : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>Price</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Views</th>
                  <th style={S.th}>Listed</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td style={S.td}>
                      <strong>{p.title}</strong>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #6b7280)' }}>📍 {p.location}</span>
                    </td>
                    <td style={S.td}>{S.formatStatus(p.type ?? '—')}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(p.price)}</td>
                    <td style={S.td}>
                      <span style={S.badge(
                        p.status === 'active' ? '#16a34a' : '#d97706',
                        p.status === 'active' ? '#dcfce7' : '#fffbeb',
                      )}>
                        {S.formatStatus(p.status)}
                      </span>
                    </td>
                    <td style={S.td}>{p.views ?? 0}</td>
                    <td style={S.td}>{S.formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

