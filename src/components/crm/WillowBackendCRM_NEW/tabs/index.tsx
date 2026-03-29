import React, { useState } from 'react';
import { useBackendData } from '../hooks/useBackendData';
import type { BackendFeature } from '../data/features';
import OverviewTab from './OverviewTab';
import APIsTab from './APIsTab';
import DatabaseTab from './DatabaseTab';
import CachingTab from './CachingTab';
import SecurityTab from './SecurityTab';
import RealtimeTab from './RealtimeTab';
import '../WillowBackendCRM.css';

const WillowBackendCRM = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    apiStats,
    apis,
    databaseMetrics,
    cacheStats,
    securityChecks,
    realtimeConnections,
    getSecurityStatus,
    getRealtimeStats,
    getCacheHealthPercentage,
    getDatabaseHealth,
    features
  } = useBackendData();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'apis', label: 'APIs', icon: '🔗' },
    { id: 'database', label: 'Database', icon: '🗄️' },
    { id: 'caching', label: 'Caching', icon: '⚡' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'realtime', label: 'Real-time', icon: '📡' }
  ];

  const renderContent = () => {
    const securityStatus = getSecurityStatus();
    const realtimeStats = getRealtimeStats();
    const dbHealth = getDatabaseHealth();
    const cacheHealth = parseFloat(getCacheHealthPercentage());

    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            apiStats={apiStats as any}
            dbHealth={dbHealth as any}
            cacheHealth={cacheHealth}
            securityStatus={securityStatus}
            realtimeStats={realtimeStats}
          />
        );
      case 'apis':
        return <APIsTab endpoints={apis} apiStats={apiStats as any} />;
      case 'database':
        return <DatabaseTab metrics={databaseMetrics as any} dbHealth={dbHealth as any} />;
      case 'caching':
        return <CachingTab cacheStats={cacheStats as any} cacheHealth={cacheHealth} />;
      case 'security':
        return <SecurityTab checks={securityChecks} securityStatus={securityStatus} />;
      case 'realtime':
        return <RealtimeTab connections={realtimeConnections} realtimeStats={realtimeStats} />;
      default:
        return <OverviewTab apiStats={apiStats as any} dbHealth={dbHealth as any} cacheHealth={cacheHealth} securityStatus={securityStatus} realtimeStats={realtimeStats} />;
    }
  };

  return (
    <div className="crm-container backend-crm">
      <div className="crm-header">
        <h2>Willow Backend Management System</h2>
        <p className="crm-description">Infrastructure monitoring and backend operations</p>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="crm-content">
        {renderContent()}
      </div>

      <div className="features-section">
        <h3>Available Features</h3>
        <ul className="features-list">
          {features.map((feature: BackendFeature) => (
            <li key={feature.id} className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WillowBackendCRM;
