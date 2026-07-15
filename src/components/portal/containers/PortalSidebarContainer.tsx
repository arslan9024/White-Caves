import React, { FC } from 'react';
import { useTranslation } from '../../../context/TranslationContext';

export interface TabConfig<T extends string> {
  key: T;
  label: string;
  icon: string;
}

interface PortalSidebarContainerProps<T extends string> {
  tabs: TabConfig<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  ariaLabel?: string;
}

export const PortalSidebarContainer = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
}: PortalSidebarContainerProps<T>): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div
      className="portal-tab-navigation"
      role="tablist"
      aria-label={ariaLabel || t('common.navigation')}
    >
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          aria-controls={`tabpanel-${tab.key}`}
          className={`portal-tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
          data-testid={`tab-${tab.key}`}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PortalSidebarContainer;
