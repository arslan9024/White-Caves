import React from 'react';
import { Settings, Plug, BookOpen, Shield, Users, Database } from 'lucide-react';

const INTEGRATIONS = [
  { id: 'stripe', name: 'Stripe', status: 'connected', icon: '💳' },
  { id: 'google-drive', name: 'Google Drive', status: 'connected', icon: '📁' },
  { id: 'whatsapp', name: 'WhatsApp Business', status: 'connected', icon: '💬' },
  { id: 'firebase', name: 'Firebase Auth', status: 'connected', icon: '🔥' },
  { id: 'mongodb', name: 'MongoDB', status: 'connected', icon: '🍃' },
  { id: 'matterport', name: 'Matterport', status: 'pending', icon: '🏠' },
];

const SYSTEM_SETTINGS = [
  { id: 'general', name: 'General Settings', description: 'Company info, branding' },
  { id: 'security', name: 'Security', description: 'Access control, 2FA' },
  { id: 'notifications', name: 'Notifications', description: 'Email, SMS, push settings' },
  { id: 'workflows', name: 'Workflows', description: 'Automation rules' },
];

export default function AdminView({ activeSubItem, subItemConfig, assistantContext }) {
  const renderSystemSettings = () => (
    <div className="settings-view">
      <h2 className="view-title">System Settings</h2>
      <p className="view-subtitle">Platform configuration</p>
      
      <div className="settings-grid">
        {SYSTEM_SETTINGS.map(setting => (
          <div key={setting.id} className="setting-card">
            <Settings size={24} color="var(--crm-gold)" />
            <div className="setting-info">
              <h4>{setting.name}</h4>
              <p>{setting.description}</p>
            </div>
            <button className="action-btn">Configure</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="integrations-view">
      <h2 className="view-title">Integrations</h2>
      <p className="view-subtitle">Third-party service connections</p>
      
      <div className="integrations-grid">
        {INTEGRATIONS.map(integration => (
          <div key={integration.id} className="integration-card">
            <div className="integration-icon">{integration.icon}</div>
            <div className="integration-info">
              <h4>{integration.name}</h4>
              <span className={`integration-status ${integration.status}`}>
                {integration.status}
              </span>
            </div>
            <button className="action-btn">
              {integration.status === 'connected' ? 'Manage' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAPIDocs = () => (
    <div className="api-docs-view">
      <h2 className="view-title">API Documentation</h2>
      <p className="view-subtitle">Developer resources and API reference</p>
      
      <div className="api-sections">
        <div className="api-section">
          <BookOpen size={24} color="var(--crm-gold)" />
          <h4>REST API Reference</h4>
          <p>Complete API documentation for all endpoints</p>
          <button className="crm-btn crm-btn-secondary">View Docs</button>
        </div>
        <div className="api-section">
          <Database size={24} color="var(--crm-gold)" />
          <h4>Data Models</h4>
          <p>Schema documentation for all entities</p>
          <button className="crm-btn crm-btn-secondary">View Schema</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubItem) {
      case 'settings':
        return renderSystemSettings();
      case 'integrations':
        return renderIntegrations();
      case 'knowledge-base':
        return renderAPIDocs();
      case 'system-health':
        return renderSystemSettings();
      default:
        return renderSystemSettings();
    }
  };

  return (
    <div className="view-container admin-view">
      {renderContent()}
    </div>
  );
}
