import React from 'react';
import { Settings, Plug, BookOpen, Shield, Users, Database, Activity } from 'lucide-react';
import AuroraDocumentIndex from '../AuroraDocumentIndex';

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

  const renderKnowledgeBase = () => (
    <div className="knowledge-base-view">
      <h2 className="view-title">Knowledge Base</h2>
      <p className="view-subtitle">Technical documentation, company policies, and operational guides</p>
      <AuroraDocumentIndex showCompanyDocs={true} />
    </div>
  );

  const renderSystemHealth = () => (
    <div className="system-health-view">
      <h2 className="view-title">System Health</h2>
      <p className="view-subtitle">Platform monitoring and status</p>
      
      <div className="health-grid">
        <div className="health-card healthy">
          <Activity size={24} />
          <div className="health-info">
            <h4>API Server</h4>
            <span className="health-status">Operational</span>
            <p>Response time: 85ms</p>
          </div>
        </div>
        <div className="health-card healthy">
          <Database size={24} />
          <div className="health-info">
            <h4>Database</h4>
            <span className="health-status">Operational</span>
            <p>MongoDB Atlas M10</p>
          </div>
        </div>
        <div className="health-card healthy">
          <Shield size={24} />
          <div className="health-info">
            <h4>Authentication</h4>
            <span className="health-status">Operational</span>
            <p>Firebase Auth</p>
          </div>
        </div>
        <div className="health-card healthy">
          <Plug size={24} />
          <div className="health-info">
            <h4>Integrations</h4>
            <span className="health-status">5/6 Connected</span>
            <p>Stripe, Drive, WhatsApp</p>
          </div>
        </div>
      </div>
      
      <div className="uptime-section">
        <h3>Uptime: 99.97%</h3>
        <p>Last 30 days - No major incidents</p>
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
        return renderKnowledgeBase();
      case 'system-health':
        return renderSystemHealth();
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
