import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './WhatsAppSettingsPage.css';

interface WhatsAppSettings {
  businessName: string;
  businessPhone: string;
  businessDescription: string;
  profileImage: string;
  webhookUrl: string;
  apiToken: string;
}

interface WhatsAppSettingsPageProps {}

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WhatsAppSettingsPage: FC<WhatsAppSettingsPageProps> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.currentUser);
  const [settings, setSettings] = useState<WhatsAppSettings>({
    businessName: '',
    businessPhone: '',
    businessDescription: '',
    profileImage: '',
    webhookUrl: '',
    apiToken: ''
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('basic');

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async (): Promise<void> => {
    try {
      const response = await fetch('/api/whatsapp/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async (): Promise<void> => {
    try {
      setSaving(true);
      const response = await fetch('/api/whatsapp/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setSavedMessage('Settings saved successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSavedMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="whatsapp-settings-page no-sidebar">
      <div className="settings-container full-width">
        <header className="settings-header">
          <h1>WhatsApp Settings</h1>
          <p>Configure your WhatsApp business account</p>
        </header>

        {savedMessage && (
          <div className={`message ${savedMessage.includes('Error') ? 'error' : 'success'}`}>
            {savedMessage}
          </div>
        )}

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            className={`settings-tab ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            API Settings
          </button>
          <button
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {activeTab === 'basic' && (
          <div className="settings-section">
            <h3>Business Information</h3>
            <form className="settings-form">
              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  id="businessName"
                  type="text"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleChange}
                  placeholder="White Caves Real Estate LLC"
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessPhone">Business Phone</label>
                <input
                  id="businessPhone"
                  type="tel"
                  name="businessPhone"
                  value={settings.businessPhone}
                  onChange={handleChange}
                  placeholder="+971 56 361 6136"
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessDescription">Business Description</label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={settings.businessDescription}
                  onChange={handleChange}
                  placeholder="Describe your business..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profileImage">Profile Image URL</label>
                <input
                  id="profileImage"
                  type="url"
                  name="profileImage"
                  value={settings.profileImage}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="btn-save"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="settings-section">
            <h3>API Configuration</h3>
            <form className="settings-form">
              <div className="form-group">
                <label htmlFor="webhookUrl">Webhook URL</label>
                <input
                  id="webhookUrl"
                  type="url"
                  name="webhookUrl"
                  value={settings.webhookUrl}
                  onChange={handleChange}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>

              <div className="form-group">
                <label htmlFor="apiToken">API Token</label>
                <input
                  id="apiToken"
                  type="password"
                  name="apiToken"
                  value={settings.apiToken}
                  onChange={handleChange}
                  placeholder="Your API token"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="btn-save"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h3>Security Settings</h3>
            <div className="security-options">
              <div className="security-option">
                <label>
                  <input type="checkbox" defaultChecked /> Enable message encryption
                </label>
              </div>
              <div className="security-option">
                <label>
                  <input type="checkbox" defaultChecked /> Require two-factor authentication
                </label>
              </div>
              <div className="security-option">
                <label>
                  <input type="checkbox" /> Log all API requests
                </label>
              </div>
              <button className="btn-save">Update Security Settings</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppSettingsPage;
