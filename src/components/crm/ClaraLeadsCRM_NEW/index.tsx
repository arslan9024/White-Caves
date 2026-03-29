import React, { Suspense, lazy, useState } from 'react';
import SuspenseLoader from '../../common/SuspenseLoader';
import { Tabs, Badge, ProgressBar } from '../../../components/ui';
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

  // Mock data for badges and metrics
  const tabCounts = {
    prospects: 24,
    deals: 8,
    tasks: 12,
    activity: 45,
    insights: 3,
    features: 6
  };

  const pipelineMetrics = {
    prospectRate: 100,
    dealRate: 33,
    conversionRate: 8,
    completionRate: 67
  };

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

  const visibleTabs = tabs;
  const ActiveTabComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="clara-leads-crm">
      {/* Pipeline Metrics with ProgressBar */}
      <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Pipeline Progression</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Prospect Progress: {Math.round(pipelineMetrics.prospectRate)}%
            </label>
            <ProgressBar variant="info" value={pipelineMetrics.prospectRate} animated />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Deal Progress: {Math.round(pipelineMetrics.dealRate)}%
            </label>
            <ProgressBar variant="warning" value={pipelineMetrics.dealRate} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Conversion Rate: {Math.round(pipelineMetrics.conversionRate)}%
            </label>
            <ProgressBar variant="success" value={pipelineMetrics.conversionRate} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Task Completion: {Math.round(pipelineMetrics.completionRate)}%
            </label>
            <ProgressBar variant="primary" value={pipelineMetrics.completionRate} striped animated />
          </div>
        </div>
      </div>

      {/* Tab Navigation with Badges */}
      <div className="clara-tabs-nav" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0 1rem', marginBottom: '1rem' }}>
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-nav-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.description}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {tab.label}
            <Badge variant="secondary" size="small">
              {tabCounts[tab.id as keyof typeof tabCounts] || 0}
            </Badge>
          </button>
        ))}
      </div>

      {/* Tab Content with Suspense */}
      <div className="clara-tabs-content">
        <Suspense fallback={<SuspenseLoader />}>
          {ActiveTabComponent && <ActiveTabComponent />}
        </Suspense>
      </div>
    </div>
  );
}
