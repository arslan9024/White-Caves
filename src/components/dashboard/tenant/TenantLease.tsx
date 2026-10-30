import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardLease } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const TenantLease: React.FC = () => {
  const [lease, setLease] = useState<DashboardLease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/leases/my-lease');
        const json = await res.json();
        setLease(json.data);
      } catch (error) {
        log.warn('Failed to fetch lease details:', error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;
  if (!lease) {
    return (
      <div style={S.tabContainer}>
        {S.emptyState(
          '📄',
          'No active lease',
          "Your lease information will appear here once it's signed."
        )}
      </div>
    );
  }

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📄 My Lease</h2>
        <p style={S.headerSubtitle}>Lease details and agreement</p>
      </div>

      <div style={S.card}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <strong>Property:</strong>
            <p style={S.headerSubtitle}>{lease.property?.title ?? '—'}</p>
          </div>
          <div>
            <strong>Landlord:</strong>
            <p style={S.headerSubtitle}>{lease.landlord?.name ?? '—'}</p>
          </div>
          <div>
            <strong>Start Date:</strong>
            <p style={S.headerSubtitle}>{S.formatDate(lease.startDate)}</p>
          </div>
          <div>
            <strong>End Date:</strong>
            <p style={S.headerSubtitle}>{S.formatDate(lease.endDate)}</p>
          </div>
          <div>
            <strong>Monthly Rent:</strong>
            <p
              style={{
                ...S.headerSubtitle,
                color: 'var(--color-primary, #C9A84C)',
                fontWeight: 600,
              }}
            >
              {S.formatCurrency(lease.monthlyRent)}
            </p>
          </div>
          <div>
            <strong>Security Deposit:</strong>
            <p style={S.headerSubtitle}>{S.formatCurrency(lease.securityDeposit)}</p>
          </div>
          <div>
            <strong>Status:</strong>
            <p>
              <span
                style={S.badge(
                  lease.status === 'active' ? '#16a34a' : '#d97706',
                  lease.status === 'active' ? '#dcfce7' : '#fffbeb'
                )}
              >
                {S.formatStatus(lease.status)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {lease.terms && (
        <div style={S.card}>
          <h3 style={S.cardTitle}>📋 Lease Terms</h3>
          <p style={{ color: 'var(--text-secondary, #6b7280)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{lease.terms}</p>
        </div>
      )}
    </div>
  );
};

