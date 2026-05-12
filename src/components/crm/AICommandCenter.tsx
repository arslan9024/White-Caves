import React, { memo, lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshCw, Settings, Bell, LayoutGrid, List } from 'lucide-react';
import type { AssistantPerformance } from '../../store/slices/aiAssistant/types';
import { AIDropdownSelector, StatCard, ActivityTimeline } from './shared';
import SubagentCollaborationPanel from './shared/SubagentCollaborationPanel';
import {
  selectCurrentAssistant,
  selectAllAssistantsArray,
  selectPerformance,
  selectRecentActivity,
  selectUI,
  setLayout,
} from '../../store/slices/aiAssistantDashboardSlice';
import { getInternalModuleMountConfig } from '../../config/internalModuleMounts';

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
const LindaWhatsAppCRM = lazy(() => import('./LindaWhatsAppCRM'));
const HenryRecordsCRM = lazy(() => import('./HenryRecordsCRM'));

const renderAssistantDashboard = (assistantId?: string) => {
  switch (assistantId) {
    case 'nadia':
      return <NadiaWhatsAppCRM />;
    case 'mary':
      return <MaryInventoryCRM />;
    case 'clara':
      return <ClaraLeadsCRM />;
    case 'nina':
      return <NinaWhatsAppBotCRM />;
    case 'nancy':
      return <NancyHRCRM />;
    case 'sophia':
      return <SophiaSalesCRM />;
    case 'daisy':
      return <DaisyLeasingCRM />;
    case 'theodora':
      return <TheodoraFinanceCRM />;
    case 'olivia':
      return <OliviaMarketingCRM />;
    case 'zoe':
      return <ZoeExecutiveCRM />;
    case 'laila':
      return <LailaComplianceCRM />;
    case 'aurora':
      return <AuroraCTODashboard />;
    case 'linda':
      return <LindaWhatsAppCRM />;
    case 'henry':
      return <HenryRecordsCRM />;
    default:
      return null;
  }
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

type MountHealthStatus = 'checking' | 'healthy' | 'unhealthy' | 'error';

const AICommandCenter = memo(() => {
  const dispatch = useDispatch();
  const currentAssistant = useSelector(selectCurrentAssistant);
  const allAssistants = useSelector(selectAllAssistantsArray);
  const performance = useSelector(selectPerformance);
  const recentActivity = useSelector(selectRecentActivity);
  const ui = useSelector(selectUI);

  const handleLayoutChange = useCallback(
    (layout: 'grid' | 'list') => {
      dispatch(setLayout(layout));
    },
    [dispatch]
  );

  const dashboardNode = useMemo(
    () => renderAssistantDashboard(currentAssistant?.id ? String(currentAssistant.id) : undefined),
    [currentAssistant?.id]
  );

  const assistantColor = currentAssistant?.colorScheme || '#0EA5E9';
  const mountConfig = useMemo(
    () => (currentAssistant ? getInternalModuleMountConfig(currentAssistant.id) : null),
    [currentAssistant]
  );
  const [mountHealth, setMountHealth] = useState<MountHealthStatus>('checking');

  useEffect(() => {
    if (!mountConfig?.healthUrl || !mountConfig.enabled) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(mountConfig.healthUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        setMountHealth(response.ok ? 'healthy' : 'unhealthy');
      })
      .catch(() => {
        setMountHealth('error');
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [mountConfig?.enabled, mountConfig?.healthUrl]);

  const healthMeta = useMemo(() => {
    if (!mountConfig?.healthUrl || !mountConfig.enabled) {
      return { label: 'n/a', color: '#94A3B8', background: 'rgba(148, 163, 184, 0.15)' };
    }

    switch (mountHealth) {
      case 'checking':
        return { label: 'checking', color: '#FBBF24', background: 'rgba(251, 191, 36, 0.15)' };
      case 'healthy':
        return { label: 'healthy', color: '#34D399', background: 'rgba(52, 211, 153, 0.15)' };
      case 'unhealthy':
        return { label: 'degraded', color: '#F97316', background: 'rgba(249, 115, 22, 0.15)' };
      case 'error':
        return { label: 'unreachable', color: '#F87171', background: 'rgba(248, 113, 113, 0.15)' };
      default:
        return { label: 'checking', color: '#FBBF24', background: 'rgba(251, 191, 36, 0.15)' };
    }
  }, [mountConfig?.enabled, mountConfig?.healthUrl, mountHealth]);

  return (
    <div
      className="ai-command-center"
      style={{ '--primary-color': assistantColor } as React.CSSProperties}
    >
      <header className="command-center-header">
        <div className="header-left">
          <h1
            className="command-center-title"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            AI Command Center
            {mountConfig?.enabled ? (
              <>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                    color: mountConfig.mountMode === 'iframe' ? '#67E8F9' : '#A7F3D0',
                    border:
                      mountConfig.mountMode === 'iframe'
                        ? '1px solid rgba(103, 232, 249, 0.45)'
                        : '1px solid rgba(167, 243, 208, 0.45)',
                    borderRadius: 999,
                    padding: '2px 8px',
                    background:
                      mountConfig.mountMode === 'iframe'
                        ? 'rgba(8, 145, 178, 0.15)'
                        : 'rgba(22, 163, 74, 0.15)',
                  }}
                  aria-label={`Current mount mode ${mountConfig.mountMode}`}
                  title={`Current module mount: ${mountConfig.mountMode}`}
                >
                  {mountConfig.mountMode} mount
                </span>

                {mountConfig.healthUrl ? (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.3,
                      textTransform: 'uppercase',
                      color: healthMeta.color,
                      border: `1px solid ${healthMeta.color}55`,
                      borderRadius: 999,
                      padding: '2px 8px',
                      background: healthMeta.background,
                    }}
                    aria-label={`Mount health ${healthMeta.label}`}
                    title={`Module health endpoint status: ${healthMeta.label}`}
                  >
                    {healthMeta.label}
                  </span>
                ) : null}
              </>
            ) : null}
          </h1>
          <span className="command-center-subtitle">Unified dashboard for all AI assistants</span>
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

          <button className="header-action" title="Settings" aria-label="Open settings">
            <Settings size={18} />
          </button>
          <button
            className="header-action notification"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={18} />
            {performance?.criticalAlerts?.length > 0 && (
              <span className="notification-badge">{performance.criticalAlerts.length}</span>
            )}
          </button>
        </div>
      </header>

      <QuickStatsBar assistants={allAssistants} performance={performance} />

      <main className="command-center-main">
        <div className="dashboard-container">
          {dashboardNode ? (
            <Suspense fallback={<LoadingSpinner />}>{dashboardNode}</Suspense>
          ) : (
            <div className="no-assistant-selected">
              <div className="empty-state-icon">🤖</div>
              <h3>Select an AI Assistant</h3>
              <p>Choose an assistant from the dropdown above to view their dashboard</p>
            </div>
          )}
        </div>

        <aside className="activity-sidebar">
          <SubagentCollaborationPanel assistantId={currentAssistant?.id} />
          <div className="sidebar-section">
            <h3 className="sidebar-title">Recent Activity</h3>
            <ActivityTimeline activities={recentActivity} maxItems={8} color={assistantColor} />
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
