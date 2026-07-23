import React, { FC } from 'react';
import type { RoleTab } from '../../../config/ROLE_TAB_MAPPING';
import type { GroupedModuleItem } from '../../../config/crmNavigationSchema';

interface ZoneGroup {
  zone: string;
  items: GroupedModuleItem[];
}

interface DashboardSidebarProps {
  isSuperUser: boolean;
  activeTab: string;
  selectedCRMModule: string | null;
  pinnedTabs: RoleTab[];
  coreTabs: RoleTab[];
  aiModules: GroupedModuleItem[];
  advancedModules: GroupedModuleItem[];
  zoneGroups: ZoneGroup[];
  zoneLabels: Record<string, string>;
  aiModulesExpanded: boolean;
  departmentsExpanded: boolean;
  advancedExpanded: boolean;
  onToggleAiModules: () => void;
  onToggleDepartments: () => void;
  onToggleAdvanced: () => void;
  onSelectTab: (tabId: string) => void;
  onSelectModule: (moduleId: string) => void;
}

const renderTabButton = (
  tab: RoleTab,
  isActive: boolean,
  onSelectTab: (tabId: string) => void,
  tabType: string
) => (
  <button
    key={tab.id}
    className={`dashboard-rail-tab ${isActive ? 'active' : ''}`}
    type="button"
    role="tab"
    aria-selected={isActive}
    onClick={() => onSelectTab(tab.id)}
  >
    <span className="dashboard-rail-tab__icon">{tab.icon}</span>
    <span className="dashboard-rail-tab__label">{tab.label}</span>
    {tab.badge !== undefined && tab.badge > 0 && <span className="dashboard-rail-tab__badge">{tab.badge}</span>}
    <span className="sr-only">{tabType}</span>
  </button>
);

const DashboardSidebar: FC<DashboardSidebarProps> = ({
  isSuperUser,
  activeTab,
  selectedCRMModule,
  pinnedTabs,
  coreTabs,
  aiModules,
  advancedModules,
  zoneGroups,
  zoneLabels,
  aiModulesExpanded,
  departmentsExpanded,
  advancedExpanded,
  onToggleAiModules,
  onToggleDepartments,
  onToggleAdvanced,
  onSelectTab,
  onSelectModule,
}) => {
  return (
    <aside className="dashboard-side-rail" aria-label="Dashboard tabs">
      <div className="dashboard-side-rail__section">
        <span className="dashboard-side-rail__label">Pinned</span>
        <div className="dashboard-tab-rail" role="tablist" aria-orientation="vertical">
          {pinnedTabs.map(tab => renderTabButton(tab, activeTab === tab.id && !selectedCRMModule, onSelectTab, 'Pinned workspace'))}
        </div>
      </div>

      <div className="dashboard-side-rail__section">
        <span className="dashboard-side-rail__label">Core Workspaces</span>
        <div className="dashboard-tab-rail" role="tablist" aria-orientation="vertical">
          {coreTabs.map(tab => renderTabButton(tab, activeTab === tab.id && !selectedCRMModule, onSelectTab, 'Core workspace'))}
        </div>
      </div>

      {isSuperUser && (
        <div className="dashboard-side-rail__section dashboard-side-rail__section--modules">
          <button type="button" className="dashboard-modules-toggle" onClick={onToggleAiModules} aria-expanded={aiModulesExpanded}>
            <span>AI Modules</span>
            <span aria-hidden="true">{aiModulesExpanded ? '−' : '+'}</span>
          </button>
          {aiModulesExpanded && (
            <div className="dashboard-module-list">
              {aiModules.map(module => (
                <button
                  key={module.id}
                  type="button"
                  className={`dashboard-module-option ${selectedCRMModule === module.id ? 'active' : ''}`}
                  onClick={() => onSelectModule(module.id)}
                >
                  <span aria-hidden="true">{module.icon}</span>
                  <span>{module.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isSuperUser && (
        <div className="dashboard-side-rail__section dashboard-side-rail__section--modules">
          <button type="button" className="dashboard-modules-toggle" onClick={onToggleDepartments} aria-expanded={departmentsExpanded}>
            <span>Departments</span>
            <span aria-hidden="true">{departmentsExpanded ? '−' : '+'}</span>
          </button>
          {departmentsExpanded && (
            <div className="dashboard-module-list">
              {zoneGroups.map(({ zone, items }) => (
                <button
                  key={zone}
                  type="button"
                  className="dashboard-module-option"
                  onClick={() => {
                    if (items[0]) onSelectModule(items[0].id);
                  }}
                >
                  <span aria-hidden="true">{items[0]?.icon ?? '🧭'}</span>
                  <span>{zoneLabels[zone] ?? zone}</span>
                  <span className="dashboard-rail-tab__badge">{items.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isSuperUser && (
        <div className="dashboard-side-rail__section dashboard-side-rail__section--modules">
          <button type="button" className="dashboard-modules-toggle" onClick={onToggleAdvanced} aria-expanded={advancedExpanded}>
            <span>Advanced</span>
            <span aria-hidden="true">{advancedExpanded ? '−' : '+'}</span>
          </button>
          {advancedExpanded && (
            <div className="dashboard-module-list">
              {advancedModules.map(module => (
                <button
                  key={module.id}
                  type="button"
                  className={`dashboard-module-option ${selectedCRMModule === module.id ? 'active' : ''}`}
                  onClick={() => onSelectModule(module.id)}
                >
                  <span aria-hidden="true">{module.icon}</span>
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

export default DashboardSidebar;
