import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardApplication } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const TenantApplications: React.FC = () => {
  const [applications, setApplications] = useState<DashboardApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/job-applications?type=tenant&pageSize=50');
        const json = await res.json();
        setApplications(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch applications:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📋 Tenant Applications</h2>
        <p style={S.headerSubtitle}>{applications.length} applications to review</p>
      </div>
      {applications.length === 0 ? (
        S.emptyState(
          '📋',
          'No applications',
          'Tenant applications will appear when prospective tenants apply.'
        )
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Applicant</th>
                <th style={S.th}>Property</th>
                <th style={S.th}>Applied On</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id}>
                  <td style={S.td}>
                    <strong>{a.applicantName ?? a.user?.name ?? '—'}</strong>
                  </td>
                  <td style={S.td}>{a.property?.title ?? '—'}</td>
                  <td style={S.td}>{S.formatDate(a.createdAt)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        a.status === 'approved'
                          ? '#16a34a'
                          : a.status === 'rejected'
                            ? '#EF4444'
                            : '#d97706',
                        a.status === 'approved'
                          ? '#dcfce7'
                          : a.status === 'rejected'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(a.status)}
                    </span>
                  </td>
                  <td style={S.td}>{a.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
