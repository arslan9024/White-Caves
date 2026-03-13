import React, { useState } from 'react';
import { Bot, RefreshCw, Download, Zap } from 'lucide-react';
import { useWhatsAppData } from './hooks/useWhatsAppData';
import { ConversationsTab } from './tabs/ConversationsTab';
import { QuickRepliesTab } from './tabs/QuickRepliesTab';
import { AgentAssignmentTab } from './tabs/AgentAssignmentTab';
import { InsightsTab } from './tabs/InsightsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import './LindaWhatsAppCRM.css';

const LindaWhatsAppCRM = () => {
  const [activeTab, setActiveTab] = useState('conversations');
  const data = useWhatsAppData();

  const tabs = [
    { id: 'conversations', label: 'Conversations', icon: '💬' },
    { id: 'quick-replies', label: 'Quick Replies', icon: '⚡' },
    { id: 'agents', label: 'Agent Assignment', icon: '👤' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'features', label: 'Features', icon: '✨' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'conversations':
        return <ConversationsTab data={data} />;
      case 'quick-replies':
        return <QuickRepliesTab data={data} />;
      case 'agents':
        return <AgentAssignmentTab data={data} />;
      case 'insights':
        return <InsightsTab data={data} />;
      case 'settings':
        return <SettingsTab data={data} />;
      case 'features':
        return <FeaturesTab data={data} />;
      default:
        return <ConversationsTab data={data} />;
    }
  };

  return (
    <div className="linda-crm-container">
      {/* Header */}
      <div className="linda-header">
        <div className="linda-info">
          <div className="linda-avatar">
            <Bot size={24} />
          </div>
          <div className="linda-details">
            <h2>Linda - WhatsApp Assistant</h2>
            <span className={`linda-status ${data.lindaActive ? 'active' : 'inactive'}`}>
              {data.lindaActive ? 'AI Active' : 'AI Paused'}
            </span>
          </div>
        </div>
        <div className="linda-actions">
          <button
            className={`linda-toggle ${data.lindaActive ? 'active' : ''}`}
            onClick={() => data.setLindaActive(!data.lindaActive)}
          >
            {data.lindaActive ? 'Pause Linda' : 'Activate Linda'}
          </button>
          <button className="linda-action-btn">
            <RefreshCw size={18} />
          </button>
          <button className="linda-action-btn">
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

export default LindaWhatsAppCRM;
