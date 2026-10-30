import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import { settledJson } from '../../../utils/settledJson';
import type { DashboardOwnerStats } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const OwnerOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardOwnerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [props, leads, leases] = await settledJson(
          [authFetch('/api/properties/count'), authFetch('/api/leads/count'), authFetch('/api/leases/count')],
          [{ count: 0 }, { count: 0 }, { count: 0 }],
        ) as [
          { count?: number; data?: number },
          { count?: number; data?: number },
          { count?: number; data?: number },
        ];
        setStats({
          properties: props.count ?? props.data ?? 0,
          leads: leads.count ?? leads.data ?? 0,
          leases: leases.count ?? leases.data ?? 0,
        });
      } catch (error) { log.warn('Failed to fetch overview stats:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Business Overview</h2>
        <p style={S.headerSubtitle}>White Caves Real Estate LLC — Executive Dashboard</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.properties ?? 0}</span>
          <span style={S.statLabel}>🏠 Total Properties</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.leads ?? 0}</span>
          <span style={S.statLabel}>🎯 Active Leads</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.leases ?? 0}</span>
          <span style={S.statLabel}>📝 Active Leases</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>3</span>
          <span style={S.statLabel}>🤖 AI Assistants Online</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div style={S.card}>
          <h3 style={S.cardTitle}>🤖 AI Assistants Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Nadia — WhatsApp Business API', status: 'online', icon: '💬' },
              { name: 'Nina — NLP Engine', status: 'online', icon: '🧠' },
              { name: 'Linda — WhatsApp LocalAuth', status: 'standby', icon: '🔐' },
            ].map((bot) => (
              <div key={bot.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-f3f4f6, #f3f4f6)' }}>
                <span>{bot.icon} {bot.name}</span>
                <span style={S.badge(
                  bot.status === 'online' ? '#16a34a' : '#d97706',
                  bot.status === 'online' ? '#dcfce7' : '#fffbeb',
                )}>{S.formatStatus(bot.status)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>📈 Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-f3f4f6, #f3f4f6)' }}>
              <span>Properties Listed</span>
              <strong>{stats?.properties ?? 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-f3f4f6, #f3f4f6)' }}>
              <span>Active Leads</span>
              <strong>{stats?.leads ?? 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Active Leases</span>
              <strong>{stats?.leases ?? 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
