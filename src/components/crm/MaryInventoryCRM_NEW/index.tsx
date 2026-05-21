import React, { Suspense, lazy, useState } from 'react';
import SuspenseLoader from '../../common/SuspenseLoader';
import AssistantLifecycleTab from '../shared/AssistantLifecycleTab';
import './MaryInventoryCRM.css';

// Lazy-load all tabs
const MaryInventoryTab = lazy(() => import('./tabs/MaryInventoryTab'));
const MaryAcquisitionTab = lazy(() => import('./tabs/MaryAcquisitionTab'));
const MaryPipelineTab = lazy(() => import('./tabs/MaryPipelineTab'));
const MaryDataToolsTab = lazy(() => import('./tabs/MaryDataToolsTab'));
const MaryFeaturesTab = lazy(() => import('./tabs/MaryFeaturesTab'));
const MaryDetailsTab = lazy(() => import('./tabs/MaryDetailsTab'));

export default function MaryInventoryCRM() {
  const [activeTab, setActiveTab] = useState('acquisition');

  const tabs = [
    {
      id: 'acquisition',
      label: '+ Acquire',
      description: 'Add new property to inventory',
      component: MaryAcquisitionTab,
      order: 0,
    },
    {
      id: 'pipeline',
      label: 'Pipeline',
      description: '5-stage inventory lifecycle & document compliance',
      component: MaryPipelineTab,
      order: 1,
    },
    {
      id: 'inventory',
      label: 'Inventory',
      description: 'Manage properties and owners',
      component: MaryInventoryTab,
      order: 2,
    },
    {
      id: 'datatools',
      label: 'Data Tools',
      description: 'Data collection & extraction',
      component: MaryDataToolsTab,
      order: 3,
    },
    {
      id: 'features',
      label: 'Features',
      description: 'Available capabilities',
      component: MaryFeaturesTab,
      order: 4,
    },
    {
      id: 'details',
      label: 'Property Details',
      description: 'Detailed property information',
      component: MaryDetailsTab,
      order: 6,
      hidden: true, // This tab is shown via modal, not main nav
    },
    {
      id: 'lifecycle',
      label: 'Lifecycle',
      description: 'Task lifecycle board',
      component: null,
      order: 5,
    },
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
          {activeTab === 'lifecycle' ? (
            <AssistantLifecycleTab assistantId="mary" color="#3B82F6" assistantName="Mary" />
          ) : (
            ActiveTabComponent && <ActiveTabComponent />
          )}
        </Suspense>
      </div>
    </div>
  );
}
