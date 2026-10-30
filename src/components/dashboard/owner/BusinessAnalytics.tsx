import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardFinanceAnalytics } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const BusinessAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardFinanceAnalytics | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/finance/analytics');
        const json = await res.json();
        setData(json.data);
      } catch (error) { log.warn('Failed to fetch analytics data:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📈 Business Analytics</h2>
        <p style={S.headerSubtitle}>Revenue, performance, and market data</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(data?.totalRevenue ?? 0)}</span>
          <span style={S.statLabel}>💰 Total Revenue</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(data?.monthlyRevenue ?? 0)}</span>
          <span style={S.statLabel}>📅 Monthly Revenue</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{data?.occupancyRate ?? '—'}%</span>
          <span style={S.statLabel}>🏠 Occupancy Rate</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{data?.avgDaysToLease ?? '—'}</span>
          <span style={S.statLabel}>⏱️ Avg Days to Lease</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📊 Key Metrics</h3>
        <p style={{ color: 'var(--text-secondary, #6b7280)' }}>
          Detailed revenue charts and market analysis will render here when chart library integration is enabled.
          Data is available via <code>/api/finance/analytics</code>.
        </p>
      </div>
    </div>
  );
};
