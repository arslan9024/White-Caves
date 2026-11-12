/**
 * BuyerPortalPage — Phase 2: Buyer Client Portal
 *
 * Self-service portal for buyers to manage:
 * - Overview: Buyer journey progress and active stats
 * - Favorites: Quick access to saved listings
 * - Calculators: Mortgage & DLD calculations
 * - Profile: Settings & credentials
 *
 * Single-purpose file complying with AEGIS AEG-008 & AEG-042 (< 350 lines).
 */

import React, { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../store/store';
import '../RolePages.css';
import PortalLayout from '../../components/portal/PortalLayout';
import PortalSidebarContainer, {
  type TabConfig,
} from '../../components/portal/containers/PortalSidebarContainer';
import PortalProfileTab from '../../components/portal/PortalProfileTab';

type TabKey = 'home' | 'saved' | 'tools' | 'profile';

const BuyerPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const tabs: TabConfig<TabKey>[] = useMemo(
    () => [
      { key: 'home', label: 'Dashboard', icon: '🏠' },
      { key: 'saved', label: 'Saved Units', icon: '❤️' },
      { key: 'tools', label: 'Mortgage & DLD', icon: '🧮' },
      { key: 'profile', label: 'Profile', icon: '👤' },
    ],
    []
  );

  if (!currentUser) {
    return (
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="error-message">
            <p>
              Please <Link to="/signin">sign in</Link> to access your Buyer Portal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PortalLayout portalType="buyer">
      <div
        className="portal-container"
        style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}
      >
        <PortalSidebarContainer<TabKey>
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Buyer Portal Navigation"
        />

        <div className="portal-tab-content" style={{ marginTop: '1.5rem' }}>
          {activeTab === 'home' && (
            <div className="buyer-portal-home">
              <header style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
                  Welcome back, {currentUser.name || 'Valued Buyer'} 👋
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Track your property search, viewings, and purchase milestones in Dubai.
                </p>
              </header>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <div
                  style={{
                    background: '#1e293b',
                    padding: '1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155',
                  }}
                >
                  <div
                    style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}
                  >
                    Saved Properties
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      marginTop: '0.25rem',
                    }}
                  >
                    Active List
                  </div>
                  <Link
                    to="/buyer/favorites"
                    style={{
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    View all favorites →
                  </Link>
                </div>

                <div
                  style={{
                    background: '#1e293b',
                    padding: '1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155',
                  }}
                >
                  <div
                    style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}
                  >
                    Mortgage Assessment
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#10b981',
                      marginTop: '0.25rem',
                    }}
                  >
                    Pre-approval
                  </div>
                  <Link
                    to="/buyer/mortgage-calculator"
                    style={{
                      color: '#10b981',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    Calculate rate & installments →
                  </Link>
                </div>

                <div
                  style={{
                    background: '#1e293b',
                    padding: '1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155',
                  }}
                >
                  <div
                    style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}
                  >
                    DLD Statutory Transfer
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#f59e0b',
                      marginTop: '0.25rem',
                    }}
                  >
                    4% Fee Model
                  </div>
                  <Link
                    to="/buyer/dld-fees"
                    style={{
                      color: '#f59e0b',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    Estimate registration costs →
                  </Link>
                </div>
              </div>

              <div
                style={{
                  background: '#0f172a',
                  borderRadius: '0.5rem',
                  padding: '1.25rem',
                  border: '1px solid #334155',
                }}
              >
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#f1f5f9',
                    marginBottom: '0.75rem',
                  }}
                >
                  Buying Milestone Progress (DLD Standard)
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#1e293b',
                      color: '#38bdf8',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      border: '1px solid #0284c7',
                    }}
                  >
                    1. Property Shortlist
                  </span>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#1e293b',
                      color: '#94a3b8',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                    }}
                  >
                    2. Form B Representation
                  </span>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#1e293b',
                      color: '#94a3b8',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                    }}
                  >
                    3. Unified Form F / MOU
                  </span>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#1e293b',
                      color: '#94a3b8',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                    }}
                  >
                    4. Developer NOC & Escrow
                  </span>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#1e293b',
                      color: '#94a3b8',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                    }}
                  >
                    5. Trustee Title Deed Handover
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="buyer-portal-saved">
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  marginBottom: '1rem',
                }}
              >
                Saved Listings & Searches
              </h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to="/buyer/favorites"
                  className="portal-action-btn"
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Open My Favorite Listings
                </Link>
                <Link
                  to="/buyer/saved-searches"
                  className="portal-action-btn"
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: '#1e293b',
                    color: '#f8fafc',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    border: '1px solid #475569',
                  }}
                >
                  Manage Saved Searches
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="buyer-portal-tools">
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  marginBottom: '1rem',
                }}
              >
                Dubai Buyer Financial Tools
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    background: '#1e293b',
                    padding: '1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155',
                  }}
                >
                  <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem' }}>
                    Mortgage Calculator
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.5rem 0 1rem' }}>
                    Calculate monthly installments, down payment requirements, and interest rates.
                  </p>
                  <Link
                    to="/buyer/mortgage-calculator"
                    style={{ color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'underline' }}
                  >
                    Launch Mortgage Calculator →
                  </Link>
                </div>

                <div
                  style={{
                    background: '#1e293b',
                    padding: '1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #334155',
                  }}
                >
                  <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem' }}>
                    DLD Fees Estimator
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.5rem 0 1rem' }}>
                    Estimate Dubai Land Department 4% transfer fees, trustee admin fees, and VAT.
                  </p>
                  <Link
                    to="/buyer/dld-fees"
                    style={{ color: '#f59e0b', fontSize: '0.85rem', textDecoration: 'underline' }}
                  >
                    Launch DLD Fees Estimator →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && <PortalProfileTab />}
        </div>
      </div>
    </PortalLayout>
  );
};

export default BuyerPortalPage;
