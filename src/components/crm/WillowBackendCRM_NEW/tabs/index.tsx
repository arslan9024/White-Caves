import React, { useState } from 'react';
import { useBackendData } from '../hooks/useBackendData';
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
    dbHealth,
    cacheHealth,
    securityStatus,
    realtimeStats,
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
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            apiStats={apiStats}
            dbHealth={dbHealth}
            cacheHealth={cacheHealth}
            securityStatus={securityStatus}
            realtimeStats={realtimeStats}
          />
        );
      case 'apis':
        return <APIsTab apiStats={apiStats} />;
      case 'database':
        return <DatabaseTab dbHealth={dbHealth} />;
      case 'caching':
        return <CachingTab cacheHealth={cacheHealth} />;
      case 'security':
        return <SecurityTab securityStatus={securityStatus} />;
      case 'realtime':
        return <RealtimeTab realtimeStats={realtimeStats} />;
      default:
        return <OverviewTab apiStats={apiStats} dbHealth={dbHealth} cacheHealth={cacheHealth} securityStatus={securityStatus} realtimeStats={realtimeStats} />;
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
          {features.map((feature, index) => (
            <li key={index} className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WillowBackendCRM;
