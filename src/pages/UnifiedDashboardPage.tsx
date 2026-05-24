import React, {
  FC,
  KeyboardEvent,
  ReactNode,
  ComponentType,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SuspenseLoader from '../components/common/SuspenseLoader';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import DepartmentContentPanel from '../components/layout/DepartmentContentPanel/DepartmentContentPanel';
import AuthenticatedPageShell from '../components/layout/authenticated/AuthenticatedPageShell';
import SubNavBar from '../components/common/SubNavBar';
import { DashboardSubTabRenderer } from '../components/dashboard/DashboardRenderer';
import SuperuserControlCenter from '../components/dashboard/SuperuserControlCenter';
import { useUnifiedDashboard } from '../hooks/useUnifiedDashboard';
import type { DashboardData, CRMModuleProps } from '../hooks/useUnifiedDashboard';
import { AI_ASSISTANTS_REGISTRY } from '../store/slices/aiAssistant/registry';
import { selectSelectedAssistant } from '../store/slices/sidebarSlice';
import { SUPERUSER_CRM_MODULE_ORDER, getCRMModule } from '../config/crmModuleRegistry';
import type { RootState } from '../store/store';
import type { RoleTab } from '../config/ROLE_TAB_MAPPING';
import './UnifiedDashboardPage.css';

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
  } = useUnifiedDashboard();

  const selectedAssistant = useSelector((state: RootState) => selectSelectedAssistant(state));
  const prefersReducedMotion = useReducedMotion();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [modulesExpanded, setModulesExpanded] = useState(true);
  const globalSearchRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!selectedAssistant) return;
    if (selectedAssistant in CRM_MODULES) {
      handleCRMModuleSelect(selectedAssistant);
    }
  }, [selectedAssistant, handleCRMModuleSelect]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent | globalThis.KeyboardEvent) => {
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
    const handleOutsideClick = (event: MouseEvent) => {
      if (!globalSearchRef.current?.contains(event.target as Node)) {
        setIsGlobalSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
      ? moduleEntries.map(([key, module]) => ({
          id: `module-${key}`,
          icon: '🤖',
          label: module.label,
          meta: 'Launch CRM module',
          type: 'module' as const,
          target: key,
        }))
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
            .map(([key, module]) => ({
              id: `module-search-${key}`,
              icon: '🤖',
              label: module.label,
              meta: 'Launch CRM module',
              type: 'module' as const,
              target: key,
            }))
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

  const executeSearchItem = (item: SearchItem) => {
    if (item.type === 'module') {
      handleCRMModuleSelect(item.target);
    } else {
      handleBackFromCRM();
      setActiveTab(item.target);
    }

    setCommandQuery('');
    setGlobalSearchQuery('');
    setIsCommandPaletteOpen(false);
    setIsGlobalSearchOpen(false);
  };

  const openWorkspaceTab = (tabId: string, fallbackModule?: string) => {
    if (availableTabIds.has(tabId)) {
      handleBackFromCRM();
      setActiveTab(tabId);
      return;
    }

    if (fallbackModule) {
      handleCRMModuleSelect(fallbackModule);
      return;
    }

    handleBackFromCRM();
    setActiveTab('overview');
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

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = availableTabs.length - 1;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        tabButtonRefs.current[index === lastIndex ? 0 : index + 1]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        tabButtonRefs.current[index === 0 ? lastIndex : index - 1]?.focus();
        break;
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
      <header className="dashboard-topbar">
        <div className="dashboard-topbar__brand">
          <div className="dashboard-topbar__logo" aria-hidden="true">
            WC
          </div>
          <div>
            <p className="dashboard-topbar__eyebrow">White Caves CRM</p>
            <strong>Internal command center</strong>
          </div>
        </div>

        <div className="dashboard-topbar__search" ref={globalSearchRef}>
          <span className="dashboard-topbar__search-icon" aria-hidden="true">
            🔎
          </span>
          <input
            type="search"
            value={globalSearchQuery}
            onChange={event => {
              setGlobalSearchQuery(event.target.value);
              setIsGlobalSearchOpen(true);
            }}
            onFocus={() => setIsGlobalSearchOpen(true)}
            onKeyDown={event => {
              if (event.key === 'Enter' && globalSearchResults[0]) {
                event.preventDefault();
                executeSearchItem(globalSearchResults[0]);
              }
            }}
            placeholder="Search leads, properties, agents, tabs, or modules"
            aria-label="Search dashboard records"
          />

          {isGlobalSearchOpen && globalSearchResults.length > 0 && (
            <div className="dashboard-search-results" role="listbox" aria-label="Search results">
              {globalSearchResults.map(item => (
                <button
                  key={item.id}
                  className="dashboard-search-result"
                  onMouseDown={event => {
                    event.preventDefault();
                    executeSearchItem(item);
                  }}
                >
                  <span className="dashboard-search-result__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="dashboard-search-result__copy">
                    <strong>{item.label}</strong>
                    <small>{item.meta}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-topbar__actions">
          <button
            type="button"
            className="dashboard-icon-button"
            aria-label={`${hotLeadsCount} notifications`}
          >
            🔔
            {hotLeadsCount > 0 && <span className="dashboard-icon-badge">{hotLeadsCount}</span>}
          </button>
          <button
            type="button"
            className="dashboard-command-button"
            onClick={() => setIsCommandPaletteOpen(true)}
          >
            ⌘K <span>Command palette</span>
          </button>
          <button
            type="button"
            className="dashboard-quick-action"
            onClick={() => setIsCommandPaletteOpen(true)}
          >
            + Quick action
          </button>
          <div className="dashboard-user-chip" aria-label={`Signed in as ${user.email}`}>
            <div className="dashboard-user-chip__avatar" aria-hidden="true">
              {greetingName.slice(0, 2).toUpperCase()}
            </div>
            <div className="dashboard-user-chip__copy">
              <strong>{greetingName}</strong>
              <small>{user.email}</small>
            </div>
          </div>
        </div>
      </header>

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

      <div className="dashboard-workspace-shell">
        {!selectedDepartment && (
          <aside className="dashboard-side-rail" aria-label="Dashboard tabs">
            <div className="dashboard-side-rail__section">
              <span className="dashboard-side-rail__label">Workspaces</span>
              <div className="dashboard-tab-rail" role="tablist" aria-orientation="vertical">
                {availableTabs.map((tab: RoleTab, index: number) => (
                  <button
                    key={tab.id}
                    ref={element => {
                      tabButtonRefs.current[index] = element;
                    }}
                    className={`dashboard-rail-tab ${activeTab === tab.id && !selectedCRMModule ? 'active' : ''}`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id && !selectedCRMModule}
                    aria-controls="dashboard-main"
                    onClick={() => {
                      handleBackFromCRM();
                      setActiveTab(tab.id);
                    }}
                    onKeyDown={event => handleTabKeyDown(event, index)}
                  >
                    <span className="dashboard-rail-tab__icon" aria-hidden="true">
                      {tab.icon}
                    </span>
                    <span className="dashboard-rail-tab__label">{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="dashboard-rail-tab__badge">{tab.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {isSuperUser && (
              <div className="dashboard-side-rail__section dashboard-side-rail__section--modules">
                <button
                  type="button"
                  className="dashboard-modules-toggle"
                  onClick={() => setModulesExpanded(current => !current)}
                  aria-expanded={modulesExpanded}
                >
                  <span>AI CRM Modules</span>
                  <span aria-hidden="true">{modulesExpanded ? '−' : '+'}</span>
                </button>
                {modulesExpanded && (
                  <div className="dashboard-module-list">
                    {moduleEntries.map(([key, module]) => (
                      <button
                        key={key}
                        type="button"
                        className={`dashboard-module-option ${selectedCRMModule === key ? 'active' : ''}`}
                        onClick={() => handleCRMModuleSelect(key)}
                      >
                        <span aria-hidden="true">🤖</span>
                        <span>{module.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        <main id="dashboard-main" className="dashboard-main-panel">
          <section className="dashboard-page-header">
            <div className="dashboard-page-header__copy">
              <span className="dashboard-page-header__eyebrow">
                {currentModule ?? currentRole} /{' '}
                {currentTab?.label ?? selectedCRMModuleConfig?.label ?? 'Overview'}
              </span>
              <h1>{roleInfo.label} Dashboard</h1>
              <p className="dashboard-page-header__subtitle">{roleInfo.description}</p>
              <p className="dashboard-page-header__greeting">{greetingLine}</p>
            </div>
            <div className="dashboard-page-header__meta">
              <div className="dashboard-breadcrumbs" aria-label="Breadcrumb">
                <span>CRM</span>
                <span aria-hidden="true">/</span>
                <span>{roleInfo.label}</span>
                <span aria-hidden="true">/</span>
                <span>{selectedCRMModuleConfig?.label ?? currentTab?.label ?? 'Overview'}</span>
              </div>
              <div className="dashboard-page-header__status">
                <span className="dashboard-status-pill">Live workspace</span>
                <span className="dashboard-status-pill dashboard-status-pill--muted">
                  {user.email}
                </span>
              </div>
            </div>
          </section>

          {isSuperUser && !selectedDepartment && (
            <SuperuserControlCenter
              hotLeadsCount={hotLeadsCount}
              superuserModuleCount={superuserModuleCount}
              monthlyRevenueLabel={formatCurrency(monthlyRevenue)}
              profileCompletionPercent={profileCompletionPercent}
              onRefreshData={handleRetryAll}
              onOpenCommandPalette={() => {
                setModulesExpanded(true);
                setIsCommandPaletteOpen(true);
              }}
              onOpenAdminWorkspace={() => openWorkspaceTab('admin', 'unified')}
              onOpenAnalyticsWorkspace={() => openWorkspaceTab('analytics', 'analytics')}
              onOpenUsersWorkspace={() => openWorkspaceTab('users', 'unified')}
              onLaunchUnifiedCRM={() => handleCRMModuleSelect('unified')}
            />
          )}

          {hasProfileCompletionGaps && (
            <section className="dashboard-profile-completion" aria-label="Profile setup status">
              <div className="dashboard-profile-completion__copy">
                <p className="dashboard-profile-completion__eyebrow">Post-login setup</p>
                <h2>Complete your profile</h2>
                <p>
                  Your profile is {profileCompletionPercent}% complete. Finishing setup improves
                  lead assignment accuracy and team coordination.
                </p>
              </div>
              <div className="dashboard-profile-completion__actions">
                <ul>
                  {profileCompletionItems.map(item => (
                    <li key={item.id}>
                      <span aria-hidden="true">{item.complete ? '✅' : '⬜'}</span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="dashboard-profile-completion__cta"
                  onClick={() => navigate('/profile')}
                >
                  Finish profile setup
                </button>
              </div>
            </section>
          )}

          {!selectedDepartment && !selectedCRMModule && (
            <section className="dashboard-kpi-strip" aria-label="Dashboard highlights">
              {kpiCards.map(card => (
                <article key={card.id} className="dashboard-kpi-card">
                  <div className="dashboard-kpi-card__icon" aria-hidden="true">
                    {card.icon}
                  </div>
                  <div className="dashboard-kpi-card__body">
                    <p>{card.label}</p>
                    <strong>{card.value}</strong>
                    <span>{card.subtext}</span>
                  </div>
                  <div
                    className={`dashboard-kpi-card__trend ${card.positive ? 'positive' : 'negative'}`}
                  >
                    {card.trend}
                  </div>
                </article>
              ))}
            </section>
          )}

          {selectedDepartment ? (
            <div className="dashboard-surface-panel">
              <DepartmentContentPanel />
            </div>
          ) : (
            <>
              {roleSubNavItems.length > 0 && (
                <div className="dashboard-subnav-panel">
                  <SubNavBar moduleId={currentModule ?? currentRole} />
                </div>
              )}

              <div className="dashboard-content-frame">
                {selectedCRMModuleConfig && isSuperUser && (
                  <div className="dashboard-module-toolbar">
                    <button className="crm-back-button" onClick={handleBackFromCRM}>
                      ← Back to dashboard
                    </button>
                    <span className="dashboard-module-toolbar__label">
                      {selectedCRMModuleConfig.label}
                    </span>
                  </div>
                )}

                <AnimatePresence mode="wait" initial={false}>
                  <motion.section
                    key={activeContentKey}
                    className="unified-dashboard-content"
                    initial={
                      prefersReducedMotion
                        ? false
                        : {
                            opacity: 0,
                            x: selectedCRMModule ? 24 : 0,
                            y: selectedCRMModule ? 0 : 12,
                          }
                    }
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, y: 0 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
                  >
                    {isLoading ? (
                      <TabLoadingFallback />
                    ) : (
                      <Suspense fallback={<TabLoadingFallback />}>{renderTabContent()}</Suspense>
                    )}
                  </motion.section>
                </AnimatePresence>
              </div>
            </>
          )}
        </main>
      </div>

      <AnimatePresence>
        {isCommandPaletteOpen && (
          <motion.div
            className="dashboard-command-palette-backdrop"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? {} : { opacity: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <motion.div
              className="dashboard-command-palette"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' }}
              onClick={event => event.stopPropagation()}
            >
              <div className="dashboard-command-palette__header">
                <strong>Command palette</strong>
                <button type="button" onClick={() => setIsCommandPaletteOpen(false)}>
                  Esc
                </button>
              </div>
              <input
                autoFocus
                type="search"
                value={commandQuery}
                onChange={event => setCommandQuery(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && commandItems[0]) {
                    event.preventDefault();
                    executeSearchItem(commandItems[0]);
                  }
                }}
                placeholder="Search tabs or AI CRM modules"
                aria-label="Search command palette"
              />
              <div className="dashboard-command-palette__results">
                {commandItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className="dashboard-command-palette__item"
                    onClick={() => executeSearchItem(item)}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span className="dashboard-command-palette__copy">
                      <strong>{item.label}</strong>
                      <small>{item.meta}</small>
                    </span>
                  </button>
                ))}
                {commandItems.length === 0 && (
                  <div className="dashboard-command-palette__empty">
                    No matching tabs or modules.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthenticatedPageShell>
  );
};

export default UnifiedDashboardPage;
