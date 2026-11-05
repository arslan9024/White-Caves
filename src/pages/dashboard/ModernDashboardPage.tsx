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
import { CorporateDepartmentsProvider } from '../../context/CorporateDepartmentsContext';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export const ModernDashboardPage: FC = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse deep URL e.g. /dashboard/tasks/T001 or /dashboard/departments/D01
  const pathParts = location.pathname
    .replace(/^\/dashboard\/?/, '')
    .split('/')
    .filter(Boolean);
  const rawTab = pathParts[0] as ActivityTab | undefined;
  const activeItemId = pathParts[1] || null;

  const validTabs: ActivityTab[] = [
    'departments',
    'employees',
    'tasks',
    'leaderboard',
    'REproperties',
    'deals',
    'documents',
    'relationships',
    'customers',
    'explorer',
    'ai-mesh',
    'audit',
    'settings',
  ];

  const activeTab: ActivityTab = validTabs.includes(rawTab as ActivityTab)
    ? (rawTab as ActivityTab)
    : 'departments';

  // Auto-redirect /dashboard to /dashboard/departments
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      navigate('/dashboard/departments', { replace: true });
    }
  }, [location.pathname, navigate]);

  const [activeAgent, setActiveAgent] = useState<{ id: string; name: string } | null>(null);

  const handleSelectSidebarTab = (tab: ActivityTab) => {
    navigate(`/dashboard/${tab}`);
  };

  const handleSelectSidebarItem = (key: string, label: string) => {
    if (key === 'departments-crud') {
      navigate('/dashboard/departments');
    } else if (key.startsWith('emp-')) {
      const empId = key.replace('emp-', '');
      navigate(`/dashboard/employees/${empId}`);
    } else if (key.startsWith('task-')) {
      const taskId = key.replace('task-', '');
      navigate(`/dashboard/tasks/${taskId}`);
    } else if (key.startsWith('lead-')) {
      const leadId = key.replace('lead-', '');
      navigate(`/dashboard/leaderboard/${leadId}`);
    } else if (key.startsWith('prop-')) {
      const propId = key.replace('prop-', '');
      navigate(`/dashboard/REproperties/${propId}`);
    } else if (key.startsWith('deal-')) {
      const dealId = key.replace('deal-', '');
      navigate(`/dashboard/deals/${dealId}`);
    } else if (key.startsWith('doc-')) {
      const docId = key.replace('doc-', '');
      navigate(`/dashboard/documents/${docId}`);
    } else if (key.startsWith('rel-')) {
      const relId = key.replace('rel-', '');
      navigate(`/dashboard/relationships/${relId}`);
    } else if (key.startsWith('cust-')) {
      const custId = key.replace('cust-', '');
      navigate(`/dashboard/customers/${custId}`);
    } else {
      navigate(`/dashboard/${activeTab}`);
    }
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
        {/* ── Top Executive Navbar ────────────────────────────────────────── */}
        <ExecutiveTopNavbar sticky={true} />

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
              <DepartmentManagementWorkspace selectedDeptId={activeItemId || undefined} />
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
            ) : activeTab === 'relationships' ? (
              <RelationshipManagerView
                selectedEntityId={activeItemId}
                onSelectEntity={id => navigate(`/dashboard/relationships/${id}`)}
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
          />
        </div>
      </CorporateDepartmentsProvider>
    </div>
  );
};

export default ModernDashboardPage;
