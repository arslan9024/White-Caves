import React from 'react';
import { Plus, Search, Filter, Download, RefreshCw, Settings } from 'lucide-react';
import './QuickActionBar.css';

const ICON_MAP = {
  add: Plus,
  search: Search,
  filter: Filter,
  download: Download,
  refresh: RefreshCw,
  settings: Settings
};

const QuickActionBar = ({
  actions = [],
  searchValue = '',
  onSearchChange,
  showSearch = true,
  className = ''
}) => {
  return (
    <div className={`quick-action-bar ${className}`}>
      {showSearch && (
        <div className="qab-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
      )}

      <div className="qab-actions">
        {actions.map((action, idx) => {
          const Icon = action.icon || ICON_MAP[action.type] || Plus;
          return (
            <button
              key={idx}
              className={`qab-action ${action.variant || ''} ${action.loading ? 'loading' : ''}`}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              title={action.tooltip || action.label}
            >
              {action.loading ? (
                <RefreshCw size={16} className="spinning" />
              ) : (
                <Icon size={16} />
              )}
              {action.label && <span>{action.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionBar;
