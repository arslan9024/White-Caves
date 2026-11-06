// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.tsx
/**
 * White Caves Real Estate LLC - Executive VSCode Sidebar Master Hub
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC } from 'react';
import { Search, Building, Plus, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useExecutiveVSCodeSidebarLogic, ActivityTab } from './ExecutiveVSCodeSidebar.logic';
import { UserRoleContext } from '../../../context/UserRoleContext';
import { SidebarActivityBar } from './SidebarActivityBar';
import { SidebarDepartmentsList } from './SidebarDepartmentsList';
import { SidebarEmployeesList } from './SidebarEmployeesList';
import { SidebarTasksList } from './SidebarTasksList';
import { SidebarLeaderboardList } from './SidebarLeaderboardList';
import { SidebarREPropertiesList } from './SidebarREPropertiesList';
import { SidebarDealsList } from './SidebarDealsList';
import { SidebarDocumentsList } from './SidebarDocumentsList';
import { SidebarRelationshipsList } from './SidebarRelationshipsList';
import { SidebarCustomersList } from './SidebarCustomersList';
import { SidebarRolesList } from './SidebarRolesList';
import {
  SidebarLayoutContainer,
  ExplorerDrawer,
  ExplorerHeader,
  FilterBarWrapper,
  ResizeHandle,
} from './ExecutiveVSCodeSidebar.styles';
import { TAB_HEADER_MAP, SEARCH_PLACEHOLDER_MAP } from './ExecutiveVSCodeSidebar.data';

export interface ExecutiveVSCodeSidebarProps {
  activeTab?: ActivityTab;
  onSelectTab?: (tab: ActivityTab) => void;
  onSelectItem?: (key: string, label: string) => void;
  onOpenDeptManager?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ExecutiveVSCodeSidebar: FC<ExecutiveVSCodeSidebarProps> = ({
  activeTab: controlledTab,
  onSelectTab,
  onSelectItem,
  onOpenDeptManager,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}) => {
  const {
    activeTab,
    isCollapsed,
    width,
    filterQuery,
    setFilterQuery,
    setActiveItemKey,
    toggleCollapse,
    handleSelectTab,
    handleMouseDown,
  } = useExecutiveVSCodeSidebarLogic({
    activeTab: controlledTab,
    onSelectTab,
    isCollapsed: controlledCollapsed,
    onToggleCollapse,
  });

  const roleContext = React.useContext(UserRoleContext);
  const role = roleContext?.role || 'managing_director';
  const isDirectorate = Boolean(
    !roleContext ||
      roleContext?.isFounder ||
      roleContext?.isManagingDirector ||
      (roleContext?.accessLevel && roleContext.accessLevel >= 3)
  );

  const handleLeafClick = (key: string, label: string) => {
    setActiveItemKey(key);
    if (onSelectItem) onSelectItem(key, label);
  };

  const headerInfo = TAB_HEADER_MAP[activeTab] || {
    icon: <Building size={14} color="#EF4444" />,
    label: 'Departments Hub (12 Slots)',
  };

  return (
    <SidebarLayoutContainer
      $isCollapsed={isCollapsed}
      $width={width}
      data-testid="executive-vscode-sidebar"
    >
      {/* ── 1. Vertical Activity Bar (48px) ────────────────────────── */}
      <SidebarActivityBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        role={role}
        isDirectorate={isDirectorate}
      />

      {/* ── 2. Collapsible Explorer Drawer ─────────────────────────── */}
      <ExplorerDrawer $isCollapsed={isCollapsed}>
        <ExplorerHeader>
          <div className="title-wrap">
            {headerInfo.icon}
            <span>{headerInfo.label}</span>
          </div>
          <div className="actions-wrap">
            {activeTab === 'departments' && (
              <button
                className="icon-action-btn"
                title="Create Department Blueprint"
                onClick={onOpenDeptManager}
                data-testid="sidebar-action-new-dept"
              >
                <Plus size={14} />
              </button>
            )}
            <button
              className="icon-action-btn"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              onClick={toggleCollapse}
              data-testid="sidebar-collapse-toggle-btn"
            >
              {isCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
            </button>
          </div>
        </ExplorerHeader>

        {/* ── Filter Bar ───────────────────── */}
        <FilterBarWrapper>
          <div className="input-wrap">
            <Search size={12} className="search-icon" />
            <input
              type="text"
              placeholder={SEARCH_PLACEHOLDER_MAP[activeTab] || 'Filter modules & squads...'}
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
            />
          </div>
        </FilterBarWrapper>

        {/* ── View Selection in Drawer ─────── */}
        {activeTab === 'departments' ? (
          <SidebarDepartmentsList
            filterQuery={filterQuery}
            onOpenCreate={onOpenDeptManager}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'employees' ? (
          <SidebarEmployeesList
            filterQuery={filterQuery}
            onSelectEmployee={(id, name) => handleLeafClick(`emp-${id}`, `Employee: ${name}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'tasks' ? (
          <SidebarTasksList
            filterQuery={filterQuery}
            onSelectTask={(id, title) => handleLeafClick(`task-${id}`, `Task: ${title}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'leaderboard' ? (
          <SidebarLeaderboardList
            filterQuery={filterQuery}
            onSelectMember={(id, name) => handleLeafClick(`lead-${id}`, `Leaderboard: ${name}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'REproperties' ? (
          <SidebarREPropertiesList
            filterQuery={filterQuery}
            onSelectProperty={(id, title) => handleLeafClick(`prop-${id}`, `Property: ${title}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'deals' ? (
          <SidebarDealsList
            filterQuery={filterQuery}
            onSelectDeal={(id, title) => handleLeafClick(`deal-${id}`, `Deal: ${title}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'customers' ? (
          <SidebarCustomersList
            filterQuery={filterQuery}
            onSelectCustomer={(id, name) => handleLeafClick(`cust-${id}`, `Customer: ${name}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'documents' ? (
          <SidebarDocumentsList
            filterQuery={filterQuery}
            onSelectDoc={(id, title) => handleLeafClick(`doc-${id}`, `Doc: ${title}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'relationships' || activeTab === 'erms' ? (
          <SidebarRelationshipsList
            filterQuery={filterQuery}
            onSelectChain={(id, name) => handleLeafClick(`rel-${id}`, `Chain: ${name}`)}
            onSelectEntity={(id, name) => handleLeafClick(`entity-${id}`, `Entity: ${name}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : activeTab === 'roles' ? (
          <SidebarRolesList
            filterQuery={filterQuery}
            onSelectRole={(id, name) => handleLeafClick(`role-${id}`, `Role: ${name}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : (
          <SidebarDepartmentsList
            filterQuery={filterQuery}
            onOpenCreate={onOpenDeptManager}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        )}
      </ExplorerDrawer>

      {/* ── 3. Draggable Resizing Splitter on the Right Edge ───────── */}
      {!isCollapsed && <ResizeHandle onMouseDown={handleMouseDown} />}
    </SidebarLayoutContainer>
  );
};

export default ExecutiveVSCodeSidebar;
