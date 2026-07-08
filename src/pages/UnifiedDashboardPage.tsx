import React, {
  FC,
  ReactNode,
  ComponentType,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SuspenseLoader from '../components/common/SuspenseLoader';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import DepartmentContentPanel from '../components/layout/DepartmentContentPanel/DepartmentContentPanel';
import MobileCRMDrawer from '../components/layout/MobileCRMDrawer';
import AuthenticatedPageShell from '../components/layout/authenticated/AuthenticatedPageShell';
import DashboardShell from '../components/layout/DashboardShell/DashboardShell';
import DashboardTopBar from '../components/dashboard/DashboardTopBar';
import DashboardSidebar from '../components/layout/DashboardSidebar/DashboardSidebar';
import SubNavBar from '../components/common/SubNavBar';
import { DashboardSubTabRenderer } from '../components/dashboard/DashboardRenderer';
import SuperuserControlCenter from '../components/dashboard/SuperuserControlCenter';
import DashboardSideRail from '../components/dashboard/DashboardSideRail';
import DashboardPageHeader from '../components/dashboard/DashboardPageHeader';
import DashboardKpiStrip, { type KpiCardData } from '../components/dashboard/DashboardKpiStrip';
import DashboardProfileCompletion from '../components/dashboard/DashboardProfileCompletion';
import DashboardCommandPalette from '../components/dashboard/DashboardCommandPalette';
import DashboardModuleToolbar from '../components/dashboard/DashboardModuleToolbar';
import DashboardConfigurator, {
  type DashboardWidgetOption,
} from '../components/dashboard/DashboardConfigurator';
import CRMContextPanel from '../components/crm/CRMContextPanel';
import { useUnifiedDashboard } from '../hooks/useUnifiedDashboard';
import type { DashboardData, CRMModuleProps } from '../hooks/useUnifiedDashboard';
import {
  fetchDashboardPreferences,
  fetchRoleDashboardConfig,
  saveDashboardPreferences,
} from '../services/dashboardPreferencesAPI';
import { createLogger } from '../utils/logger';
import { AI_ASSISTANTS_REGISTRY } from '../store/slices/aiAssistant/registry';
import { selectSelectedAssistant } from '../store/slices/sidebarSlice';
import { SUPERUSER_CRM_MODULE_ORDER, getCRMModule } from '../config/crmModuleRegistry';
import { ZONE_LABELS, groupModulesForMD } from '../config/crmNavigationSchema';
import type { RootState } from '../store/store';
import { colors, spacing, typography, media, shadows, borderRadius } from '../design-tokens';

const OverviewTab = lazy(() => import('../components/owner/tabs/OverviewTab'));
const PropertiesTab = lazy(() => import('../components/owner/tabs/PropertiesTab'));
const AgentsTab = lazy(() => import('../components/owner/tabs/AgentsTab'));
const LeadsTab = lazy(() => import('../components/owner/tabs/LeadsTab'));
const ContractsTab = lazy(() => import('../components/owner/tabs/ContractsTab'));
const AnalyticsTab = lazy(() => import('../components/owner/tabs/AnalyticsTab'));
const CommissionsTab = lazy(() =>
  import('../components/owner/tabs/CommissionsTab').then(module => ({
    default: module.CommissionsTab,
  }))
);
const SettingsTab = lazy(() => import('../components/owner/tabs/SettingsTab'));
const UsersTab = lazy(() => import('../components/owner/tabs/UsersTab'));
import type {
  OverviewData,
  PropertiesData,
  AgentsData,
  LeadsData,
  ContractsData,
  AnalyticsData,
  SettingsData,
} from '../components/owner/tabs/types';
const AdminDashboard = lazy(() => import('../components/admin/AdminDashboard'));

const AIAssistantHub = lazy(() => import('../components/crm/AIAssistantHub'));
const AICommandCenter = lazy(() => import('../components/crm/AICommandCenter.tsx'));
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
const RERAComplianceModule = lazy(() => import('../components/crm/RERAComplianceModule'));
const DLDIntegrationModule = lazy(() => import('../components/crm/DLDIntegrationModule'));
const LeadScoringModule = lazy(() => import('../components/crm/LeadScoringModule'));
const PropertyValuationModule = lazy(() => import('../components/crm/PropertyValuationModule'));
const MarketAnalyticsModule = lazy(() => import('../components/crm/MarketAnalyticsModule'));

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
  <TabLoadingFallbackContainer>
    <SuspenseLoader />
  </TabLoadingFallbackContainer>
);

