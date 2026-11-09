// FILE: src/pages/dashboard/ModernDashboardPage.tsx
/**
 * White Caves Real Estate LLC - Sovereign Executive Dashboard Page
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Page Orchestrator)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Deep URL Routing & Bhakti Protocol Anchors
 */

import React, { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ExecutiveTopNavbar } from '../../components/dashboard/ExecutiveTopNavbar';
import { ExecutiveVSCodeSidebar } from '../../components/dashboard/ExecutiveVSCodeSidebar';
import { ExecutiveAIVSCodeSidebar } from '../../components/dashboard/ExecutiveAIVSCodeSidebar';
import { GlobalEntityCommandPalette } from '../../components/dashboard/GlobalEntityCommandPalette';
import { CorporateDepartmentsProvider } from '../../context/CorporateDepartmentsContext';
import { ErmsProvider } from '../../context/ErmsContext';
import { VSCodeBreadcrumbs } from '../../components/dashboard/VSCodeBreadcrumbs';
import { DashboardLiveTicker } from '../../components/dashboard/header/DashboardLiveTicker';
import { MDCommandStrip } from '../../components/dashboard/header/MDCommandStrip';
import { DashboardContentRouter } from './DashboardContentRouter';
import { RoleConfirmationModal } from '../../components/auth/RoleConfirmationModal';
import { useUserRole } from '../../context/UserRoleContext';
import {
  VALID_DASHBOARD_TABS,
  useSidebarToggles,
  resolveSidebarItemRoute,
} from './ModernDashboardPage.logic';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export const ModernDashboardPage: FC = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const roleContext = useUserRole();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const pathParts = location.pathname
    .replace(/^\/dashboard\/?/, '')
    .split('/')
    .filter(Boolean);

  // Normalize /dashboard/explorer/* to direct dashboard entity routes
  let rawTab = pathParts[0] as ActivityTab | undefined;
  let activeItemId = pathParts[1] || null;

  if (rawTab === ('explorer' as ActivityTab) && pathParts.length > 1) {
    const explorerSub = pathParts[1];
    const explorerId = pathParts[2] || null;
    if (explorerSub === 'departments') {
      rawTab = 'departments';
      activeItemId = explorerId;
    } else if (explorerSub === 'tasks') {
      rawTab = 'tasks';
      activeItemId = explorerId;
    } else if (explorerSub === 'properties' || explorerSub === 'REproperties') {
      rawTab = 'REproperties';
      activeItemId = explorerId;
    } else if (explorerSub === 'deals') {
      rawTab = 'deals';
      activeItemId = explorerId;
    } else if (explorerSub === 'employees') {
      rawTab = 'employees';
      activeItemId = explorerId;
    }
  }

  const isRootOverview = !activeItemId;

  const queryParams = new URLSearchParams(location.search);
  const isReadOnly = queryParams.get('mode') === 'view' || queryParams.get('mode') === 'execution';
  const activeTab: ActivityTab = rawTab && VALID_DASHBOARD_TABS.includes(rawTab) ? rawTab : 'departments';

  let ermsSubTab: 'entities' | 'relationships' | 'graph' | 'matrix' = 'entities';
  let ermsEntityId: string | null = null;
  let ermsRelationshipId: string | null = null;
  const isErmsRootOverview =
    (activeTab === 'erms' || activeTab === 'relationships') &&
    (pathParts.length === 1 || !pathParts[1]);

  if (activeTab === 'erms' || activeTab === 'relationships') {
    if (pathParts[1] === 'entities') {
      ermsSubTab = 'entities';
      ermsEntityId = pathParts[2] || null;
    } else if (pathParts[1] === 'relationships') {
      ermsSubTab = 'relationships';
      ermsRelationshipId = pathParts[2] || null;
    } else if (pathParts[1] === 'graph') {
      ermsSubTab = 'graph';
    } else if (pathParts[1] === 'matrix') {
      ermsSubTab = 'matrix';
    }
  }

  const [activeAgent, setActiveAgent] = useState<{ id: string; name: string } | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { isLeftCollapsed, isRightCollapsed, toggleLeftSidebar, toggleRightSidebar } = useSidebarToggles();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'key' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const isMdOrFounder = Boolean(
      roleContext?.isManagingDirector || roleContext?.isFounder || roleContext?.role === 'managing_director'
    );
    if (isMdOrFounder) {
      setIsRoleModalOpen(false);
      return;
    }
    if (
      roleContext?.user &&
      roleContext.user.id !== 'guest_user' &&
      (!roleContext.isRoleConfirmed || roleContext.role === 'guest')
    ) {
      setIsRoleModalOpen(true);
      return;
    }
    if (pathParts.length === 0 && roleContext?.isRoleConfirmed) {
      if (roleContext.role === 'landlord') navigate('/dashboard/landlord', { replace: true });
      else if (roleContext.role === 'tenant') navigate('/dashboard/tenant', { replace: true });
      else if (roleContext.role === 'agent') navigate('/dashboard/broker', { replace: true });
    }
  }, [
    pathParts.length,
    roleContext?.user,
    roleContext?.role,
    roleContext?.isRoleConfirmed,
    roleContext?.isManagingDirector,
    roleContext?.isFounder,
    navigate,
  ]);

  const handleSelectSidebarTab = (tab: ActivityTab) => {
    setActiveAgent(null);
    navigate(`/dashboard/${tab}`);
  };

  const handleSelectSidebarItem = (key: string) => {
    setActiveAgent(null);
    navigate(resolveSidebarItemRoute(key, activeTab));
  };

  const handleSelectRightExplorerItem = (key: string, label: string) => {
    const viewPrefixes: Record<string, string> = {
      'dept-': '/dashboard/departments/',
      'task-': '/dashboard/tasks/',
      'prop-': '/dashboard/REproperties/',
      'deal-': '/dashboard/deals/',
      'emp-': '/dashboard/employees/',
    };
    for (const [pfx, route] of Object.entries(viewPrefixes)) {
      if (key.startsWith(pfx)) {
        const id = key.replace(pfx, '');
        const mode = pfx === 'task-' ? 'execution' : 'view';
        return navigate(`${route}${id}?mode=${mode}`);
      }
    }
    handleSelectSidebarItem(key);
  };

  const isMdOrFounder = Boolean(
    roleContext?.isManagingDirector || roleContext?.isFounder || roleContext?.role === 'managing_director'
  );

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isDark ? '#020617' : '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <CorporateDepartmentsProvider>
        <ErmsProvider>
          <div style={{ position: 'relative' }}>
            <ExecutiveTopNavbar sticky={true} homeRoute="/dashboard/departments" />
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              data-testid="quick-command-palette-btn"
              style={{
                position: 'absolute',
                right: '260px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '4px 10px',
                color: '#EF4444',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⌘ Quick Find</span>
              <kbd style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.65rem' }}>
                Ctrl+K
              </kbd>
            </button>
          </div>
          <VSCodeBreadcrumbs onNavigate={navigate} />

          {/* Legacy Dashboard2 Executive Header Strip & Live Dubai Ticker */}
          {isMdOrFounder && (
            <div style={{ padding: '4px 16px', background: isDark ? '#020617' : '#FFFFFF' }}>
              <MDCommandStrip
                mdName={roleContext?.user?.name || 'Managing Director'}
                mdEmail={roleContext?.user?.email}
                onOpenModule={modId => navigate(`/dashboard/module/${modId}`)}
              />
            </div>
          )}
          <div style={{ padding: '0 16px', background: isDark ? '#020617' : '#FFFFFF' }}>
            <DashboardLiveTicker />
          </div>

          {isCommandPaletteOpen && (
            <GlobalEntityCommandPalette
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
              onSelectEntity={entity => {
                navigate(entity.route);
                setIsCommandPaletteOpen(false);
              }}
            />
          )}

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            <ExecutiveVSCodeSidebar
              activeTab={activeTab}
              onSelectTab={handleSelectSidebarTab}
              onSelectItem={handleSelectSidebarItem}
              onOpenDeptManager={() => navigate('/dashboard/departments/slots')}
              isCollapsed={isLeftCollapsed}
              onToggleCollapse={toggleLeftSidebar}
            />

            <main
              style={{
                flex: 1,
                height: '100%',
                overflowY: 'auto',
                backgroundColor: isDark ? '#020617' : '#F8FAFC',
                color: isDark ? '#F8FAFC' : '#0F172A',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
              data-testid="viewport-main-area"
            >
              <React.Suspense
                fallback={
                  <div style={{ padding: '32px' }}>
                    <div
                      style={{
                        height: '450px',
                        borderRadius: '16px',
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                      }}
                    />
                  </div>
                }
              >
                <DashboardContentRouter
                  activeTab={activeTab}
                  isRootOverview={isRootOverview}
                  activeItemId={activeItemId}
                  isReadOnly={isReadOnly}
                  isErmsRootOverview={isErmsRootOverview}
                  ermsSubTab={ermsSubTab}
                  ermsEntityId={ermsEntityId}
                  ermsRelationshipId={ermsRelationshipId}
                  activeAgent={activeAgent}
                  navigate={navigate}
                  onOpenRoleModal={() => setIsRoleModalOpen(true)}
                />
              </React.Suspense>
            </main>

            <ExecutiveAIVSCodeSidebar
              activeDomain={activeTab}
              activeEntityId={activeItemId || undefined}
              onSelectAgent={(agentId, agentName) => {
                setActiveAgent({ id: agentId, name: agentName });
                if (agentId === 'linda') {
                  navigate('/dashboard/linda');
                } else if (agentId === 'ai-command') {
                  navigate('/dashboard/aiams');
                } else {
                  navigate(`/dashboard/aiams/${agentId}`);
                }
              }}
              onSelectItem={handleSelectRightExplorerItem}
              isCollapsed={isRightCollapsed}
              onToggleCollapse={toggleRightSidebar}
            />
          </div>

          <RoleConfirmationModal
            isOpen={isRoleModalOpen && !roleContext?.isManagingDirector && !roleContext?.isFounder}
            onClose={() => setIsRoleModalOpen(false)}
            onRoleConfirmed={confirmed =>
              navigate(`/dashboard/${confirmed === 'agent' ? 'broker' : confirmed}`)
            }
          />
        </ErmsProvider>
      </CorporateDepartmentsProvider>
    </div>
  );
};

export default ModernDashboardPage;
