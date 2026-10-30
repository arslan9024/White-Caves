import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../../utils/authFetch';
import { createLogger } from '../../../../utils/logger';
import type { DashboardLease } from '@/types/dashboard';
import * as S from '../../shared';

const log = createLogger('Dashboard');

export const LeaseRenewals: React.FC = () => {
  const [expiring, setExpiring] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases/expiring?days=90');
        const json = await res.json();
        setExpiring(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch expiring leases:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🔄 Lease Renewals</h2>
        <p style={S.headerSubtitle}>{expiring.length} leases expiring within 90 days</p>
      </div>
      {expiring.length === 0 ? (
        S.emptyState(
          '🔄',
          'No upcoming renewals',
          'All leases are current. Renewals will appear as end dates approach.'
        )
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Property</th>
                <th style={S.th}>Tenant</th>
                <th style={S.th}>Expires</th>
                <th style={S.th}>Monthly Rent</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {expiring.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>{l.property?.title ?? '—'}</td>
                  <td style={S.td}>{l.tenant?.name ?? '—'}</td>
                  <td style={{ ...S.td, color: 'var(--accent-gold, #d97706)', fontWeight: 600 }}>
                    {S.formatDate(l.endDate)}
                  </td>
                  <td style={S.td}>{S.formatCurrency(l.monthlyRent)}</td>
                  <td style={S.td}>
                    <span style={S.badge('#d97706', '#fffbeb')}>Expiring</span>
                  </td>
                  <td style={S.td}>
                    <button style={S.btnPrimary}>Initiate Renewal</button>
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

