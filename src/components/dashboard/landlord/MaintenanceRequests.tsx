import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import { settledJson } from '../../../utils/settledJson';
import type {
  DashboardMaintenanceRequest,
  DashboardMaintenanceStats,
} from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const MaintenanceRequests: React.FC = () => {
  const [requests, setRequests] = useState<DashboardMaintenanceRequest[]>([]);
  const [stats, setStats] = useState<DashboardMaintenanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [reqs, st] = (await settledJson(
          [authFetch('/api/maintenance?pageSize=50'), authFetch('/api/maintenance/stats')],
          [{ data: [] }, { data: null }]
        )) as [
          { data?: DashboardMaintenanceRequest[] },
          { data?: DashboardMaintenanceStats | null },
        ];
        setRequests(reqs.data ?? []);
        setStats(st.data ?? null);
      } catch (error) {
        log.warn('Failed to fetch maintenance data:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const priorityColor = (p: string) => {
    if (p === 'emergency') return { c: '#EF4444', bg: '#fef2f2' };
    if (p === 'high') return { c: '#d97706', bg: '#fffbeb' };
    if (p === 'medium') return { c: '#EF4444', bg: '#dbeafe' };
    return { c: '#6b7280', bg: '#f3f4f6' };
  };

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔧 Maintenance Requests</h2>
        <p style={S.headerSubtitle}>Track and manage property maintenance</p>
      </div>

      {stats && (
        <div style={S.statsGrid}>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.total ?? 0}</span>
            <span style={S.statLabel}>Total Requests</span>
          </div>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.open ?? 0}</span>
            <span style={S.statLabel}>🟡 Open</span>
          </div>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.inProgress ?? 0}</span>
            <span style={S.statLabel}>🔵 In Progress</span>
          </div>
          <div style={S.statCard}>
            <span style={S.statValue}>{stats.completed ?? 0}</span>
            <span style={S.statLabel}>✅ Completed</span>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        S.emptyState(
          '🔧',
          'No maintenance requests',
          'Tenant maintenance requests will appear here.'
        )
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Title</th>
                <th style={S.th}>Property</th>
                <th style={S.th}>Priority</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Cost</th>
                <th style={S.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const pc = priorityColor(r.priority ?? '');
                return (
                  <tr key={r.id}>
                    <td style={S.td}>
                      <strong>{r.title}</strong>
                    </td>
                    <td style={S.td}>{r.property?.title ?? '—'}</td>
                    <td style={S.td}>
                      <span style={S.badge(pc.c, pc.bg)}>{S.formatStatus(r.priority)}</span>
                    </td>
                    <td style={S.td}>{S.formatStatus(r.category ?? '—')}</td>
                    <td style={S.td}>
                      <span style={S.badge('#EF4444', '#dbeafe')}>{S.formatStatus(r.status)}</span>
                    </td>
                    <td style={S.td}>{r.cost ? S.formatCurrency(r.cost) : '—'}</td>
                    <td style={S.td}>{S.formatDate(r.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

