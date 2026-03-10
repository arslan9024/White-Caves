import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROLE_TAB_MAPPING, getTabsForRole, getRoleInfo } from '../config/ROLE_TAB_MAPPING';
import SuspenseLoader from '../components/common/SuspenseLoader';
import SidebarContainer from '../components/layout/SidebarContainer/SidebarContainer';
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
const LindaWhatsAppCRM = lazy(() => import('../components/crm/LindaWhatsAppCRM_NEW'));
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

// Dubai CRM Modules
const RERAComplianceModule = lazy(() => import('../components/crm/RERAComplianceModule'));
const DLDIntegrationModule = lazy(() => import('../components/crm/DLDIntegrationModule'));
const LeadScoringModule = lazy(() => import('../components/crm/LeadScoringModule'));
const PropertyValuationModule = lazy(() => import('../components/crm/PropertyValuationModule'));
const MarketAnalyticsModule = lazy(() => import('../components/crm/MarketAnalyticsModule'));

// Fallback loader for async content
const TabLoadingFallback = () => (
  <div className="tab-loading-fallback">
    <SuspenseLoader />
  </div>
);

const CRM_MODULES = {
  // AI-Powered CRM Modules
  linda: { Component: LindaWhatsAppCRM, label: 'WhatsApp CRM' },
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

export default function UnifiedDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentRole = useSelector(state => state.navigation?.activeRole || 'buyer');
  const user = useSelector(state => state.user.currentUser);
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCRMModule, setSelectedCRMModule] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get available tabs for current role
  const availableTabs = getTabsForRole(currentRole);
  const roleInfo = getRoleInfo(currentRole);
  
  // Check if user is super user (only sees /lion all the time)
  const isSuperUser = user?.email === 'arslanmalikgoraha@gmail.com' || currentRole === 'lion';

  /**
   * Filter data based on user role
   * Super users see all data, others see only their role-specific data
   */
  const filterDataByRole = (rawData) => {
    if (isSuperUser || currentRole === 'lion') {
      // Super users see ALL data unfiltered
      return rawData;
    }

    if (!rawData) return null;

    const filtered = { ...rawData };

    // Role-specific data filtering - each role sees ONLY their data
    switch (currentRole) {
      case 'landlord':
        // Landlords see ONLY their properties and their tenants
        filtered.properties = rawData.properties?.filter(p => p.ownerId === user?.id);
        filtered.tenants = rawData.tenants?.filter(t => t.landlordId === user?.id);
        filtered.agents = rawData.agents?.filter(a => a.id === user?.assignedAgentId);
        filtered.leases = rawData.leases?.filter(l => l.landlordId === user?.id);
        filtered.payments = rawData.payments?.filter(p => p.landlordId === user?.id);
        break;

      case 'tenant':
        // Tenants see ONLY their rental information
        filtered.myRental = rawData.myRental?.filter(r => r.tenantId === user?.id);
        filtered.payments = rawData.payments?.filter(p => p.tenantId === user?.id);
        filtered.maintenanceRequests = rawData.maintenanceRequests?.filter(m => m.tenantId === user?.id);
        filtered.leaseInfo = rawData.leaseInfo?.filter(l => l.tenantId === user?.id);
        break;

      case 'leasing-agent':
        // Leasing agents see ONLY their assigned properties and clients
        filtered.properties = rawData.properties?.filter(p => p.managingAgentId === user?.id);
        filtered.tenants = rawData.tenants?.filter(t => t.agentId === user?.id);
        filtered.contracts = rawData.contracts?.filter(c => c.agentId === user?.id);
        filtered.applications = rawData.applications?.filter(a => a.agentId === user?.id);
        break;

      case 'secondary-sales-agent':
        // Sales agents see ONLY their assigned clients and deals
        filtered.properties = rawData.properties?.filter(p => p.agentId === user?.id);
        filtered.leads = rawData.leads?.filter(l => l.agentId === user?.id);
        filtered.contracts = rawData.contracts?.filter(c => c.agentId === user?.id);
        filtered.commissions = rawData.commissions?.filter(c => c.agentId === user?.id);
        break;

      case 'buyer':
        // Buyers see ONLY their saved properties and offers
        filtered.savedProperties = rawData.savedProperties?.filter(p => p.userId === user?.id);
        filtered.searchHistory = rawData.searchHistory?.filter(s => s.userId === user?.id);
        filtered.offers = rawData.offers?.filter(o => o.buyerId === user?.id);
        filtered.applications = rawData.applications?.filter(a => a.buyerId === user?.id);
        break;

      case 'seller':
        // Sellers see ONLY their properties for sale
        filtered.properties = rawData.properties?.filter(p => p.sellerId === user?.id);
        filtered.offers = rawData.offers?.filter(o => {
          const propertyBelongsToSeller = rawData.properties?.some(
            p => p.id === o.propertyId && p.sellerId === user?.id
          );
          return propertyBelongsToSeller;
        });
        filtered.sales = rawData.sales?.filter(s => s.sellerId === user?.id);
        break;

      default:
        // Default: return minimal data
        filtered.properties = [];
        filtered.users = [];
        break;
    }

    return filtered;
  };
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Fetch dashboard data based on current role
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Super users get admin summary with ALL data
        // Normal users get role-specific data which gets further filtered
        const endpoint = isSuperUser 
          ? `/api/dashboard/admin/summary` 
          : `/api/dashboard/${currentRole}/summary`;
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data for role: ${currentRole}`);
        }
        
        const rawData = await response.json();
        
        // Apply role-based data filtering
        const filtered = filterDataByRole(rawData);
        
        setDashboardData(rawData);
        setFilteredData(filtered);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
        // Set default empty data to prevent blank screen
        setDashboardData({});
        setFilteredData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [currentRole, isSuperUser]);

  // Helper: Render tab content based on activeTab
  const renderTabContent = () => {
    // Check if user selected a CRM module
    if (selectedCRMModule && CRM_MODULES[selectedCRMModule]) {
      const Module = CRM_MODULES[selectedCRMModule].Component;
      return (
        <Suspense fallback={<TabLoadingFallback />}>
          <Module role={currentRole} user={user} data={isSuperUser ? dashboardData : filteredData} />
        </Suspense>
      );
    }

    // Use filtered data for normal users, raw data for super users
    const dataToRender = isSuperUser ? dashboardData : (filteredData || dashboardData);

    // Render standard tabs
    switch (activeTab) {
      case 'overview':
        return <OverviewTab role={currentRole} data={dataToRender} user={user} />;
      case 'properties':
        return <PropertiesTab role={currentRole} data={dataToRender} user={user} />;
      case 'agents':
        return <AgentsTab role={currentRole} data={dataToRender} user={user} />;
      case 'leads':
        return <LeadsTab role={currentRole} data={dataToRender} user={user} />;
      case 'contracts':
        return <ContractsTab role={currentRole} data={dataToRender} user={user} />;
      case 'analytics':
        return <AnalyticsTab role={currentRole} data={dataToRender} user={user} />;
      case 'admin':
        return <AdminDashboard role={currentRole} data={dataToRender} user={user} />;
      case 'ai-hub':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <AIAssistantHub role={currentRole} user={user} data={dataToRender} />
          </Suspense>
        );
      case 'ai-command':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <AICommandCenter role={currentRole} user={user} data={dataToRender} />
          </Suspense>
        );
      case 'users':
        return <UsersTab role={currentRole} data={dataToRender} user={user} />;
      case 'settings':
        return <SettingsTab role={currentRole} data={dataToRender} user={user} />;
      default:
        return <OverviewTab role={currentRole} data={dataToRender} user={user} />;
    }
  };

  // Handle CRM Module Selection
  const handleCRMModuleSelect = (moduleId) => {
    setSelectedCRMModule(moduleId);
    setActiveTab(null); // Clear active tab when showing CRM module
  };

  // Handle Back from CRM Module
  const handleBackFromCRM = () => {
    setSelectedCRMModule(null);
    setActiveTab('overview');
  };

  if (!user) {
    return (
      <div className="unified-dashboard unified-dashboard-error">
        <p>Please log in to access the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="unified-dashboard-layout">
      {/* Left Sidebar */}
      <SidebarContainer
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        role={currentRole}
      />

      {/* Main Dashboard Content */}
      <div className={`unified-dashboard ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Dashboard Header */}
      <div className="unified-dashboard-header">
        <div className="dashboard-title">
          <h1>{roleInfo.label} Dashboard</h1>
          <p className="dashboard-subtitle">{roleInfo.description}</p>
        </div>
        <div className="dashboard-info">
          <span className="user-email">{user.email}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="unified-dashboard-error-banner">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
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
          {/* Tab Navigation */}
          <div className="unified-dashboard-tabs">
            <div className="tabs-scroll">
              {availableTabs.map(tab => (
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
      </div>
    </div>
  );
}
