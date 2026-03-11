import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../store/dashboardSlice';
import {
  TabbedPanelContainer,
  TabButtons,
  TabButton,
  TabIcon,
  TabLabel,
  TabBadge,
  TabContent,
  TabPanelContent,
} from './TabbedPanel.styles';

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
    <TabbedPanelContainer $variant={variant} className={className}>
      <TabButtons $variant={variant} role="tablist">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            $isActive={activeTab === tab.id}
            $variant={variant}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.icon && <TabIcon>{tab.icon}</TabIcon>}
            <TabLabel>{tab.label}</TabLabel>
            {tab.badge !== undefined && (
              <TabBadge $variant={variant} $isActive={activeTab === tab.id}>{tab.badge}</TabBadge>
            )}
          </TabButton>
        ))}
      </TabButtons>
      <TabContent 
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
      >
        {activeTabContent || children}
      </TabContent>
    </TabbedPanelContainer>
  );
}

export function TabPanel({ children, className = '' }) {
  return (
    <TabPanelContent className={className}>
      {children}
    </TabPanelContent>
  );
}
