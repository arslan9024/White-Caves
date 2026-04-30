/**
 * useUnifiedDashboard Hook
 * ========================
 * Extracts ALL state management, data fetching, computed values, and
 * action handlers from UnifiedDashboardPage so the page component is
 * a thin rendering shell.
 *
 * Responsibilities:
 * - Redux selector reads (role, user, CRM data, sidebar state)
 * - Computed dashboard data & role-based filtering (useMemo)
 * - Data-fetching effects (leads, properties, agents, overview)
 * - Keyboard shortcut registration (Ctrl+B sidebar toggle)
 * - URL search-param sync for active tab
 * - Sidebar toggle / assistant selection handlers
 * - CRM module select / back handlers
 */

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getTabsForRole, getRoleInfo } from '../config/ROLE_TAB_MAPPING';
import { useDocumentTitle } from './useDocumentTitle';
import { getSubNavItems, getModuleById } from '../features/featureRegistry';
import {
  openFlyout,
  closeFlyout,
  selectAssistant,
  selectFlyoutOpen,
  selectFlyoutDepartment,
  selectSelectedAssistant as selectSelectedAssistantSelector,
  selectSelectedDepartment as selectSelectedDepartmentSelector,
} from '../store/slices/sidebarSlice';
import type { RootState } from '../store/store';
import { useAppDispatch } from '../store/store';
import {
  fetchLeadsFromAPI,
  fetchPropertiesFromAPI,
  fetchAgentsFromAPI,
  fetchDashboardOverview,
  selectAllLeads,
  selectAllProperties,
  selectAllAgents,
  selectAllCommissions,
  selectOverviewData,
  selectLeadsLoading,
  selectPropertiesLoading,
  selectAgentsLoading,
  selectLeadsError,
  selectPropertiesError,
  selectAgentsError,
  selectRecentActivities,
  selectHotLeads,
} from '../store/crmDataSlice';

// ─── Types ────────────────────────────────────────────────────

/** A generic CRM entity (property, lead, tenant, agent, etc.) keyed by string fields */
type CRMEntity = Record<string, unknown>;

export interface DashboardData {
  properties: CRMEntity[];
  agents: CRMEntity[];
  leads: CRMEntity[];
  hotLeads: CRMEntity[];
  commissions: CRMEntity[];
  recentActivities: CRMEntity[];
  overview: CRMEntity | null;
  contracts: CRMEntity[];
  tenants: CRMEntity[];
  payments: CRMEntity[];
  leases: CRMEntity[];
  applications: CRMEntity[];
  savedProperties: CRMEntity[];
  searchHistory: CRMEntity[];
  offers: CRMEntity[];
  sales: CRMEntity[];
  myRental: CRMEntity[];
  maintenanceRequests: CRMEntity[];
  leaseInfo: CRMEntity[];
  [key: string]: unknown;
}

/** Standard props passed to every CRM module and dashboard tab */
export interface CRMModuleProps {
  role: string;
  user: { id: string; name?: string; email: string; role?: string; [key: string]: unknown } | null;
  data: DashboardData;
}

/** Stable empty array constant for placeholder data fields */
const EMPTY_CRM_ARRAY: CRMEntity[] = [];

// ─── Hook ─────────────────────────────────────────────────────

