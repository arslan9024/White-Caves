import React, { FC } from 'react';
import {
  Files,
  Cpu,
  FileText,
  ShieldCheck,
  Building2,
  Users,
  CheckSquare,
  Trophy,
  Settings,
  ChevronRight,
  Search,
  Crown,
  Building,
  Plus,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Zap,
  Folder,
} from 'lucide-react';
import { useExecutiveVSCodeSidebarLogic, ActivityTab } from './ExecutiveVSCodeSidebar.logic';
import { SidebarDepartmentsList } from './SidebarDepartmentsList';
import { SidebarEmployeesList } from './SidebarEmployeesList';
import { SidebarTasksList } from './SidebarTasksList';
import { SidebarLeaderboardList } from './SidebarLeaderboardList';
import {
  SidebarLayoutContainer,
  ActivityBar,
  ActivityGroup,
  ActivityIconBtn,
  ExplorerDrawer,
  ExplorerHeader,
  FilterBarWrapper,
  TreeScrollArea,
  FolderNode,
  FolderHeaderBtn,
  FolderChildrenList,
  TreeLeafItem,
  ResizeHandle,
} from './ExecutiveVSCodeSidebar.styles';

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
            $isActive={activeTab === 'explorer'}
            onClick={() => handleSelectTab('explorer')}
            title="Explorer (1-12-108 Hierarchy & Modules)"
            data-testid="activity-btn-explorer"
          >
            <Files size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'ai-mesh'}
            onClick={() => handleSelectTab('ai-mesh')}
            title="AI Mesh Command (Zoe + 120 Agents)"
          >
            <Cpu size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'documents'}
            onClick={() => handleSelectTab('documents')}
            title="Document Centre & Henry OCR Studio"
          >
            <FileText size={18} />
          </ActivityIconBtn>

          <ActivityIconBtn
            $isActive={activeTab === 'audit'}
            onClick={() => handleSelectTab('audit')}
            title="RERA Compliance & Master Audit"
          >
            <ShieldCheck size={18} />
          </ActivityIconBtn>

          {/* 5th Icon: Corporate Departments Management */}
          <ActivityIconBtn
            $isActive={activeTab === 'departments'}
            onClick={() => handleSelectTab('departments')}
            title="Corporate Departments Hub (12 Slots / 7 Pillars)"
            data-testid="activity-btn-departments"
          >
            <Building2 size={18} />
          </ActivityIconBtn>

          {/* 6th Icon: Employees Management Hub */}
          <ActivityIconBtn
            $isActive={activeTab === 'employees'}
            onClick={() => handleSelectTab('employees')}
            title="Employees Directory & Personnel Management"
            data-testid="activity-btn-employees"
          >
            <Users size={18} />
          </ActivityIconBtn>

          {/* 7th Icon: Tasks Management Hub */}
          <ActivityIconBtn
            $isActive={activeTab === 'tasks'}
            onClick={() => handleSelectTab('tasks')}
            title="200+ Core Operational & Statutory Tasks Catalog"
            data-testid="activity-btn-tasks"
          >
            <CheckSquare size={18} />
          </ActivityIconBtn>

          {/* 8th Icon: Gamified Leaderboard & Tier Progression */}
          <ActivityIconBtn
            $isActive={activeTab === 'leaderboard'}
            onClick={() => handleSelectTab('leaderboard')}
            title="Corporate Merit Leaderboard & Tier Progression (L0–L5)"
            data-testid="activity-btn-leaderboard"
          >
            <Trophy size={18} />
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
        {/* Drawer Header */}
        <ExplorerHeader>
          <div className="title-wrap">
            {activeTab === 'departments' && (
              <>
                <Building2 size={14} color="#EF4444" />
                <span>Departments Hub (12 Slots)</span>
              </>
            )}
            {activeTab === 'employees' && (
              <>
                <Users size={14} color="#3B82F6" />
                <span>Employees Hub (Roster)</span>
              </>
            )}
            {activeTab === 'tasks' && (
              <>
                <CheckSquare size={14} color="#10B981" />
                <span>200+ Tasks Catalog</span>
              </>
            )}
            {activeTab === 'leaderboard' && (
              <>
                <Trophy size={14} color="#F59E0B" />
                <span>Merit Leaderboard & Tiers</span>
              </>
            )}
            {!['departments', 'employees', 'tasks', 'leaderboard'].includes(activeTab) && (
              <>
                <Building size={14} color="#EF4444" />
                <span>White Caves Explorer</span>
              </>
            )}
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
              placeholder={
                activeTab === 'departments'
                  ? 'Filter 12 slots & depts...'
                  : activeTab === 'employees'
                    ? 'Filter employees & roles...'
                    : activeTab === 'tasks'
                      ? 'Filter 200 tasks & SLAs...'
                      : activeTab === 'leaderboard'
                        ? 'Filter leaderboard & tiers...'
                        : 'Filter modules & squads...'
              }
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
        ) : (
          <TreeScrollArea>
            {/* MD Sovereign Founder Section */}
            <FolderNode>
              <FolderHeaderBtn
                $isExpanded={expandedFolders['md-hub']}
                $isSpecial={true}
                onClick={() => toggleFolder('md-hub')}
              >
                <span className="caret">
                  <ChevronRight size={13} />
                </span>
                <Crown size={14} color="#EF4444" />
                <span className="label">Managing Director Hub</span>
                <span className="badge">L5</span>
              </FolderHeaderBtn>

              {expandedFolders['md-hub'] && (
                <FolderChildrenList>
                  <TreeLeafItem
                    $isActive={activeItemKey === 'morning-briefing'}
                    onClick={() =>
                      handleLeafClick('morning-briefing', 'Morning Executive Briefing')
                    }
                  >
                    <Sparkles size={12} color="#EF4444" />
                    <span>Morning Briefing</span>
                    <span className="sla-pill">08:00</span>
                  </TreeLeafItem>
                  <TreeLeafItem
                    $isActive={activeItemKey === 'escrow-oversight'}
                    onClick={() =>
                      handleLeafClick('escrow-oversight', 'DLD Escrow Accounts Oversight')
                    }
                  >
                    <Zap size={12} color="#10B981" />
                    <span>Escrow Oversight</span>
                    <span className="sla-pill">AED 42M</span>
                  </TreeLeafItem>
                  <TreeLeafItem
                    $isActive={activeItemKey === 'departments-crud'}
                    onClick={() =>
                      handleLeafClick('departments-crud', 'Corporate Departments Management')
                    }
                  >
                    <Building2 size={12} color="#3B82F6" />
                    <span>Departments CRUD</span>
                    <span className="sla-pill">12 Depts</span>
                  </TreeLeafItem>
                </FolderChildrenList>
              )}
            </FolderNode>

            {/* 12 Corporate Departments Tree */}
            {departments.map((dept, idx) => {
              const folderKey = `dept-${dept.id}`;
              const isExpanded = expandedFolders[folderKey];

              return (
                <FolderNode key={dept.id}>
                  <FolderHeaderBtn $isExpanded={isExpanded} onClick={() => toggleFolder(folderKey)}>
                    <span className="caret">
                      <ChevronRight size={13} />
                    </span>
                    <span className="label">
                      {(dept as any).order || idx + 1}. {dept.name}
                    </span>
                    <span className="badge">{dept.supervisors.length}</span>
                  </FolderHeaderBtn>

                  {isExpanded && (
                    <FolderChildrenList>
                      {dept.supervisors.map(sup => (
                        <TreeLeafItem
                          key={sup.id}
                          $isActive={activeItemKey === sup.id}
                          onClick={() => handleLeafClick(sup.id, `${dept.name} · ${sup.name}`)}
                        >
                          <span>🤖</span>
                          <span>{sup.name}</span>
                          <span className="sla-pill">L3</span>
                        </TreeLeafItem>
                      ))}
                    </FolderChildrenList>
                  )}
                </FolderNode>
              );
            })}
          </TreeScrollArea>
        )}
      </ExplorerDrawer>

      {/* ── 3. Draggable Resizing Splitter on the Right Edge ───────── */}
      {!isCollapsed && <ResizeHandle onMouseDown={handleMouseDown} />}
    </SidebarLayoutContainer>
  );
};

export default ExecutiveVSCodeSidebar;
