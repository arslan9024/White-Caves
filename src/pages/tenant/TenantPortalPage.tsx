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

import React, { FC, useState } from 'react';
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

type TabKey = 'home' | 'lease' | 'payments' | 'maintenance' | 'documents' | 'profile';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { key: 'home', label: 'Dashboard', icon: '🏠' },
  { key: 'lease', label: 'My Lease', icon: '📋' },
  { key: 'payments', label: 'Payment History', icon: '💳' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { key: 'documents', label: 'Documents', icon: '📄' },
  { key: 'profile', label: 'My Profile', icon: '👤' },
];

const TenantPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser) {
    return (
      <div className="role-page no-sidebar">
        <div className="role-page-content full-width">
          <div className="error-message">
            <p>You must be logged in to access the Tenant Portal.</p>
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
            <h1>Tenant Portal</h1>
            <p>Welcome, {currentUser.name}. Manage your lease and requests.</p>
          </div>

          {/* Tab Navigation */}
          <div
            className="portal-tab-navigation"
            role="tablist"
            aria-label="Tenant Portal Navigation"
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

export default TenantPortalPage;
