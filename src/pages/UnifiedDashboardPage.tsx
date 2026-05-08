import React, { FC, lazy, Suspense, ReactNode, ComponentType } from 'react';
import SuspenseLoader from '../components/common/SuspenseLoader';
import RouteErrorBoundary from '../components/RouteErrorBoundary';
import DepartmentContentPanel from '../components/layout/DepartmentContentPanel/DepartmentContentPanel';
import { Badge, ProgressBar } from '../components/ui';
import SubNavBar from '../components/common/SubNavBar';
import { DashboardSubTabRenderer } from '../components/dashboard/DashboardRenderer';
import { useUnifiedDashboard } from '../hooks/useUnifiedDashboard';
import type { DashboardData, CRMModuleProps } from '../hooks/useUnifiedDashboard';
import './UnifiedDashboardPage.css';

// Import tab components (non-lazy for critical paths)
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
const LindaAdminCRM = lazy(() => import('../components/crm/LindaAdminCRM_NEW'));
const HenryDocumentHub = lazy(() => import('../features/henry/HenryDocumentHub'));
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

// ─── Static helpers & constants (kept in page — rendering-only) ────────

interface CRMModule {
  Component: ComponentType<CRMModuleProps>;
  label: string;
}

/** Adapter: UnifiedCRM has its own props, not the standard CRM module contract */
const UnifiedCRMAdapter: FC<CRMModuleProps> = () => <UnifiedCRM />;

/**
 * Type bridge for dashboard tabs.
 * Tabs receive the shared DashboardData bundle but expect specific sub-shapes.
 */
function tabData<T>(data: DashboardData | null | undefined): T {
  return (data ?? {}) as unknown as T;
}

const TabLoadingFallback: FC = () => (
  <div className="tab-loading-fallback">
    <SuspenseLoader />
  </div>
);

const CRM_MODULES: Record<string, CRMModule> = {
  // Unified CRM Dashboard
  unified: { Component: UnifiedCRMAdapter, label: 'Unified CRM Dashboard' },

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

  // White Caves Channel & Document Modules
  linda: { Component: (LindaAdminCRM as ComponentType<CRMModuleProps>), label: 'Linda WhatsApp Bot' },
  henry: { Component: (HenryDocumentHub as ComponentType<CRMModuleProps>), label: '📄 Document Hub (Henry)' },
};

// ─── Page Component ───────────────────────────────────────────

const UnifiedDashboardPage: FC = () => {
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

  if (!user) {
    return (
      <div className="unified-dashboard unified-dashboard-error">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
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
                      <span className="tab-icon-wrap">
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span className="tab-badge">{tab.badge}</span>
                        )}
                      </span>
                      <span className="tab-label">{tab.label}</span>
                    </button>
                  ))}

                  {/* CRM Modules - Super User Only */}
                  {isSuperUser && (
                    <>
                      <div className="tab-divider"></div>
                      <div className="crm-modules-dropdown">
                        <button className="crm-modules-button">
                          <span className="tab-icon">🤖</span>
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
  );
}

export default UnifiedDashboardPage;
