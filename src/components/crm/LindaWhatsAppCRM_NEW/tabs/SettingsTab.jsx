import React from 'react';
import { Settings, ToggleRight, Save, Bell, Lock, Zap } from 'lucide-react';

export const SettingsTab = ({ data }) => {
  const { lindaActive, setLindaActive } = data;

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <h3>Settings</h3>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h4>Linda AI Preferences</h4>
          <div className="setting-item">
            <div className="setting-label">
              <Zap size={18} />
              <span>AI Active</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={lindaActive}
                onChange={(e) => setLindaActive(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <Bell size={18} />
              <span>Notifications</span>
            </div>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
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
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h4>Message Settings</h4>
          <div className="setting-item">
            <label>Default Response Delay (seconds)</label>
            <input type="number" defaultValue="2" min="0" max="60" />
          </div>
          <div className="setting-item">
            <label>Auto-send AI responses</label>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-btn">
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
};
