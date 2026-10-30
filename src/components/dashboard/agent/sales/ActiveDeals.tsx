import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardOffer } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const ActiveDeals: React.FC = () => {
  const [offers, setOffers] = useState<DashboardOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers?status=accepted,negotiation,closing&pageSize=50');
        const json = await res.json();
        setOffers(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch active deals:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const totalValue = offers.reduce((sum, o) => sum + (o.amount ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🤝 Active Deals</h2>
        <p style={S.headerSubtitle}>
          {offers.length} active — {S.formatCurrency(totalValue)}
        </p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{offers.length}</span>
          <span style={S.statLabel}>🤝 Active Deals</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalValue)}</span>
          <span style={S.statLabel}>💰 Pipeline Value</span>
        </div>
      </div>

      {offers.length === 0 ? (
        S.emptyState('🤝', 'No active deals', 'Active deals will appear as offers are accepted.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Buyer</th>
                <th style={S.th}>Offer Amount</th>
                <th style={S.th}>Stage</th>
                <th style={S.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id}>
                  <td style={S.td}>{o.property?.title ?? '—'}</td>
                  <td style={S.td}>{o.buyer?.name ?? o.user?.name ?? '—'}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(o.amount)}</td>
                  <td style={S.td}>
                    <span style={S.badge('#EF4444', '#dbeafe')}>{S.formatStatus(o.status)}</span>
                  </td>
                  <td style={S.td}>{S.formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
