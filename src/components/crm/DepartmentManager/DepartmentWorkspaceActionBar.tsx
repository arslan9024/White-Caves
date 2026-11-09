import React, { FC } from 'react';
import { Search, Plus, Building2, Table2, Layers, GitFork } from 'lucide-react';
import { ActionBar } from './DepartmentManagementWorkspace.styles';
import { DepartmentWorkspaceViewMode } from './DepartmentManagementWorkspace';

interface DepartmentWorkspaceActionBarProps {
  viewMode: DepartmentWorkspaceViewMode;
  setViewMode: (mode: DepartmentWorkspaceViewMode) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isReadOnly: boolean;
  onOpenCreate: () => void;
}

const VIEW_TABS: Array<{
  mode: DepartmentWorkspaceViewMode;
  label: string;
  testId: string;
  activeColor: string;
  activeBg: string;
  activeText: string;
  Icon: React.ComponentType<any>;
}> = [
  { mode: 'grid', label: '12 Slots Matrix', testId: 'viewmode-grid-btn', activeColor: '#EF4444', activeBg: 'rgba(239, 68, 68, 0.18)', activeText: '#F87171', Icon: Building2 },
  { mode: 'finalizer', label: '12-Dept Name Finalizer', testId: 'viewmode-finalizer-btn', activeColor: '#F59E0B', activeBg: 'rgba(245, 158, 11, 0.18)', activeText: '#FBBF24', Icon: Table2 },
  { mode: 'squads', label: 'Squad Allocations', testId: 'viewmode-squads-btn', activeColor: '#3B82F6', activeBg: 'rgba(59, 130, 246, 0.18)', activeText: '#60A5FA', Icon: Layers },
  { mode: 'hierarchy', label: '3-Tier Bhakti Hierarchy', testId: 'viewmode-hierarchy-btn', activeColor: '#10B981', activeBg: 'rgba(16, 185, 129, 0.18)', activeText: '#34D399', Icon: GitFork },
];

export const DepartmentWorkspaceActionBar: FC<DepartmentWorkspaceActionBarProps> = ({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  isReadOnly,
  onOpenCreate,
}) => {
  return (
    <ActionBar>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {VIEW_TABS.map(({ mode, label, testId, activeColor, activeBg, activeText, Icon }) => {
          const isActive = viewMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              data-testid={testId}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: isActive ? `1px solid ${activeColor}` : '1px solid rgba(255,255,255,0.1)',
                background: isActive ? activeBg : 'transparent',
                color: isActive ? activeText : '#94A3B8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div className="search-wrap">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search departments by code, title, or scope..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {!isReadOnly && (
        <button className="add-btn" onClick={onOpenCreate}>
          <Plus size={16} />
          Add Corporate Department
        </button>
      )}
    </ActionBar>
  );
};
