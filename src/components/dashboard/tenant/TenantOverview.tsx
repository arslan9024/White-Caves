import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import { settledJson } from '../../../utils/settledJson';
import type {
  DashboardLease,
  DashboardMaintenanceRequest,
} from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const TenantOverview: React.FC = () => {
  const [lease, setLease] = useState<DashboardLease | null>(null);
  const [maintenance, setMaintenance] = useState<DashboardMaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [l, m] = (await settledJson(
          [authFetch('/api/leases/my-lease'), authFetch('/api/maintenance?pageSize=5')],
          [{ data: null }, { data: [] }]
        )) as [{ data?: DashboardLease | null }, { data?: DashboardMaintenanceRequest[] }];
        setLease(l.data ?? null);
        setMaintenance(m.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch tenant overview:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Tenant Overview</h2>
        <p style={S.headerSubtitle}>Your tenancy at a glance</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{lease ? S.formatCurrency(lease.monthlyRent) : '—'}</span>
          <span style={S.statLabel}>💳 Monthly Rent</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{lease ? S.formatDate(lease.endDate) : '—'}</span>
          <span style={S.statLabel}>📅 Lease Expiry</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{maintenance.length}</span>
          <span style={S.statLabel}>🔧 Open Requests</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{lease?.property?.title ?? '—'}</span>
          <span style={S.statLabel}>🏠 Property</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📌 Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button style={S.btnPrimary}>Submit Maintenance Request</button>
          <button style={S.btnSecondary}>📄 View Lease</button>
          <button style={S.btnSecondary}>💳 Payment History</button>
        </div>
      </div>

      {maintenance.length > 0 && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>🔧 Recent Maintenance</h3>
          {maintenance.map(m => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <span>{m.title}</span>
              <span style={S.badge('#EF4444', '#dbeafe')}>{S.formatStatus(m.status)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

