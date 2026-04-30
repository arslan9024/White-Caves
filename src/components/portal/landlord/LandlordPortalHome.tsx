/**
 * LandlordPortalHome — Phase 2.13: Landlord Portal Home Dashboard
 *
 * Landing page summary for landlords with key metrics and quick links.
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
  { label: 'My Properties', icon: '🏢', tabKey: 'properties' },
  { label: 'Tenants', icon: '👥', tabKey: 'tenants' },
  { label: 'Rent Payments', icon: '💰', tabKey: 'payments' },
  { label: 'Maintenance', icon: '🔧', tabKey: 'maintenance' },
  { label: 'Documents', icon: '📄', tabKey: 'documents' },
];

interface LandlordPortalHomeProps {
  /** Called when a quick-link tile is clicked */
  onNavigate?: (tabKey: string) => void;
}

const LandlordPortalHome: FC<LandlordPortalHomeProps> = ({ onNavigate }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

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
            3
          </p>
          <span className="metric-label">Total listings</span>
        </div>

        <div className="summary-card" data-testid="landlord-metric-tenants">
          <span className="metric-icon">👥</span>
          <h4>Active Tenants</h4>
          <p className="metric-value" data-testid="landlord-metric-tenants-value">
            2
          </p>
          <span className="metric-label">Occupied units</span>
        </div>

        <div className="summary-card" data-testid="landlord-metric-rent">
          <span className="metric-icon">💰</span>
          <h4>Rent Due</h4>
          <p className="metric-value" data-testid="landlord-metric-rent-value">
            AED 16,000
          </p>
          <span className="metric-label">This month</span>
        </div>

        <div className="summary-card" data-testid="landlord-metric-maintenance">
          <span className="metric-icon">🔧</span>
          <h4>Open Requests</h4>
          <p className="metric-value" data-testid="landlord-metric-maintenance-value">
            2
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
