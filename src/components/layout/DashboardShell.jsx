import React, { Suspense, lazy, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentAssistant, selectUI } from '../../store/slices/aiAssistantDashboardSlice';
import { selectSelectedFeature } from '../../store/slices/dashboardViewSlice';
import CommandSidebar from './CommandSidebar';
import './DashboardShell.css';

const LindaWhatsAppCRM = lazy(() => import('../crm/LindaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('../crm/MaryInventoryCRM'));
const ClaraLeadsCRM = lazy(() => import('../crm/ClaraLeadsCRM'));
const NinaWhatsAppBotCRM = lazy(() => import('../crm/NinaWhatsAppBotCRM'));
const NancyHRCRM = lazy(() => import('../crm/NancyHRCRM'));
const SophiaSalesCRM = lazy(() => import('../crm/SophiaSalesCRM'));
const DaisyLeasingCRM = lazy(() => import('../crm/DaisyLeasingCRM'));
const TheodoraFinanceCRM = lazy(() => import('../crm/TheodoraFinanceCRM'));
const OliviaMarketingCRM = lazy(() => import('../crm/OliviaMarketingCRM'));
const ZoeExecutiveCRM = lazy(() => import('../crm/ZoeExecutiveCRM'));
const LailaComplianceCRM = lazy(() => import('../crm/LailaComplianceCRM'));
const AuroraCTODashboard = lazy(() => import('../crm/AuroraCTODashboard'));
const HazelFrontendCRM = lazy(() => import('../crm/HazelFrontendCRM'));
const WillowBackendCRM = lazy(() => import('../crm/WillowBackendCRM'));
const EvangelineLegalCRM = lazy(() => import('../crm/EvangelineLegalCRM'));
const SentinelPropertyCRM = lazy(() => import('../crm/SentinelPropertyCRM'));
const HunterProspectingCRM = lazy(() => import('../crm/HunterProspectingCRM'));
const HenryAuditCRM = lazy(() => import('../crm/HenryAuditCRM'));
const CipherMarketCRM = lazy(() => import('../crm/CipherMarketCRM'));
const AtlasProjectsCRM = lazy(() => import('../crm/AtlasProjectsCRM'));
const VestaHandoverCRM = lazy(() => import('../crm/VestaHandoverCRM'));
const JunoCommunity = lazy(() => import('../crm/JunoCommunity'));
const KairosLuxuryCRM = lazy(() => import('../crm/KairosLuxuryCRM'));
const MavenInvestmentCRM = lazy(() => import('../crm/MavenInvestmentCRM'));

const ASSISTANT_COMPONENTS = {
  linda: LindaWhatsAppCRM,
  mary: MaryInventoryCRM,
  clara: ClaraLeadsCRM,
  nina: NinaWhatsAppBotCRM,
  nancy: NancyHRCRM,
  sophia: SophiaSalesCRM,
  daisy: DaisyLeasingCRM,
  theodora: TheodoraFinanceCRM,
  olivia: OliviaMarketingCRM,
  zoe: ZoeExecutiveCRM,
  laila: LailaComplianceCRM,
  aurora: AuroraCTODashboard,
  hazel: HazelFrontendCRM,
  willow: WillowBackendCRM,
  evangeline: EvangelineLegalCRM,
  sentinel: SentinelPropertyCRM,
  hunter: HunterProspectingCRM,
  henry: HenryAuditCRM,
  cipher: CipherMarketCRM,
  atlas: AtlasProjectsCRM,
  vesta: VestaHandoverCRM,
  juno: JunoCommunity,
  kairos: KairosLuxuryCRM,
  maven: MavenInvestmentCRM
};

const LoadingFallback = () => (
  <div className="dashboard-loading">
    <div className="loading-spinner"></div>
    <span>Loading...</span>
  </div>
);

const WelcomeScreen = () => (
  <div className="dashboard-welcome">
    <div className="welcome-content">
      <div className="welcome-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <h1>AI Command Center</h1>
      <p>Select an AI assistant from the sidebar to view their dashboard</p>
      <div className="welcome-stats">
        <div className="stat">
          <span className="stat-number">24</span>
          <span className="stat-label">AI Assistants</span>
        </div>
        <div className="stat">
          <span className="stat-number">10</span>
          <span className="stat-label">Departments</span>
        </div>
        <div className="stat">
          <span className="stat-number">9,378+</span>
          <span className="stat-label">Properties</span>
        </div>
      </div>
    </div>
  </div>
);

const DashboardShell = ({ children }) => {
  const currentAssistant = useSelector(selectCurrentAssistant);
  const selectedFeature = useSelector(selectSelectedFeature);
  const ui = useSelector(selectUI);
  
  const DashboardComponent = useMemo(() => {
    if (!currentAssistant) return null;
    return ASSISTANT_COMPONENTS[currentAssistant.id] || null;
  }, [currentAssistant]);

  const assistantColor = currentAssistant?.colorScheme || '#0EA5E9';

  return (
    <div className="dashboard-shell" style={{ '--assistant-color': assistantColor }}>
      <CommandSidebar />
      
      <main className="dashboard-content">
        {currentAssistant && DashboardComponent ? (
          <div className="content-wrapper">
            <header className="content-header">
              <div className="header-info">
                <h1 className="assistant-title">{currentAssistant.name}</h1>
                <span className="assistant-role">{currentAssistant.title}</span>
              </div>
              {selectedFeature && selectedFeature !== 'dashboard' && (
                <div className="feature-badge">
                  {selectedFeature.replace(/_/g, ' ')}
                </div>
              )}
            </header>
            
            <div className="content-body">
              <Suspense fallback={<LoadingFallback />}>
                <DashboardComponent activeFeature={selectedFeature} />
              </Suspense>
            </div>
          </div>
        ) : (
          <WelcomeScreen />
        )}
      </main>
    </div>
  );
};

export default DashboardShell;
