import React, { useState } from 'react';
import { useCTOData } from '../hooks/useCTOData';
import OverviewTab from './OverviewTab';
import AssistantsTab from './AssistantsTab';
import ArchitectureTab from './ArchitectureTab';
import ApplicationsTab from './ApplicationsTab';
import APIPerformanceTab from './APIPerformanceTab';
import '../AuroraCTODashboard.css';

const AuroraCTODashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    stats,
    assistants,
    departments,
    selectedAssistant,
    onSelectAssistant,
    modules,
    techStack,
    systemComponents,
    systemStatus,
    features
  } = useCTOData();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'assistants', label: 'Assistants', icon: '🤖' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'applications', label: 'Applications', icon: '🚀' },
    { id: 'api-performance', label: 'API Performance', icon: '⚡' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} systemStatus={systemStatus} />;
      case 'assistants':
        return <AssistantsTab assistants={assistants as any} departments={Object.keys(departments)} selectedAssistant={selectedAssistant as any} onSelectAssistant={onSelectAssistant as any} />;
      case 'architecture':
        return <ArchitectureTab modules={modules} techStack={techStack as any} systemComponents={systemComponents as any} />;
      case 'applications':
        return <ApplicationsTab systemComponents={systemComponents as any} />;
      case 'api-performance':
        return <APIPerformanceTab systemComponents={systemComponents as any} />;
      default:
        return <OverviewTab stats={stats} systemStatus={systemStatus} />;
    }
  };

  return (
    <div className="crm-container aurora-cto">
      <div className="crm-header">
        <div className="header-title">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #DDD6FE 100%)' }}>
            <span>🏛️</span>
          </div>
          <div>
            <h2>Aurora - CTO & Systems Architect</h2>
            <p>System monitoring, technical documentation, architecture planning, and deployment pipeline</p>
          </div>
        </div>
        <div className="quick-stats-header">
          <div className="stat-mini">
            <span className="stat-value">{stats.totalAssistants}</span>
            <span className="stat-label">Assistants</span>
          </div>
          <div className="stat-mini">
            <span className="stat-value">{stats.totalModules}</span>
            <span className="stat-label">Modules</span>
          </div>
          <div className="stat-mini">
            <span className="stat-value">{stats.systemHealth.toFixed(0)}%</span>
            <span className="stat-label">Health</span>
          </div>
        </div>
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
          {features.map((feature) => (
            <li key={feature} className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuroraCTODashboard;
