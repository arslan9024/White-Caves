import React, { memo, useState, useCallback, type ReactNode } from 'react';
import './SharedComponents.css';

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size: number }>;
  badge?: number;
}

interface TabPanelProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  color?: string;
  children: ReactNode;
}

const TabPanel = memo(({ 
  tabs, 
  defaultTab, 
  onTabChange,
  color = 'var(--assistant-color, #0EA5E9)',
  children 
}: TabPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);
  
  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [onTabChange]);
  
  const activeChild = React.Children.toArray(children).find(
    (child): child is React.ReactElement<{ tabId?: string }> => React.isValidElement(child) && (child.props as { tabId?: string })?.tabId === activeTab
  );
  
  return (
    <div className="tab-panel" style={{ '--tab-accent': color } as React.CSSProperties}>
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

interface TabContentProps {
  tabId: string;
  children: ReactNode;
}

export const TabContent = memo(({ tabId, children }: TabContentProps) => {
  return <div className="tab-pane">{children}</div>;
});

TabPanel.displayName = 'TabPanel';
TabContent.displayName = 'TabContent';
export default TabPanel;
