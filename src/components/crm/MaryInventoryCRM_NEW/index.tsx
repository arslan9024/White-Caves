import React, { Suspense, lazy, useState } from 'react';
import SuspenseLoader from '../../common/SuspenseLoader';
import './MaryInventoryCRM.css';

// Lazy-load all tabs
const MaryInventoryTab = lazy(() => import('./tabs/MaryInventoryTab'));
const MaryDataToolsTab = lazy(() => import('./tabs/MaryDataToolsTab'));
const MaryFeaturesTab = lazy(() => import('./tabs/MaryFeaturesTab'));
const MaryDetailsTab = lazy(() => import('./tabs/MaryDetailsTab'));

export default function MaryInventoryCRM() {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    {
      id: 'inventory',
      label: 'Inventory',
      description: 'Manage properties and owners',
      component: MaryInventoryTab,
      order: 1
    },
    {
      id: 'datatools',
      label: 'Data Tools',
      description: 'Data collection & extraction',
      component: MaryDataToolsTab,
      order: 2
    },
    {
      id: 'features',
      label: 'Features',
      description: 'Available capabilities',
      component: MaryFeaturesTab,
      order: 3
    },
    {
      id: 'details',
      label: 'Property Details',
      description: 'Detailed property information',
      component: MaryDetailsTab,
      order: 4,
      hidden: true  // This tab is shown via modal, not main nav
    }
  ];

  const visibleTabs = tabs.filter(t => !t.hidden);
  const ActiveTabComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="mary-inventory-crm">
      {/* Tab Navigation */}
      <div className="mary-tabs-nav">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.description}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with Suspense */}
      <div className="mary-tabs-content">
        <Suspense fallback={<SuspenseLoader />}>
          {ActiveTabComponent && <ActiveTabComponent />}
        </Suspense>
      </div>
    </div>
  );
}
