import React, { Suspense, lazy, useState } from 'react';
import SuspenseLoader from '../../common/SuspenseLoader';
import './ClaraLeadsCRM.css';

// Lazy-load all tabs
const ProspectsTab = lazy(() => import('./tabs/ProspectsTab'));
const DealsTab = lazy(() => import('./tabs/DealsTab'));
const TasksTab = lazy(() => import('./tabs/TasksTab'));
const ActivityTab = lazy(() => import('./tabs/ActivityTab'));
const InsightsTab = lazy(() => import('./tabs/InsightsTab'));
const FeaturesTab = lazy(() => import('./tabs/FeaturesTab'));

export default function ClaraLeadsCRM() {
  const [activeTab, setActiveTab] = useState('prospects');

  const tabs = [
    {
      id: 'prospects',
      label: 'Prospects',
      description: 'Manage leads and prospects',
      component: ProspectsTab,
      order: 1
    },
    {
      id: 'deals',
      label: 'Deals',
      description: 'Pipeline and deal tracking',
      component: DealsTab,
      order: 2
    },
    {
      id: 'tasks',
      label: 'Tasks',
      description: 'Task and action items',
      component: TasksTab,
      order: 3
    },
    {
      id: 'activity',
      label: 'Activity',
      description: 'Communication history',
      component: ActivityTab,
      order: 4
    },
    {
      id: 'insights',
      label: 'Insights',
      description: 'Analytics and metrics',
      component: InsightsTab,
      order: 5
    },
    {
      id: 'features',
      label: 'Features',
      description: 'Clara\'s capabilities',
      component: FeaturesTab,
      order: 6
    }
  ];

  const visibleTabs = tabs.filter(t => !t.hidden);
  const ActiveTabComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="clara-leads-crm">
      {/* Tab Navigation */}
      <div className="clara-tabs-nav">
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
      <div className="clara-tabs-content">
        <Suspense fallback={<SuspenseLoader message="Loading leads..." />}>
          {ActiveTabComponent && <ActiveTabComponent />}
        </Suspense>
      </div>
    </div>
  );
}
