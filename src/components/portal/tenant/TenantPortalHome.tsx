/**
 * TenantPortalHome — Phase 2.13 / Phase 30: Tenant Portal Home Dashboard
 *
 * Landing page summary for tenants with key metrics fetched from live APIs.
 *
 * @component
 */

import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

interface ApiLease {
  id: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  nextPaymentDue?: string | null;
  property: { title: string; location: string };
}

interface QuickLink {
  label: string;
  icon: string;
  tabKey: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'My Lease', icon: '📋', tabKey: 'lease' },
  { label: 'Payments', icon: '💳', tabKey: 'payments' },
  { label: 'Maintenance', icon: '🔧', tabKey: 'maintenance' },
  { label: 'Documents', icon: '📄', tabKey: 'documents' },
];

interface TenantPortalHomeProps {
  /** Called when a quick-link tile is clicked */
  onNavigate?: (tabKey: string) => void;
}

const TenantPortalHome: FC<TenantPortalHomeProps> = ({ onNavigate }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [lease, setLease] = useState<ApiLease | null>(null);
  const [openCount, setOpenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      authFetch('/api/leases?role=tenant&pageSize=1').then(r => r.json()),
      authFetch('/api/maintenance?status=open&pageSize=1').then(r => r.json()),
    ])
      .then(([leasesData, maintData]) => {
        setLease((leasesData.data as ApiLease[])?.[0] ?? null);
        setOpenCount((maintData.pagination?.total as number) ?? 0);
      })
      .catch(() => setError('Unable to load dashboard data. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view the Tenant Portal.</p>
      </div>
    );
  }

  // ── Derive KPIs from live data ───────────────────────────────────────────
  const leaseEndDate = lease?.endDate ? lease.endDate.split('T')[0] : null;
  const leaseEndDays = leaseEndDate
    ? Math.ceil((new Date(leaseEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const nextPaymentDate = lease?.nextPaymentDue ? new Date(lease.nextPaymentDue) : null;
  const daysUntilDue = nextPaymentDate
    ? Math.ceil((nextPaymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const nextPaymentMonth = nextPaymentDate
    ? nextPaymentDate.toLocaleDateString('en-AE', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="tab-content-section tenant-portal-home" data-testid="tenant-portal-home">
      {/* Welcome banner */}
      <div className="portal-welcome-banner" data-testid="tenant-welcome-banner">
        <h2>Welcome back, {currentUser.name ?? currentUser.email} 👋</h2>
        <p className="portal-welcome-subtitle">Here is a summary of your tenancy today.</p>
      </div>

      {error && (
        <div className="error-message" data-testid="tenant-home-error">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="loading-state" data-testid="tenant-home-loading">
          <p>Loading dashboard…</p>
        </div>
      ) : (
        /* Key metrics */
        <div className="summary-grid" data-testid="tenant-metrics-grid">
          <div className="summary-card next-payment-card" data-testid="tenant-metric-next-payment">
            <span className="metric-icon">💳</span>
            <h4>Next Payment</h4>
            {lease && nextPaymentMonth ? (
              <>
                <p className="metric-value next-payment-amount" data-testid="tenant-metric-payment-value">
                  AED {lease.monthlyRent.toLocaleString()}
                </p>
                <span className="metric-label">
                  {nextPaymentMonth}
                  {daysUntilDue !== null && (
                    <> · {daysUntilDue > 0 ? `Due in ${daysUntilDue} days` : 'Overdue'}</>
                  )}
                </span>
              </>
            ) : (
              <p className="metric-value" data-testid="tenant-metric-payment-value">—</p>
            )}
          </div>

          <div className="summary-card" data-testid="tenant-metric-lease">
            <span className="metric-icon">📋</span>
            <h4>Lease Ends</h4>
            <p className="metric-value" data-testid="tenant-metric-lease-value">
              {leaseEndDays !== null
                ? leaseEndDays > 0 ? `${leaseEndDays} days` : 'Expired'
                : '—'}
            </p>
            {leaseEndDate && <span className="metric-label">{leaseEndDate}</span>}
          </div>

          <div className="summary-card" data-testid="tenant-metric-maintenance">
            <span className="metric-icon">🔧</span>
            <h4>Open Requests</h4>
            <p className="metric-value" data-testid="tenant-metric-maintenance-value">
              {openCount}
            </p>
            <span className="metric-label">Maintenance issues</span>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="portal-quick-links" data-testid="tenant-quick-links">
        <h3>Quick Actions</h3>
        <div className="quick-links-grid">
          {QUICK_LINKS.map(link => (
            <button
              key={link.tabKey}
              type="button"
              className="quick-link-tile"
              data-testid={`tenant-quick-link-${link.tabKey}`}
              onClick={() => onNavigate?.(link.tabKey)}
            >
              <span className="quick-link-icon">{link.icon}</span>
              <span className="quick-link-label">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenantPortalHome;
