import React, { lazy, Suspense, useState, useCallback, useMemo } from 'react';
import SuspenseLoader from '../../layout/SuspenseLoader';
import './MaryInventoryCRM.css';

// Lazy load all tabs for better performance
const MaryInventoryTab = lazy(() => import('./tabs/MaryInventoryTab'));
const MaryDataToolsTab = lazy(() => import('./tabs/MaryDataToolsTab'));
const MaryFeaturesTab = lazy(() => import('./tabs/MaryFeaturesTab'));
const MaryDetailsTab = lazy(() => import('./tabs/MaryDetailsTab'));

/**
 * MaryInventoryCRM Component
 * 
 * Refactored tab-based inventory management system with lazy loading.
 * Improves performance by splitting large component into smaller chunks,
 * each loaded on-demand when their tab is activated.
 * 
 * Features:
 * - Tab-based navigation with lazy loading
 * - Shared inventory state management via custom hook
 * - Responsive design with mobile-friendly tab navigation
 * - Optimized for bundle size and runtime performance
 * 
 * @returns {JSX.Element} Rendered MaryInventoryCRM component
 */
const MaryInventoryCRM = () => {
  // Tab configuration with metadata
  const tabs = useMemo(
    () => [
      {
        id: 'inventory',
        label: 'Inventory',
        icon: '📦',
        component: MaryInventoryTab,
      },
      {
        id: 'data-tools',
        label: 'Data Tools',
        icon: '🔧',
        component: MaryDataToolsTab,
      },
      {
        id: 'features',
        label: 'Features',
        icon: '⭐',
        component: MaryFeaturesTab,
      },
      {
        id: 'details',
        label: 'Details',
        icon: '📋',
        component: MaryDetailsTab,
      },
    ],
    []
  );

  // Active tab state
  const [activeTab, setActiveTab] = useState('inventory');

  // Find active tab component
  const activeTabConfig = useMemo(
    () => tabs.find((tab) => tab.id === activeTab),
    [activeTab, tabs]
  );

  // Handle tab clicks with stable callback
  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Render tab navigation buttons
  const renderTabNavigation = () => (
    <nav className="mary-tabs-nav" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          className={`tab-nav-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
        >
          <span>{tab.icon}</span> {tab.label}
        </button>
      ))}
    </nav>
  );

  // Render active tab content with lazy loading
  const renderTabContent = () => {
    if (!activeTabConfig) return null;

    const TabComponent = activeTabConfig.component;

    return (
      <div
        key={activeTab}
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="mary-tabs-content"
      >
        <Suspense fallback={<SuspenseLoader />}>
          <TabComponent />
        </Suspense>
      </div>
    );
  };

  return (
    <div className="mary-inventory-crm">
      {renderTabNavigation()}
      {renderTabContent()}
    </div>
  );
};

MaryInventoryCRM.displayName = 'MaryInventoryCRM';

export default MaryInventoryCRM;
