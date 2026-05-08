import React, { useState } from 'react';
import { Bot, RefreshCw, Download } from 'lucide-react';
import { useBotData } from './hooks/useBotData';
import { BotsTab } from './tabs/BotsTab';
import { CodeModulesTab } from './tabs/CodeModulesTab';
import { SessionsTab } from './tabs/SessionsTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { NinaSettingsTab } from './tabs/SettingsTab';
import { NinaFeaturesTab } from './tabs/FeaturesTab';
import AssistantLifecycleTab from '../shared/AssistantLifecycleTab';
import './NinaWhatsAppBotCRM.css';

const NinaWhatsAppBotCRM = () => {
  const [activeTab, setActiveTab] = useState('bots');
  const data = useBotData();

  const tabs = [
    { id: 'bots', label: 'Bot Sessions', icon: '🤖' },
    { id: 'code', label: 'Code Modules', icon: '📝' },
    { id: 'sessions', label: 'QR & Connections', icon: '📲' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'lifecycle', label: 'Lifecycle', icon: '🔄' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'bots':
        return <BotsTab data={data as never} />;
      case 'code':
        return <CodeModulesTab data={data} />;
      case 'sessions':
        return <SessionsTab data={data as never} />;
      case 'analytics':
        return <AnalyticsTab data={data as never} />;
      case 'settings':
        return <NinaSettingsTab data={data} />;
      case 'features':
        return <NinaFeaturesTab data={data} />;
      case 'lifecycle':
        return <AssistantLifecycleTab assistantId="nina" color="#F59E0B" assistantName="Nina" />;
      default:
        return <BotsTab data={data as never} />;
    }
  };

  return (
    <div className="nina-crm-container">
      {/* Header */}
      <div className="nina-header">
        <div className="nina-info">
          <div className="nina-avatar">
            <Bot size={24} />
          </div>
          <div className="nina-details">
            <h2>Nina - WhatsApp Bot Manager</h2>
            <span className="nina-status">
              {data.getConnectedBotCount()} of {data.bots.length} bots connected
            </span>
          </div>
        </div>
        <div className="nina-actions">
          <button className="nina-action-btn" aria-label="Refresh bot status">
            <RefreshCw size={18} />
          </button>
          <button className="nina-action-btn" aria-label="Download bot data">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-buttons">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTab()}
      </div>
    </div>
  );
};

export default NinaWhatsAppBotCRM;
