import React, { FC } from 'react';
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Users,
  CheckSquare,
  Trophy,
  Home,
  Handshake,
  Network,
  Contact,
  UserCircle,
  Settings,
  Search,
  Building,
  Plus,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useExecutiveVSCodeSidebarLogic, ActivityTab } from './ExecutiveVSCodeSidebar.logic';
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
  ActivityBar,
  ActivityGroup,
  ActivityIconBtn,
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
}

export const ExecutiveVSCodeSidebar: FC<ExecutiveVSCodeSidebarProps> = ({
  activeTab: controlledTab,
  onSelectTab,
  onSelectItem,
  onOpenDeptManager,
}) => {
  const {
    activeTab,
    isCollapsed,
    width,
    filterQuery,
    setFilterQuery,
    expandedFolders,
    activeItemKey,
    setActiveItemKey,
    toggleFolder,
    toggleCollapse,
    handleSelectTab,
    handleMouseDown,
    departments,
  } = useExecutiveVSCodeSidebarLogic({
    activeTab: controlledTab,
    onSelectTab,
  });

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
      <ActivityBar>
        <ActivityGroup>
          <ActivityIconBtn
            $isActive={activeTab === 'departments'}
            onClick={() => handleSelectTab('departments')}
            title="Corporate Departments Hub (12 Slots / 7 Pillars)"
            data-testid="activity-btn-departments"
          >
            <Building2 size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'employees'}
            onClick={() => handleSelectTab('employees')}
            title="Employees Directory & Personnel Management"
            data-testid="activity-btn-employees"
          >
            <Users size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'tasks'}
            onClick={() => handleSelectTab('tasks')}
            title="200+ Core Operational & Statutory Tasks Catalog"
            data-testid="activity-btn-tasks"
          >
            <CheckSquare size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'REproperties'}
            onClick={() => handleSelectTab('REproperties')}
            title="Real Estate Inventory & Portfolio (REproperties)"
            data-testid="activity-btn-reproperties"
          >
            <Home size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'deals'}
            onClick={() => handleSelectTab('deals')}
            title="Deals & Revenue Pipeline (deals)"
            data-testid="activity-btn-deals"
          >
            <Handshake size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'customers'}
            onClick={() => handleSelectTab('customers')}
            title="Customers & CRM Nervous Hub (customers)"
            data-testid="activity-btn-customers"
          >
            <Contact size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'documents'}
            onClick={() => handleSelectTab('documents')}
            title="Sovereign Document Vault (documents)"
            data-testid="activity-btn-documents"
          >
            <FileText size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'leaderboard'}
            onClick={() => handleSelectTab('leaderboard')}
            title="Corporate Merit Leaderboard & Tier Progression (L0–L5)"
            data-testid="activity-btn-leaderboard"
          >
            <Trophy size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'relationships' || activeTab === 'erms'}
            onClick={() => handleSelectTab('relationships')}
            title="ERMS: Entities & Relational Matrix Hub"
            data-testid="activity-btn-relationships"
          >
            <Network size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'roles'}
            onClick={() => handleSelectTab('roles')}
            title="User Role Management System & RBAC (roles)"
            data-testid="activity-btn-roles"
          >
            <ShieldAlert size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'audit'}
            onClick={() => handleSelectTab('audit')}
            title="RERA Compliance & Master Audit"
          >
            <ShieldCheck size={18} />
          </ActivityIconBtn>
        </ActivityGroup>

        <ActivityGroup>
          <ActivityIconBtn
            $isActive={activeTab === 'profile'}
            onClick={() => handleSelectTab('profile')}
            title="Sovereign Executive Profile & Preferences"
            data-testid="activity-btn-profile"
          >
            <UserCircle size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'settings'}
            onClick={() => handleSelectTab('settings')}
            title="Sovereign Settings"
          >
            <Settings size={18} />
          </ActivityIconBtn>
        </ActivityGroup>
      </ActivityBar>

      {/* ── 2. Collapsible Explorer Drawer ─────────────────────────── */}
      <ExplorerDrawer $isCollapsed={isCollapsed}>
        <ExplorerHeader>
          <div className="title-wrap">
            {headerInfo.icon}
            <span>{headerInfo.label}</span>
          </div>
          <div className="header-actions">
            {onOpenDeptManager && (
              <button onClick={onOpenDeptManager} title="Action Panel">
                <Plus size={14} />
              </button>
            )}
            <button onClick={toggleCollapse} title="Collapse Sidebar">
              {isCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
            </button>
          </div>
        </ExplorerHeader>

        {/* Search / Filter Box */}
        <FilterBarWrapper>
          <div className="search-box">
            <Search size={14} />
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
