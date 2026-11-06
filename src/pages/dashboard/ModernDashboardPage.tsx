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
import { DashboardContentRouter } from './DashboardContentRouter';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export const ModernDashboardPage: FC = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname
    .replace(/^\/dashboard\/?/, '')
    .split('/')
    .filter(Boolean);
  const rawTab = pathParts[0] as ActivityTab | undefined;
  const activeItemId = pathParts[1] || null;
  const isRootOverview = !pathParts[1];

  const queryParams = new URLSearchParams(location.search);
  const isReadOnly = queryParams.get('mode') === 'view' || queryParams.get('mode') === 'execution';

  const validTabs: ActivityTab[] = [
    'departments',
    'employees',
    'tasks',
    'leaderboard',
    'REproperties',
    'deals',
    'documents',
    'relationships',
    'erms',
    'customers',
  ];

  const activeTab: ActivityTab = rawTab && validTabs.includes(rawTab) ? rawTab : 'departments';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSidebarTab = (tab: ActivityTab) => {
    navigate(`/dashboard/${tab}`);
  };

  const handleSelectSidebarItem = (key: string, label: string) => {
    if (key === 'departments-crud') return navigate('/dashboard/departments/slots');
    if (key.startsWith('route-')) return navigate(key.replace('route-', ''));
    if (key.startsWith('entity-'))
      return navigate(`/dashboard/erms/entities/${key.replace('entity-', '')}`);
    if (key.startsWith('rel-'))
      return navigate(`/dashboard/erms/relationships/${key.replace('rel-', '')}`);
    const prefixes: Record<string, string> = {
      'emp-': '/dashboard/employees/',
      'task-': '/dashboard/tasks/',
      'lead-': '/dashboard/leaderboard/',
      'prop-': '/dashboard/REproperties/',
      'deal-': '/dashboard/deals/',
      'doc-': '/dashboard/documents/',
      'cust-': '/dashboard/customers/',
    };
    for (const [pfx, route] of Object.entries(prefixes)) {
      if (key.startsWith(pfx)) return navigate(`${route}${key.replace(pfx, '')}`);
    }
    navigate(`/dashboard/${activeTab}`);
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
    handleSelectSidebarItem(key, label);
  };

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
              <kbd
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                }}
              >
                Ctrl+K
              </kbd>
            </button>
          </div>
          <VSCodeBreadcrumbs onNavigate={navigate} />
          <GlobalEntityCommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
            onSelectEntity={entity => {
              navigate(entity.route);
              setIsCommandPaletteOpen(false);
            }}
          />
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            <ExecutiveVSCodeSidebar
              activeTab={activeTab}
              onSelectTab={handleSelectSidebarTab}
              onSelectItem={handleSelectSidebarItem}
            />

            <main
              style={{
                flex: 1,
                height: '100%',
                overflowY: 'auto',
                backgroundColor: isDark ? '#020617' : '#FFFFFF',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
              data-testid="viewport-main-area"
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
                navigate={navigate}
              />
            </main>

            <ExecutiveAIVSCodeSidebar
              onSelectAgent={(agentId, agentName) =>
                setActiveAgent({ id: agentId, name: agentName })
              }
              onSelectItem={handleSelectRightExplorerItem}
            />
          </div>
        </ErmsProvider>
      </CorporateDepartmentsProvider>
    </div>
  );
};

export default ModernDashboardPage;
