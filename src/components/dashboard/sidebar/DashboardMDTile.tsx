/**
 * DashboardMDTile.tsx
 *
 * Tile 1: Managing Director Office (MD Sovereign Suite) in Dashboard Sidebar.
 */

import React, { FC } from 'react';
import {
  TopLevelTileButton,
  DeptHeader,
  SidebarSubItem,
} from '../../../pages/crm/CRMHubPage.styles';
import { MD_SUITE_DEPT } from '../../../pages/crm/CRMHubPage.logic';

export interface DashboardMDTileProps {
  isOpen: boolean;
  isCollapsed: boolean;
  activeTab: string;
  onTileClick: () => void;
  onSubItemClick: (itemId: string) => void;
}

export const DashboardMDTile: FC<DashboardMDTileProps> = ({
  isOpen,
  isCollapsed,
  activeTab,
  onTileClick,
  onSubItemClick,
}) => {
  return (
    <div>
      <TopLevelTileButton
        $open={isOpen}
        onClick={onTileClick}
        $accentColor="#EF4444"
        title="Managing Director Sovereign Suite"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👑</span>
          {!isCollapsed && <span>1. MD Office (MD Suite)</span>}
        </div>
        {!isCollapsed && <span className="arrow">▶</span>}
      </TopLevelTileButton>

      {isOpen && !isCollapsed && (
        <div style={{ paddingLeft: '0.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <DeptHeader
            $active={activeTab === 'dept_summary'}
            onClick={() => onSubItemClick('dept_summary')}
          >
            <div className="left">
              <span className="num-tag">{MD_SUITE_DEPT.num}</span>
              <span>{MD_SUITE_DEPT.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Executive Overview</span>
            </div>
          </DeptHeader>

          {MD_SUITE_DEPT.items?.map(item => (
            <SidebarSubItem
              key={item.id}
              $active={activeTab === item.id}
              onClick={() => onSubItemClick(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </SidebarSubItem>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMDTile;
