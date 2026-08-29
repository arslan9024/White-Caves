/**
 * Sidebar108.tsx — Pure Presentational View (1-12-108 Command Panel)
 */

import React, { FC } from 'react';
import {
  SidebarContainer,
  SidebarHeader,
  SidebarScrollableArea,
  FounderHubPodium,
  NavItemButton,
  SidebarFooter,
} from './styles/Sidebar108.style';
import { useSidebar108Logic } from './logic/Sidebar108.logic';
import { SIDEBAR_STATIC_DATA, FOUNDER_QUICK_ACTIONS } from './data/Sidebar108.data';
import {
  Crown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  UserCheck,
  FileText,
  TrendingUp,
  Network,
} from 'lucide-react';

const ACTION_ICONS: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-4 h-4 text-red-500" />,
  FileText: <FileText className="w-4 h-4 text-red-500" />,
  TrendingUp: <TrendingUp className="w-4 h-4 text-red-500" />,
  Network: <Network className="w-4 h-4 text-red-500" />,
};

export const Sidebar108: FC = () => {
  const {
    user,
    isFounder,
    isDark,
    isCollapsed,
    toggleCollapse,
    departments,
    expandedDeptId,
    toggleDepartment,
    currentPath,
    handleNavigate,
    handleLogout,
  } = useSidebar108Logic();

  return (
    <SidebarContainer
      $isCollapsed={isCollapsed}
      $isDark={isDark}
      data-testid="sidebar-108-command-panel"
      role="navigation"
      aria-label="1-12-108 Corporate Hierarchy Navigation"
    >
      {/* ── Header Collapse Action ────────────────────────────────────────── */}
      <SidebarHeader $isDark={isDark}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider text-red-500 uppercase">
              {SIDEBAR_STATIC_DATA.brandName}
            </span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </SidebarHeader>

      <SidebarScrollableArea>
        {/* ── Founder Sovereign Bypass [Managing Director Hub] ─────────────── */}
        {isFounder && !isCollapsed && (
          <FounderHubPodium $isDark={isDark}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-red-500 tracking-wide">
                <Crown className="w-4 h-4 text-red-500 animate-pulse" />
                <span>{SIDEBAR_STATIC_DATA.masterHubLabel}</span>
              </div>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-500 text-white">
                {SIDEBAR_STATIC_DATA.masterHubBadge}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {FOUNDER_QUICK_ACTIONS.map(act => (
                <button
                  key={act.id}
                  onClick={() => handleNavigate(act.path)}
                  className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-semibold transition-all ${
                    currentPath === act.path
                      ? 'bg-red-500 text-white'
                      : isDark
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-red-500/20'
                      : 'bg-white text-slate-700 hover:bg-red-50 shadow-sm'
                  }`}
                >
                  {ACTION_ICONS[act.icon]}
                  <span className="truncate">{act.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </FounderHubPodium>
        )}

        {/* ── Main Dashboard Item ─────────────────────────────────────────── */}
        <NavItemButton
          $isActive={currentPath === '/crm' || currentPath === '/crm/dashboard'}
          $isDark={isDark}
          onClick={() => handleNavigate('/crm/dashboard')}
          title="Personal Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 text-red-500" />
          {!isCollapsed && <span>{SIDEBAR_STATIC_DATA.dashboardLabel}</span>}
        </NavItemButton>

        {/* ── 12 Corporate Departments Listing ────────────────────────────── */}
        {!isCollapsed && (
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {SIDEBAR_STATIC_DATA.departmentsSectionTitle}
          </div>
        )}

        {departments.map(dept => {
          const isExpanded = expandedDeptId === dept.departmentId;
          const deptPath = `/crm/department/${dept.departmentId}`;
          const isDeptActive = currentPath.includes(dept.departmentId);

          return (
            <div key={dept.departmentId} className="mb-1">
              <NavItemButton
                $isActive={isDeptActive}
                $isDark={isDark}
                onClick={() => {
                  if (isCollapsed) {
                    handleNavigate(deptPath);
                  } else {
                    toggleDepartment(dept.departmentId);
                  }
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dept.accentColor || '#EF4444' }}
                />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{dept.title}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-red-500' : 'text-slate-400'
                      }`}
                    />
                  </div>
                )}
              </NavItemButton>

              {/* Nested Supervisors list */}
              {!isCollapsed && isExpanded && dept.supervisors && (
                <div className="pl-6 pr-2 py-1 space-y-1">
                  {dept.supervisors.map(sup => (
                    <button
                      key={sup.id}
                      onClick={() => handleNavigate(`/crm/supervisor/${sup.id}`)}
                      className="w-full text-left text-xs px-2.5 py-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-500 flex items-center justify-between group transition-colors"
                    >
                      <span className="truncate">{sup.name}</span>
                      <span className="text-[10px] text-slate-500 group-hover:text-red-400">
                        {sup.slaResponseTime || '15m'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </SidebarScrollableArea>

      {/* ── Footer / User Signout ────────────────────────────────────────── */}
      <SidebarFooter $isDark={isDark}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Arsalan Malik'}</div>
                <div className="text-[10px] text-red-400 font-semibold">{user?.role || 'Managing Director'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title={SIDEBAR_STATIC_DATA.signOutLabel}
              className="p-1.5 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title={SIDEBAR_STATIC_DATA.signOutLabel}
            className="w-full flex justify-center p-2 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-500"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar108;
