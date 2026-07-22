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

import React, { FC, useState, useMemo } from 'react';
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
import PortalSidebarContainer from '../../components/portal/containers/PortalSidebarContainer';
import { useTranslation, Text } from '../../context/TranslationContext';

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

const LandlordPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { t } = useTranslation();

  const tabs: Tab[] = useMemo(
    () => [
      { key: 'home', label: t('landlord.portal.tabs.home'), icon: '🏠' },
      { key: 'properties', label: t('landlord.portal.tabs.properties'), icon: '🏢' },
      { key: 'tenants', label: t('landlord.portal.tabs.tenants'), icon: '👥' },
      { key: 'payments', label: t('landlord.portal.tabs.payments'), icon: '💰' },
      { key: 'maintenance', label: t('landlord.portal.tabs.maintenance'), icon: '🔧' },
      { key: 'documents', label: t('landlord.portal.tabs.documents'), icon: '📄' },
      { key: 'profile', label: t('landlord.portal.tabs.profile'), icon: '👤' },
    ],
    [t]
  );

  if (!currentUser) {
    return (
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="error-message">
            <p>
              <Text tid="landlord.portal.unauthorized" />
            </p>
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
            <h1>
              <Text tid="landlord.portal.title" />
            </h1>
            <p>{t('landlord.portal.welcome').replace('{name}', currentUser.name ?? 'User')}</p>
          </div>

          {/* Tab Navigation */}
          <PortalSidebarContainer<TabKey>
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ariaLabel={t('landlord.portal.title')}
          />

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
