/**
 * TenantPortalHome — Phase 2.13: Tenant Portal Home Dashboard
 *
 * Landing page summary for tenants with key metrics and quick links.
 *
 * @component
 */

import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import '../../../pages/RolePages.css';

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

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view the Tenant Portal.</p>
      </div>
    );
  }

  // Static demo data — will be replaced by API calls in Phase 5
  const nextPayment = { month: 'May 2026', amount: 8000, daysUntilDue: 15 };
  const leaseEndDate = '2026-12-31';
  const leaseEndDays = Math.ceil(
    (new Date(leaseEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const openRequests = 2;

  return (
    <div className="tab-content-section tenant-portal-home" data-testid="tenant-portal-home">
      {/* Welcome banner */}
      <div className="portal-welcome-banner" data-testid="tenant-welcome-banner">
        <h2>Welcome back, {currentUser.name ?? currentUser.email} 👋</h2>
        <p className="portal-welcome-subtitle">Here is a summary of your tenancy today.</p>
      </div>

      {/* Key metrics */}
      <div className="summary-grid" data-testid="tenant-metrics-grid">
        <div className="summary-card next-payment-card" data-testid="tenant-metric-next-payment">
          <span className="metric-icon">💳</span>
          <h4>Next Payment</h4>
          <p className="metric-value next-payment-amount" data-testid="tenant-metric-payment-value">
            AED {nextPayment.amount.toLocaleString()}
          </p>
          <span className="metric-label">
            {nextPayment.month} · Due in {nextPayment.daysUntilDue} days
          </span>
        </div>

        <div className="summary-card" data-testid="tenant-metric-lease">
          <span className="metric-icon">📋</span>
          <h4>Lease Ends</h4>
          <p className="metric-value" data-testid="tenant-metric-lease-value">
            {leaseEndDays > 0 ? `${leaseEndDays} days` : 'Expired'}
          </p>
          <span className="metric-label">{leaseEndDate}</span>
        </div>

        <div className="summary-card" data-testid="tenant-metric-maintenance">
          <span className="metric-icon">🔧</span>
          <h4>Open Requests</h4>
          <p className="metric-value" data-testid="tenant-metric-maintenance-value">
            {openRequests}
          </p>
          <span className="metric-label">Maintenance issues</span>
        </div>
      </div>

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
