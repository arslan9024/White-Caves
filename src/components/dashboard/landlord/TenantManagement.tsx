import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardLease } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const TenantManagement: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?role=landlord&pageSize=50');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch tenant leases:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>👥 Tenant Management</h2>
        <p style={S.headerSubtitle}>Active tenants and lease status</p>
      </div>
      {leases.length === 0 ? (
        S.emptyState('👥', 'No tenants yet', 'Tenants will appear here when leases are signed.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Tenant</th>
                <th style={S.th}>Property</th>
                <th style={S.th}>Rent</th>
                <th style={S.th}>Lease End</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leases.map(l => (
                <tr key={l.id}>
                  <td style={S.td}>{l.tenant?.name ?? l.tenantId ?? '—'}</td>
                  <td style={S.td}>{l.property?.title ?? l.propertyId ?? '—'}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(l.monthlyRent)}</td>
                  <td style={S.td}>{S.formatDate(l.endDate)}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        l.status === 'active'
                          ? '#16a34a'
                          : l.status === 'expiring_soon'
                            ? '#d97706'
                            : '#6b7280',
                        l.status === 'active'
                          ? '#dcfce7'
                          : l.status === 'expiring_soon'
                            ? '#fffbeb'
                            : '#f3f4f6'
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

