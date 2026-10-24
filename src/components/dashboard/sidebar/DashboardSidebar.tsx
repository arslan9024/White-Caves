/**
 * DashboardSidebar.tsx — Tile 1 MD Suite, Tile 2 Corporate, Tile 3 AI Command.
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
  isManagingDirector?: boolean;
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
  isManagingDirector = false,
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
      <SidebarHeader>
        {!isCollapsed ? (
          <div className="brand">
            <span>🏛️</span>
            <span>{isManagingDirector ? 'MD Command Deck' : 'Corporate Deck'}</span>
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

      <DashboardMDTile
        isOpen={openTopTile === 'md_office'}
        isCollapsed={isCollapsed}
        activeTab={activeTab}
        isManagingDirector={isManagingDirector}
        onTileClick={onMdTileClick}
        onSubItemClick={onSubItemClick}
      />

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
