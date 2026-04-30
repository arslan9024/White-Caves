/**
 * LandlordPortalPage — Phase 2.1-2.6 + Leasing Enhancements
 *
 * Provides landlords with access to:
 * - My Properties (2.2)
 * - Tenants (2.3)
 * - Rent Payments (2.4)
 * - Maintenance Requests (2.5)
 * - Documents (2.6)
 * - Offer Review (Stage 4-5 leasing lifecycle)
 * - Income Summary (Stage 10 leasing lifecycle)
 *
 * @component
 */

import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import '../RolePages.css';
import LandlordPropertiesTab from '../../components/portal/landlord/LandlordPropertiesTab';
import LandlordTenantsTab from '../../components/portal/landlord/LandlordTenantsTab';
import LandlordPaymentsTab from '../../components/portal/landlord/LandlordPaymentsTab';
import LandlordMaintenanceTab from '../../components/portal/landlord/LandlordMaintenanceTab';
import LandlordDocumentsTab from '../../components/portal/landlord/LandlordDocumentsTab';
import LandlordOfferReviewTab from '../../components/portal/landlord/LandlordOfferReviewTab';
import LandlordIncomeTab from '../../components/portal/landlord/LandlordIncomeTab';

type TabKey = 'properties' | 'tenants' | 'payments' | 'maintenance' | 'documents' | 'offers' | 'income';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { key: 'properties', label: 'My Properties', icon: '🏢' },
  { key: 'tenants', label: 'Tenants', icon: '👥' },
  { key: 'offers', label: 'Offer Review', icon: '📨' },
  { key: 'income', label: 'Income', icon: '💹' },
  { key: 'payments', label: 'Rent Payments', icon: '💰' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { key: 'documents', label: 'Documents', icon: '📄' },
];

const LandlordPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('properties');
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
      case 'offers':
        return <LandlordOfferReviewTab />;
      case 'income':
        return <LandlordIncomeTab />;
      default:
        return <LandlordPropertiesTab />;
    }
  };

  return (
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
  );
};

export default LandlordPortalPage;