export function useUnifiedDashboard() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // ─── Core Redux State ─────────────────────────────────────
  const currentRole = useSelector((state: RootState) => state.navigation?.activeRole || 'buyer');
  const currentModule = useSelector((state: RootState) => state.navigation?.currentModule);
  const currentSubModule = useSelector((state: RootState) => state.navigation?.currentSubModule);
  const user = useSelector((state: RootState) => state.user.currentUser);

  // ─── Local UI State ───────────────────────────────────────
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'overview');
  const [selectedCRMModule, setSelectedCRMModule] = useState<string | null>(null);

  // ─── Feature Registry ─────────────────────────────────────
  const roleModule = getModuleById(currentModule ?? currentRole);
  const roleSubNavItems = getSubNavItems(currentRole, currentModule ?? currentRole);

  // ─── Redux CRM Data Selectors ─────────────────────────────
  const allLeads = useSelector(selectAllLeads);
  const hotLeads = useSelector(selectHotLeads);
  const allProperties = useSelector(selectAllProperties);
  const allAgents = useSelector(selectAllAgents);
  const allCommissions = useSelector(selectAllCommissions);
  const overview = useSelector(selectOverviewData);
  const recentActivities = useSelector((state: RootState) => selectRecentActivities(state, 10));
  const leadsLoading = useSelector(selectLeadsLoading);
  const propertiesLoading = useSelector(selectPropertiesLoading);
  const agentsLoading = useSelector(selectAgentsLoading);

  const leadsError = useSelector(selectLeadsError);
  const propertiesError = useSelector(selectPropertiesError);
  const agentsError = useSelector(selectAgentsError);

  // Composite loading / error
  const isLoading = leadsLoading || propertiesLoading || agentsLoading;
  const error: string | null = leadsError || propertiesError || agentsError || null;

  // ─── Dashboard Data (memoized) ────────────────────────────
  const dashboardData = useMemo<DashboardData>(
    () => ({
      properties: allProperties,
      agents: allAgents,
      leads: allLeads,
      hotLeads,
      commissions: allCommissions,
      recentActivities,
      overview,
      contracts: EMPTY_CRM_ARRAY,
      tenants: EMPTY_CRM_ARRAY,
      payments: EMPTY_CRM_ARRAY,
      leases: EMPTY_CRM_ARRAY,
      applications: EMPTY_CRM_ARRAY,
      savedProperties: EMPTY_CRM_ARRAY,
      searchHistory: EMPTY_CRM_ARRAY,
      offers: EMPTY_CRM_ARRAY,
      sales: EMPTY_CRM_ARRAY,
      myRental: EMPTY_CRM_ARRAY,
      maintenanceRequests: EMPTY_CRM_ARRAY,
      leaseInfo: EMPTY_CRM_ARRAY,
    }),
    [allProperties, allAgents, allLeads, hotLeads, allCommissions, recentActivities, overview]
  );

  // ─── Sidebar State ────────────────────────────────────────
  const flyoutOpen = useSelector(selectFlyoutOpen);
  const flyoutDepartment = useSelector(selectFlyoutDepartment);
  const selectedAssistantRedux = useSelector(selectSelectedAssistantSelector);
  const selectedDepartment = useSelector(selectSelectedDepartmentSelector);
  const leftCollapsed = !flyoutOpen;

  // ─── Sidebar Handlers ─────────────────────────────────────
  const handleToggleLeftSidebar = useCallback(() => {
    if (flyoutOpen) {
      dispatch(closeFlyout());
    } else {
      dispatch(openFlyout(flyoutDepartment || selectedDepartment || 'general'));
    }
  }, [dispatch, flyoutOpen, flyoutDepartment, selectedDepartment]);

  const handleSelectAssistant = useCallback(
    (assistant: string | { id?: string }): void => {
      const id = typeof assistant === 'string' ? assistant : assistant?.id || '';
      dispatch(selectAssistant(id));
    },
    [dispatch]
  );

  const handleRetryAll = useCallback(() => {
    dispatch(fetchLeadsFromAPI({}));
    dispatch(fetchPropertiesFromAPI({}));
    dispatch(fetchAgentsFromAPI());
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  // ─── Tab / Role Info ──────────────────────────────────────
  const availableTabs = getTabsForRole(currentRole);
  const roleInfo = getRoleInfo(currentRole);
  useDocumentTitle(`${roleInfo.label} Dashboard`);

  const isSuperUser =
    user?.role === 'owner' ||
    user?.role === 'admin' ||
    user?.role === 'managing_director' ||
    currentRole === 'lion' ||
    currentRole === 'managing_director';

  // ─── Role-Based Data Filtering ────────────────────────────
  const filteredData = useMemo<DashboardData>(() => {
    if (isSuperUser || currentRole === 'lion') {
      return dashboardData;
    }

    if (!dashboardData) return dashboardData;

    const filtered = { ...dashboardData };

    switch (currentRole) {
      case 'landlord':
        filtered.properties = (dashboardData.properties ?? []).filter(p => p.ownerId === user?.id);
        filtered.tenants = (dashboardData.tenants ?? []).filter(t => t.landlordId === user?.id);
        filtered.agents = (dashboardData.agents ?? []).filter(
          a => a.id === (user as CRMEntity)?.assignedAgentId
        );
        filtered.leases = (dashboardData.leases ?? []).filter(l => l.landlordId === user?.id);
        filtered.payments = (dashboardData.payments ?? []).filter(p => p.landlordId === user?.id);
        break;

      case 'tenant':
        filtered.myRental = (dashboardData.myRental ?? []).filter(r => r.tenantId === user?.id);
        filtered.payments = (dashboardData.payments ?? []).filter(p => p.tenantId === user?.id);
        filtered.maintenanceRequests = (dashboardData.maintenanceRequests ?? []).filter(
          m => m.tenantId === user?.id
        );
        filtered.leaseInfo = (dashboardData.leaseInfo ?? []).filter(l => l.tenantId === user?.id);
        break;

      case 'leasing-agent':
        filtered.properties = (dashboardData.properties ?? []).filter(
          p => p.managingAgentId === user?.id
        );
        filtered.tenants = (dashboardData.tenants ?? []).filter(t => t.agentId === user?.id);
        filtered.contracts = (dashboardData.contracts ?? []).filter(c => c.agentId === user?.id);
        filtered.applications = (dashboardData.applications ?? []).filter(
          a => a.agentId === user?.id
        );
        break;

      case 'secondary-sales-agent':
        filtered.properties = (dashboardData.properties ?? []).filter(p => p.agentId === user?.id);
        filtered.leads = (dashboardData.leads ?? []).filter(l => l.agentId === user?.id);
        filtered.contracts = (dashboardData.contracts ?? []).filter(c => c.agentId === user?.id);
        break;

      case 'buyer':
        filtered.savedProperties = (dashboardData.savedProperties ?? []).filter(
          p => p.userId === user?.id
        );
        filtered.searchHistory = (dashboardData.searchHistory ?? []).filter(
          s => s.userId === user?.id
        );
        filtered.offers = (dashboardData.offers ?? []).filter(o => o.buyerId === user?.id);
        filtered.applications = (dashboardData.applications ?? []).filter(
          a => a.buyerId === user?.id
        );
        break;

      case 'seller':
        filtered.properties = (dashboardData.properties ?? []).filter(p => p.sellerId === user?.id);
        filtered.offers = (dashboardData.offers ?? []).filter(o => {
          const propertyBelongsToSeller = (dashboardData.properties ?? []).some(
            p => p.id === o.propertyId && p.sellerId === user?.id
          );
          return propertyBelongsToSeller;
        });
        filtered.sales = (dashboardData.sales ?? []).filter(s => s.sellerId === user?.id);
        break;

      default:
        filtered.properties = [];
        filtered.leads = [];
        break;
    }

    return filtered;
  }, [dashboardData, isSuperUser, currentRole, user]);

  // ─── Effects ──────────────────────────────────────────────

  // Sync active tab to URL search params
  useEffect((): void => {
    if (activeTab) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, setSearchParams]);

  // Fetch CRM data on mount (skip if already loaded)
  useEffect(() => {
    const promises: Array<{ abort?: () => void }> = [];
    if (!allLeads.length && !leadsLoading) promises.push(dispatch(fetchLeadsFromAPI({})));
    if (!allProperties.length && !propertiesLoading)
      promises.push(dispatch(fetchPropertiesFromAPI({})));
    if (!allAgents.length && !agentsLoading) promises.push(dispatch(fetchAgentsFromAPI()));
    if (!overview) promises.push(dispatch(fetchDashboardOverview()));

    return () => {
      promises.forEach(p => p.abort?.());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [dispatch]);

  // Re-fetch overview when role changes
  const prevRoleRef = useRef(currentRole);
  useEffect(() => {
    if (prevRoleRef.current !== currentRole) {
      prevRoleRef.current = currentRole;
      const promise = dispatch(fetchDashboardOverview()) as unknown as {
        abort?: () => void;
      };
      return () => {
        promise.abort?.();
      };
    }
  }, [dispatch, currentRole]);

  // Keyboard shortcut: Ctrl+B / Cmd+B to toggle sidebar flyout
  useEffect((): (() => void) => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyB') {
        e.preventDefault();
        if (flyoutOpen) {
          dispatch(closeFlyout());
        } else {
          dispatch(openFlyout(flyoutDepartment || selectedDepartment || 'general'));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, flyoutOpen, flyoutDepartment, selectedDepartment]);

  // ─── CRM Module Handlers ──────────────────────────────────
  const handleCRMModuleSelect = useCallback((moduleId: string): void => {
    setSelectedCRMModule(moduleId);
    setActiveTab('');
  }, []);

  const handleBackFromCRM = useCallback((): void => {
    setSelectedCRMModule(null);
    setActiveTab('overview');
  }, []);

  // ─── Return ───────────────────────────────────────────────
  return {
    // Core state
    currentRole,
    currentModule,
    currentSubModule,
    user,

    // Tab / CRM module state
    activeTab,
    setActiveTab,
    selectedCRMModule,
    setSelectedCRMModule,

    // Data
    dashboardData,
    filteredData,
    isLoading,
    error,

    // Sidebar state
    flyoutOpen,
    leftCollapsed,
    selectedDepartment,
    selectedAssistantRedux,

    // Role info
    availableTabs,
    roleInfo,
    roleModule,
    roleSubNavItems,
    isSuperUser,

    // Handlers
    handleToggleLeftSidebar,
    handleSelectAssistant,
    handleRetryAll,
    handleCRMModuleSelect,
    handleBackFromCRM,
  } as const;
}
