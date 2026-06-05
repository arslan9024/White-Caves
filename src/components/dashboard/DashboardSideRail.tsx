import React, { FC, KeyboardEvent, RefObject } from 'react';
import type { RoleTab } from '../../config/ROLE_TAB_MAPPING';

interface DashboardModuleEntry {
  label: string;
}

interface DashboardSideRailProps {
  availableTabs: RoleTab[];
  activeTab: string;
  selectedCRMModule: string | null;
  isSuperUser: boolean;
  modulesExpanded: boolean;
  moduleEntries: Array<[string, DashboardModuleEntry]>;
  tabButtonRefs: RefObject<Array<HTMLButtonElement | null>>;
  onSelectTab: (tabId: string) => void;
  onTabKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onToggleModules: () => void;
  onSelectModule: (moduleId: string) => void;
}

const DashboardSideRail: FC<DashboardSideRailProps> = ({
  availableTabs,
  activeTab,
  selectedCRMModule,
  isSuperUser,
  modulesExpanded,
  moduleEntries,
  tabButtonRefs,
  onSelectTab,
  onTabKeyDown,
  onToggleModules,
  onSelectModule,
}) => {
  return (
    <aside className="dashboard-side-rail" aria-label="Dashboard navigation">
      <div className="dashboard-side-rail__section">
        <span className="dashboard-side-rail__label">Workspaces</span>
        <nav className="dashboard-tab-rail" aria-label="Workspace navigation">
          {availableTabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={element => {
                if (tabButtonRefs.current) tabButtonRefs.current[index] = element;
              }}
              className={`dashboard-rail-tab ${activeTab === tab.id && !selectedCRMModule ? 'active' : ''}`}
              type="button"
              aria-current={activeTab === tab.id && !selectedCRMModule ? 'page' : undefined}
              onClick={() => onSelectTab(tab.id)}
              onKeyDown={event => onTabKeyDown(event, index)}
            >
              <span className="dashboard-rail-tab__icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="dashboard-rail-tab__label">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="dashboard-rail-tab__badge">{tab.badge}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {isSuperUser && (
        <div className="dashboard-side-rail__section dashboard-side-rail__section--modules">
          <button
            type="button"
            className="dashboard-modules-toggle"
            onClick={onToggleModules}
            aria-controls="dashboard-module-list"
          >
            <span>AI CRM Modules</span>
            <span aria-hidden="true">{modulesExpanded ? '−' : '+'}</span>
          </button>
          {modulesExpanded && (
            <div className="dashboard-module-list" id="dashboard-module-list">
              {moduleEntries.map(([key, module]) => (
                <button
                  key={key}
                  type="button"
                  className={`dashboard-module-option ${selectedCRMModule === key ? 'active' : ''}`}
                  onClick={() => onSelectModule(key)}
                  aria-current={selectedCRMModule === key ? 'page' : undefined}
                >
                  <span aria-hidden="true">🤖</span>
                  <span>{module.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default DashboardSideRail;
