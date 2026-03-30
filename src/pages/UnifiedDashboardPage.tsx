import React, { FC, useState, useEffect, useMemo, useRef, lazy, Suspense, ReactNode, useCallback, ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROLE_TAB_MAPPING, getTabsForRole, getRoleInfo } from '../config/ROLE_TAB_MAPPING';
import SuspenseLoader from '../components/common/SuspenseLoader';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import MainNavBar from '../components/layout/MainNavBar/MainNavBar';
import SidebarContainer from '../components/layout/SidebarContainer/SidebarContainer';
import AIAssistantsPanel from '../components/layout/AIAssistantsPanel/AIAssistantsPanel';
import DepartmentContentPanel from '../components/layout/DepartmentContentPanel/DepartmentContentPanel';
import { Badge, Tabs, ProgressBar } from '../components/ui';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import SubNavBar from '../components/common/SubNavBar';
import { DashboardSubTabRenderer } from '../components/dashboard/DashboardRenderer';
import { getSubNavItems, getModuleById } from '../features/featureRegistry';
import {
  toggleLeftSidebar,
  toggleRightSidebar,
  selectAssistant,
  toggleShowRightDrawer,
  selectLeftCollapsed,
  selectRightCollapsed,
  selectSelectedAssistant as selectSelectedAssistantSelector,
  selectShowRightDrawer as selectShowRightDrawerSelector,
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
import './UnifiedDashboardPage.css';

// Import tab components (non-lazy for critical paths)
import OverviewTab from '../components/owner/tabs/OverviewTab';
import PropertiesTab from '../components/owner/tabs/PropertiesTab';
import AgentsTab from '../components/owner/tabs/AgentsTab';
import LeadsTab from '../components/owner/tabs/LeadsTab';
import ContractsTab from '../components/owner/tabs/ContractsTab';
import AnalyticsTab from '../components/owner/tabs/AnalyticsTab';
import SettingsTab from '../components/owner/tabs/SettingsTab';
import UsersTab from '../components/owner/tabs/UsersTab';
import AdminDashboard from '../components/admin/AdminDashboard';

// Lazy-load AI modules
const AIAssistantHub = lazy(() => import('../components/crm/AIAssistantHub'));
const AICommandCenter = lazy(() => import('../components/crm/AICommandCenter'));

// Lazy CRM modules
const NadiaWhatsAppCRM = lazy(() => import('../components/crm/NadiaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('../components/crm/MaryInventoryCRM_NEW'));
const ClaraLeadsCRM = lazy(() => import('../components/crm/ClaraLeadsCRM_NEW'));
const NinaWhatsAppBotCRM = lazy(() => import('../components/crm/NinaWhatsAppBotCRM_NEW'));
const NancyHRCRM = lazy(() => import('../components/crm/NancyHRCRM_NEW'));
const SophiaSalesCRM = lazy(() => import('../components/crm/SophiaSalesCRM_NEW'));
const DaisyLeasingCRM = lazy(() => import('../components/crm/DaisyLeasingCRM_NEW'));
const TheodoraFinanceCRM = lazy(() => import('../components/crm/TheodoraFinanceCRM_NEW'));
const OliviaMarketingCRM = lazy(() => import('../components/crm/OliviaMarketingCRM_NEW'));
const ZoeExecutiveCRM = lazy(() => import('../components/crm/ZoeExecutiveCRM_NEW'));
const LailaComplianceCRM = lazy(() => import('../components/crm/LailaComplianceCRM_NEW'));
const AuroraCTODashboard = lazy(() => import('../components/crm/AuroraCTODashboard_NEW'));
const HazelFrontendCRM = lazy(() => import('../components/crm/HazelFrontendCRM_NEW'));
const WillowBackendCRM = lazy(() => import('../components/crm/WillowBackendCRM_NEW'));
const UnifiedCRM = lazy(() => import('../components/crm/UnifiedCRM'));

// Dubai CRM Modules
const RERAComplianceModule = lazy(() => import('../components/crm/RERAComplianceModule'));
const DLDIntegrationModule = lazy(() => import('../components/crm/DLDIntegrationModule'));
const LeadScoringModule = lazy(() => import('../components/crm/LeadScoringModule'));
const PropertyValuationModule = lazy(() => import('../components/crm/PropertyValuationModule'));
const MarketAnalyticsModule = lazy(() => import('../components/crm/MarketAnalyticsModule'));

// Type definitions

/** A generic CRM entity (property, lead, tenant, agent, etc.) keyed by string fields */
type CRMEntity = Record<string, unknown>;

interface DashboardData {
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
interface CRMModuleProps {
  role: string;
  user: Record<string, unknown> | null;
  data: DashboardData;
}

interface CRMModule {
  Component: ComponentType<any>;
  label: string;
}

interface TabLoadingFallbackProps {}

interface UnifiedDashboardPageState {
  activeTab: string;
  dashboardData: DashboardData;
  filteredData: DashboardData;
  isLoading: boolean;
  error: string | null;
  selectedCRMModule: string | null;
}

/** Stable empty array constant for placeholder data fields */
const EMPTY_CRM_ARRAY: CRMEntity[] = [];

const TabLoadingFallback: FC<TabLoadingFallbackProps> = () => (
  <div className="tab-loading-fallback">
    <SuspenseLoader />
  </div>
);

const CRM_MODULES: Record<string, CRMModule> = {
  // Unified CRM Dashboard
  unified: { Component: UnifiedCRM, label: 'Unified CRM Dashboard' },
  
  // AI-Powered CRM Modules
  nadia: { Component: NadiaWhatsAppCRM, label: 'WhatsApp CRM' },
  mary: { Component: MaryInventoryCRM, label: 'Inventory CRM' },
  clara: { Component: ClaraLeadsCRM, label: 'Leads CRM' },
  nina: { Component: NinaWhatsAppBotCRM, label: 'WhatsApp Bot CRM' },
  nancy: { Component: NancyHRCRM, label: 'HR CRM' },
  sophia: { Component: SophiaSalesCRM, label: 'Sales CRM' },
  daisy: { Component: DaisyLeasingCRM, label: 'Leasing CRM' },
  theodora: { Component: TheodoraFinanceCRM, label: 'Finance CRM' },
  olivia: { Component: OliviaMarketingCRM, label: 'Marketing CRM' },
  zoe: { Component: ZoeExecutiveCRM, label: 'Executive CRM' },
  laila: { Component: LailaComplianceCRM, label: 'Compliance CRM' },
  aurora: { Component: AuroraCTODashboard, label: 'CTO Dashboard' },
  hazel: { Component: HazelFrontendCRM, label: 'Frontend CRM' },
  willow: { Component: WillowBackendCRM, label: 'Backend CRM' },
  
  // Dubai CRM Modules
  rera: { Component: RERAComplianceModule, label: 'RERA Compliance' },
  dld: { Component: DLDIntegrationModule, label: 'DLD Integration' },
  leads: { Component: LeadScoringModule, label: 'Lead Scoring' },
  valuation: { Component: PropertyValuationModule, label: 'Property Valuation' },
  analytics: { Component: MarketAnalyticsModule, label: 'Market Analytics' },
};

const UnifiedDashboardPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentRole = useSelector((state: RootState) => state.navigation?.activeRole || 'buyer');
  const currentModule = useSelector((state: RootState) => state.navigation?.currentModule);
  const currentSubModule = useSelector((state: RootState) => state.navigation?.currentSubModule);
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'overview');
  const [selectedCRMModule, setSelectedCRMModule] = useState<string | null>(null);

  // Resolve the feature-registry sub-nav items for the current role
  const roleModule = getModuleById(currentModule ?? currentRole);
  const roleSubNavItems = getSubNavItems(currentRole, currentModule ?? currentRole);

  // ─── Redux CRM State (replaces direct API calls) ─────────────────────
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

  // Per-slice error state — surface the first error to the user
  const leadsError = useSelector(selectLeadsError);
  const propertiesError = useSelector(selectPropertiesError);
  const agentsError = useSelector(selectAgentsError);

  // Composite loading state — shows spinner until all critical data is loaded
  const isLoading = leadsLoading || propertiesLoading || agentsLoading;
  const error: string | null = leadsError || propertiesError || agentsError || null;

  // Build dashboard data from Redux state (consistent across all pages)
  // Memoized to prevent unnecessary re-renders of all child CRM modules
  const dashboardData = useMemo<DashboardData>(() => ({
    properties: allProperties,
    agents: allAgents,
    leads: allLeads,
    hotLeads,
    commissions: allCommissions,
    recentActivities,
    overview,
    contracts: EMPTY_CRM_ARRAY,       // Placeholder for future contractsSlice
    tenants: EMPTY_CRM_ARRAY,         // Placeholder for future tenantsSlice
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
  }), [allProperties, allAgents, allLeads, hotLeads, allCommissions, recentActivities, overview]);

  // Redux sidebar state — use named selectors for stable references
  const leftCollapsed = useSelector(selectLeftCollapsed);
  const rightCollapsed = useSelector(selectRightCollapsed);
  const selectedAssistantRedux = useSelector(selectSelectedAssistantSelector);
  const showRightDrawer = useSelector(selectShowRightDrawerSelector);
  const selectedDepartment = useSelector(selectSelectedDepartmentSelector);

  // Sidebar action handlers
  const handleToggleLeftSidebar = useCallback(() => dispatch(toggleLeftSidebar()), [dispatch]);
  const handleToggleRightSidebar = useCallback(() => {
    dispatch(toggleRightSidebar());
    dispatch(toggleShowRightDrawer());
  }, [dispatch]);

  const handleSelectAssistant = useCallback((assistant: any): void => {
    const id = typeof assistant === 'string' ? assistant : assistant?.id || assistant;
    dispatch(selectAssistant(id));
  }, [dispatch]);

  // Memoized retry handler — avoids new function identity on every render
  const handleRetryAll = useCallback(() => {
    dispatch(fetchLeadsFromAPI({}));
    dispatch(fetchPropertiesFromAPI({}));
    dispatch(fetchAgentsFromAPI());
    dispatch(fetchDashboardOverview());
  }, [dispatch]);

  // Get available tabs for current role
  const availableTabs = getTabsForRole(currentRole);
  const roleInfo = getRoleInfo(currentRole);
  useDocumentTitle(`${roleInfo.label} Dashboard`);
  
  // Check if user is super user (owner/admin sees all data)
  const isSuperUser = user?.role === 'owner' || user?.role === 'admin' || currentRole === 'lion';

  /**
   * Filter data based on user role
   * Super users see all data, others see only their role-specific data.
   * Uses `(arr ?? []).filter(...)` to guarantee array output (never undefined).
   */
  const filteredData = useMemo<DashboardData>(() => {
    if (isSuperUser || currentRole === 'lion') {
      // Super users see ALL data unfiltered
      return dashboardData;
    }

    if (!dashboardData) return dashboardData;

    const filtered = { ...dashboardData };

    // Role-specific data filtering - each role sees ONLY their data
    switch (currentRole) {
      case 'landlord':
        // Landlords see ONLY their properties and their tenants
        filtered.properties = (dashboardData.properties ?? []).filter((p) => p.ownerId === user?.id);
        filtered.tenants = (dashboardData.tenants ?? []).filter((t) => t.landlordId === user?.id);
        filtered.agents = (dashboardData.agents ?? []).filter((a) => a.id === (user as CRMEntity)?.assignedAgentId);
        filtered.leases = (dashboardData.leases ?? []).filter((l) => l.landlordId === user?.id);
        filtered.payments = (dashboardData.payments ?? []).filter((p) => p.landlordId === user?.id);
        break;

      case 'tenant':
        // Tenants see ONLY their rental information
        filtered.myRental = (dashboardData.myRental ?? []).filter((r) => r.tenantId === user?.id);
        filtered.payments = (dashboardData.payments ?? []).filter((p) => p.tenantId === user?.id);
        filtered.maintenanceRequests = (dashboardData.maintenanceRequests ?? []).filter((m) => m.tenantId === user?.id);
        filtered.leaseInfo = (dashboardData.leaseInfo ?? []).filter((l) => l.tenantId === user?.id);
        break;

      case 'leasing-agent':
        // Leasing agents see ONLY their assigned properties and clients
        filtered.properties = (dashboardData.properties ?? []).filter((p) => p.managingAgentId === user?.id);
        filtered.tenants = (dashboardData.tenants ?? []).filter((t) => t.agentId === user?.id);
        filtered.contracts = (dashboardData.contracts ?? []).filter((c) => c.agentId === user?.id);
        filtered.applications = (dashboardData.applications ?? []).filter((a) => a.agentId === user?.id);
        break;

      case 'secondary-sales-agent':
        // Sales agents see ONLY their assigned clients and deals
        filtered.properties = (dashboardData.properties ?? []).filter((p) => p.agentId === user?.id);
        filtered.leads = (dashboardData.leads ?? []).filter((l) => l.agentId === user?.id);
        filtered.contracts = (dashboardData.contracts ?? []).filter((c) => c.agentId === user?.id);
        break;

      case 'buyer':
        // Buyers see ONLY their saved properties and offers
        filtered.savedProperties = (dashboardData.savedProperties ?? []).filter((p) => p.userId === user?.id);
        filtered.searchHistory = (dashboardData.searchHistory ?? []).filter((s) => s.userId === user?.id);
        filtered.offers = (dashboardData.offers ?? []).filter((o) => o.buyerId === user?.id);
        filtered.applications = (dashboardData.applications ?? []).filter((a) => a.buyerId === user?.id);
        break;

      case 'seller':
        // Sellers see ONLY their properties for sale
        filtered.properties = (dashboardData.properties ?? []).filter((p) => p.sellerId === user?.id);
        filtered.offers = (dashboardData.offers ?? []).filter((o) => {
          const propertyBelongsToSeller = (dashboardData.properties ?? []).some(
            (p) => p.id === o.propertyId && p.sellerId === user?.id
          );
          return propertyBelongsToSeller;
        });
        filtered.sales = (dashboardData.sales ?? []).filter((s) => s.sellerId === user?.id);
        break;

      default:
        // Default: return minimal data
        filtered.properties = [];
        filtered.leads = [];
        break;
    }

    return filtered;
  }, [dashboardData, isSuperUser, currentRole, user?.id]);

  useEffect((): void => {
    // Only sync non-empty tabs to URL; empty means CRM module is selected
    if (activeTab) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, setSearchParams]);

  // ─── Fetch CRM data via Redux thunks (conditional — skip if already loaded) ──
  useEffect(() => {
    const promises: Array<{ abort?: () => void }> = [];
    if (!allLeads.length && !leadsLoading) promises.push(dispatch(fetchLeadsFromAPI({})));
    if (!allProperties.length && !propertiesLoading) promises.push(dispatch(fetchPropertiesFromAPI({})));
    if (!allAgents.length && !agentsLoading) promises.push(dispatch(fetchAgentsFromAPI()));
    if (!overview) promises.push(dispatch(fetchDashboardOverview()));

    return () => {
      // Abort in-flight requests on unmount to prevent memory leaks
      promises.forEach(p => p.abort?.());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run once on mount; guards prevent re-fetching loaded data
  }, [dispatch]);

  // Re-fetch overview when role changes (skip initial mount — handled above)
  const prevRoleRef = useRef(currentRole);
  useEffect(() => {
    if (prevRoleRef.current !== currentRole) {
      prevRoleRef.current = currentRole;
      const promise = dispatch(fetchDashboardOverview()) as unknown as { abort?: () => void };
      return () => { promise.abort?.(); };
    }
  }, [dispatch, currentRole]);

  // Keyboard shortcuts for sidebar toggles
  useEffect((): (() => void) => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Ctrl+B or Cmd+B to toggle left sidebar
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyB') {
        e.preventDefault();
        dispatch(toggleLeftSidebar());
      }
      // Ctrl+Shift+A or Cmd+Shift+A to toggle right sidebar (avoids hijacking native Ctrl+A select-all)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        dispatch(toggleRightSidebar());
        dispatch(toggleShowRightDrawer());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  // Helper: Render tab content based on activeTab
  const renderTabContent = (): ReactNode => {
    // Use the memoized role-filtered data
    const dataToRender = filteredData || dashboardData;

    // Check if user selected a CRM module
    if (selectedCRMModule && CRM_MODULES[selectedCRMModule]) {
      const Module = CRM_MODULES[selectedCRMModule].Component;
      const label = CRM_MODULES[selectedCRMModule].label;
      return (
        <RouteErrorBoundary section={label}>
          <Suspense fallback={<TabLoadingFallback />}>
            <Module role={currentRole} user={user} data={dataToRender} />
          </Suspense>
        </RouteErrorBoundary>
      );
    }

    // ─── Feature-registry sub-module rendering ────────────────────────
    // When a sub-module is active (via SubNavBar click), resolve the
    // component name from featureRegistry and render via DashboardSubTabRenderer.
    if (currentSubModule && roleSubNavItems.length > 0) {
      const subItem = roleSubNavItems.find((s) => s.id === currentSubModule);
      if (subItem) {
        return (
          <RouteErrorBoundary section={subItem.label}>
            <DashboardSubTabRenderer
              componentName={subItem.component}
              fallback={<TabLoadingFallback />}
            />
          </RouteErrorBoundary>
        );
      }
    }

    // Render standard tabs
    switch (activeTab) {
      case 'overview':
        return (
          <RouteErrorBoundary section="Overview">
            <OverviewTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
      case 'properties':
        return (
          <RouteErrorBoundary section="Properties">
            <PropertiesTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
      case 'agents':
        return (
          <RouteErrorBoundary section="Agents">
            <AgentsTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
      case 'leads':
        return (
          <RouteErrorBoundary section="Leads">
            <LeadsTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
      case 'contracts':
        return (
          <RouteErrorBoundary section="Contracts">
            <ContractsTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
      case 'analytics':
        return (
          <RouteErrorBoundary section="Analytics">
            <AnalyticsTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
      case 'admin':
        return (
          <RouteErrorBoundary section="Admin">
            <AdminDashboard />
          </RouteErrorBoundary>
        );
      case 'ai-hub':
        return (
          <RouteErrorBoundary section="AI Assistant Hub">
            <Suspense fallback={<TabLoadingFallback />}>
              <AIAssistantHub />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'ai-command':
        return (
          <RouteErrorBoundary section="AI Command Center">
            <Suspense fallback={<TabLoadingFallback />}>
              <AICommandCenter />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'users':
        return (
          <RouteErrorBoundary section="Users">
            <UsersTab />
          </RouteErrorBoundary>
        );
      case 'settings':
        return (
          <RouteErrorBoundary section="Settings">
            <SettingsTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
      default:
        return (
          <RouteErrorBoundary section="Overview">
            <OverviewTab data={dataToRender as any} />
          </RouteErrorBoundary>
        );
    }
  };

  // Helper: Render dashboard stats with badges
  const renderDashboardStats = (): ReactNode => {
    const propertiesCount = dashboardData?.properties?.length || 0;
    const agentsCount = dashboardData?.agents?.length || 0;
    const leadsCount = dashboardData?.leads?.length || 0;
    const contractsCount = dashboardData?.contracts?.length || 0;

    return (
      <div className="dashboard-stats-container">
        <div className="stat-item">
          <span className="stat-label">Properties:</span>
          <Badge variant="success" size="medium">{propertiesCount}</Badge>
        </div>
        <div className="stat-item">
          <span className="stat-label">Agents:</span>
          <Badge variant="info" size="medium">{agentsCount}</Badge>
        </div>
        <div className="stat-item">
          <span className="stat-label">Leads:</span>
          <Badge variant="warning" size="medium">{leadsCount}</Badge>
        </div>
        <div className="stat-item">
          <span className="stat-label">Contracts:</span>
          <Badge variant="primary" size="medium">{contractsCount}</Badge>
        </div>
      </div>
    );
  };

  // Helper: Render performance metrics with progress bars
  const renderPerformanceMetrics = (): ReactNode => {
    const propertiesCount = dashboardData?.properties?.length || 0;
    const agentsCount = dashboardData?.agents?.length || 0;
    const leadsCount = dashboardData?.leads?.length || 0;
    const overallProgress = Math.min(100, (propertiesCount * 2 + agentsCount * 3 + leadsCount) / 10);
    
    return (
      <div className="performance-metrics">
        <h3>Performance Metrics</h3>
        <div className="metrics-list">
          <div className="metric-item">
            <label className="metric-label">
              Dashboard Completion: {Math.round(overallProgress)}%
            </label>
            <ProgressBar variant="success" value={overallProgress} striped animated />
          </div>
          <div className="metric-item">
            <label className="metric-label">
              Data Synchronization: 95%
            </label>
            <ProgressBar variant="info" value={95} />
          </div>
        </div>
      </div>
    );
  };

  // Handle CRM Module Selection
  const handleCRMModuleSelect = useCallback((moduleId: string): void => {
    setSelectedCRMModule(moduleId);
    setActiveTab(''); // Clear active tab when showing CRM module
  }, []);

  // Handle Back from CRM Module
  const handleBackFromCRM = useCallback((): void => {
    setSelectedCRMModule(null);
    setActiveTab('overview');
  }, []);

  if (!user) {
    return (
      <div className="unified-dashboard unified-dashboard-error">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Navigation Bar */}
      <MainNavBar
        user={user}
        leftSidebarCollapsed={leftCollapsed}
        rightSidebarCollapsed={rightCollapsed}
        onToggleLeftSidebar={handleToggleLeftSidebar}
        onToggleRightSidebar={handleToggleRightSidebar}
      />

      {/* Main Layout Container */}
      <div className="unified-dashboard-layout">
        {/* Left Sidebar - Fixed Overlay (Desktop) / Drawer (Mobile) */}
        <SidebarContainer
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Center Content Area */}
        <div className={`dashboard-center ${leftCollapsed ? 'left-collapsed' : ''}`}>
          {/* Main Dashboard */}
          <div className="unified-dashboard">
            {/* Dashboard Header */}
            <div className="unified-dashboard-header">
              <div className="dashboard-title">
                <h1>{roleInfo.label} Dashboard</h1>
                <p className="dashboard-subtitle">{roleInfo.description}</p>
              </div>
              <div className="dashboard-info">
                <span className="user-email">{user.email}</span>
              </div>
              {/* Dashboard Stats with Badges */}
              {!selectedDepartment && !selectedCRMModule && renderDashboardStats()}
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="unified-dashboard-error-banner"
                role="alert"
                aria-live="assertive"
              >
                <span className="error-icon" aria-hidden="true">⚠️</span>
                <p>{error}</p>
                <button
                  onClick={handleRetryAll}
                  aria-label="Retry loading dashboard data"
                >
                  Retry
                </button>
              </div>
            )}

            {/* CRM Module View */}
            {selectedCRMModule && CRM_MODULES[selectedCRMModule] && isSuperUser && (
              <div className="crm-module-view">
                <button className="crm-back-button" onClick={handleBackFromCRM}>
                  Back to Dashboard
                </button>
                <div className="crm-module-container">
                  <Suspense fallback={<TabLoadingFallback />}>
                    {React.createElement(CRM_MODULES[selectedCRMModule].Component, {
                      role: currentRole,
                      user,
                      data: dashboardData
                    })}
                  </Suspense>
                </div>
              </div>
            )}

            {/* Standard Tab View */}
            {!selectedCRMModule && (
              <>
                {/* Show Department Content if Department is Selected */}
                {selectedDepartment ? (
                  <div className="unified-dashboard-content">
                    <DepartmentContentPanel />
                  </div>
                ) : (
                  <>
                    {/* Role-specific Sub-Navigation (from featureRegistry) */}
                    {roleSubNavItems.length > 0 && (
                      <SubNavBar moduleId={currentModule ?? currentRole} />
                    )}

                    {/* Tab Navigation */}
                    <div className="unified-dashboard-tabs">
                      <div className="tabs-scroll">
                        {availableTabs.map((tab) => (
                          <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                          </button>
                        ))}

                        {/* CRM Modules - Super User Only */}
                        {isSuperUser && (
                          <>
                            <div className="tab-divider"></div>
                            <div className="crm-modules-dropdown">
                              <button className="crm-modules-button">
                                <span className="tab-icon">bot</span>
                                <span className="tab-label">AI CRM Modules</span>
                                <span className="dropdown-arrow">▼</span>
                              </button>
                              <div className="crm-modules-menu">
                                {Object.entries(CRM_MODULES).map(([key, module]) => (
                                  <button
                                    key={key}
                                    className="crm-module-option"
                                    onClick={() => handleCRMModuleSelect(key)}
                                  >
                                    {module.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="unified-dashboard-content">
                      {isLoading ? (
                        <TabLoadingFallback />
                      ) : (
                        <Suspense fallback={<TabLoadingFallback />}>
                          {renderTabContent()}
                        </Suspense>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - Mirror of Left (with AI Assistants) */}
        <AIAssistantsPanel
          isOpen={!rightCollapsed}
          onClose={handleToggleRightSidebar}
          onAssistantSelect={handleSelectAssistant}
        />

        {/* Right Drawer for Mobile (< 768px) */}
        {showRightDrawer && (
          <div className="right-drawer-overlay" onClick={handleToggleRightSidebar} role="dialog" aria-label="Close sidebar overlay" onKeyDown={(e: React.KeyboardEvent) => e.key === 'Escape' && handleToggleRightSidebar()}>
            <div className="right-drawer" onClick={(e: React.MouseEvent) => e.stopPropagation()} role="complementary" aria-label="AI Assistants panel">
              <AIAssistantsPanel
                isOpen={true}
                onClose={handleToggleRightSidebar}
                onAssistantSelect={handleSelectAssistant}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UnifiedDashboardPage;
