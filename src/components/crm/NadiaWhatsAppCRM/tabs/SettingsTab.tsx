import React from 'react';
import { Settings, ToggleRight, Save, Bell, Lock, Zap } from 'lucide-react';

interface NadiaSettingsTabProps {
  data: {
    nadiaActive: boolean;
    setNadiaActive: (active: boolean) => void;
  };
}

export const SettingsTab: React.FC<NadiaSettingsTabProps> = ({ data }) => {
  const { nadiaActive, setNadiaActive } = data;

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h3>Settings</h3>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h4>Nadia AI Preferences</h4>
          <div className="setting-item">
            <div className="setting-label">
              <Zap size={18} />
              <span>AI Active</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={nadiaActive}
                onChange={(e) => setNadiaActive(e.target.checked)}
                aria-label="Toggle AI Active"
              />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <Bell size={18} />
              <span>Notifications</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle notifications" />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h4>Security</h4>
          <div className="setting-item">
            <div className="setting-label">
              <Lock size={18} />
              <span>Conversation Encryption</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle conversation encryption" />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h4>Message Settings</h4>
          <div className="setting-item">
            <label htmlFor="nadia-response-delay">Default Response Delay (seconds)</label>
            <input id="nadia-response-delay" type="number" defaultValue="2" min="0" max="60" aria-label="Default response delay in seconds" />
          </div>
          <div className="setting-item">
            <label>Auto-send AI responses</label>
            <label className="toggle">
              <input type="checkbox" defaultChecked aria-label="Toggle auto-send AI responses" />
              <span className="toggle-slider" aria-hidden="true"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button
          className="save-btn"
          disabled
          title="API integration coming soon"
          onClick={() => {
            // TODO: POST settings to /api/whatsapp/nadia/settings
          }}
        >
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
};
