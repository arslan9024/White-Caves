/**
 * Tabs Component
 * ==============
 * Accessible tab navigation with automatic focus management and keyboard support.
 */

import React, { useState, memo } from 'react';
import styled from 'styled-components';

export type TabsVariant = 'default' | 'underline' | 'box';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: TabsVariant;
  onChange?: (tabId: string) => void;
  fullWidth?: boolean;
}

const TabsContainer = styled.div`
  width: 100%;
`;

const TabList = styled.div<{ $fullWidth: boolean; $variant: TabsVariant }>`
  display: flex;
  border-bottom: ${props => (props.$variant === 'underline' ? '2px solid #e5e7eb' : 'none')};
  background-color: ${props => (props.$variant === 'box' ? '#f9fafb' : 'transparent')};
  border-radius: ${props => (props.$variant === 'box' ? '8px 8px 0 0' : '0')};
  padding: ${props => (props.$variant === 'box' ? '4px' : '0')};
  gap: ${props => (props.$variant === 'box' ? '4px' : '0')};

  ${props => (props.$fullWidth ? 'width: 100%;' : '')}
`;

const TabButton = styled.button<{
  $isActive: boolean;
  $variant: TabsVariant;
  disabled?: boolean;
}>`
  flex: ${props => (props.$variant === 'default' ? 'initial' : 'auto')};
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 14px;
  font-weight: 600;
  color: ${props => {
    if (props.disabled) return '#d1d5db';
    return props.$isActive ? '#3b82f6' : '#6b7280';
  }};
  position: relative;
  white-space: nowrap;
  transition: all 0.2s ease;

  ${props => {
    if (props.$variant === 'underline' && props.$isActive) {
      return `
        border-bottom: 3px solid #3b82f6;
        margin-bottom: -2px;
        color: #3b82f6;
      `;
    }
    if (props.$variant === 'box' && props.$isActive) {
      return `
        background-color: white;
        border-radius: 6px;
        color: #3b82f6;
      `;
    }
    return '';
  }}

  &:hover:not(:disabled) {
    color: ${props => (props.$variant === 'underline' ? '#1f2937' : '#3b82f6')};
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }

  opacity: ${props => (props.disabled ? '0.5' : '1')};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabContent = styled.div`
  padding: 20px 0;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/**
 * Tabs Component
 * Accessible tab navigation system
 */
export const Tabs: React.FC<TabsProps> = memo(function Tabs({
  tabs,
  defaultTab,
  variant = 'default',
  onChange,
  fullWidth = false,
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const currentEnabledIndex = enabledTabs.findIndex(t => t.id === tabs[currentIndex].id);
    if (currentEnabledIndex === -1) return;

    let targetIndex = -1;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (currentEnabledIndex + 1) % enabledTabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (currentEnabledIndex - 1 + enabledTabs.length) % enabledTabs.length;
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    if (targetIndex >= 0) {
      const targetTab = enabledTabs[targetIndex];
      handleTabChange(targetTab.id);
      // Focus the target tab button
      const tabEl = document.getElementById(`tab-${targetTab.id}`);
      tabEl?.focus();
    }
  };

  const activeTabItem = tabs.find(tab => tab.id === activeTab);

  return (
    <TabsContainer>
      <TabList role="tablist" $fullWidth={fullWidth} $variant={variant}>
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            $isActive={activeTab === tab.id}
            $variant={variant}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </TabButton>
        ))}
      </TabList>

      {activeTabItem && (
        <TabContent role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTabItem.content}
        </TabContent>
      )}
    </TabsContainer>
  );
});
