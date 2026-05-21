/**
 * LandlordPortalPage — Phase 2.1-2.6 + 2.13: Landlord Self-Service Portal
 *
 * Provides landlords with read-only access to:
 * - Home Dashboard (2.13) ← default landing
 * - My Properties (2.2)
 * - Tenants (2.3)
 * - Rent Payments (2.4)
 * - Maintenance Requests (2.5)
 * - Documents (2.6)
 *
 * @component
 */

import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import '../RolePages.css';
import PortalLayout from '../../components/portal/PortalLayout';
import LandlordPortalHome from '../../components/portal/landlord/LandlordPortalHome';
import LandlordPropertiesTab from '../../components/portal/landlord/LandlordPropertiesTab';
import LandlordTenantsTab from '../../components/portal/landlord/LandlordTenantsTab';
import LandlordPaymentsTab from '../../components/portal/landlord/LandlordPaymentsTab';
import LandlordMaintenanceTab from '../../components/portal/landlord/LandlordMaintenanceTab';
import LandlordDocumentsTab from '../../components/portal/landlord/LandlordDocumentsTab';
import PortalProfileTab from '../../components/portal/PortalProfileTab';

type TabKey =
  | 'home'
  | 'properties'
  | 'tenants'
  | 'payments'
  | 'maintenance'
  | 'documents'
  | 'profile';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { key: 'home', label: 'Dashboard', icon: '🏠' },
  { key: 'properties', label: 'My Properties', icon: '🏢' },
  { key: 'tenants', label: 'Tenants', icon: '👥' },
  { key: 'payments', label: 'Rent Payments', icon: '💰' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { key: 'documents', label: 'Documents', icon: '📄' },
  { key: 'profile', label: 'My Profile', icon: '👤' },
];

const LandlordPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser) {
    return (
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="error-message">
            <p>You must be logged in to access the Landlord Portal.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <LandlordPortalHome onNavigate={key => setActiveTab(key as TabKey)} />;
      case 'properties':
        return <LandlordPropertiesTab />;
      case 'tenants':
        return <LandlordTenantsTab />;
      case 'payments':
        return <LandlordPaymentsTab />;
      case 'maintenance':
        return <LandlordMaintenanceTab />;
      case 'documents':
        return <LandlordDocumentsTab />;
      case 'profile':
        return <PortalProfileTab />;
      default:
        return <LandlordPortalHome onNavigate={key => setActiveTab(key as TabKey)} />;
    }
  };

  return (
    <PortalLayout portalType="landlord">
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="page-header">
            <h1>Landlord Portal</h1>
            <p>Welcome, {currentUser.name}. Manage your properties and tenants.</p>
          </div>

          {/* Tab Navigation */}
          <div
            className="portal-tab-navigation"
            role="tablist"
            aria-label="Landlord Portal Navigation"
          >
            {tabs.map(tab => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`tabpanel-${tab.key}`}
                className={`portal-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                data-testid={`tab-${tab.key}`}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            className="portal-tab-content"
            data-testid={`tabpanel-${activeTab}`}
          >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default LandlordPortalPage;
