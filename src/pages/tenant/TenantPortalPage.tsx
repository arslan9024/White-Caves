/**
 * TenantPortalPage — Phase 2.7-2.11 + 2.13: Tenant Self-Service Portal
 *
 * Provides tenants with read-only access to:
 * - Home Dashboard (2.13) ← default landing
 * - My Lease (2.8)
 * - Payment History (2.9)
 * - Maintenance Requests (2.10)
 * - Documents (2.11)
 *
 * @component
 */

import React, { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import '../RolePages.css';
import PortalLayout from '../../components/portal/PortalLayout';
import TenantPortalHome from '../../components/portal/tenant/TenantPortalHome';
import TenantLeaseTab from '../../components/portal/tenant/TenantLeaseTab';
import TenantPaymentHistoryTab from '../../components/portal/tenant/TenantPaymentHistoryTab';
import TenantMaintenanceTab from '../../components/portal/tenant/TenantMaintenanceTab';
import TenantDocumentsTab from '../../components/portal/tenant/TenantDocumentsTab';
import PortalProfileTab from '../../components/portal/PortalProfileTab';
import PortalSidebarContainer from '../../components/portal/containers/PortalSidebarContainer';
import { useTranslation, Text } from '../../context/TranslationContext';

type TabKey = 'home' | 'lease' | 'payments' | 'maintenance' | 'documents' | 'profile';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

const TenantPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { t } = useTranslation();

  const tabs: Tab[] = useMemo(
    () => [
      { key: 'home', label: t('tenant.portal.tabs.home'), icon: '🏠' },
      { key: 'lease', label: t('tenant.portal.tabs.lease'), icon: '📋' },
      { key: 'payments', label: t('tenant.portal.tabs.payments'), icon: '💳' },
      { key: 'maintenance', label: t('tenant.portal.tabs.maintenance'), icon: '🔧' },
      { key: 'documents', label: t('tenant.portal.tabs.documents'), icon: '📄' },
      { key: 'profile', label: t('tenant.portal.tabs.profile'), icon: '👤' },
    ],
    [t]
  );

  if (!currentUser) {
    return (
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="error-message">
            <p>
              <Text tid="tenant.portal.unauthorized" />
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <TenantPortalHome onNavigate={key => setActiveTab(key as TabKey)} />;
      case 'lease':
        return <TenantLeaseTab />;
      case 'payments':
        return <TenantPaymentHistoryTab />;
      case 'maintenance':
        return <TenantMaintenanceTab />;
      case 'documents':
        return <TenantDocumentsTab />;
      case 'profile':
        return <PortalProfileTab />;
      default:
        return <TenantPortalHome onNavigate={key => setActiveTab(key as TabKey)} />;
    }
  };

  return (
    <PortalLayout portalType="tenant">
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="page-header">
            <h1>
              <Text tid="tenant.portal.title" />
            </h1>
            <p>{t('tenant.portal.welcome').replace('{name}', currentUser.name)}</p>
          </div>

          {/* Tab Navigation */}
          <PortalSidebarContainer<TabKey>
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            ariaLabel={t('tenant.portal.title')}
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

export default TenantPortalPage;
