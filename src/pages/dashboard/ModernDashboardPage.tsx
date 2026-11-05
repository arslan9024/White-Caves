/**
 * White Caves Real Estate LLC - Sovereign Executive Dashboard Page
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Page Orchestrator)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Deep URL Routing & Bhakti Protocol Anchors
 */

import React, { FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ExecutiveTopNavbar } from '../../components/dashboard/ExecutiveTopNavbar';
import { ExecutiveVSCodeSidebar } from '../../components/dashboard/ExecutiveVSCodeSidebar';
import { ExecutiveAIVSCodeSidebar } from '../../components/dashboard/ExecutiveAIVSCodeSidebar';
import { DepartmentManagementWorkspace } from '../../components/crm/DepartmentManager';
import { EmployeeManagerView } from '../../components/crm/EmployeeManager';
import { TaskManagerView } from '../../components/crm/TaskManager';
import { LeaderboardView } from '../../components/crm/Leaderboard';
import { REPropertyManagerView } from '../../components/crm/REPropertyManager';
import { DealManagerView } from '../../components/crm/DealManager';
import { DocumentManagerView } from '../../components/crm/DocumentManager';
import { RelationshipManagerView } from '../../components/crm/RelationshipManager';
import { CustomerManagerView } from '../../components/crm/CustomerManager';
import { GlobalEntityCommandPalette } from '../../components/dashboard/GlobalEntityCommandPalette';
import { CorporateDepartmentsProvider } from '../../context/CorporateDepartmentsContext';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export const ModernDashboardPage: FC = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse deep URL e.g. /dashboard/tasks/T001 or /dashboard/departments/DEPT-01/sub/SUB-01
  const pathParts = location.pathname
    .replace(/^\/dashboard\/?/, '')
    .split('/')
    .filter(Boolean);
  const rawTab = pathParts[0] as ActivityTab | undefined;
  const activeItemId = pathParts[1] || null;

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
    'audit',
    'settings',
  ];

  const activeTab: ActivityTab = validTabs.includes(rawTab as ActivityTab)
    ? (rawTab as ActivityTab)
    : 'departments';

  // ERMS double-layer route extraction: /dashboard/erms/entities/:id or /dashboard/erms/relationships/:id
  let ermsSubTab: 'entities' | 'relationships' | 'erd' = 'entities';
  let ermsEntityId: string | null = null;
  let ermsRelationshipId: string | null = null;

  if (rawTab === 'erms' || rawTab === 'relationships') {
    const layer1 = pathParts[1];
    const layer2 = pathParts[2];
    if (layer1 === 'entities') {
      ermsSubTab = 'entities';
      ermsEntityId = layer2 || null;
    } else if (layer1 === 'relationships') {
      ermsSubTab = 'relationships';
      ermsRelationshipId = layer2 || null;
    } else if (layer1 === 'erd') {
      ermsSubTab = 'erd';
    } else if (layer1 && (layer1.startsWith('rel-') || layer1.startsWith('REL-'))) {
      ermsSubTab = 'relationships';
      ermsRelationshipId = layer1;
    } else if (layer1) {
      ermsSubTab = 'entities';
      ermsEntityId = layer1;
    }
  }

  // Auto-redirect /dashboard to /dashboard/departments
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate('/dashboard/departments', { replace: true });
    }
  }, [location.pathname, navigate]);

  const [activeAgent, setActiveAgent] = useState<{ id: string; name: string } | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSelectSidebarTab = (tab: ActivityTab) => {
    if (tab === 'erms' || tab === 'relationships') {
      navigate('/dashboard/erms/entities');
    } else {
      navigate(`/dashboard/${tab}`);
    }
  };

  const handleSelectSidebarItem = (key: string, label: string) => {
    if (key === 'departments-crud') return navigate('/dashboard/departments');
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
        backgroundColor: isDark ? '#070D18' : '#F8FAFC',
        color: isDark ? '#FFFFFF' : '#0F172A',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      data-testid="modern-dashboard-page"
    >
      <CorporateDepartmentsProvider>
        {/* ── Global Entity Quick Switcher (Ctrl+K) ───────────────────────── */}
        <GlobalEntityCommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectEntity={entity => {
            navigate(entity.route);
          }}
        />

        {/* ── Top Executive Navbar ────────────────────────────────────────── */}
        <div style={{ position: 'relative' }}>
          <ExecutiveTopNavbar sticky={true} />
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

        {/* ── Main Workspace Body (Sidebar + Viewport + AI Mesh) ──────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* ── Left VS Code-Style Explorer Sidebar ────────────────────────── */}
          <ExecutiveVSCodeSidebar
            activeTab={activeTab}
            onSelectTab={handleSelectSidebarTab}
            onSelectItem={handleSelectSidebarItem}
          />

          {/* ── Center Working Canvas (Viewport Switcher) ─────────────────── */}
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
            {/* ── Active Viewport Switcher ── */}
            {activeTab === 'departments' ? (
              <DepartmentManagementWorkspace
                selectedDeptId={activeItemId || undefined}
                isReadOnly={isReadOnly}
              />
            ) : activeTab === 'employees' ? (
              <EmployeeManagerView selectedEmpId={activeItemId || undefined} />
            ) : activeTab === 'tasks' ? (
              <TaskManagerView
                selectedTaskId={activeItemId}
                onSelectTask={id => navigate(`/dashboard/tasks/${id}`)}
              />
            ) : activeTab === 'leaderboard' ? (
              <LeaderboardView />
            ) : activeTab === 'REproperties' ? (
              <REPropertyManagerView
                selectedPropertyId={activeItemId}
                onSelectProperty={id => navigate(`/dashboard/REproperties/${id}`)}
              />
            ) : activeTab === 'deals' ? (
              <DealManagerView
                selectedDealId={activeItemId}
                onSelectDeal={id => navigate(`/dashboard/deals/${id}`)}
              />
            ) : activeTab === 'documents' ? (
              <DocumentManagerView
                selectedDocId={activeItemId}
                onSelectDoc={id => navigate(`/dashboard/documents/${id}`)}
              />
            ) : activeTab === 'relationships' || activeTab === 'erms' ? (
              <RelationshipManagerView
                initialTab={ermsSubTab}
                selectedEntityId={ermsEntityId}
                selectedRelationshipId={ermsRelationshipId}
                onSelectEntity={id => navigate(`/dashboard/erms/entities/${id}`)}
                onSelectRelationship={id => navigate(`/dashboard/erms/relationships/${id}`)}
                onNavigateToDeepRoute={route => navigate(route)}
              />
            ) : activeTab === 'customers' ? (
              <CustomerManagerView
                selectedCustomerId={activeItemId}
                onSelectCustomer={id => navigate(`/dashboard/customers/${id}`)}
              />
            ) : (
              <div
                style={{
                  flex: 1,
                  border: isDark
                    ? '1.5px dashed rgba(239, 68, 68, 0.25)'
                    : '1.5px dashed rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#64748B' : '#475569',
                  backgroundColor: isDark ? 'rgba(7, 13, 24, 0.3)' : '#F8FAFC',
                  textAlign: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '2rem' }}>🎯</span>
                <div style={{ maxWidth: '480px' }}>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: isDark ? '#F1F5F9' : '#0F172A',
                    }}
                  >
                    {activeTab.toUpperCase()} Viewport Initialized
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      marginTop: '4px',
                      color: isDark ? '#94A3B8' : '#64748B',
                    }}
                  >
                    Select a module from the left activity bar to inspect departments, employees,
                    tasks, or merit rankings.
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* ── Right VS Code-Style AI Command Center Sidebar ─────────────────── */}
          <ExecutiveAIVSCodeSidebar
            onSelectAgent={(agentId, agentName) => setActiveAgent({ id: agentId, name: agentName })}
            onSelectItem={handleSelectRightExplorerItem}
          />
        </div>
      </CorporateDepartmentsProvider>
    </div>
  );
};

export default ModernDashboardPage;
