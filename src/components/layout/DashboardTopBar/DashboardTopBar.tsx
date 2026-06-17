import React, { FC } from 'react';

interface DashboardSearchResult {
  id: string;
  icon: string;
  label: string;
  meta: string;
}

interface DashboardTopBarProps {
  isSuperUser: boolean;
  greetingName: string;
  email: string;
  hotLeadsCount: number;
  searchQuery: string;
  searchResults: DashboardSearchResult[];
  isSearchOpen: boolean;
  onSearchChange: (query: string) => void;
  onSearchFocus: () => void;
  onSearchEnter: () => void;
  onSearchResultSelect: (resultId: string) => void;
  onSearchBlurOutside: () => void;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
}

const DashboardTopBar: FC<DashboardTopBarProps> = ({
  isSuperUser,
  greetingName,
  email,
  hotLeadsCount,
  searchQuery,
  searchResults,
  isSearchOpen,
  onSearchChange,
  onSearchFocus,
  onSearchEnter,
  onSearchResultSelect,
  onSearchBlurOutside,
  onOpenMobileMenu,
  onOpenCommandPalette,
}) => {
  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar__brand">
        <div className={`dashboard-topbar__logo${isSuperUser ? ' dashboard-topbar__logo--lion' : ''}`}>
          WC
        </div>
        <div>
          <p className="dashboard-topbar__eyebrow">White Caves CRM</p>
          <strong>
            Internal command center
            {isSuperUser && <span className="dashboard-topbar__super-pill">👑</span>}
          </strong>
        </div>
      </div>

      <div className="dashboard-topbar__search" onBlur={onSearchBlurOutside}>
        <span className="dashboard-topbar__search-icon">🔎</span>
        <input
          type="search"
          value={searchQuery}
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
        {isSearchOpen && searchResults.length > 0 && (
          <div className="dashboard-search-results" role="listbox" aria-label="Search results">
            {searchResults.map(item => (
              <button
                key={item.id}
                className="dashboard-search-result"
                onMouseDown={event => {
                  event.preventDefault();
                  onSearchResultSelect(item.id);
                }}
              >
                <span className="dashboard-search-result__icon">{item.icon}</span>
                <span className="dashboard-search-result__copy">
                  <strong>{item.label}</strong>
                  <small>{item.meta}</small>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-topbar__actions">
        <button
          type="button"
          className="dashboard-mobile-menu-button"
          aria-label="Open CRM navigation menu"
          onClick={onOpenMobileMenu}
        >
          ☰
        </button>
        <button type="button" className="dashboard-icon-button" aria-label={`${hotLeadsCount} notifications`}>
          🔔
          {hotLeadsCount > 0 && <span className="dashboard-icon-badge">{hotLeadsCount}</span>}
        </button>
        <button type="button" className="dashboard-command-button" onClick={onOpenCommandPalette}>
          ⌘K <span>Command palette</span>
        </button>
        <button type="button" className="dashboard-quick-action" onClick={onOpenCommandPalette}>
          + Quick action
        </button>
        <div className={`dashboard-user-chip${isSuperUser ? ' dashboard-user-chip--lion' : ''}`}>
          <div className="dashboard-user-chip__avatar">{isSuperUser ? '👑' : greetingName.slice(0, 2).toUpperCase()}</div>
          <div className="dashboard-user-chip__copy">
            <strong>
              {greetingName}
              {isSuperUser && <span className="dashboard-user-chip__role-badge">Lion</span>}
            </strong>
            <small>{email}</small>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
