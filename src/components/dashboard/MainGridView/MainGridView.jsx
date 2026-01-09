import React, { Suspense, lazy, useMemo } from 'react';
import { LayoutDashboard, Bot, BarChart3, FileText, Loader } from 'lucide-react';
import './MainGridView.css';

const CRM_COMPONENTS = {
  zoe: lazy(() => import('../../crm/ZoeExecutiveCRM')),
  mary: lazy(() => import('../../crm/MaryInventoryCRM')),
  linda: lazy(() => import('../../crm/LindaWhatsAppCRM')),
  clara: lazy(() => import('../../crm/ClaraLeadsCRM')),
  nina: lazy(() => import('../../crm/NinaWhatsAppBotCRM')),
  nancy: lazy(() => import('../../crm/NancyHRCRM')),
  sophia: lazy(() => import('../../crm/SophiaSalesCRM')),
  daisy: lazy(() => import('../../crm/DaisyLeasingCRM')),
  theodora: lazy(() => import('../../crm/TheodoraFinanceCRM')),
  olivia: lazy(() => import('../../crm/OliviaMarketingCRM')),
  laila: lazy(() => import('../../crm/LailaComplianceCRM')),
  aurora: lazy(() => import('../../crm/AuroraCTODashboard')),
  hazel: lazy(() => import('../../crm/HazelFrontendCRM')),
  willow: lazy(() => import('../../crm/WillowBackendCRM')),
  evangeline: lazy(() => import('../../crm/EvangelineLegalCRM')),
  sentinel: lazy(() => import('../../crm/SentinelPropertyCRM')),
  hunter: lazy(() => import('../../crm/HunterLeadCRM')),
  henry: lazy(() => import('../../crm/HenryAuditCRM')),
  cipher: lazy(() => import('../../crm/CipherMarketCRM')),
  atlas: lazy(() => import('../../crm/AtlasDevelopmentCRM')),
  vesta: lazy(() => import('../../crm/VestaHandoverCRM')),
  juno: lazy(() => import('../../crm/JunoCommunityCRM')),
  kairos: lazy(() => import('../../crm/KairosLuxuryCRM')),
  maven: lazy(() => import('../../crm/MavenInvestmentCRM'))
};

const LoadingFallback = () => (
  <div className="crm-loading">
    <Loader size={40} className="spinning" />
    <span>Loading dashboard...</span>
  </div>
);

const MainGridView = ({ content, activeAssistant, children }) => {
  const CRMComponent = useMemo(() => {
    if (!activeAssistant?.id) return null;
    return CRM_COMPONENTS[activeAssistant.id] || null;
  }, [activeAssistant?.id]);

  const renderContent = () => {
    if (!activeAssistant) {
      return (
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
      );
    }

    if (children) {
      return children;
    }

    if (CRMComponent) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          <CRMComponent assistant={activeAssistant} />
        </Suspense>
      );
    }

    return (
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
                This is where the <strong>{content?.component || 'Dashboard'}</strong> component 
                for <strong>{activeAssistant.name}</strong> would render.
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
    );
  };

  return (
    <div className="main-grid-view">
      {renderContent()}
    </div>
  );
};

export default MainGridView;
