import React, { FC } from 'react';
import {
  FileText,
  ShieldCheck,
  Building2,
  Users,
  CheckSquare,
  Trophy,
  Home,
  Handshake,
  Network,
  Contact,
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

const TAB_HEADER_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  departments: {
    icon: <Building2 size={14} color="#EF4444" />,
    label: 'Departments Hub (12 Slots)',
  },
  employees: { icon: <Users size={14} color="#3B82F6" />, label: 'Employees Hub (Roster)' },
  tasks: { icon: <CheckSquare size={14} color="#10B981" />, label: '200+ Tasks Catalog' },
  leaderboard: { icon: <Trophy size={14} color="#F59E0B" />, label: 'Merit Leaderboard & Tiers' },
  REproperties: { icon: <Home size={14} color="#8B5CF6" />, label: 'RE Properties Inventory' },
  deals: { icon: <Handshake size={14} color="#C084FC" />, label: 'Deals & Pipeline' },
  documents: { icon: <FileText size={14} color="#38BDF8" />, label: 'Document Vault' },
  relationships: {
    icon: <Network size={14} color="#10B981" />,
    label: 'ERMS (Entities & Relationships)',
  },
  erms: { icon: <Network size={14} color="#10B981" />, label: 'ERMS (Entities & Relationships)' },
  customers: { icon: <Contact size={14} color="#34D399" />, label: 'Customers Hub (CRM)' },
};

const SEARCH_PLACEHOLDER_MAP: Record<string, string> = {
  departments: 'Filter 12 slots & depts...',
  employees: 'Filter employees & roles...',
  tasks: 'Filter 200 tasks & SLAs...',
  leaderboard: 'Filter leaderboard & tiers...',
  REproperties: 'Filter properties & units...',
  deals: 'Filter deals & pipelines...',
  documents: 'Filter vault documents...',
  relationships: 'Filter entities & relational matrix...',
  erms: 'Filter entities & relational matrix...',
  customers: 'Filter clients & leads...',
};

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
            $isActive={activeTab === 'audit'}
            onClick={() => handleSelectTab('audit')}
            title="RERA Compliance & Master Audit"
          >
            <ShieldCheck size={18} />
          </ActivityIconBtn>
        </ActivityGroup>

        <ActivityGroup>
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
          <SidebarDepartmentsList filterQuery={filterQuery} onOpenCreate={onOpenDeptManager} />
        ) : activeTab === 'employees' ? (
          <SidebarEmployeesList
            filterQuery={filterQuery}
            onSelectEmployee={(id, name) => handleLeafClick(`emp-${id}`, `Employee: ${name}`)}
          />
        ) : activeTab === 'tasks' ? (
          <SidebarTasksList
            filterQuery={filterQuery}
            onSelectTask={(id, title) => handleLeafClick(`task-${id}`, `Task: ${title}`)}
          />
        ) : activeTab === 'leaderboard' ? (
          <SidebarLeaderboardList
            filterQuery={filterQuery}
            onSelectMember={(id, name) => handleLeafClick(`lead-${id}`, `Leaderboard: ${name}`)}
          />
        ) : activeTab === 'REproperties' ? (
          <SidebarREPropertiesList
            filterQuery={filterQuery}
            onSelectProperty={(id, title) => handleLeafClick(`prop-${id}`, `Property: ${title}`)}
          />
        ) : activeTab === 'deals' ? (
          <SidebarDealsList
            filterQuery={filterQuery}
            onSelectDeal={(id, title) => handleLeafClick(`deal-${id}`, `Deal: ${title}`)}
          />
        ) : activeTab === 'customers' ? (
          <SidebarCustomersList
            filterQuery={filterQuery}
            onSelectCustomer={(id, name) => handleLeafClick(`cust-${id}`, `Customer: ${name}`)}
          />
        ) : activeTab === 'documents' ? (
          <SidebarDocumentsList
            filterQuery={filterQuery}
            onSelectDoc={(id, title) => handleLeafClick(`doc-${id}`, `Doc: ${title}`)}
          />
        ) : activeTab === 'relationships' || activeTab === 'erms' ? (
          <SidebarRelationshipsList
            filterQuery={filterQuery}
            onSelectChain={(id, name) => handleLeafClick(`rel-${id}`, `Chain: ${name}`)}
            onSelectEntity={(id, name) => handleLeafClick(`entity-${id}`, `Entity: ${name}`)}
            onNavigateToView={route => handleLeafClick(`route-${route}`, route)}
          />
        ) : (
          <SidebarDepartmentsList filterQuery={filterQuery} onOpenCreate={onOpenDeptManager} />
        )}
      </ExplorerDrawer>

      {/* ── 3. Draggable Resizing Splitter on the Right Edge ───────── */}
      {!isCollapsed && <ResizeHandle onMouseDown={handleMouseDown} />}
    </SidebarLayoutContainer>
  );
};

export default ExecutiveVSCodeSidebar;
