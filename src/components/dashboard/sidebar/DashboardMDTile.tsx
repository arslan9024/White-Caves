/**
 * DashboardMDTile.tsx — Tile 1 MD Sovereign Suite.
 * Non-MD users see locked summary (no sovereign module deep-links).
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
  isManagingDirector?: boolean;
  onTileClick: () => void;
  onSubItemClick: (itemId: string) => void;
}

export const DashboardMDTile: FC<DashboardMDTileProps> = ({
  isOpen,
  isCollapsed,
  activeTab,
  isManagingDirector = false,
  onTileClick,
  onSubItemClick,
}) => {
  return (
    <div data-testid="dashboard-md-tile">
      <TopLevelTileButton
        $open={isOpen}
        onClick={onTileClick}
        $accentColor="#EF4444"
        title={
          isManagingDirector
            ? 'Managing Director Sovereign Suite'
            : 'MD Suite (restricted — Managing Director only)'
        }
        aria-label={
          isManagingDirector ? 'Open Managing Director Suite' : 'MD Suite restricted'
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👑</span>
          {!isCollapsed && <span>1. MD Office (MD Suite)</span>}
        </div>
        {!isCollapsed && <span className="arrow">▶</span>}
      </TopLevelTileButton>

      {isOpen && !isCollapsed && (
        <div
          style={{
            paddingLeft: '0.5rem',
            marginTop: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <DeptHeader
            type="button"
            $active={activeTab === 'dept_summary'}
            onClick={() => onSubItemClick('dept_summary')}
            aria-current={activeTab === 'dept_summary' ? 'page' : undefined}
          >
            <div className="left">
              <span className="num-tag">{MD_SUITE_DEPT.num}</span>
              <span>{MD_SUITE_DEPT.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Executive Overview</span>
            </div>
          </DeptHeader>

          {isManagingDirector ? (
            MD_SUITE_DEPT.items?.map(item => (
              <SidebarSubItem
                key={item.id}
                $active={activeTab === item.id}
                onClick={() => onSubItemClick(item.id)}
              >
                <span>{item.icon}</span> {item.label}
              </SidebarSubItem>
            ))
          ) : (
            <p
              style={{
                margin: '0.35rem 0.5rem',
                fontSize: '0.72rem',
                color: '#94a3b8',
                lineHeight: 1.4,
              }}
              data-testid="md-suite-locked"
            >
              Sovereign modules require Managing Director sign-in
              (arslanmalikgoraha@gmail.com).
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardMDTile;
