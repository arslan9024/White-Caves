/**
 * DashboardDeptTile.tsx
 *
 * Tile 2: 12 Corporate Departments with integrated SearchableSelect & sub-items.
 */

import React, { FC, useMemo } from 'react';
import {
  TopLevelTileButton,
  DeptHeader,
  SubGroupHeader,
  NestedItemList,
  SidebarSubItem,
} from '../../../pages/crm/CRMHubPage.styles';
import {
  TWELVE_CORPORATE_DEPARTMENTS,
  type BuildingTier,
} from '../../../pages/crm/CRMHubPage.logic';
import SearchableSelect, { type SearchableOption } from '../common/SearchableSelect';

export interface DashboardDeptTileProps {
  isOpen: boolean;
  isCollapsed: boolean;
  activeTab: string;
  selectedDept: BuildingTier;
  selectedDeptId: string;
  openSubGroups: Record<string, boolean>;
  onTileClick: () => void;
  onSelectDepartment: (option: SearchableOption) => void;
  onSubItemClick: (itemId: string) => void;
  onToggleSubGroup: (subGroupName: string) => void;
}

export const DashboardDeptTile: FC<DashboardDeptTileProps> = ({
  isOpen,
  isCollapsed,
  activeTab,
  selectedDept,
  selectedDeptId,
  openSubGroups,
  onTileClick,
  onSelectDepartment,
  onSubItemClick,
  onToggleSubGroup,
}) => {
  const departmentOptions = useMemo<SearchableOption[]>(() => {
    return TWELVE_CORPORATE_DEPARTMENTS.map(dept => ({
      id: dept.id,
      num: dept.num,
      name: dept.name,
      icon: dept.icon,
      role: dept.locationTag,
    }));
  }, []);

  return (
    <div>
      <TopLevelTileButton
        $open={isOpen}
        onClick={onTileClick}
        $accentColor="#EF4444"
        title="12 Corporate Departments"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏛️</span>
          {!isCollapsed && <span>2. Corporate Departments (12 Depts)</span>}
        </div>
        {!isCollapsed && <span className="arrow">▶</span>}
      </TopLevelTileButton>

      {isOpen && !isCollapsed && (
        <div style={{ paddingLeft: '0.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Reusable Searchable Department Dropdown */}
          <SearchableSelect
            options={departmentOptions}
            selectedId={selectedDeptId}
            onSelect={onSelectDepartment}
            searchPlaceholder="🔍 Search Dept (e.g. Sales, Inventory, Finance)..."
            accentColor="#EF4444"
            labelPrefix="Select Dept"
          />

          {/* Sub-items of the selected department */}
          <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <DeptHeader
              $active={activeTab === 'dept_summary'}
              onClick={() => onSubItemClick('dept_summary')}
            >
              <div className="left">
                <span className="num-tag">{selectedDept.num}</span>
                <span>{selectedDept.icon}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>Executive Overview</span>
              </div>
            </DeptHeader>

            {selectedDept.subGroups ? (
              selectedDept.subGroups.map(sg => {
                const sgName = sg.name || sg.label || 'Section';
                const sgKey = `${selectedDept.id}-${sgName}`;
                const isSgOpen = !!openSubGroups[sgKey];
                return (
                  <div key={sgKey}>
                    <SubGroupHeader
                      $open={isSgOpen}
                      onClick={() => onToggleSubGroup(sgKey)}
                    >
                      <span>{sgName}</span>
                      <span className="arrow">▶</span>
                    </SubGroupHeader>
                    <NestedItemList $open={isSgOpen}>
                      {(sg.items || []).map(item => (
                        <SidebarSubItem
                          key={item.id + item.label}
                          $active={activeTab === item.id}
                          onClick={() => onSubItemClick(item.id)}
                        >
                          <span>{item.icon}</span> {item.label}
                        </SidebarSubItem>
                      ))}
                    </NestedItemList>
                  </div>
                );
              })
            ) : (
              selectedDept.items?.map(item => (
                <SidebarSubItem
                  key={item.id + item.label}
                  $active={activeTab === item.id}
                  onClick={() => onSubItemClick(item.id)}
                >
                  <span>{item.icon}</span> {item.label}
                </SidebarSubItem>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDeptTile;
