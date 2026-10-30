import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardLease } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const FinancialSummary: React.FC = () => {
  const [leases, setLeases] = useState<DashboardLease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases?role=landlord&pageSize=100');
        const json = await res.json();
        setLeases(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch financial data:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const activeLeases = leases.filter(l => l.status === 'active');
  const totalMonthlyRent = activeLeases.reduce((sum, l) => sum + (l.monthlyRent ?? 0), 0);
  const totalAnnualRent = totalMonthlyRent * 12;
  const maintenanceCost = leases.reduce((sum, l) => sum + (l.maintenanceCost ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💰 Financial Summary</h2>
        <p style={S.headerSubtitle}>Revenue and expense overview</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalMonthlyRent)}</span>
          <span style={S.statLabel}>📅 Monthly Rental Income</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalAnnualRent)}</span>
          <span style={S.statLabel}>📆 Annual Rental Income</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{activeLeases.length}</span>
          <span style={S.statLabel}>✅ Active Leases</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(maintenanceCost)}</span>
          <span style={S.statLabel}>🔧 Maintenance Costs</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📊 Income by Property</h3>
        {activeLeases.length === 0 ? (
          <p style={S.headerSubtitle}>No active leases to display.</p>
        ) : (
          <div style={S.tableWrapper}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Property</th>
                  <th style={S.th}>Tenant</th>
                  <th style={S.th}>Monthly Rent</th>
                  <th style={S.th}>Lease End</th>
                </tr>
              </thead>
              <tbody>
                {activeLeases.map(l => (
                  <tr key={l.id}>
                    <td style={S.td}>{l.property?.title ?? '—'}</td>
                    <td style={S.td}>{l.tenant?.name ?? '—'}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(l.monthlyRent)}</td>
                    <td style={S.td}>{S.formatDate(l.endDate)}</td>
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
