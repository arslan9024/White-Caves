import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardViewing } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const LeasingViewings: React.FC = () => {
  const [viewings, setViewings] = useState<DashboardViewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<DashboardViewing[]>([]);
  const [past, setPast] = useState<DashboardViewing[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/viewings?pageSize=50');
        const json = await res.json();
        setViewings(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch viewings:', error);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const compute = async () => {
      const now = Date.now();
      setUpcoming(
        viewings.filter(v => {
          const ts = v.scheduledDate ? Date.parse(String(v.scheduledDate)) : 0;
          return ts >= now;
        })
      );
      setPast(
        viewings.filter(v => {
          const ts = v.scheduledDate ? Date.parse(String(v.scheduledDate)) : 0;
          return ts < now;
        })
      );
    };
    compute();
  }, [viewings]);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>👁️ Property Viewings</h2>
        <p style={S.headerSubtitle}>
          {upcoming.length} upcoming, {past.length} completed
        </p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{upcoming.length}</span>
          <span style={S.statLabel}>📅 Upcoming</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{past.length}</span>
          <span style={S.statLabel}>✅ Completed</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{viewings.length}</span>
          <span style={S.statLabel}>📊 Total</span>
        </div>
      </div>

      {viewings.length === 0 ? (
        S.emptyState(
          '👁️',
          'No viewings scheduled',
          'Schedule viewings to show properties to prospective tenants.'
        )
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Client</th>
                <th style={S.th}>Date & Time</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {viewings.map(v => (
                <tr key={v.id}>
                  <td style={S.td}>{v.property?.title ?? '—'}</td>
                  <td style={S.td}>{v.lead?.name ?? v.user?.name ?? '—'}</td>
                  <td style={S.td}>{S.formatDate(v.scheduledDate)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        v.status === 'confirmed'
                          ? '#16a34a'
                          : v.status === 'cancelled'
                            ? '#EF4444'
                            : '#d97706',
                        v.status === 'confirmed'
                          ? '#dcfce7'
                          : v.status === 'cancelled'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(v.status)}
                    </span>
                  </td>
                  <td style={S.td}>{v.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