const DashboardSearchItem: FC<{ item: SearchItem; onSelect: (item: SearchItem) => void }> = ({
  item,
  onSelect,
}) => (
  <DashboardSearchResultButton
    onMouseDown={event => {
      event.preventDefault();
      onSelect(item);
    }}
  >
    <SearchResultIcon aria-hidden="true">{item.icon}</SearchResultIcon>
    <SearchResultCopy>
      <strong>{item.label}</strong>
      <small>{item.meta}</small>
    </SearchResultCopy>
  </DashboardSearchResultButton>
);

const UnifiedCRMAdapter: FC<CRMModuleProps> = () => <UnifiedCRM />;

const CRM_MODULES: Record<string, CRMModule> = {
  unified: { Component: UnifiedCRMAdapter, label: 'Unified CRM Dashboard' },
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
  rera: { Component: RERAComplianceModule, label: 'RERA Compliance' },
  dld: { Component: DLDIntegrationModule, label: 'DLD Integration' },
  leads: { Component: LeadScoringModule, label: 'Lead Scoring' },
  valuation: { Component: PropertyValuationModule, label: 'Property Valuation' },
  analytics: { Component: MarketAnalyticsModule, label: 'Market Analytics' },
};

const moduleEntries = Object.entries(CRM_MODULES);

// ═══════════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const UnifiedDashboardContainer = styled.div`
  min-height: 100%;
  background: ${colors.background.default};
  color: ${colors.text.primary};
  padding: ${spacing[5]};
`;

const UnifiedDashboardError = styled(UnifiedDashboardContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const TabLoadingFallbackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
`;

const DashboardSearchResultButton = styled.button`
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  gap: ${spacing[3]};
  width: 100%;
  padding: ${spacing[2]} ${spacing[3]};
  border: 0;
  border-radius: ${borderRadius.lg};
  background: transparent;
  color: ${colors.text.primary};
  text-align: start;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${colors.background.hover};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const SearchResultIcon = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: ${borderRadius.md};
  background: ${colors.background.surface};
`;

const SearchResultCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};

  strong {
    ${typography.presets.label};
    color: ${colors.text.primary};
  }

  small {
    ${typography.presets.caption};
    color: ${colors.text.secondary};
  }
`;

const DashboardSearchResultsEmpty = styled.div`
  padding: ${spacing[2]} ${spacing[3]};
  border-radius: ${borderRadius.md};
  color: ${colors.text.secondary};
  ${typography.presets.caption};
  background: ${colors.background.surface};
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[4]};
  padding: ${spacing[3]} ${spacing[4]};
  background: ${colors.error[50]};
  border: 1px solid ${colors.error[200]};
  border-radius: ${borderRadius.md};
  color: ${colors.error[700]};
  box-shadow: ${shadows.sm};

  p {
    flex: 1;
    margin: 0;
    ${typography.presets.body};
  }

  button {
    min-height: 38px;
    padding: 0 ${spacing[3]};
    border: 0;
    border-radius: 999px;
    background: ${colors.primary[500]};
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${colors.primary[600]};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.span`
  font-size: 1.2rem;
`;

const DashboardWorkspaceShell = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(0, 300px);
  gap: ${spacing[5]};
  align-items: start;

  ${media.lg} {
    grid-template-columns: 1fr;
  }
`;

const DashboardMainPanel = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

const ExecutiveCockpitBannerSection = styled.section`
  display: grid;
  gap: ${spacing[3]};
  margin-bottom: ${spacing[3]};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.md};
  border: 1px solid rgba(201, 168, 76, 0.34);
  background: linear-gradient(135deg, rgba(38, 38, 46, 0.92), rgba(24, 24, 30, 0.95));
  color: #f8f6ef;

  h2 {
    margin: 0;
    font-size: 1.08rem;
    font-weight: 600;
  }

  p {
    margin: ${spacing[1]} 0 0;
    color: rgba(248, 246, 239, 0.84);
    ${typography.presets.body};
  }
