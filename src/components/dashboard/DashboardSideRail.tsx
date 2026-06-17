import React, { FC, KeyboardEvent, RefObject, useState } from 'react';
import type { RoleTab } from '../../config/ROLE_TAB_MAPPING';
import { getCRMModule } from '../../config/crmModuleRegistry';
import { ZONE_LABELS, groupModulesForMD } from '../../config/crmNavigationSchema';

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

const ZONE_ICONS: Record<string, string> = {
  executive: '◆',
  sales_leads: '🎯',
  inventory_listings: '🏠',
  leasing_contracts: '📋',
  finance_compliance: '💼',
  ai_command: '🤖',
};

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
  const groupedModules = React.useMemo(() => groupModulesForMD(moduleEntries), [moduleEntries]);

  // Track which zones are collapsed; all open by default
  const [collapsedZones, setCollapsedZones] = useState<Set<string>>(new Set());

  const toggleZone = (zone: string) => {
    setCollapsedZones(prev => {
      const next = new Set(prev);
      if (next.has(zone)) next.delete(zone);
      else next.add(zone);
      return next;
    });
  };

  const zoneSections = React.useMemo(
    () =>
      Object.entries(groupedModules.byZone)
        .filter(([, items]) => items.length > 0)
        .sort((a, b) => {
          const order = ['executive', 'sales_leads', 'inventory_listings', 'leasing_contracts', 'finance_compliance', 'ai_command'];
          return (order.indexOf(a[0]) ?? 99) - (order.indexOf(b[0]) ?? 99);
        }),
    [groupedModules.byZone]
  );

  return (
    <aside className="dashboard-side-rail" aria-label="Dashboard navigation">

      {/* ── Brand Header ── */}
      <div className="dashboard-side-rail__brand">
        <span className="dashboard-side-rail__brand-logo" aria-hidden="true">WC</span>
        <span className="dashboard-side-rail__brand-name">White Caves</span>
      </div>

      <div className="dashboard-side-rail__divider" role="separator" />

      {/* ── Workspaces ── */}
      <div className="dashboard-side-rail__section">
        <span className="dashboard-side-rail__label">Workspaces</span>
        <nav className="dashboard-tab-rail" aria-label="Workspace navigation">
          {availableTabs.filter(tab => tab.id !== 'ai-hub' && tab.id !== 'ai-command').map((tab, index) => (
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

      {/* ── CRM Modules (zone-grouped hierarchy) ── */}
      {isSuperUser && (
        <div className="dashboard-side-rail__section dashboard-side-rail__section--modules">
          <div className="dashboard-side-rail__divider" role="separator" />
          <button
            type="button"
            className="dashboard-modules-toggle"
            onClick={onToggleModules}
            aria-controls="dashboard-module-zones"
          >
            <span>AI Modules</span>
            <span className="dashboard-modules-toggle__count" aria-hidden="true">
              {moduleEntries.length}
            </span>
            <span className="dashboard-modules-toggle__chevron" aria-hidden="true">
              {modulesExpanded ? '▲' : '▼'}
            </span>
          </button>

          {modulesExpanded && (
            <div id="dashboard-module-zones" aria-label="CRM modules by zone">
              {zoneSections.map(([zone, items]) => {
                const zoneLabel = ZONE_LABELS[zone] ?? zone.replace(/_/g, ' ');
                const zoneIcon = ZONE_ICONS[zone] ?? '⬡';
                const isCollapsed = collapsedZones.has(zone);
                const hasActiveModule = items.some(item => item.id === selectedCRMModule);

                return (
                  <div
                    key={zone}
                    className={`dashboard-zone-group${hasActiveModule ? ' dashboard-zone-group--active' : ''}`}
                    role="group"
                    aria-label={zoneLabel}
                  >
                    <button
                      type="button"
                      className="dashboard-zone-header"
                      onClick={() => toggleZone(zone)}
                    >
                      <span className="dashboard-zone-header__icon" aria-hidden="true">
                        {zoneIcon}
                      </span>
                      <span className="dashboard-zone-header__label">{zoneLabel}</span>
                      <span className="dashboard-zone-header__count" aria-hidden="true">
                        {items.length}
                      </span>
                      <span className="dashboard-zone-header__chevron" aria-hidden="true">
                        {isCollapsed ? '›' : '⌄'}
                      </span>
                    </button>

                    {!isCollapsed && (
                      <div className="dashboard-zone-items" role="group">
                        {items.map(item => {
                          const def = getCRMModule(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              className={`dashboard-module-option${selectedCRMModule === item.id ? ' active' : ''}`}
                              onClick={() => onSelectModule(item.id)}
                              aria-current={selectedCRMModule === item.id ? 'page' : undefined}
                              title={def?.description}
                            >
                              <span
                                className="dashboard-module-option__icon"
                                aria-hidden="true"
                                data-zone={zone}
                              >
                                {item.icon}
                              </span>
                              <span className="dashboard-module-option__label">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default DashboardSideRail;
