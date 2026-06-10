import React, { FC, ReactNode, RefObject } from 'react';

interface DashboardTopBarProps {
  globalSearchRef: RefObject<HTMLDivElement>;
  globalSearchQuery: string;
  isGlobalSearchOpen: boolean;
  globalSearchResults: ReactNode;
  hotLeadsCount: number;
  greetingName: string;
  userEmail: string;
  onOpenCommandPalette: () => void;
  onQuickAction: () => void;
  onSearchChange: (value: string) => void;
  onSearchFocus: () => void;
  onSearchEnter: () => void;
}

const DashboardTopBar: FC<DashboardTopBarProps> = ({
  globalSearchRef,
  globalSearchQuery,
  isGlobalSearchOpen,
  globalSearchResults,
  hotLeadsCount,
  greetingName,
  userEmail,
  onOpenCommandPalette,
  onQuickAction,
  onSearchChange,
  onSearchFocus,
  onSearchEnter,
}) => {
  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar__brand">
        <div className="dashboard-topbar__logo" aria-hidden="true">
          WC
        </div>
        <div>
          <p className="dashboard-topbar__eyebrow">White Caves CRM</p>
          <strong>Internal command center</strong>
        </div>
      </div>

      <div className="dashboard-topbar__search" ref={globalSearchRef}>
        <span className="dashboard-topbar__search-icon" aria-hidden="true">
          🔎
        </span>
        <input
          type="search"
          value={globalSearchQuery}
          onChange={event => onSearchChange(event.target.value)}
          onFocus={onSearchFocus}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSearchEnter();
            }
          }}
          placeholder="Search leads, properties, agents, tabs, or modules"
          aria-label="Search dashboard records"
        />

        {isGlobalSearchOpen && <div className="dashboard-search-results">{globalSearchResults}</div>}
      </div>

      <div className="dashboard-topbar__actions">
        <button type="button" className="dashboard-icon-button" aria-label={`${hotLeadsCount} notifications`}>
          🔔
          {hotLeadsCount > 0 && <span className="dashboard-icon-badge">{hotLeadsCount}</span>}
        </button>
        <button type="button" className="dashboard-command-button" onClick={onOpenCommandPalette}>
          ⌘K <span>Command palette</span>
        </button>
        <button type="button" className="dashboard-quick-action" onClick={onQuickAction}>
          + Quick action
        </button>
        <div className="dashboard-user-chip" aria-label={`Signed in as ${userEmail}`}>
          <div className="dashboard-user-chip__avatar" aria-hidden="true">
            {greetingName.slice(0, 2).toUpperCase()}
          </div>
          <div className="dashboard-user-chip__copy">
            <strong>{greetingName}</strong>
            <small>{userEmail}</small>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
