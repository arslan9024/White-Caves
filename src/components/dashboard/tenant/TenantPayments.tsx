import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardPayment } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const TenantPayments: React.FC = () => {
  const [payments, setPayments] = useState<DashboardPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases/my-payments');
        const json = await res.json();
        setPayments(json.data ?? []);
      } catch (error) {
        log.warn('Failed to fetch payment history:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((s, p) => s + (p.amount ?? 0), 0);
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((s, p) => s + (p.amount ?? 0), 0);

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💳 Payments</h2>
        <p style={S.headerSubtitle}>Rent payment history and upcoming dues</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalPaid)}</span>
          <span style={S.statLabel}>✅ Total Paid</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(totalPending)}</span>
          <span style={S.statLabel}>⏳ Pending</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{payments.length}</span>
          <span style={S.statLabel}>📑 Total Transactions</span>
        </div>
      </div>

      {payments.length === 0 ? (
        S.emptyState('💳', 'No payments', 'Payment records will appear here.')
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Date</th>
                <th style={S.th}>Period</th>
                <th style={S.th}>Amount</th>
                <th style={S.th}>Method</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td style={S.td}>{S.formatDate(p.paymentDate ?? p.createdAt)}</td>
                  <td style={S.td}>{p.period ?? '—'}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{S.formatCurrency(p.amount)}</td>
                  <td style={S.td}>{S.formatStatus(p.method ?? 'bank_transfer')}</td>
                  <td style={S.td}>
                    <span
                      style={S.badge(
                        p.status === 'paid'
                          ? '#16a34a'
                          : p.status === 'overdue'
                            ? '#EF4444'
                            : '#d97706',
                        p.status === 'paid'
                          ? '#dcfce7'
                          : p.status === 'overdue'
                            ? '#fef2f2'
                            : '#fffbeb'
                      )}
                    >
                      {S.formatStatus(p.status)}
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
