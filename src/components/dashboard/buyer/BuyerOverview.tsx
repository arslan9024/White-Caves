import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import { settledJson } from '../../../utils/settledJson';
import type { DashboardViewing } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const BuyerOverview: React.FC = () => {
  const [stats, setStats] = useState({ favorites: 0, viewings: 0, offers: 0, savedSearches: 0 });
  const [recentViewings, setRecentViewings] = useState<DashboardViewing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fav, view, off, sSearch] = (await settledJson(
          [
            authFetch('/api/favorites/ids'),
            authFetch('/api/viewings?pageSize=5'),
            authFetch('/api/offers?role=buyer&pageSize=5'),
            authFetch('/api/saved-searches'),
          ],
          [{ data: [] }, { data: [] }, { data: [] }, { data: [] }]
        )) as [
          { data?: unknown[] },
          { data?: DashboardViewing[]; pagination?: { total?: number } },
          { data?: unknown[]; pagination?: { total?: number } },
          { data?: unknown[] },
        ];

        setStats({
          favorites: fav.data?.length ?? 0,
          viewings: view.pagination?.total ?? view.data?.length ?? 0,
          offers: off.pagination?.total ?? off.data?.length ?? 0,
          savedSearches: sSearch.data?.length ?? 0,
        });
        setRecentViewings(view.data?.slice?.(0, 5) ?? []);
      } catch (error) {
        log.warn('Failed to fetch buyer stats:', error);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🏠 Buyer Dashboard</h2>
        <p style={S.headerSubtitle}>Your property search at a glance</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.favorites}</span>
          <span style={S.statLabel}>❤️ Favorites</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.viewings}</span>
          <span style={S.statLabel}>👁️ Scheduled Viewings</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.offers}</span>
          <span style={S.statLabel}>💰 Active Offers</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats.savedSearches}</span>
          <span style={S.statLabel}>🔍 Saved Searches</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📅 Upcoming Viewings</h3>
        {recentViewings.length === 0 ? (
          <p style={S.headerSubtitle}>No upcoming viewings scheduled.</p>
        ) : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentViewings.map(v => (
                  <tr key={v.id}>
                    <td style={S.td}>{v.property?.title ?? v.propertyId}</td>
                    <td style={S.td}>{S.formatDate(v.scheduledAt)}</td>
                    <td style={S.td}>
                      <span style={S.badge('#EF4444', '#dbeafe')}>{S.formatStatus(v.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

