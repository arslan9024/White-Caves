import React from 'react';
import { Settings, Save as SaveIcon, Bell, Lock, Zap, AlertCircle } from 'lucide-react';

interface NinaSettingsData {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

interface NinaSettingsTabProps {
  data: NinaSettingsData;
}

export const NinaSettingsTab: React.FC<NinaSettingsTabProps> = ({ data }) => {
  const { showSettings, setShowSettings } = data;

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h3>Settings</h3>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h4>Bot Behavior</h4>
          <div className="setting-item">
            <div className="setting-label">
              <Zap size={18} />
              <span>Auto-reply enabled</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle auto-reply" />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
          <div className="setting-item">
            <label htmlFor="nina-response-delay">Message response delay (ms)</label>
            <input id="nina-response-delay" type="number" defaultValue="2000" min="1000" max="10000" step="500" aria-label="Message response delay in milliseconds" />
          </div>
        </div>

        <div className="settings-section">
          <h4>Notifications & Alerts</h4>
          <div className="setting-item">
            <div className="setting-label">
              <Bell size={18} />
              <span>Connection alerts</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle connection alerts" />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <AlertCircle size={18} />
              <span>Error notifications</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle error notifications" />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h4>Security</h4>
          <div className="setting-item">
            <div className="setting-label">
              <Lock size={18} />
              <span>Message encryption</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle message encryption" />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
          <div className="setting-item">
            <label htmlFor="nina-session-timeout">Session timeout (minutes)</label>
            <input id="nina-session-timeout" type="number" defaultValue="30" min="5" max="120" aria-label="Session timeout in minutes" />
          </div>
        </div>

        <div className="settings-section">
          <h4>Data Management</h4>
          <div className="setting-item">
            <label>Clear chat history older than (days)</label>
            <input type="number" defaultValue="90" min="1" max="365" />
          </div>
          <button className="action-btn danger">Clear Cache</button>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="save-btn"
          onClick={() => {
            // TODO: POST settings to /api/whatsapp/nina/settings
            alert('Nina settings saved (API integration pending)');
          }}
        >
          <SaveIcon size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
};
