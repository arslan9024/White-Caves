import React, { useState } from 'react';
import { useFrontendData } from '../hooks/useFrontendData';
import OverviewTab from './OverviewTab';
import ComponentsTab from './ComponentsTab';
import DesignSystemTab from './DesignSystemTab';
import PerformanceTab from './PerformanceTab';
import AccessibilityTab from './AccessibilityTab';
import '../HazelFrontendCRM.css';

const HazelFrontendCRM = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    componentStats,
    accessibilityStats,
    components,
    designTokens,
    performanceMetrics,
    accessibilityAudit,
    themeMode,
    setThemeMode,
    features
  } = useFrontendData();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'components', label: 'Components', icon: '📦' },
    { id: 'design-system', label: 'Design System', icon: '🎨' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab componentStats={componentStats} accessibilityStats={accessibilityStats} performanceMetrics={performanceMetrics as any} />;
      case 'components':
        return <ComponentsTab components={components} />;
      case 'design-system':
        return <DesignSystemTab designTokens={designTokens} themeMode={themeMode} onThemeChange={setThemeMode} />;
      case 'performance':
        return <PerformanceTab metrics={performanceMetrics as any} />;
      case 'accessibility':
        return <AccessibilityTab audit={accessibilityAudit} />;
      default:
        return <OverviewTab componentStats={componentStats} accessibilityStats={accessibilityStats} performanceMetrics={performanceMetrics as any} />;
    }
  };

  return (
    <div className="crm-container frontend-crm">
      <div className="crm-header">
        <div className="header-title">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)' }}>
            <span>🎨</span>
          </div>
          <div>
            <h2>Hazel - Elite Frontend Engineer</h2>
            <p>Design system, component library, and UI performance optimization</p>
          </div>
        </div>
        <div className="quick-stats-header">
          <div className="stat-mini">
            <span className="stat-value">{componentStats.total}</span>
            <span className="stat-label">Components</span>
          </div>
          <div className="stat-mini">
            <span className="stat-value">{accessibilityStats.avgScore}%</span>
            <span className="stat-label">A11y</span>
          </div>
          <div className="stat-mini">
            <span className="stat-value">94</span>
            <span className="stat-label">Lighthouse</span>
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

export default HazelFrontendCRM;
