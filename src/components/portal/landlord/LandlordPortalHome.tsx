/**
 * LandlordPortalHome — Phase 29: Live API integration
 *
 * Landing page summary for landlords with live KPI metrics from API.
 * Single API call to /api/leases?role=landlord computes all 4 metrics.
 *
 * @component
 */

import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';
import '../../../pages/RolePages.css';

interface QuickLink {
  label: string;
  icon: string;
  tabKey: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: 'My Properties', icon: '🏢', tabKey: 'properties' },
  { label: 'Tenants', icon: '👥', tabKey: 'tenants' },
  { label: 'Rent Payments', icon: '💰', tabKey: 'payments' },
  { label: 'Maintenance', icon: '🔧', tabKey: 'maintenance' },
  { label: 'Documents', icon: '📄', tabKey: 'documents' },
];

interface ApiLease {
  id: string;
  propertyId: string;
  monthlyRent: number;
  status: string;
  nextPaymentDue?: string | null;
}

interface LandlordPortalHomeProps {
  /** Called when a quick-link tile is clicked */
  onNavigate?: (tabKey: string) => void;
}

const LandlordPortalHome: FC<LandlordPortalHomeProps> = ({ onNavigate }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [leases, setLeases] = useState<ApiLease[]>([]);
  const [properties, setProperties] = useState<{ id: string }[]>([]);
  const [openMaintenance, setOpenMaintenance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    Promise.all([
      authFetch('/api/leases?role=landlord&pageSize=100').then(r => r.json()),
      authFetch('/api/properties?pageSize=100').then(r => r.json()),
      authFetch('/api/maintenance?pageSize=1').then(r => r.json()),
    ])
      .then(([leasesRes, propsRes, maintRes]) => {
        if (cancelled) return;
        setLeases(leasesRes.data ?? []);
        setProperties(propsRes.data ?? []);
        setOpenMaintenance(maintRes.pagination?.total ?? maintRes.data?.length ?? 0);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const metrics = useMemo(() => {
    const activeTenants = leases.filter(
      l => l.status === 'active' || l.status === 'expiring'
    ).length;

    const overdueRent = leases
      .filter(l => {
        if (!l.nextPaymentDue) return false;
        return new Date(l.nextPaymentDue) < new Date();
      })
      .reduce((sum, l) => sum + l.monthlyRent, 0);

    return {
      propertiesCount: properties.length,
      activeTenants,
      overdueRent,
    };
  }, [leases, properties]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view the Landlord Portal.</p>
      </div>
    );
  }

  return (
    <div className="tab-content-section landlord-portal-home" data-testid="landlord-portal-home">
      {/* Welcome banner */}
      <div className="portal-welcome-banner" data-testid="landlord-welcome-banner">
        <h2>Welcome back, {currentUser.name ?? currentUser.email} 👋</h2>
        <p className="portal-welcome-subtitle">Here is a summary of your portfolio today.</p>
      </div>

      {/* Key metrics */}
      <div className="summary-grid" data-testid="landlord-metrics-grid">
        <div className="summary-card" data-testid="landlord-metric-properties">
          <span className="metric-icon">🏢</span>
          <h4>Properties</h4>
          <p className="metric-value" data-testid="landlord-metric-properties-value">
            {loading ? '…' : metrics.propertiesCount}
          </p>
          <span className="metric-label">Total listings</span>
        </div>

        <div className="summary-card" data-testid="landlord-metric-tenants">
          <span className="metric-icon">👥</span>
          <h4>Active Tenants</h4>
          <p className="metric-value" data-testid="landlord-metric-tenants-value">
            {loading ? '…' : metrics.activeTenants}
          </p>
          <span className="metric-label">Occupied units</span>
        </div>

        <div className="summary-card" data-testid="landlord-metric-rent">
          <span className="metric-icon">💰</span>
          <h4>Overdue Rent</h4>
          <p className="metric-value" data-testid="landlord-metric-rent-value">
            {loading ? '…' : `AED ${metrics.overdueRent.toLocaleString()}`}
          </p>
          <span className="metric-label">Needs collection</span>
        </div>

        <div className="summary-card" data-testid="landlord-metric-maintenance">
          <span className="metric-icon">🔧</span>
          <h4>Open Requests</h4>
          <p className="metric-value" data-testid="landlord-metric-maintenance-value">
            {loading ? '…' : (openMaintenance ?? 0)}
          </p>
          <span className="metric-label">Pending issues</span>
        </div>
      </div>

      {/* Quick links */}
      <div className="portal-quick-links" data-testid="landlord-quick-links">
        <h3>Quick Actions</h3>
        <div className="quick-links-grid">
          {QUICK_LINKS.map(link => (
            <button
              key={link.tabKey}
              type="button"
              className="quick-link-tile"
              data-testid={`landlord-quick-link-${link.tabKey}`}
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

export default LandlordPortalHome;
