import React, {
  FC,
  ReactNode,
  ComponentType,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import SuspenseLoader from '../components/common/SuspenseLoader';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import DepartmentContentPanel from '../components/layout/DepartmentContentPanel/DepartmentContentPanel';
import MobileCRMDrawer from '../components/layout/MobileCRMDrawer';
import AuthenticatedPageShell from '../components/layout/authenticated/AuthenticatedPageShell';
import DashboardShell from '../components/layout/DashboardShell/DashboardShell';
import DashboardTopBar from '../components/layout/DashboardTopBar/DashboardTopBar';
import DashboardSidebar from '../components/layout/DashboardSidebar/DashboardSidebar';
import SubNavBar from '../components/common/SubNavBar';
import { DashboardSubTabRenderer } from '../components/dashboard/DashboardRenderer';
import SuperuserControlCenter from '../components/dashboard/SuperuserControlCenter';
import DashboardKPIStrip from '../components/dashboard/DashboardKPIStrip';
import DashboardGreetingBanner from '../components/dashboard/DashboardGreetingBanner';
import DashboardCommandPalette from '../components/dashboard/DashboardCommandPalette';
import DashboardWorkspaceTabs from '../components/dashboard/DashboardWorkspaceTabs';
import DashboardActivityFeed from '../components/dashboard/DashboardActivityFeed';
import DashboardModuleGrid from '../components/dashboard/DashboardModuleGrid';
import AIAssistantGrid from '../components/dashboard/AIAssistantGrid';
import CRMContextPanel from '../components/crm/CRMContextPanel';
import { useUnifiedDashboard } from '../hooks/useUnifiedDashboard';
import type { DashboardData, CRMModuleProps } from '../hooks/useUnifiedDashboard';
import { AI_ASSISTANTS_REGISTRY } from '../store/slices/aiAssistant/registry';
import { selectSelectedAssistant } from '../store/slices/sidebarSlice';
import { SUPERUSER_CRM_MODULE_ORDER, getCRMModule } from '../config/crmModuleRegistry';
import {
  ZONE_LABELS,
  groupModulesForMD,
  groupWorkspacesForMD,
} from '../config/crmNavigationSchema';
import type { RootState } from '../store/store';
import './UnifiedDashboardPage.css';
import '../styles/dashboard-tokens.css';

import OverviewTab from '../components/owner/tabs/OverviewTab';
import PropertiesTab from '../components/owner/tabs/PropertiesTab';
import AgentsTab from '../components/owner/tabs/AgentsTab';
import LeadsTab from '../components/owner/tabs/LeadsTab';
import ContractsTab from '../components/owner/tabs/ContractsTab';
import AnalyticsTab from '../components/owner/tabs/AnalyticsTab';
import { CommissionsTab } from '../components/owner/tabs/CommissionsTab';
import SettingsTab from '../components/owner/tabs/SettingsTab';
import UsersTab from '../components/owner/tabs/UsersTab';
import type {
  OverviewData,
  PropertiesData,
  AgentsData,
  LeadsData,
  ContractsData,
  AnalyticsData,
  SettingsData,
} from '../components/owner/tabs/types';
import AdminDashboard from '../components/admin/AdminDashboard';

const AIAssistantHub = lazy(() => import('../components/crm/AIAssistantHub'));
const AICommandCenter = lazy(() => import('../components/crm/AICommandCenter'));

interface CRMModule {
  Component: ComponentType<CRMModuleProps>;
  label: string;
}

type GenericEntity = Record<string, unknown>;

interface SearchItem {
  id: string;
  icon: string;
  label: string;
  meta: string;
  type: 'tab' | 'module' | 'record';
  target: string;
}

function tabData<T>(data: DashboardData | null | undefined): T {
  return (data ?? {}) as unknown as T;
}

const TabLoadingFallback: FC = () => (
  <div className="tab-loading-fallback">
    <SuspenseLoader />
  </div>
);

const CRM_MODULES: Record<string, CRMModule> = SUPERUSER_CRM_MODULE_ORDER.reduce(
  (accumulator, moduleId) => {
    const moduleDef = getCRMModule(moduleId);
    if (!moduleDef) return accumulator;
    accumulator[moduleId] = {
      Component: moduleDef.Component as ComponentType<CRMModuleProps>,
      label: moduleDef.label,
    };
    return accumulator;
  },
  {} as Record<string, CRMModule>
);

const moduleEntries = Object.entries(CRM_MODULES);

const getTimeGreeting = (date: Date): string => {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const getEntityLabel = (entity: GenericEntity, keys: string[], fallback: string): string => {
  for (const key of keys) {
    const value = entity[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
};

const getEntityMeta = (entity: GenericEntity, keys: string[]): string => {
  for (const key of keys) {
    const value = entity[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return 'Open workspace';
};

const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat('en', { notation: value >= 1000 ? 'compact' : 'standard' }).format(value);

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(value);

const UnifiedDashboardPage: FC = () => {
  const navigate = useNavigate();
  const {
    currentRole,
    currentModule,
    currentSubModule,
    user,
    activeTab,
    setActiveTab,
    selectedCRMModule,
    dashboardData,
    filteredData,
    isLoading,
    error,
    selectedDepartment,
    availableTabs,
    roleInfo,
    roleSubNavItems,
    isSuperUser,
    handleRetryAll,
    handleCRMModuleSelect,
    handleBackFromCRM,
    handleWorkspaceSelect,
  } = useUnifiedDashboard();

  const selectedAssistant = useSelector((state: RootState) => selectSelectedAssistant(state));
  const prefersReducedMotion = useReducedMotion();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [aiModulesExpanded, setAiModulesExpanded] = useState(true);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [departmentsExpanded, setDepartmentsExpanded] = useState(true);
  const [selectedContext, setSelectedContext] = useState<SearchItem | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (!selectedAssistant) return;
    if (selectedAssistant in CRM_MODULES) {
      handleCRMModuleSelect(selectedAssistant);
    }
  }, [selectedAssistant, handleCRMModuleSelect]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      if (event.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsGlobalSearchOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isMobileDrawerOpen) return;

    const onResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileDrawerOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isMobileDrawerOpen]);

  const selectedCRMModuleConfig = selectedCRMModule ? CRM_MODULES[selectedCRMModule] : null;
  const currentTab = availableTabs.find(tab => tab.id === activeTab);

  const overview = (dashboardData?.overview ?? {}) as GenericEntity;
  const propertiesCount = dashboardData?.properties?.length ?? 0;
  const agentsCount = dashboardData?.agents?.length ?? 0;
  const leadsCount = dashboardData?.leads?.length ?? 0;
  const contractsCount = dashboardData?.contracts?.length ?? 0;
  const hotLeadsCount = dashboardData?.hotLeads?.length ?? 0;
  const monthlyRevenue = toNumber(
    overview.monthlyRevenue ?? overview.totalRevenue ?? overview.revenue ?? 0
  );

  const greetingName = user?.name?.trim() || user?.email.split('@')[0] || 'team';
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const greetingLine = `${getTimeGreeting(new Date())}, ${greetingName} · ${todayLabel} · ${hotLeadsCount} active leads need follow-up`;

  const kpiCards = useMemo(
    () => [
      {
        id: 'properties',
        icon: '🏙️',
        label: 'Properties',
        value: formatCompactNumber(propertiesCount),
        subtext: 'Live portfolio',
        trend: `${Math.max(propertiesCount - hotLeadsCount, 0)} ready`,
        positive: true,
      },
      {
        id: 'leads',
        icon: '📱',
        label: 'Leads',
        value: formatCompactNumber(leadsCount),
        subtext: 'Pipeline volume',
        trend: `${hotLeadsCount} hot`,
        positive: hotLeadsCount > 0,
      },
      {
        id: 'revenue',
        icon: '💼',
        label: 'Revenue',
        value: formatCurrency(monthlyRevenue),
        subtext: 'This month',
        trend: monthlyRevenue > 0 ? 'On track' : 'No revenue yet',
        positive: monthlyRevenue > 0,
      },
      {
        id: 'agents',
        icon: '👥',
        label: 'Agents',
        value: formatCompactNumber(agentsCount),
        subtext: 'Active operators',
        trend: agentsCount > 0 ? 'Team online' : 'Awaiting assignments',
        positive: agentsCount > 0,
      },
      {
        id: 'contracts',
        icon: '📋',
        label: 'Contracts',
        value: formatCompactNumber(contractsCount),
        subtext: 'Tracked documents',
        trend: contractsCount > 0 ? 'Execution moving' : 'No active contracts',
        positive: contractsCount > 0,
      },
    ],
    [agentsCount, contractsCount, hotLeadsCount, leadsCount, monthlyRevenue, propertiesCount]
  );

  const profileCompletionItems = useMemo(
    () => [
      { id: 'name', label: 'Full name', complete: Boolean(user?.name?.trim()) },
      { id: 'phone', label: 'Phone number', complete: Boolean(user?.phone?.trim()) },
      { id: 'photo', label: 'Profile photo', complete: Boolean(user?.photoURL?.trim()) },
    ],
    [user?.name, user?.phone, user?.photoURL]
  );

  const profileCompletionPercent = useMemo(() => {
    const completed = profileCompletionItems.filter(item => item.complete).length;
    return Math.round((completed / profileCompletionItems.length) * 100);
  }, [profileCompletionItems]);

  const hasProfileCompletionGaps = profileCompletionPercent < 100;
  const superuserModuleCount = moduleEntries.length;
  const groupedWorkspaces = useMemo(() => groupWorkspacesForMD(availableTabs), [availableTabs]);
  const groupedModules = useMemo(() => groupModulesForMD(moduleEntries), []);
  const departmentZones = useMemo(
    () =>
      Object.entries(groupedModules.byZone)
        .filter(([, items]) => items.length > 0)
        .sort((a, b) => (ZONE_LABELS[a[0]] ?? a[0]).localeCompare(ZONE_LABELS[b[0]] ?? b[0])),
    [groupedModules.byZone]
  );
  const availableTabIds = useMemo(() => new Set(availableTabs.map(tab => tab.id)), [availableTabs]);

  const commandItems = useMemo<SearchItem[]>(() => {
    const query = commandQuery.trim().toLowerCase();
    const tabs = availableTabs.map(tab => ({
      id: `tab-${tab.id}`,
      icon: tab.icon,
      label: tab.label,
      meta: 'Open workspace',
      type: 'tab' as const,
      target: tab.id,
    }));
    const modules = isSuperUser
      ? moduleEntries.map(([key, module]) => {
          const def = getCRMModule(key);
          return {
            id: `module-${key}`,
            icon: def?.icon ?? '🤖',
            label: module.label,
            meta: def?.zone ? (ZONE_LABELS[def.zone] ?? def.zone.replace(/_/g, ' ')) : 'CRM module',
            type: 'module' as const,
            target: key,
          };
        })
      : [];

    return [...tabs, ...modules].filter(item => {
      if (!query) return true;
      return `${item.label} ${item.meta}`.toLowerCase().includes(query);
    });
  }, [availableTabs, commandQuery, isSuperUser]);

  const globalSearchResults = useMemo<SearchItem[]>(() => {
    const query = globalSearchQuery.trim().toLowerCase();
    if (!query) return [];

    const recordMatches = (
      records: GenericEntity[],
      target: string,
      icon: string,
      typeLabel: string
    ) =>
      records
        .filter(record => {
          const haystack = JSON.stringify(record).toLowerCase();
          return haystack.includes(query);
        })
        .slice(0, 2)
        .map((record, index) => ({
          id: `${target}-${index}`,
          icon,
          label: getEntityLabel(
            record,
            ['title', 'name', 'code', 'email', 'phone', 'interest'],
            `${typeLabel} match`
          ),
          meta: getEntityMeta(record, ['location', 'email', 'agent', 'status', 'interest']),
          type: 'record' as const,
          target,
        }));

    const structuralMatches: SearchItem[] = [
      ...availableTabs
        .filter(tab => `${tab.label} ${tab.id}`.toLowerCase().includes(query))
        .map(tab => ({
          id: `tab-search-${tab.id}`,
          icon: tab.icon,
          label: tab.label,
          meta: 'Jump to workspace',
          type: 'tab' as const,
          target: tab.id,
        })),
      ...(isSuperUser
        ? moduleEntries
            .filter(([, module]) => module.label.toLowerCase().includes(query))
            .map(([key, module]) => {
              const def = getCRMModule(key);
              return {
                id: `module-search-${key}`,
                icon: def?.icon ?? '🤖',
                label: module.label,
                meta: def?.zone
                  ? (ZONE_LABELS[def.zone] ?? def.zone.replace(/_/g, ' '))
                  : 'CRM module',
                type: 'module' as const,
                target: key,
              };
            })
        : []),
    ];

    return [
      ...structuralMatches,
      ...recordMatches(dashboardData?.properties ?? [], 'properties', '🏙️', 'Property'),
      ...recordMatches(dashboardData?.leads ?? [], 'leads', '📱', 'Lead'),
      ...recordMatches(dashboardData?.agents ?? [], 'agents', '👥', 'Agent'),
    ].slice(0, 8);
  }, [
    availableTabs,
    dashboardData?.agents,
    dashboardData?.leads,
    dashboardData?.properties,
    globalSearchQuery,
    isSuperUser,
  ]);

  const commandItemsById = useMemo(
    () => new Map(commandItems.map(item => [item.id, item])),
    [commandItems]
  );
  const globalSearchItemsById = useMemo(
    () => new Map(globalSearchResults.map(item => [item.id, item])),
    [globalSearchResults]
  );

  const executeSearchItem = (item: SearchItem) => {
    setSelectedContext(item);
    if (item.type === 'module') {
      handleCRMModuleSelect(item.target);
    } else {
      handleWorkspaceSelect(item.target);
    }

    setCommandQuery('');
    setGlobalSearchQuery('');
    setIsCommandPaletteOpen(false);
    setIsGlobalSearchOpen(false);
  };

  const openWorkspaceTab = (tabId: string, fallbackModule?: string) => {
    if (availableTabIds.has(tabId)) {
      handleWorkspaceSelect(tabId);
      return;
    }

    if (fallbackModule) {
      handleCRMModuleSelect(fallbackModule);
      return;
    }

    handleBackFromCRM();
    handleWorkspaceSelect('overview');
  };

  const renderTabContent = (): ReactNode => {
    const dataToRender = filteredData || dashboardData;

    if (selectedCRMModuleConfig) {
      const Module = selectedCRMModuleConfig.Component;
      const label = selectedCRMModuleConfig.label;
      return (
        <RouteErrorBoundary section={label}>
          <Suspense fallback={<TabLoadingFallback />}>
            <Module role={currentRole} user={user} data={dataToRender} />
          </Suspense>
        </RouteErrorBoundary>
      );
    }

    if (currentSubModule && roleSubNavItems.length > 0) {
      const subItem = roleSubNavItems.find(item => item.id === currentSubModule);
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

    if (activeTab && activeTab in AI_ASSISTANTS_REGISTRY) {
      return (
        <RouteErrorBoundary section="AI Command Center">
          <Suspense fallback={<TabLoadingFallback />}>
            <AICommandCenter />
          </Suspense>
        </RouteErrorBoundary>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <RouteErrorBoundary section="Overview">
            <OverviewTab data={tabData<OverviewData>(dataToRender)} />
          </RouteErrorBoundary>
        );
      case 'properties':
        return (
          <RouteErrorBoundary section="Properties">
            <PropertiesTab data={tabData<PropertiesData>(dataToRender)} />
          </RouteErrorBoundary>
        );
      case 'agents':
        return (
          <RouteErrorBoundary section="Agents">
            <AgentsTab data={tabData<AgentsData>(dataToRender)} />
          </RouteErrorBoundary>
        );
      case 'leads':
        return (
          <RouteErrorBoundary section="Leads">
            <LeadsTab data={tabData<LeadsData>(dataToRender)} />
          </RouteErrorBoundary>
        );
      case 'contracts':
        return (
          <RouteErrorBoundary section="Contracts">
            <ContractsTab data={tabData<ContractsData>(dataToRender)} />
          </RouteErrorBoundary>
        );
      case 'analytics':
        return (
          <RouteErrorBoundary section="Analytics">
            <AnalyticsTab data={tabData<AnalyticsData>(dataToRender)} />
          </RouteErrorBoundary>
        );
      case 'commissions':
        return (
          <RouteErrorBoundary section="Commissions">
            <CommissionsTab />
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
            <SettingsTab data={tabData<SettingsData>(dataToRender)} />
          </RouteErrorBoundary>
        );
      default:
        return (
          <RouteErrorBoundary section="Overview">
            <OverviewTab data={tabData<OverviewData>(dataToRender)} />
          </RouteErrorBoundary>
        );
    }
  };

  if (!user) {
    return (
      <div className="unified-dashboard unified-dashboard-error">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  const activeContentKey =
    selectedCRMModule || currentSubModule || selectedDepartment || activeTab || 'overview';

  return (
    <AuthenticatedPageShell>
      {error && (
        <div className="unified-dashboard-error-banner" role="alert" aria-live="assertive">
          <span className="error-icon" aria-hidden="true">
            ⚠️
          </span>
          <p>{error}</p>
          <button onClick={handleRetryAll} aria-label="Retry loading dashboard data">
            Retry
          </button>
        </div>
      )}

      <DashboardShell
        topbar={
          <DashboardTopBar
            isSuperUser={isSuperUser}
            greetingName={greetingName}
            email={user.email}
            hotLeadsCount={hotLeadsCount}
            searchQuery={globalSearchQuery}
            searchResults={globalSearchResults}
            isSearchOpen={isGlobalSearchOpen}
            onSearchChange={query => {
              setGlobalSearchQuery(query);
              setIsGlobalSearchOpen(true);
            }}
            onSearchFocus={() => setIsGlobalSearchOpen(true)}
            onSearchEnter={() => {
              if (globalSearchResults[0]) {
                executeSearchItem(globalSearchResults[0]);
              }
            }}
            onSearchResultSelect={resultId => {
              const item = globalSearchItemsById.get(resultId);
              if (item) executeSearchItem(item);
            }}
            onSearchBlurOutside={() => setIsGlobalSearchOpen(false)}
            onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        }
        sidebar={
          <DashboardSidebar
            isSuperUser={isSuperUser}
            activeTab={activeTab}
            selectedCRMModule={selectedCRMModule}
            pinnedTabs={groupedWorkspaces.pinned}
            coreTabs={groupedWorkspaces.core}
            aiModules={groupedModules.ai}
            advancedModules={groupedModules.advanced}
            zoneGroups={departmentZones.map(([zone, items]) => ({ zone, items }))}
            zoneLabels={ZONE_LABELS}
            aiModulesExpanded={aiModulesExpanded}
            departmentsExpanded={departmentsExpanded}
            advancedExpanded={advancedExpanded}
            onToggleAiModules={() => setAiModulesExpanded(current => !current)}
            onToggleDepartments={() => setDepartmentsExpanded(current => !current)}
            onToggleAdvanced={() => setAdvancedExpanded(current => !current)}
            onSelectTab={tabId => {
              const tab = availableTabs.find(item => item.id === tabId);
              setSelectedContext({
                id: `tab-${tabId}`,
                icon: tab?.icon ?? '🧭',
                label: tab?.label ?? tabId,
                meta: 'Workspace',
                type: 'tab',
                target: tabId,
              });
              handleWorkspaceSelect(tabId);
            }}
            onSelectModule={moduleId => {
              const module = getCRMModule(moduleId);
              setSelectedContext({
                id: `module-${moduleId}`,
                icon: module?.icon ?? '🤖',
                label: module?.label ?? moduleId,
                meta: module?.zone ? (ZONE_LABELS[module.zone] ?? module.zone) : 'CRM module',
                type: 'module',
                target: moduleId,
              });
              handleCRMModuleSelect(moduleId);
            }}
          />
        }
        rightPanel={
          !selectedDepartment ? (
            <CRMContextPanel
              isSuperUser={isSuperUser}
              activeWorkspaceLabel={selectedCRMModuleConfig?.label ?? currentTab?.label ?? 'Overview'}
              activeWorkspaceMeta={
                selectedCRMModuleConfig ? 'AI CRM module context' : 'Workspace context'
              }
              selectedContext={
                selectedContext
                  ? {
                      label: selectedContext.label,
                      meta: selectedContext.meta,
                      type: selectedContext.type,
                    }
                  : null
              }
              recentActivities={
                Array.isArray(dashboardData?.recentActivities) ? dashboardData.recentActivities : []
              }
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenQuickAction={() => setIsCommandPaletteOpen(true)}
            />
          ) : undefined
        }
      >
        <main id="dashboard-main" className="dashboard-main-panel">
          <DashboardGreetingBanner
            currentModule={currentModule}
            currentRole={currentRole}
            workspaceLabel={selectedCRMModuleConfig?.label ?? currentTab?.label ?? 'Overview'}
            roleLabel={roleInfo.label}
            roleDescription={roleInfo.description}
            greetingLine={greetingLine}
            userEmail={user.email}
            profileCompletionPercent={profileCompletionPercent}
            profileCompletionItems={profileCompletionItems}
            showProfileCompletion={!isSuperUser && hasProfileCompletionGaps}
            onOpenProfile={() => navigate('/profile')}
          />

          {isSuperUser && !selectedDepartment && (
            <SuperuserControlCenter
              hotLeadsCount={hotLeadsCount}
              superuserModuleCount={superuserModuleCount}
              monthlyRevenueLabel={formatCurrency(monthlyRevenue)}
              profileCompletionPercent={profileCompletionPercent}
              onRefreshData={handleRetryAll}
              onOpenCommandPalette={() => {
                setAiModulesExpanded(true);
                setIsCommandPaletteOpen(true);
              }}
              onOpenAdminWorkspace={() => openWorkspaceTab('admin', 'unified')}
              onOpenAnalyticsWorkspace={() => openWorkspaceTab('analytics', 'analytics')}
              onOpenUsersWorkspace={() => openWorkspaceTab('users', 'unified')}
              onLaunchUnifiedCRM={() => handleCRMModuleSelect('unified')}
              onOpenGoals={() => navigate('/owner/goals/argentina')}
            />
          )}

          {!selectedDepartment && !selectedCRMModule && (
            <>
              <DashboardKPIStrip cards={kpiCards} />
              {isSuperUser && (
                <>
                  <DashboardModuleGrid
                    modulesByZone={departmentZones}
                    zoneLabels={ZONE_LABELS}
                    onOpenModule={handleCRMModuleSelect}
                  />
                  <AIAssistantGrid onOpenAssistant={assistantId => handleCRMModuleSelect(assistantId)} />
                  <DashboardActivityFeed
                    seedItems={
                      Array.isArray(dashboardData?.recentActivities)
                        ? (dashboardData.recentActivities as Record<string, unknown>[])
                        : []
                    }
                    onViewAll={() => handleCRMModuleSelect('henryAudit')}
                  />
                </>
              )}
            </>
          )}

          {selectedDepartment ? (
            <div className="dashboard-surface-panel">
              <DepartmentContentPanel />
            </div>
          ) : (
            <DashboardWorkspaceTabs
              roleSubNavItemsCount={roleSubNavItems.length}
              subNav={<SubNavBar moduleId={currentModule ?? currentRole} />}
              selectedCRMModuleLabel={selectedCRMModuleConfig?.label}
              showModuleToolbar={Boolean(selectedCRMModuleConfig && isSuperUser)}
              contentKey={activeContentKey}
              isLoading={isLoading}
              content={<Suspense fallback={<TabLoadingFallback />}>{renderTabContent()}</Suspense>}
              loadingFallback={<TabLoadingFallback />}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
              onBackFromCRM={handleBackFromCRM}
            />
          )}
        </main>
      </DashboardShell>

      <MobileCRMDrawer
        isOpen={isMobileDrawerOpen}
        tabs={availableTabs}
        activeTab={activeTab}
        selectedCRMModule={selectedCRMModule}
        isSuperUser={isSuperUser}
        moduleEntries={moduleEntries}
        onClose={() => setIsMobileDrawerOpen(false)}
        onSelectTab={tabId => {
          handleWorkspaceSelect(tabId);
        }}
        onSelectModule={moduleId => handleCRMModuleSelect(moduleId)}
      />

      <DashboardCommandPalette
        isOpen={isCommandPaletteOpen}
        prefersReducedMotion={Boolean(prefersReducedMotion)}
        query={commandQuery}
        items={commandItems}
        onClose={() => setIsCommandPaletteOpen(false)}
        onQueryChange={setCommandQuery}
        onRunTopResult={() => {
          if (commandItems[0]) {
            executeSearchItem(commandItems[0]);
          }
        }}
        onSelectItem={itemId => {
          const item = commandItemsById.get(itemId);
          if (item) executeSearchItem(item);
        }}
      />
    </AuthenticatedPageShell>
  );
};

export default UnifiedDashboardPage;
