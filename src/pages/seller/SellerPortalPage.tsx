/**
 * SellerPortalPage — Phase 2: Seller Client Portal
 *
 * Self-service portal for property sellers to manage:
 * - Overview: Listing performance, active viewings, offers
 * - Pricing: Instant property valuation and pricing tools
 * - Profile: Contact info and notification preferences
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

type TabKey = 'home' | 'pricing' | 'profile';

const SellerPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const tabs: TabConfig<TabKey>[] = useMemo(
    () => [
      { key: 'home', label: 'Dashboard', icon: '📊' },
      { key: 'pricing', label: 'Valuation & Pricing', icon: '📈' },
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
              Please <Link to="/signin">sign in</Link> to access your Seller Portal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PortalLayout portalType="seller">
      <div
        className="portal-container"
        style={{ padding: '1.5rem', maxWidth: '1280px', margin: '0 auto' }}
      >
        <PortalSidebarContainer<TabKey>
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="Seller Portal Navigation"
        />

        <div className="portal-tab-content" style={{ marginTop: '1.5rem' }}>
          {activeTab === 'home' && (
            <div className="seller-portal-home">
              <header style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
                  Welcome back, {currentUser.name || 'Property Owner'} 👋
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                  Monitor listing performance, inquiries, and sale progression with White Caves.
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
                    Active Listings
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#d97706',
                      marginTop: '0.25rem',
                    }}
                  >
                    Under Mandate
                  </div>
                  <span
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.75rem',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    Form A Verified
                  </span>
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
                    Offers Received
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#10b981',
                      marginTop: '0.25rem',
                    }}
                  >
                    Review Pipeline
                  </div>
                  <span
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.75rem',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    0 Pending MOU
                  </span>
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
                    Market Pricing
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      marginTop: '0.25rem',
                    }}
                  >
                    AI Valuation
                  </div>
                  <Link
                    to="/seller/pricing-tools"
                    style={{
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    Launch pricing tools →
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
                  Dubai Sale Protocol Milestones
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: '#1e293b',
                      color: '#f59e0b',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      border: '1px solid #d97706',
                    }}
                  >
                    1. RERA Form A Authorization
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
                    2. Marketing &amp; Viewings
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
                    3. Form F Contract Signed
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
                    4. Developer NOC Issuance
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
                    5. Escrow Settlement &amp; Deed Transfer
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="seller-portal-pricing">
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  marginBottom: '1rem',
                }}
              >
                Property Valuation &amp; Pricing Tools
              </h2>
              <div
                style={{
                  background: '#1e293b',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #334155',
                  maxWidth: '600px',
                }}
              >
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Analyze real-time transaction data from the Dubai Land Department (DLD) to price
                  your property competitively.
                </p>
                <Link
                  to="/seller/pricing-tools"
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: '#d97706',
                    color: '#fff',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'inline-block',
                  }}
                >
                  Open Full Pricing &amp; Valuation Suite →
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'profile' && <PortalProfileTab />}
        </div>
      </div>
    </PortalLayout>
  );
};

export default SellerPortalPage;
