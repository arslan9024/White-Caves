import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../store/dashboardSlice';
import './TabbedPanel.css';

export default function TabbedPanel({ 
  tabs, 
  activeTab: controlledActiveTab,
  onTabChange,
  children,
  storeKey,
  variant = 'default',
  className = ''
}) {
  const dispatch = useDispatch();
  const storedActiveTab = useSelector(state => 
    storeKey ? state.dashboard?.activeTabs?.[storeKey] : null
  );
  
  const activeTab = controlledActiveTab ?? storedActiveTab ?? tabs[0]?.id;

  const handleTabChange = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    if (storeKey) {
      dispatch(setActiveTab({ key: storeKey, tab: tabId }));
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={`tabbed-panel ${variant} ${className}`}>
      <div className="tab-buttons" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
      <div 
        className="tab-content"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
      >
        {activeTabContent || children}
      </div>
    </div>
  );
}

export function TabPanel({ children, className = '' }) {
  return (
    <div className={`tab-panel-content ${className}`}>
      {children}
    </div>
  );
}