`;

const ExecutiveCockpitEyebrow = styled.p`
  margin: 0;
  color: rgba(255, 215, 140, 0.96);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const ExecutiveCockpitActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[2]};
`;

const SuperuserButton = styled.button`
  min-height: 38px;
  padding: 0 ${spacing[3]};
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 215, 140, 0.95);
    outline-offset: 2px;
  }
`;

const SuperuserButtonPrimary = styled(SuperuserButton)`
  background: linear-gradient(135deg, #bd8f2f, #e4b75e);
  border-color: transparent;
  color: #1f1300;

  &:hover {
    background: linear-gradient(135deg, #a87a28, #d4a84a);
  }
`;

const ConfiguratorPanel = styled.section`
  margin-bottom: ${spacing[4]};
`;

const ConfiguratorPanelError = styled.p`
  margin: ${spacing[2]} 0 0;
  color: ${colors.error[700]};
  font-size: 0.86rem;
  font-weight: 600;
`;

const EmptyState = styled.section`
  display: grid;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[4]};
  padding: ${spacing[4]} ${spacing[5]};
  border-radius: ${borderRadius.md};
  border: 1px dashed ${colors.border.light};
  background: ${colors.background.surface};

  h2 {
    margin: 0;
    font-size: 1.06rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: ${colors.text.secondary};
    ${typography.presets.body};
  }
`;

const EmptyStateEyebrow = styled.p`
  margin: 0;
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  font-weight: 700;
`;

const EmptyStateActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing[2]};
`;

const SurfacePanel = styled.div`
  min-height: 460px;
  padding: ${spacing[6]};
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.default};
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

const DashboardSubnavPanel = styled.div`
  min-width: 0;
  margin-bottom: ${spacing[2]};
  padding: ${spacing[2]};
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.default};
`;

const DashboardContentFrame = styled.div`
  min-width: 0;
