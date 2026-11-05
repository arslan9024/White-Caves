import React, { FC, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ExecutiveTopNavbar } from '../../components/dashboard/ExecutiveTopNavbar';
import { ExecutiveVSCodeSidebar } from '../../components/dashboard/ExecutiveVSCodeSidebar';
import { ExecutiveAIVSCodeSidebar } from '../../components/dashboard/ExecutiveAIVSCodeSidebar';
import { DepartmentManagementWorkspace } from '../../components/crm/DepartmentManager';
import { EmployeeManagerView } from '../../components/crm/EmployeeManager';
import { TaskManagerView } from '../../components/crm/TaskManager';
import { LeaderboardView } from '../../components/crm/Leaderboard';
import { CorporateDepartmentsProvider } from '../../context/CorporateDepartmentsContext';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export const ModernDashboardPage: FC = () => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<ActivityTab>('departments');
  const [activeItem, setActiveItem] = useState<{ key: string; label: string }>({
    key: 'departments-crud',
    label: 'Corporate Departments Management',
  });
  const [activeAgent, setActiveAgent] = useState<{ id: string; name: string } | null>(null);

  const handleSelectSidebarTab = (tab: ActivityTab) => {
    setActiveTab(tab);
    if (tab === 'departments') {
      setActiveItem({
        key: 'departments-crud',
        label: 'Corporate Departments Management',
      });
    } else if (tab === 'employees') {
      setActiveItem({
        key: 'employees-directory',
        label: 'Employee Directory & Personnel Management',
      });
    } else if (tab === 'tasks') {
      setActiveItem({
        key: 'tasks-catalog',
        label: '200+ Core Statutory & Operational Tasks Catalog',
      });
    } else if (tab === 'leaderboard') {
      setActiveItem({
        key: 'leaderboard-progression',
        label: 'Corporate Merit Leaderboard & Tier Progression (L0–L5)',
      });
    }
  };

  const handleSelectSidebarItem = (key: string, label: string) => {
    setActiveItem({ key, label });
    if (key === 'departments-crud') {
      setActiveTab('departments');
    } else if (key.startsWith('emp-')) {
      setActiveTab('employees');
    } else if (key.startsWith('task-')) {
      setActiveTab('tasks');
    } else if (key.startsWith('lead-')) {
      setActiveTab('leaderboard');
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
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
      data-testid="modern-dashboard-page"
    >
      {/* ── 1. Top Executive Navbar ────────────────────────────────────────── */}
      <ExecutiveTopNavbar />

      {/* ── 2. Tri-Pane Workspace Layout Body ──────────────────────────────── */}
      <CorporateDepartmentsProvider>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* ── Left VS Code-Style Corporate Sidebar (Explorer) ──────────────── */}
          <ExecutiveVSCodeSidebar
            activeTab={activeTab}
            onSelectTab={handleSelectSidebarTab}
            onSelectItem={handleSelectSidebarItem}
          />

          {/* ── Center Working Canvas (Fills remaining space with 0 shift) ───── */}
          <main
            style={{
              flex: 1,
              backgroundColor: isDark ? '#0B1120' : '#FFFFFF',
              overflowY: 'auto',
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              transition: 'background-color 0.25s ease',
            }}
          >
            {/* Breadcrumb Target Header */}
            <div
              style={{
                paddingBottom: '12px',
                borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#EF4444',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                  }}
                >
                  Executive Workspace · Active Target
                </span>
                <h2
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: isDark ? '#FFFFFF' : '#0F172A',
                  }}
                >
                  {activeItem.label}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeAgent && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid #EF4444',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      color: isDark ? '#FFFFFF' : '#DC2626',
                      fontWeight: 700,
                    }}
                  >
                    🤖 Assigned: {activeAgent.name}
                  </span>
                )}
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    color: isDark ? '#94A3B8' : '#64748B',
                    border: isDark ? 'none' : '1px solid #E2E8F0',
                  }}
                >
                  target: {activeItem.key}
                </span>
              </div>
            </div>

            {/* ── Active Viewport Switcher ── */}
            {activeTab === 'departments' || activeItem.key === 'departments-crud' ? (
              <DepartmentManagementWorkspace />
            ) : activeTab === 'employees' ||
              activeItem.key === 'employees-directory' ||
              activeItem.key.startsWith('emp-') ? (
              <EmployeeManagerView />
            ) : activeTab === 'tasks' ||
              activeItem.key === 'tasks-catalog' ||
              activeItem.key.startsWith('task-') ? (
              <TaskManagerView />
            ) : activeTab === 'leaderboard' ||
              activeItem.key === 'leaderboard-progression' ||
              activeItem.key.startsWith('lead-') ? (
              <LeaderboardView />
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
                  transition: 'all 0.25s ease',
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
                    {activeItem.label} Target Loaded
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      marginTop: '4px',
                      color: isDark ? '#94A3B8' : '#64748B',
                    }}
                  >
                    Click the Activity Bar icons on the left sidebar to access Departments,
                    Employees, or 200+ Core Tasks.
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
