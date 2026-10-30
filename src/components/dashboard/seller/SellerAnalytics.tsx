import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import { settledJson } from '../../../utils/settledJson';
import type { DashboardProperty, DashboardOffer } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const SellerAnalytics: React.FC = () => {
  const [stats, setStats] = useState({ totalListings: 0, totalOffers: 0, avgPrice: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [props, offs] = await settledJson(
          [authFetch('/api/properties?role=seller'), authFetch('/api/offers?role=seller')],
          [{ data: [] }, { data: [] }],
        ) as [
          { data?: DashboardProperty[]; properties?: DashboardProperty[] },
          { data?: DashboardOffer[] },
        ];

        const propList: DashboardProperty[] = props.data ?? props.properties ?? [];
        const offList: DashboardOffer[] = offs.data ?? [];
        const prices = propList
          .map((p) => Number(p.price ?? 0))
          .filter((price) => Number.isFinite(price) && price > 0);
        const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
        const accepted = offList.filter((o) => o.status === 'accepted').length;

        setStats({
          totalListings: propList.length,
          totalOffers: offList.length,
          avgPrice: avg,
          conversionRate: offList.length > 0 ? Math.round((accepted / offList.length) * 100) : 0,
        });
      } catch (error) { log.warn('Failed to fetch seller analytics:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Seller Analytics</h2>
        <p style={S.headerSubtitle}>Performance metrics for your listings</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.totalListings}</span>
          <span style={S.statLabel}>📋 Total Listings</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.totalOffers}</span>
          <span style={S.statLabel}>🤝 Offers Received</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(stats.avgPrice)}</span>
          <span style={S.statLabel}>💰 Avg Listing Price</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.conversionRate}%</span>
          <span style={S.statLabel}>✅ Offer Acceptance Rate</span>
        </div>
      </div>
    </div>
  );
};
