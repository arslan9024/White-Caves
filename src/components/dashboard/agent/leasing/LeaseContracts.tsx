import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardLease } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const LeaseContracts: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?pageSize=50');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch lease contracts:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📄 Lease Contracts</h2>
        <p style={S.headerSubtitle}>{leases.length} contracts</p>
      </div>
      {leases.length === 0 ? (
        S.emptyState('📄', 'No contracts', 'Contracts will appear when leases are created.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Tenant</th>
                <th style={S.th}>Start</th>
                <th style={S.th}>End</th>
                <th style={S.th}>Rent</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leases.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>{l.property?.title ?? '—'}</td>
                  <td style={S.td}>{l.tenant?.name ?? '—'}</td>
                  <td style={S.td}>{S.formatDate(l.startDate)}</td>
                  <td style={S.td}>{S.formatDate(l.endDate)}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(l.monthlyRent)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        l.status === 'active'
                          ? '#16a34a'
                          : l.status === 'expired'
                            ? '#EF4444'
                            : '#d97706',
                        l.status === 'active'
                          ? '#dcfce7'
                          : l.status === 'expired'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(l.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
