/**
 * TenantPortalPage — Phase 2.7-2.11: Tenant Self-Service Portal
 *
 * Provides tenants with access to:
 * - My Lease (2.8)
 * - Payment History + PDC Schedule (2.9)
 * - Maintenance Requests (2.10)
 * - Documents (2.11)
 * - Key Handover (Stage 8 leasing lifecycle)
 *
 * @component
 */

import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';
import { clearUser } from '../../store/userSlice';
import '../RolePages.css';
import TenantLeaseTab from '../../components/portal/tenant/TenantLeaseTab';
import TenantPaymentHistoryTab from '../../components/portal/tenant/TenantPaymentHistoryTab';
import TenantMaintenanceTab from '../../components/portal/tenant/TenantMaintenanceTab';
import TenantDocumentsTab from '../../components/portal/tenant/TenantDocumentsTab';
import TenantKeyHandoverTab from '../../components/portal/tenant/TenantKeyHandoverTab';

type TabKey = 'lease' | 'payments' | 'maintenance' | 'documents' | 'key_handover';

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { key: 'lease', label: 'My Lease', icon: '📋' },
  { key: 'payments', label: 'Payment History', icon: '💳' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { key: 'documents', label: 'Documents', icon: '📄' },
  { key: 'key_handover', label: 'Key Handover', icon: '🔑' },
];

const TenantPortalPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('lease');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    navigate('/signin');
  };

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
      case 'lease':
        return <TenantLeaseTab />;
      case 'payments':
        return <TenantPaymentHistoryTab />;
      case 'maintenance':
        return <TenantMaintenanceTab />;
      case 'documents':
        return <TenantDocumentsTab />;
      case 'key_handover':
        return <TenantKeyHandoverTab />;
      default:
        return <TenantLeaseTab />;
    }
  };

  return (
    <div className="role-page no-sidebar">
      {/* Portal Navbar */}
      <nav className="portal-navbar" data-testid="portal-navbar">
        <div className="portal-navbar-brand">
          <span className="portal-navbar-logo">🏠</span>
          <span className="portal-navbar-title">White Caves</span>
          <span className="portal-navbar-subtitle">Tenant</span>
        </div>
        <div className="portal-navbar-user">
          <span className="portal-navbar-username" data-testid="portal-navbar-username">
            {(currentUser.name ?? currentUser.email).split(' ')[0]}
          </span>
          <button
            type="button"
            className="portal-navbar-logout"
            onClick={handleLogout}
            data-testid="portal-navbar-logout"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>Tenant Portal</h1>
          <p>Welcome, {currentUser.name}. Manage your lease and requests.</p>
        </div>

        {/* Tab Navigation */}
        <div className="portal-tab-navigation" role="tablist" aria-label="Tenant Portal Navigation">
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

export default TenantPortalPage;
