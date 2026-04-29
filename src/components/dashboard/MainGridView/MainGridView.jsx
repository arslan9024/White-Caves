import React, { lazy, Suspense, memo } from 'react';
import { LayoutDashboard, Bot, BarChart3, FileText, RefreshCw } from 'lucide-react';
import './MainGridView.css';

const LindaWhatsAppCRM = lazy(() => import('../../crm/LindaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('../../crm/MaryInventoryCRM'));
const ClaraLeadsCRM = lazy(() => import('../../crm/ClaraLeadsCRM'));
const NinaWhatsAppBotCRM = lazy(() => import('../../crm/NinaWhatsAppBotCRM'));
const NancyHRCRM = lazy(() => import('../../crm/NancyHRCRM'));
const SophiaSalesCRM = lazy(() => import('../../crm/SophiaSalesCRM'));
const DaisyLeasingCRM = lazy(() => import('../../crm/DaisyLeasingCRM'));
const TheodoraFinanceCRM = lazy(() => import('../../crm/TheodoraFinanceCRM'));
const OliviaMarketingCRM = lazy(() => import('../../crm/OliviaMarketingCRM'));
const ZoeExecutiveCRM = lazy(() => import('../../crm/ZoeExecutiveCRM'));
const LailaComplianceCRM = lazy(() => import('../../crm/LailaComplianceCRM'));
const AuroraCTODashboard = lazy(() => import('../../crm/AuroraCTODashboard'));
const HazelFrontendCRM = lazy(() => import('../../crm/HazelFrontendCRM'));
const WillowBackendCRM = lazy(() => import('../../crm/WillowBackendCRM'));
const EvangelineLegalCRM = lazy(() => import('../../crm/EvangelineLegalCRM'));
const SentinelPropertyCRM = lazy(() => import('../../crm/SentinelPropertyCRM'));
const HunterProspectingCRM = lazy(() => import('../../crm/HunterProspectingCRM'));
const HenryAuditCRM = lazy(() => import('../../crm/HenryAuditCRM'));
const CipherMarketCRM = lazy(() => import('../../crm/CipherMarketCRM'));
const AtlasProjectsCRM = lazy(() => import('../../crm/AtlasProjectsCRM'));
const VestaHandoverCRM = lazy(() => import('../../crm/VestaHandoverCRM'));
const JunoCommunity = lazy(() => import('../../crm/JunoCommunity'));
const KairosLuxuryCRM = lazy(() => import('../../crm/KairosLuxuryCRM'));
const MavenInvestmentCRM = lazy(() => import('../../crm/MavenInvestmentCRM'));

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

const LoadingSpinner = memo(() => (
  <div className="main-grid-loading">
    <RefreshCw size={32} className="spinner" />
    <span>Loading dashboard...</span>
  </div>
));

const MainGridView = ({ content, activeAssistant, children }) => {
  if (!activeAssistant) {
    return (
      <div className="main-grid-view">
        <div className="main-grid-placeholder">
          <div className="placeholder-icon">
            <Bot size={64} strokeWidth={1} />
          </div>
          <h2>Welcome to AI Command Center</h2>
          <p>Select an AI assistant from the sidebar to get started</p>
          <div className="quick-stats">
            <div className="stat-card">
              <LayoutDashboard size={24} />
              <span className="stat-value">24</span>
              <span className="stat-label">AI Assistants</span>
            </div>
            <div className="stat-card">
              <BarChart3 size={24} />
              <span className="stat-value">10</span>
              <span className="stat-label">Departments</span>
            </div>
            <div className="stat-card">
              <FileText size={24} />
              <span className="stat-value">All</span>
              <span className="stat-label">Online</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const assistantId = activeAssistant.id?.toLowerCase() || activeAssistant.name?.toLowerCase();
  const AssistantComponent = ASSISTANT_COMPONENTS[assistantId];

  if (children) {
    return (
      <div className="main-grid-view">
        <div className="main-grid-content">
          {children}
        </div>
      </div>
    );
  }

  if (AssistantComponent) {
    return (
      <div className="main-grid-view">
        <Suspense fallback={<LoadingSpinner />}>
          <AssistantComponent />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="main-grid-view">
      <div className="main-grid-content">
        <div className="content-header">
          <div className="assistant-context">
            <div 
              className="context-icon" 
              style={{ background: `${activeAssistant.color}20` }}
            >
              <Bot size={24} style={{ color: activeAssistant.color }} />
            </div>
            <div className="context-info">
              <h1>{activeAssistant.name}</h1>
              <p>{activeAssistant.title}</p>
            </div>
          </div>
        </div>

        <div className="content-body">
          <div className="component-placeholder">
            <div className="placeholder-card">
              <h3>{content?.component || 'Dashboard'}</h3>
              <p>
                Dashboard for <strong>{activeAssistant.name}</strong> is being developed.
              </p>
              <div className="capabilities">
                <h4>Capabilities:</h4>
                <ul>
                  {activeAssistant.capabilities?.slice(0, 5).map((cap, index) => (
                    <li key={index}>{cap.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainGridView;
