import React, { memo, useState, useCallback } from 'react';
import './SharedComponents.css';

const TabPanel = memo(({ 
  tabs, 
  defaultTab, 
  onTabChange,
  color = 'var(--assistant-color, #0EA5E9)',
  children 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  
  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [onTabChange]);
  
  const activeChild = React.Children.toArray(children).find(
    child => child.props?.tabId === activeTab
  );
  
  return (
    <div className="tab-panel" style={{ '--tab-accent': color }}>
      <div className="tab-buttons">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <tab.icon size={16} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {activeChild}
      </div>
    </div>
  );
});

export const TabContent = memo(({ tabId, children }) => {
  return <div className="tab-pane">{children}</div>;
});

TabPanel.displayName = 'TabPanel';
TabContent.displayName = 'TabContent';
export default TabPanel;