`;

const UnifiedDashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

const dashboardPageLogger = createLogger('UnifiedDashboardPage');

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
  const [searchParams] = useSearchParams();
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
  const [modulesExpanded, setModulesExpanded] = useState(true);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [departmentsExpanded, setDepartmentsExpanded] = useState(true);
  const [selectedContext, setSelectedContext] = useState<SearchItem | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidgetOption[]>([]);
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [dashboardConfigError, setDashboardConfigError] = useState<string | null>(null);
  const globalSearchRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

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
    const handleOutsideClick = (event: MouseEvent) => {
      if (!globalSearchRef.current?.contains(event.target as Node)) {
        setIsGlobalSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) {
        lastFocusedElementRef.current = activeElement;
      }
      return;
    }

    const lastFocusedElement = lastFocusedElementRef.current;
    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    }

    if (commandQuery.length > 0) {
      setCommandQuery('');
    }
  }, [commandQuery, isCommandPaletteOpen]);

  const selectedCRMModuleConfig = selectedCRMModule ? CRM_MODULES[selectedCRMModule] : null;
  const isExecutiveCockpitMode = searchParams.get('cockpit') === 'md';
  const isManagingDirector = currentRole === 'managing_director';
  const isExecutiveRole = isSuperUser || isManagingDirector;
  const currentTab = availableTabs.find(tab => tab.id === activeTab);
  const showDashboardConfigurator =
    isExecutiveRole && !selectedDepartment && !selectedCRMModule && !isLoading;

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

  const kpiCards = useMemo<KpiCardData[]>(
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
  const isDashboardDataEmpty =
    propertiesCount === 0 &&
    agentsCount === 0 &&
    leadsCount === 0 &&
    contractsCount === 0 &&
    hotLeadsCount === 0 &&
    monthlyRevenue <= 0;
  const superuserModuleCount = moduleEntries.length;
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
    const modules = isExecutiveRole
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
  }, [availableTabs, commandQuery, isExecutiveRole]);

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
      ...(isExecutiveRole
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
    isExecutiveRole,
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

  useEffect(() => {
    if (!showDashboardConfigurator) {
      return;
    }

    let cancelled = false;

    const loadDashboardPreferences = async () => {
      try {
        setDashboardConfigError(null);
        const preferences = await fetchDashboardPreferences();

        if (cancelled) {
          return;
        }

        setDashboardLayout(preferences.layout || 'default');
        setDashboardWidgets(
          preferences.widgets.map(widget => ({
            id: widget.id,
            label: widget.title,
            enabled: widget.enabled,
            description: `Widget ${widget.enabled ? 'enabled' : 'disabled'} for ${preferences.role}`,
          }))
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setDashboardConfigError('Could not load dashboard preferences. Using role defaults.');
        dashboardPageLogger.warn(
          'Dashboard preferences fetch failed, loading role defaults',
          error
        );

        try {
          const defaults = await fetchRoleDashboardConfig();
          if (cancelled) {
            return;
          }

          setDashboardLayout(defaults.layout || 'default');
          setDashboardWidgets(
            defaults.widgets.map(widget => ({
              id: widget.id,
              label: widget.title,
              enabled: widget.enabled,
            }))
          );
        } catch (fallbackError) {
          if (!cancelled) {
            setDashboardWidgets([]);
          }
          dashboardPageLogger.error('Dashboard defaults fallback failed', fallbackError);
        }
      }
    };

    void loadDashboardPreferences();

    return () => {
      cancelled = true;
    };
  }, [showDashboardConfigurator]);

  const persistDashboardWidgets = async (nextWidgets: DashboardWidgetOption[]) => {
    try {
      const payload = nextWidgets.map(widget => ({
        id: widget.id,
        title: widget.label,
        enabled: widget.enabled,
      }));

      await saveDashboardPreferences(payload, dashboardLayout);
      setDashboardConfigError(null);
    } catch (error) {
      setDashboardConfigError('Could not save widget preferences. Please retry.');
      dashboardPageLogger.warn('Dashboard preference save failed', error);
    }
  };

  const handleToggleDashboardWidget = (id: string, enabled: boolean) => {
    const nextWidgets = dashboardWidgets.map(widget =>
      widget.id === id ? { ...widget, enabled } : widget
    );

    setDashboardWidgets(nextWidgets);
    void persistDashboardWidgets(nextWidgets);
  };

  const handleResetDashboardConfig = async () => {
    try {
      const defaults = await fetchRoleDashboardConfig();
      const nextWidgets = defaults.widgets.map(widget => ({
        id: widget.id,
        label: widget.title,
        enabled: widget.enabled,
      }));

      setDashboardWidgets(nextWidgets);
      setDashboardLayout('default');
      await saveDashboardPreferences(
        defaults.widgets.map(widget => ({
          id: widget.id,
          title: widget.title,
          enabled: widget.enabled,
        })),
        'default'
      );
      setDashboardConfigError(null);
    } catch (error) {
      setDashboardConfigError('Could not reset dashboard configuration.');
      dashboardPageLogger.warn('Dashboard config reset failed', error);
    }
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
            <Suspense fallback={<TabLoadingFallback />}>
              <OverviewTab data={tabData<OverviewData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'properties':
        return (
          <RouteErrorBoundary section="Properties">
            <Suspense fallback={<TabLoadingFallback />}>
              <PropertiesTab data={tabData<PropertiesData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'agents':
        return (
          <RouteErrorBoundary section="Agents">
            <Suspense fallback={<TabLoadingFallback />}>
              <AgentsTab data={tabData<AgentsData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'leads':
        return (
          <RouteErrorBoundary section="Leads">
            <Suspense fallback={<TabLoadingFallback />}>
              <LeadsTab data={tabData<LeadsData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'contracts':
        return (
          <RouteErrorBoundary section="Contracts">
            <Suspense fallback={<TabLoadingFallback />}>
              <ContractsTab data={tabData<ContractsData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'analytics':
        return (
          <RouteErrorBoundary section="Analytics">
            <Suspense fallback={<TabLoadingFallback />}>
              <AnalyticsTab data={tabData<AnalyticsData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'commissions':
        return (
          <RouteErrorBoundary section="Commissions">
            <Suspense fallback={<TabLoadingFallback />}>
              <CommissionsTab />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'admin':
        return (
          <RouteErrorBoundary section="Admin">
            <Suspense fallback={<TabLoadingFallback />}>
              <AdminDashboard />
            </Suspense>
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
            <Suspense fallback={<TabLoadingFallback />}>
              <UsersTab />
            </Suspense>
          </RouteErrorBoundary>
        );
      case 'settings':
        return (
          <RouteErrorBoundary section="Settings">
            <Suspense fallback={<TabLoadingFallback />}>
              <SettingsTab data={tabData<SettingsData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
      default:
        return (
          <RouteErrorBoundary section="Overview">
            <Suspense fallback={<TabLoadingFallback />}>
              <OverviewTab data={tabData<OverviewData>(dataToRender)} />
            </Suspense>
          </RouteErrorBoundary>
        );
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const renderedButtons = tabButtonRefs.current.filter(Boolean);
    const lastIndex = renderedButtons.length - 1;

    if (lastIndex < 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        renderedButtons[index === lastIndex ? 0 : index + 1]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        renderedButtons[index === 0 ? lastIndex : index - 1]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        renderedButtons[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        renderedButtons[lastIndex]?.focus();
        break;
      default:
        break;
    }
  };

  if (!user) {
    return (
      <UnifiedDashboardError>
        <p>Please log in to access the dashboard.</p>
      </UnifiedDashboardError>
    );
  }

  const activeContentKey =
    selectedCRMModule || currentSubModule || selectedDepartment || activeTab || 'overview';

  return (
    <AuthenticatedPageShell>
      <DashboardTopBar
        globalSearchRef={globalSearchRef}
        globalSearchQuery={globalSearchQuery}
        isGlobalSearchOpen={isGlobalSearchOpen && globalSearchQuery.trim().length > 0}
        globalSearchResults={
          globalSearchResults.length > 0 ? (
            globalSearchResults.map(item => (
              <DashboardSearchItem key={item.id} item={item} onSelect={executeSearchItem} />
            ))
          ) : (
            <DashboardSearchResultsEmpty role="status" aria-live="polite">
              No matches found. Try another lead, property, tab, or module keyword.
            </DashboardSearchResultsEmpty>
          )
        }
        hotLeadsCount={hotLeadsCount}
        greetingName={greetingName}
        userEmail={user.email}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onQuickAction={() => setIsCommandPaletteOpen(true)}
        onSearchChange={value => {
          setGlobalSearchQuery(value);
          setIsGlobalSearchOpen(true);
        }}
        onSearchFocus={() => setIsGlobalSearchOpen(true)}
        onSearchEnter={() => {
          if (globalSearchResults[0]) {
            executeSearchItem(globalSearchResults[0]);
          }
        }}
      />

      {error && (
        <ErrorBanner role="alert" aria-live="assertive">
          <ErrorIcon aria-hidden="true">⚠️</ErrorIcon>
          <p>{error}</p>
          <button onClick={handleRetryAll} aria-label="Retry loading dashboard data">
            Retry
          </button>
        </ErrorBanner>
      )}

      <DashboardWorkspaceShell>
        {!selectedDepartment && (
          <DashboardSideRail
            availableTabs={availableTabs}
            activeTab={activeTab}
            selectedCRMModule={selectedCRMModule}
            currentRole={currentRole}
            isSuperUser={isSuperUser}
            modulesExpanded={modulesExpanded}
            moduleEntries={moduleEntries}
            tabButtonRefs={tabButtonRefs}
            onSelectTab={tabId => {
              handleBackFromCRM();
              setActiveTab(tabId);
            }}
            onTabKeyDown={handleTabKeyDown}
            onToggleModules={() => setModulesExpanded(current => !current)}
            onSelectModule={handleCRMModuleSelect}
          />
        )}

        <DashboardMainPanel id="dashboard-main">
          <DashboardPageHeader
            currentModule={currentModule ?? null}
            currentRole={currentRole}
            currentTabLabel={currentTab?.label}
            selectedCRMModuleLabel={selectedCRMModuleConfig?.label}
            roleLabel={roleInfo.label}
            roleDescription={roleInfo.description}
            greetingLine={greetingLine}
            userEmail={user.email}
          />

          {isExecutiveCockpitMode && isSuperUser && !selectedDepartment && (
            <ExecutiveCockpitBannerSection aria-label="Managing Director cockpit mode">
              <div>
                <ExecutiveCockpitEyebrow>
                  Managing Director · Full Company View
                </ExecutiveCockpitEyebrow>
                <h2>Executive cockpit engaged</h2>
                <p>
                  Priority control over portfolio, pipeline, team, finance, compliance, and AI
                  modules. All company operations visible in one place.
                </p>
              </div>
              <ExecutiveCockpitActions>
                <SuperuserButtonPrimary type="button" onClick={() => setIsCommandPaletteOpen(true)}>
                  Command palette
                </SuperuserButtonPrimary>
                <SuperuserButton
                  type="button"
                  onClick={() => openWorkspaceTab('overview', 'unified')}
                >
                  Overview
                </SuperuserButton>
                <SuperuserButton
                  type="button"
                  onClick={() => openWorkspaceTab('analytics', 'analytics')}
                >
                  Analytics
                </SuperuserButton>
                <SuperuserButton type="button" onClick={() => handleCRMModuleSelect('theodora')}>
                  Finance
                </SuperuserButton>
                <SuperuserButton type="button" onClick={() => handleCRMModuleSelect('laila')}>
                  Compliance
                </SuperuserButton>
                <SuperuserButton
                  type="button"
                  onClick={() => openWorkspaceTab('ai-hub', 'unified')}
                >
                  AI modules
                </SuperuserButton>
                <SuperuserButton type="button" onClick={() => openWorkspaceTab('users', 'unified')}>
                  Users
                </SuperuserButton>
                <SuperuserButton type="button" onClick={() => navigate('/profile')}>
                  Profile
                </SuperuserButton>
              </ExecutiveCockpitActions>
            </ExecutiveCockpitBannerSection>
          )}

          {isExecutiveRole && !selectedDepartment && (
            <SuperuserControlCenter
              persona={isSuperUser ? 'superuser' : 'executive'}
              hotLeadsCount={hotLeadsCount}
              superuserModuleCount={superuserModuleCount}
              monthlyRevenueLabel={formatCurrency(monthlyRevenue)}
              profileCompletionPercent={profileCompletionPercent}
              propertiesCount={propertiesCount}
              agentsCount={agentsCount}
              leadsCount={leadsCount}
              contractsCount={contractsCount}
              onRefreshData={handleRetryAll}
              onOpenCommandPalette={() => {
                setModulesExpanded(true);
                setIsCommandPaletteOpen(true);
              }}
              onOpenAdminWorkspace={() => openWorkspaceTab('admin', 'unified')}
              onOpenAnalyticsWorkspace={() => openWorkspaceTab('analytics', 'analytics')}
              onOpenUsersWorkspace={() => openWorkspaceTab('users', 'unified')}
              onLaunchUnifiedCRM={() => handleCRMModuleSelect('unified')}
              onOpenPropertiesWorkspace={() => openWorkspaceTab('properties', 'unified')}
              onOpenLeadsWorkspace={() => openWorkspaceTab('leads', 'leads')}
              onOpenAgentsWorkspace={() => openWorkspaceTab('agents', 'unified')}
              onOpenContractsWorkspace={() => openWorkspaceTab('contracts', 'unified')}
              onOpenFinanceWorkspace={() => handleCRMModuleSelect('theodora')}
              onOpenComplianceWorkspace={() => handleCRMModuleSelect('laila')}
              onLaunchAIModules={() => openWorkspaceTab('ai-hub', 'unified')}
            />
          )}

          {hasProfileCompletionGaps && (
            <DashboardProfileCompletion
              percent={profileCompletionPercent}
              items={profileCompletionItems}
              onFinishSetup={() => navigate('/profile')}
            />
          )}

          {!selectedDepartment && !selectedCRMModule && <DashboardKpiStrip cards={kpiCards} />}

          {showDashboardConfigurator && (
            <ConfiguratorPanel aria-label="Dashboard widget controls">
              <DashboardConfigurator
                title="Executive Widget Controls"
                widgets={dashboardWidgets}
                onToggleWidget={handleToggleDashboardWidget}
                onReset={handleResetDashboardConfig}
              />
              {dashboardConfigError ? (
                <ConfiguratorPanelError role="status" aria-live="polite">
                  {dashboardConfigError}
                </ConfiguratorPanelError>
              ) : null}
            </ConfiguratorPanel>
          )}

          {!selectedDepartment &&
            !selectedCRMModule &&
            !isLoading &&
            !error &&
            isDashboardDataEmpty && (
              <EmptyState aria-label="Dashboard empty state" role="status">
                <EmptyStateEyebrow>No data yet</EmptyStateEyebrow>
                <h2>Your executive dashboard is ready</h2>
                <p>
                  Connect your first workflows to populate KPIs, activity timeline, and operations
                  intelligence.
                </p>
                <EmptyStateActions>
                  <SuperuserButtonPrimary
                    type="button"
                    onClick={() => setIsCommandPaletteOpen(true)}
                  >
                    Open command palette
                  </SuperuserButtonPrimary>
                  <SuperuserButton type="button" onClick={() => handleCRMModuleSelect('unified')}>
                    Open Unified CRM
                  </SuperuserButton>
                </EmptyStateActions>
              </EmptyState>
            )}

          {selectedDepartment ? (
            <SurfacePanel>
              <DepartmentContentPanel />
            </SurfacePanel>
          ) : (
            <>
              {roleSubNavItems.length > 0 && (
                <DashboardSubnavPanel>
                  <SubNavBar moduleId={currentModule ?? currentRole} />
                </DashboardSubnavPanel>
              )}

              <DashboardContentFrame>
                {selectedCRMModuleConfig && isSuperUser && (
                  <DashboardModuleToolbar
                    label={selectedCRMModuleConfig.label}
                    onBack={handleBackFromCRM}
                  />
                )}

                <AnimatePresence mode="wait" initial={false}>
                  <motion.section
                    key={activeContentKey}
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
              </DashboardContentFrame>
            </>
          )}
        </DashboardMainPanel>

        {!selectedDepartment && (
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
        )}
      </DashboardWorkspaceShell>

      <DashboardCommandPalette
        isOpen={isCommandPaletteOpen}
        query={commandQuery}
        items={commandItems}
        prefersReducedMotion={Boolean(prefersReducedMotion)}
        onClose={() => setIsCommandPaletteOpen(false)}
        onQueryChange={setCommandQuery}
        onEnter={activeIndex => {
          if (commandItems[activeIndex]) {
            executeSearchItem(commandItems[activeIndex]);
          }
        }}
        onSelect={item => executeSearchItem(item as unknown as SearchItem)}
      />
    </AuthenticatedPageShell>
  );
};

export default UnifiedDashboardPage;
