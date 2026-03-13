import React, { useState } from 'react';
import './TabStyles.css';

const SettingsTab = ({ data, onAction, onSave }) => {
  const [settings, setSettings] = useState({
    companyName: 'White Caves Real Estate LLC',
    companyEmail: 'info@whitecaves.ae',
    companyPhone: '+971 56 361 6136',
    address: 'Office D-72, El-Shaye-4, Port Saeed, Dubai',
    reraNumber: 'RERA-12345',
    dldLicense: 'Active',
    established: '2009',
    whatsappEnabled: true,
    chatbotEnabled: true,
    uaepassEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    leadAutoAssign: true,
    darkMode: false
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const integrations = [
    { id: 'firebase', name: 'Firebase Auth', status: 'connected', icon: '🔥' },
    { id: 'mongodb', name: 'MongoDB', status: 'connected', icon: '🍃' },
    { id: 'stripe', name: 'Stripe Payments', status: 'connected', icon: '💳' },
    { id: 'google', name: 'Google APIs', status: 'connected', icon: '🔍' },
    { id: 'whatsapp', name: 'WhatsApp Business', status: 'connected', icon: '💬' },
    { id: 'uaepass', name: 'UAE Pass', status: 'pending', icon: '🆔' },
  ];

  const systemHealth = [
    { name: 'API Server', status: 'healthy', uptime: '99.9%' },
    { name: 'Database', status: 'healthy', uptime: '99.8%' },
    { name: 'File Storage', status: 'healthy', uptime: '100%' },
    { name: 'Email Service', status: 'healthy', uptime: '99.5%' },
  ];

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h3>System Settings</h3>
        <button className="primary-btn" onClick={() => onSave?.(settings)}>
          <span>💾</span> Save Changes
        </button>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h4>Company Information</h4>
          <div className="settings-form">
            <div className="form-group">
              <label>Company Name</label>
              <input 
                type="text" 
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={settings.companyEmail}
                onChange={(e) => handleChange('companyEmail', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                value={settings.companyPhone}
                onChange={(e) => handleChange('companyPhone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea 
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>RERA Number</label>
                <input 
                  type="text" 
                  value={settings.reraNumber}
                  onChange={(e) => handleChange('reraNumber', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Established</label>
                <input 
                  type="text" 
                  value={settings.established}
                  onChange={(e) => handleChange('established', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h4>Feature Toggles</h4>
          <div className="toggles-list">
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-icon">💬</span>
                <div>
                  <span className="toggle-label">WhatsApp Integration</span>
                  <small>Enable WhatsApp Business messaging</small>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.whatsappEnabled}
                  onChange={(e) => handleChange('whatsappEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-icon">🤖</span>
                <div>
                  <span className="toggle-label">AI Chatbot</span>
                  <small>Enable automated chatbot responses</small>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.chatbotEnabled}
                  onChange={(e) => handleChange('chatbotEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-icon">🆔</span>
                <div>
                  <span className="toggle-label">UAE Pass Login</span>
                  <small>Enable UAE Pass authentication</small>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.uaepassEnabled}
                  onChange={(e) => handleChange('uaepassEnabled', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div className="toggle-info">
                <span className="toggle-icon">🎯</span>
                <div>
                  <span className="toggle-label">Auto Lead Assignment</span>
                  <small>Automatically assign leads to agents</small>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.leadAutoAssign}
                  onChange={(e) => handleChange('leadAutoAssign', e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h4>Integrations Status</h4>
          <div className="integrations-list">
            {integrations.map((int) => (
              <div key={int.id} className={`integration-item ${int.status}`}>
                <div className="integration-info">
                  <span className="integration-icon">{int.icon}</span>
                  <span className="integration-name">{int.name}</span>
                </div>
                <span className={`integration-status ${int.status}`}>
                  {int.status === 'connected' ? '● Connected' : '○ Pending'}
                </span>
                <button className="icon-btn" onClick={() => onAction?.('configureIntegration', int.id)}>⚙️</button>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-card">
          <h4>System Health</h4>
          <div className="health-list">
            {systemHealth.map((service, index) => (
              <div key={index} className="health-item">
                <div className="health-info">
                  <span className={`health-indicator ${service.status}`}></span>
                  <span className="health-name">{service.name}</span>
                </div>
                <div className="health-details">
                  <span className="health-status">{service.status}</span>
                  <span className="health-uptime">{service.uptime}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="secondary-btn full-width" onClick={() => onAction?.('viewSystemHealth')}>
            <span>🩺</span> View Detailed Health
          </button>
        </div>
      </div>

      <div className="settings-card full-width danger-zone">
        <h4>⚠️ Danger Zone</h4>
        <p>These actions are irreversible. Please proceed with caution.</p>
        <div className="danger-actions">
          <button className="danger-btn" onClick={() => onAction?.('clearCache')}>
            <span>🗑️</span> Clear Cache
          </button>
          <button className="danger-btn" onClick={() => onAction?.('resetAnalytics')}>
            <span>📊</span> Reset Analytics
          </button>
          <button className="danger-btn" onClick={() => onAction?.('exportData')}>
            <span>📥</span> Export All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
