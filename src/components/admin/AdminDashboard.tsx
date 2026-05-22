import React, { KeyboardEvent, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createLogger } from '../../utils/logger';
import type { RootState } from '../../store/store';
import { Users, Settings, Activity, BarChart3 } from 'lucide-react';
import { Alert } from '../../components/ui';
import {
  AdminAnalyticsPanel,
  AdminOverviewPanel,
  AdminSettingsPanel,
  AdminUsersPanel,
} from './AdminDashboardPanels';
import { type AdminTabId, useAdminDashboardData } from './hooks/useAdminDashboardData';
import * as S from './AdminDashboard.styles';

const ADMIN_TABS: ReadonlyArray<{ id: AdminTabId; label: string; Icon: typeof Activity }> = [
  { id: 'overview', label: 'Overview', Icon: Activity },
  { id: 'users', label: 'Users', Icon: Users },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

const getTabId = (tabId: AdminTabId): string => `admin-tab-${tabId}`;
const getPanelId = (tabId: AdminTabId): string => `admin-panel-${tabId}`;

/**
 * AdminDashboard Component
 *
 * Comprehensive admin control panel for super user (lion role)
 * Features:
 * - System health monitoring
 * - User management
 * - Activity tracking
 * - Analytics overview
 * - System settings
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Get user info from Redux
  const user = useSelector((state: RootState) => state.auth?.user);
  const {
    filterPeriod,
    setFilterPeriod,
    currentActivityPage,
    setCurrentActivityPage,
    currentUsersPage,
    setCurrentUsersPage,
    isLoading,
    systemMetrics,
    totalActivities,
    paginatedActivities,
    activitiesTotalPages,
    totalUsers,
    paginatedUsers,
    usersTotalPages,
    alerts,
    refreshData,
  } = useAdminDashboardData();

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = ADMIN_TABS.length - 1;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = index === lastIndex ? 0 : index + 1;
        tabButtonRefs.current[nextIndex]?.focus();
        break;
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        event.preventDefault();
        const previousIndex = index === 0 ? lastIndex : index - 1;
        tabButtonRefs.current[previousIndex]?.focus();
        break;
      }
      case 'Home':
        event.preventDefault();
        tabButtonRefs.current[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        tabButtonRefs.current[lastIndex]?.focus();
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <S.AdminContainer>
        <S.AdminHeader>
          <S.AdminTitle>
            <h1>Admin Dashboard</h1>
            <p>Loading platform management data...</p>
          </S.AdminTitle>
        </S.AdminHeader>
      </S.AdminContainer>
    );
  }

  return (
    <S.AdminContainer>
      <S.AdminHeader>
        <S.AdminTitle>
          <h1>Admin Dashboard</h1>
          <p>Platform management and monitoring</p>
        </S.AdminTitle>
        <S.AdminUserInfo>
          <S.UserName>{user?.displayName || 'Admin'}</S.UserName>
          <S.UserRole>Super User</S.UserRole>
          <S.BtnSecondary type="button" onClick={() => void refreshData()}>
            <Activity size={16} />
            Refresh Data
          </S.BtnSecondary>
        </S.AdminUserInfo>
      </S.AdminHeader>

      <S.AdminTabs role="tablist" aria-label="Admin dashboard tabs">
        {ADMIN_TABS.map((tab, index) => (
          <S.Tab
            key={tab.id}
            ref={element => {
              tabButtonRefs.current[index] = element;
            }}
            id={getTabId(tab.id)}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            aria-controls={getPanelId(tab.id)}
            tabIndex={activeTab === tab.id ? 0 : -1}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={event => handleTabKeyDown(event, index)}
          >
            <tab.Icon size={20} />
            {tab.label}
          </S.Tab>
        ))}
      </S.AdminTabs>

      <S.AdminContent>
        {activeTab === 'overview' && (
          <AdminOverviewPanel
            panelId={getPanelId('overview')}
            tabId={getTabId('overview')}
            systemMetrics={systemMetrics}
            alerts={alerts}
            paginatedActivities={paginatedActivities}
            currentActivityPage={currentActivityPage}
            activitiesTotalPages={activitiesTotalPages}
            totalActivities={totalActivities}
            setCurrentActivityPage={setCurrentActivityPage}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersPanel
            panelId={getPanelId('users')}
            tabId={getTabId('users')}
            paginatedUsers={paginatedUsers}
            currentUsersPage={currentUsersPage}
            usersTotalPages={usersTotalPages}
            totalUsers={totalUsers}
            setCurrentUsersPage={setCurrentUsersPage}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsPanel
            panelId={getPanelId('analytics')}
            tabId={getTabId('analytics')}
            filterPeriod={filterPeriod}
            setFilterPeriod={setFilterPeriod}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsPanel panelId={getPanelId('settings')} tabId={getTabId('settings')} />
        )}
      </S.AdminContent>
    </S.AdminContainer>
  );
};

export default AdminDashboard;
