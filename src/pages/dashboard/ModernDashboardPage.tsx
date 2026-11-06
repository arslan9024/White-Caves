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
import { DepartmentOverviewView } from '../../components/crm/DepartmentManager/DepartmentOverviewView';
import { EmployeeManagerView } from '../../components/crm/EmployeeManager';
import { EmployeeOverviewView } from '../../components/crm/EmployeeManager/EmployeeOverviewView';
import { TaskManagerView } from '../../components/crm/TaskManager';
import { TaskOverviewView } from '../../components/crm/TaskManager/TaskOverviewView';
import { LeaderboardView } from '../../components/crm/Leaderboard';
import { LeaderboardOverviewView } from '../../components/crm/Leaderboard/LeaderboardOverviewView';
import { REPropertyManagerView } from '../../components/crm/REPropertyManager';
import { REPropertyOverviewView } from '../../components/crm/REPropertyManager/REPropertyOverviewView';
import { DealManagerView } from '../../components/crm/DealManager';
import { DealOverviewView } from '../../components/crm/DealManager/DealOverviewView';
import { DocumentManagerView } from '../../components/crm/DocumentManager';
import { DocumentOverviewView } from '../../components/crm/DocumentManager/DocumentOverviewView';
import { CustomerManagerView } from '../../components/crm/CustomerManager';
import { CustomerOverviewView } from '../../components/crm/CustomerManager/CustomerOverviewView';
import { RelationshipManagerView } from '../../components/crm/RelationshipManager';
import { ErmsOverviewView } from '../../components/crm/RelationshipManager/ErmsOverviewView';
import { GlobalEntityCommandPalette } from '../../components/dashboard/GlobalEntityCommandPalette';
import { CorporateDepartmentsProvider } from '../../context/CorporateDepartmentsContext';
import { ErmsProvider } from '../../context/ErmsContext';
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
    'audit',
    'settings',
  ];
  const activeTab: ActivityTab = validTabs.includes(rawTab as ActivityTab)
    ? (rawTab as ActivityTab)
    : 'departments';

  // ERMS double-layer extraction
  const isErmsRootOverview = rawTab === 'erms' && isRootOverview;
  let ermsSubTab: 'entities' | 'relationships' | 'erd' =
    rawTab === 'relationships' ? 'relationships' : 'entities';
  let ermsEntityId: string | null = null;
  let ermsRelationshipId: string | null = null;

  if (rawTab === 'erms' || rawTab === 'relationships') {
    const l1 = pathParts[1];
    const l2 = pathParts[2];
    if (l1 === 'entities') {
      ermsSubTab = 'entities';
      ermsEntityId = l2 || null;
    } else if (l1 === 'relationships') {
      ermsSubTab = 'relationships';
      ermsRelationshipId = l2 || null;
    } else if (l1 === 'erd') {
      ermsSubTab = 'erd';
    } else if (l1 && (l1.startsWith('rel-') || l1.startsWith('REL-'))) {
      ermsSubTab = 'relationships';
      ermsRelationshipId = l1;
    } else if (l1) {
      ermsSubTab = 'entities';
      ermsEntityId = l1;
    }
  }

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

  const handleSelectSidebarTab = (tab: ActivityTab) => navigate(`/dashboard/${tab}`);

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
              {activeTab === 'departments' ? (
                isRootOverview ? (
                  <DepartmentOverviewView onNavigate={navigate} />
                ) : (
                  <DepartmentManagementWorkspace
                    selectedDeptId={
                      activeItemId && activeItemId !== 'slots' && activeItemId !== 'pillars'
                        ? activeItemId
                        : undefined
                    }
                    onNavigateBack={() => navigate('/dashboard/departments/slots')}
                    onSelectDept={code => navigate(`/dashboard/departments/${code}`)}
                    isReadOnly={isReadOnly}
                  />
                )
              ) : activeTab === 'employees' ? (
                isRootOverview ? (
                  <EmployeeOverviewView onNavigate={navigate} />
                ) : (
                  <EmployeeManagerView
                    selectedEmpId={
                      activeItemId &&
                      activeItemId !== 'roster' &&
                      activeItemId !== 'directors' &&
                      activeItemId !== 'supervisors'
                        ? activeItemId
                        : undefined
                    }
                    onNavigateBack={() => navigate('/dashboard/employees/roster')}
                    onSelectEmployee={id => navigate(`/dashboard/employees/${id}`)}
                  />
                )
              ) : activeTab === 'tasks' ? (
                isRootOverview ? (
                  <TaskOverviewView onNavigate={navigate} />
                ) : (
                  <TaskManagerView
                    selectedTaskId={
                      activeItemId !== 'catalog' && activeItemId !== 'categories'
                        ? activeItemId
                        : null
                    }
                    onSelectTask={id => navigate(`/dashboard/tasks/${id}`)}
                    onNavigateBack={() => navigate('/dashboard/tasks/catalog')}
                  />
                )
              ) : activeTab === 'leaderboard' ? (
                isRootOverview ? (
                  <LeaderboardOverviewView onNavigate={navigate} />
                ) : (
                  <LeaderboardView />
                )
              ) : activeTab === 'REproperties' ? (
                isRootOverview ? (
                  <REPropertyOverviewView onNavigate={navigate} />
                ) : (
                  <REPropertyManagerView
                    selectedPropertyId={
                      activeItemId !== 'inventory' && activeItemId !== 'clusters'
                        ? activeItemId
                        : null
                    }
                    onSelectProperty={id => navigate(`/dashboard/REproperties/${id}`)}
                    onNavigateBack={() => navigate('/dashboard/REproperties/inventory')}
                  />
                )
              ) : activeTab === 'deals' ? (
                isRootOverview ? (
                  <DealOverviewView onNavigate={navigate} />
                ) : (
                  <DealManagerView
                    selectedDealId={
                      activeItemId !== 'pipeline' && activeItemId !== 'escrow' ? activeItemId : null
                    }
                    onSelectDeal={id => navigate(`/dashboard/deals/${id}`)}
                    onNavigateBack={() => navigate('/dashboard/deals/pipeline')}
                  />
                )
              ) : activeTab === 'documents' ? (
                isRootOverview ? (
                  <DocumentOverviewView onNavigate={navigate} />
                ) : (
                  <DocumentManagerView
                    selectedDocId={
                      activeItemId !== 'vault' && activeItemId !== 'compliance'
                        ? activeItemId
                        : null
                    }
                    onSelectDoc={id => navigate(`/dashboard/documents/${id}`)}
                    onNavigateBack={() => navigate('/dashboard/documents/vault')}
                  />
                )
              ) : activeTab === 'relationships' || activeTab === 'erms' ? (
                isErmsRootOverview ? (
                  <ErmsOverviewView onNavigate={navigate} />
                ) : (
                  <RelationshipManagerView
                    initialTab={ermsSubTab}
                    selectedEntityId={ermsEntityId}
                    selectedRelationshipId={ermsRelationshipId}
                    onSelectEntity={id => navigate(`/dashboard/erms/entities/${id}`)}
                    onSelectRelationship={id => navigate(`/dashboard/erms/relationships/${id}`)}
                    onNavigateToDeepRoute={route => navigate(route)}
                  />
                )
              ) : activeTab === 'customers' ? (
                isRootOverview ? (
                  <CustomerOverviewView onNavigate={navigate} />
                ) : (
                  <CustomerManagerView
                    selectedCustomerId={
                      activeItemId !== 'leads' && activeItemId !== 'investors' ? activeItemId : null
                    }
                    onSelectCustomer={id => navigate(`/dashboard/customers/${id}`)}
                    onNavigateBack={() => navigate('/dashboard/customers/leads')}
                  />
                )
              ) : (
                <div
                  style={{
                    flex: 1,
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span>🎯 {activeTab.toUpperCase()} Viewport Initialized</span>
                </div>
              )}
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
