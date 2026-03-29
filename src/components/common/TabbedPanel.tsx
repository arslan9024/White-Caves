import React, { type ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../../store/dashboardSlice';
import type { RootState } from '../../store/store';
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

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  content?: ReactNode;
}

interface TabbedPanelProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children?: ReactNode;
  storeKey?: string;
  variant?: 'default' | 'pills' | 'underline' | string;
  className?: string;
}

export default function TabbedPanel({ 
  tabs, 
  activeTab: controlledActiveTab,
  onTabChange,
  children,
  storeKey,
  variant = 'default',
  className = ''
}: TabbedPanelProps) {
  const dispatch = useDispatch();
  const storedActiveTab = useSelector((state: RootState) => 
    storeKey ? state.dashboard?.activeTabs?.[storeKey] : null
  );
  
  const activeTab = controlledActiveTab ?? storedActiveTab ?? tabs[0]?.id;

  const handleTabChange = (tabId: string) => {
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

interface TabPanelProps {
  children: ReactNode;
  className?: string;
}

export function TabPanel({ children, className = '' }: TabPanelProps) {
  return (
    <TabPanelContent className={className}>
      {children}
    </TabPanelContent>
  );
}
