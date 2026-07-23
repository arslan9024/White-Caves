import React, { useMemo } from 'react';
import { useAuthContext } from './contexts/AuthContext';
import { useActiveView, VIEW_KEYS } from './contexts/ActiveViewContext';
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import {
  SalesView,
  OperationsView,
  CommunicationsView,
  FinanceView,
  MarketingView,
  ExecutiveView,
  ComplianceView,
  TechnologyView,
  LegalView,
  IntelligenceView
} from './DepartmentViews';

/**
 * MainLayout.jsx — Workspace Layout Orchestrator
 */

// ─── View Label Mapping ─────────────────────────────────────────────────────
const VIEW_LABELS = {
  [VIEW_KEYS.DASHBOARD]:   'Personal Dashboard',
  [VIEW_KEYS.SALES]:       'Sales Department',
  [VIEW_KEYS.OPERATIONS]:  'Operations Department',
  [VIEW_KEYS.COMMUNICATIONS]: 'Communications Department',
  [VIEW_KEYS.FINANCE]:     'Finance Department',
  [VIEW_KEYS.MARKETING]:   'Marketing Department',
  [VIEW_KEYS.EXECUTIVE]:   'Executive Department',
  [VIEW_KEYS.COMPLIANCE]:  'Compliance Department',
  [VIEW_KEYS.TECHNOLOGY]:  'Technology Department',
  [VIEW_KEYS.LEGAL]:       'Legal Department',
  [VIEW_KEYS.INTELLIGENCE]:'Intelligence Department',
};

export default function MainLayout() {
  const { user } = useAuthContext();
  const { activeView } = useActiveView();

  const currentLabel = VIEW_LABELS[activeView] || 'Dashboard';

  // Render the active view panel
  const viewContent = useMemo(() => {
    switch (activeView) {
      case VIEW_KEYS.DASHBOARD:    return <DashboardView />;
      case VIEW_KEYS.SALES:        return <SalesView />;
      case VIEW_KEYS.OPERATIONS:   return <OperationsView />;
      case VIEW_KEYS.COMMUNICATIONS: return <CommunicationsView />;
      case VIEW_KEYS.FINANCE:      return <FinanceView />;
      case VIEW_KEYS.MARKETING:    return <MarketingView />;
      case VIEW_KEYS.EXECUTIVE:    return <ExecutiveView />;
      case VIEW_KEYS.COMPLIANCE:   return <ComplianceView />;
      case VIEW_KEYS.TECHNOLOGY:   return <TechnologyView />;
      case VIEW_KEYS.LEGAL:        return <LegalView />;
      case VIEW_KEYS.INTELLIGENCE: return <IntelligenceView />;
      default: return <DashboardView />;
    }
  }, [activeView]);

  return (
    <div className="ws-workspace">
      <Sidebar />

      <div className="ws-main">
        {/* Top Header Bar */}
        <header className="ws-header">
          <div className="ws-header-left">
            <div className="ws-breadcrumbs">
              <span>White Caves</span>
              <span>/</span>
              <span>CRM</span>
              <span>/</span>
              <span>{currentLabel}</span>
            </div>
            <input
              type="text"
              className="ws-header-search"
              placeholder="Search leads, properties, Form 7…"
            />
          </div>

          <div className="ws-header-right">
            <button className="ws-header-btn" title="Notifications">
              🔔 <span>3</span>
            </button>
            <button className="ws-header-btn" title="Quick Actions">
              ⚡ Quick
            </button>

            <div className="ws-header-user">
              <div>
                <div className="ws-header-user-name">{user?.name}</div>
                <div className="ws-header-user-dept">
                  {user?.role} · CL{user?.clearance_level}
                </div>
              </div>
              <div className="ws-header-avatar">
                {user?.avatar_initials || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="ws-viewport">
          <div className="ws-view-enter" key={activeView}>
            {viewContent}
          </div>
        </main>
      </div>
    </div>
  );
}
