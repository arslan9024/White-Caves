import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import { settledJson } from '../../../utils/settledJson';
import type { DashboardLease } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const LeaseManagement: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [expiring, setExpiring] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [all, exp] = (await settledJson(
          [
            authFetch('/api/leases?role=landlord&pageSize=50'),
            authFetch('/api/leases/expiring?days=60'),
          ],
          [{ data: [] }, { data: [] }]
        )) as [{ data?: DashboardLease[] }, { data?: DashboardLease[] }];
        setLeases(all.data ?? []);
        setExpiring(exp.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch lease data:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📝 Lease Management</h2>
        <p style={S.headerSubtitle}>
          {leases.length} {leases.length === 1 ? 'lease' : 'leases'} total
        </p>
      </div>

      {expiring.length > 0 && (
        <div style={{ ...S.card, borderColor: 'var(--color-fbbf24, #fbbf24)', background: 'var(--color-fffbeb, #fffbeb)' }}>
          <h3 style={S.cardTitle}>⚠️ Expiring Soon ({expiring.length})</h3>
          {expiring.map(l => (
            <div
              key={l.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #fde68a',
              }}
            >
              <span>
                {l.property?.title ?? '—'} — {l.tenant?.name ?? '—'}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--accent-gold, #d97706)' }}>
                Expires {S.formatDate(l.endDate)}
              </span>
            </div>
          ))}
        </div>
      )}

      {leases.length === 0 ? (
        S.emptyState('📝', 'No leases', 'Create leases to track tenancy agreements.')
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
