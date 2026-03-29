import React, { memo, lazy, Suspense, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshCw, Settings, Bell, LayoutGrid, List } from 'lucide-react';
import type { AssistantPerformance } from '../../store/slices/aiAssistant/types';
import { 
  AIDropdownSelector, 
  UniversalAssistantLayout,
  StatCard,
  ActivityTimeline
} from './shared';
import {
  selectCurrentAssistant,
  selectAllAssistantsArray,
  selectPerformance,
  selectRecentActivity,
  selectUI,
  setLayout
} from '../../store/slices/aiAssistantDashboardSlice';
import {
  CommandCenterContainer,
  CommandCenterHeader,
  HeaderLeft,
  CommandCenterTitle,
  CommandCenterSubtitle,
  HeaderControls,
  ViewToggleContainer,
  ToggleBtn,
  HeaderAction,
  NotificationBadge,
  CommandCenterMain,
  DashboardContainer,
  ActivitySidebar,
  LoadingContainer
} from './AICommandCenter.styles';

const NadiaWhatsAppCRM = lazy(() => import('./NadiaWhatsAppCRM'));
const MaryInventoryCRM = lazy(() => import('./MaryInventoryCRM_NEW'));
const ClaraLeadsCRM = lazy(() => import('./ClaraLeadsCRM_NEW'));
const NinaWhatsAppBotCRM = lazy(() => import('./NinaWhatsAppBotCRM_NEW'));
const NancyHRCRM = lazy(() => import('./NancyHRCRM_NEW'));
const SophiaSalesCRM = lazy(() => import('./SophiaSalesCRM_NEW'));
const DaisyLeasingCRM = lazy(() => import('./DaisyLeasingCRM_NEW'));
const TheodoraFinanceCRM = lazy(() => import('./TheodoraFinanceCRM_NEW'));
const OliviaMarketingCRM = lazy(() => import('./OliviaMarketingCRM_NEW'));
const ZoeExecutiveCRM = lazy(() => import('./ZoeExecutiveCRM_NEW'));
const LailaComplianceCRM = lazy(() => import('./LailaComplianceCRM_NEW'));
const AuroraCTODashboard = lazy(() => import('./AuroraCTODashboard_NEW'));

const ASSISTANT_COMPONENTS = {
  nadia: NadiaWhatsAppCRM,
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
  aurora: AuroraCTODashboard
};

const LoadingSpinner = memo(() => (
  <div className="command-center-loading">
    <RefreshCw size={32} className="spinner" />
    <span>Loading dashboard...</span>
  </div>
));

interface QuickStatsBarProps {
  assistants: Array<{ metrics?: { systemHealth?: string } }>;
  performance: AssistantPerformance | undefined;
}

const QuickStatsBar = memo(({ assistants, performance }: QuickStatsBarProps) => {
  const activeCount = assistants.filter(a => a.metrics?.systemHealth === 'optimal').length;
  const alertCount = performance?.criticalAlerts?.length || 0;
  
  return (
    <div className="quick-stats-bar">
      <StatCard 
        label="Active Assistants" 
        value={`${activeCount}/${assistants.length}`}
        icon={LayoutGrid}
        color="#10B981"
      />
      <StatCard 
        label="System Health" 
        value={`${performance?.overallHealth ?? 95}%`}
        icon={Settings}
        color="#0EA5E9"
        change={0.5}
      />
      <StatCard 
        label="Active Tasks" 
        value={performance?.activeTasks ?? 47}
        icon={List}
        color="#8B5CF6"
        change={12}
      />
      <StatCard 
        label="Alerts" 
        value={alertCount}
        icon={Bell}
        color={alertCount > 0 ? '#EF4444' : '#64748B'}
      />
    </div>
  );
});

const AICommandCenter = memo(() => {
  const dispatch = useDispatch();
  const currentAssistant = useSelector(selectCurrentAssistant);
  const allAssistants = useSelector(selectAllAssistantsArray);
  const performance = useSelector(selectPerformance);
  const recentActivity = useSelector(selectRecentActivity);
  const ui = useSelector(selectUI);
  
  const handleLayoutChange = useCallback((layout: 'grid' | 'list') => {
    dispatch(setLayout(layout));
  }, [dispatch]);
  
  const DashboardComponent = useMemo(() => {
    if (!currentAssistant) return null;
    const id = currentAssistant.id as keyof typeof ASSISTANT_COMPONENTS;
    return ASSISTANT_COMPONENTS[id] || null;
  }, [currentAssistant]);
  
  const assistantColor = currentAssistant?.colorScheme || '#0EA5E9';
  
  return (
    <div className="ai-command-center" style={{ '--primary-color': assistantColor } as React.CSSProperties}>
      <header className="command-center-header">
        <div className="header-left">
          <h1 className="command-center-title">AI Command Center</h1>
          <span className="command-center-subtitle">
            Unified dashboard for all AI assistants
          </span>
        </div>
        
        <div className="header-controls">
          <AIDropdownSelector />
          
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${ui?.layout === 'grid' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('grid')}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`toggle-btn ${ui?.layout === 'list' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('list')}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
          
          <button className="header-action" title="Settings">
            <Settings size={18} />
          </button>
          <button className="header-action notification" title="Notifications">
            <Bell size={18} />
            {performance?.criticalAlerts?.length > 0 && (
              <span className="notification-badge">
                {performance.criticalAlerts.length}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <QuickStatsBar assistants={allAssistants} performance={performance} />
      
      <main className="command-center-main">
        <div className="dashboard-container">
          {DashboardComponent ? (
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardComponent />
            </Suspense>
          ) : (
            <div className="no-assistant-selected">
              <div className="empty-state-icon">🤖</div>
              <h3>Select an AI Assistant</h3>
              <p>Choose an assistant from the dropdown above to view their dashboard</p>
            </div>
          )}
        </div>
        
        <aside className="activity-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Recent Activity</h3>
            <ActivityTimeline 
              activities={recentActivity} 
              maxItems={8}
              color={assistantColor}
            />
          </div>
        </aside>
      </main>
    </div>
  );
});

AICommandCenter.displayName = 'AICommandCenter';
LoadingSpinner.displayName = 'LoadingSpinner';
QuickStatsBar.displayName = 'QuickStatsBar';

export default AICommandCenter;
