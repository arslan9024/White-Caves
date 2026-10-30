import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardAgentStats } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const AgentPerformance: React.FC = () => {
  const [stats, setStats] = useState<DashboardAgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/offers/stats');
        const json = await res.json();
        setStats(json.data);
      } catch (error) {
        log.warn('Failed to fetch agent stats:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📈 Agent Performance</h2>
        <p style={S.headerSubtitle}>Your sales metrics and achievements</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.totalDeals ?? 0}</span>
          <span style={S.statLabel}>🤝 Total Deals</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(stats?.totalVolume ?? 0)}</span>
          <span style={S.statLabel}>💰 Total Volume</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.closedThisMonth ?? 0}</span>
          <span style={S.statLabel}>📅 Closed This Month</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.conversionRate ?? '—'}%</span>
          <span style={S.statLabel}>📊 Conversion Rate</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>🏆 Monthly Target</h3>
        <div
          style={{
            background: '#f3f4f6',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '24px',
            marginTop: '0.5rem',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(((stats?.closedThisMonth ?? 0) / (stats?.monthlyTarget ?? 10)) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #E31E24, #B8860B)',
              borderRadius: '8px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', marginTop: '0.5rem' }}>
          {stats?.closedThisMonth ?? 0} / {stats?.monthlyTarget ?? 10} deals closed
        </p>
      </div>
    </div>
  );
};
