/**
 * DashboardSidebar.tsx
 *
 * Master Dashboard Sidebar container aggregating Tile 1 (MD Suite),
 * Tile 2 (12 Corporate Departments), and Tile 3 (26 AI Command Center).
 */

import React, { FC } from 'react';
import {
  UnifiedSidebar,
  SidebarHeader,
} from '../../../pages/crm/CRMHubPage.styles';
import type {
  BuildingTier,
  AIAssistantOption,
} from '../../../pages/crm/CRMHubPage.logic';
import type { SearchableOption } from '../common/SearchableSelect';
import DashboardMDTile from './DashboardMDTile';
import DashboardDeptTile from './DashboardDeptTile';
import DashboardAiTile from './DashboardAiTile';

export interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  openTopTile: 'md_office' | 'corporate' | 'ai_command' | null;
  activeTab: string;
  selectedDept: BuildingTier;
  selectedDeptId: string;
  selectedAi: AIAssistantOption;
  selectedAiId: string;
  openSubGroups: Record<string, boolean>;
  onMdTileClick: () => void;
  onCorporateTileClick: () => void;
  onAiTileClick: () => void;
  onSelectDepartment: (option: SearchableOption) => void;
  onSelectAiAssistant: (option: SearchableOption) => void;
  onSubItemClick: (itemId: string) => void;
  onToggleSubGroup: (subGroupName: string) => void;
}

export const DashboardSidebar: FC<DashboardSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  openTopTile,
  activeTab,
  selectedDept,
  selectedDeptId,
  selectedAi,
  selectedAiId,
  openSubGroups,
  onMdTileClick,
  onCorporateTileClick,
  onAiTileClick,
  onSelectDepartment,
  onSelectAiAssistant,
  onSubItemClick,
  onToggleSubGroup,
}) => {
  return (
    <UnifiedSidebar $collapsed={isCollapsed} data-testid="dashboard-sidebar">
      {/* Sidebar Header & Brand */}
      <SidebarHeader>
        {!isCollapsed ? (
          <div className="brand">
            <span>🏛️</span>
            <span>Corporate Deck</span>
          </div>
        ) : (
          <div style={{ fontSize: '1.1rem', margin: '0 auto' }}>🏛️</div>
        )}

        <button
          type="button"
          className="collapse-toggle"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </SidebarHeader>

      {/* TILE 1: MD SUITE */}
      <DashboardMDTile
        isOpen={openTopTile === 'md_office'}
        isCollapsed={isCollapsed}
        activeTab={activeTab}
        onTileClick={onMdTileClick}
        onSubItemClick={onSubItemClick}
      />

      {/* TILE 2: 12 CORPORATE DEPARTMENTS */}
      <DashboardDeptTile
        isOpen={openTopTile === 'corporate'}
        isCollapsed={isCollapsed}
        activeTab={activeTab}
        selectedDept={selectedDept}
        selectedDeptId={selectedDeptId}
        openSubGroups={openSubGroups}
        onTileClick={onCorporateTileClick}
        onSelectDepartment={onSelectDepartment}
        onSubItemClick={onSubItemClick}
        onToggleSubGroup={onToggleSubGroup}
      />

      {/* TILE 3: 26 AI COMMAND CENTER */}
      <DashboardAiTile
        isOpen={openTopTile === 'ai_command'}
        isCollapsed={isCollapsed}
        selectedAi={selectedAi}
        selectedAiId={selectedAiId}
        activeTab={activeTab}
        onTileClick={onAiTileClick}
        onSelectAiAssistant={onSelectAiAssistant}
        onSubItemClick={onSubItemClick}
      />
    </UnifiedSidebar>
  );
};

export default DashboardSidebar;
