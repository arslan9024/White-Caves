import React, { useState } from 'react';
import { Bot, RefreshCw, Download, Zap } from 'lucide-react';
import { useWhatsAppData } from './hooks/useWhatsAppData';
import { ConversationsTab } from './tabs/ConversationsTab';
import { QuickRepliesTab } from './tabs/QuickRepliesTab';
import { AgentAssignmentTab } from './tabs/AgentAssignmentTab';
import { InsightsTab } from './tabs/InsightsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import AssistantLifecycleTab from '../shared/AssistantLifecycleTab';
import './NadiaWhatsAppCRM.css';

const NadiaWhatsAppCRM = () => {
  const [activeTab, setActiveTab] = useState('conversations');
  const [convertingLeadId, setConvertingLeadId] = useState<string | null>(null);
  const data = useWhatsAppData();

  const handleConvertToLead = async (conversationId: string) => {
    setConvertingLeadId(conversationId);
    try {
      const res = await fetch(`/api/nadia/conversations/${conversationId}/convert-to-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        console.error('Convert to lead failed:', json.message ?? res.statusText);
      }
    } catch (err) {
      console.error('Convert to lead error:', err);
    } finally {
      setConvertingLeadId(null);
    }
  };

  const tabs = [
    { id: 'conversations', label: 'Conversations', icon: '💬' },
    { id: 'quick-replies', label: 'Quick Replies', icon: '⚡' },
    { id: 'agents', label: 'Agent Assignment', icon: '👤' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'lifecycle', label: 'Lifecycle', icon: '🔄' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'conversations':
        return (
          <ConversationsTab
            data={{ ...data, onConvertToLead: handleConvertToLead, convertingLeadId }}
          />
        );
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
      case 'lifecycle':
        return <AssistantLifecycleTab assistantId="nadia" color="#25D366" assistantName="Nadia" />;
      default:
        return <ConversationsTab data={data} />;
    }
  };

  return (
    <div className="nadia-crm-container">
      {/* Header */}
      <div className="nadia-header">
        <div className="nadia-info">
          <div className="nadia-avatar">
            <Bot size={24} />
          </div>
          <div className="nadia-details">
            <h2>Nadia - WhatsApp Assistant</h2>
            <span className={`nadia-status ${data.nadiaActive ? 'active' : 'inactive'}`}>
              {data.nadiaActive ? 'AI Active' : 'AI Paused'}
            </span>
          </div>
        </div>
        <div className="nadia-actions">
          <button
            className={`nadia-toggle ${data.nadiaActive ? 'active' : ''}`}
            onClick={() => data.setNadiaActive(!data.nadiaActive)}
          >
            {data.nadiaActive ? 'Pause Nadia' : 'Activate Nadia'}
          </button>
          <button className="nadia-action-btn" aria-label="Refresh conversations">
            <RefreshCw size={18} />
          </button>
          <button className="nadia-action-btn" aria-label="Download chat export">
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

export default NadiaWhatsAppCRM;
