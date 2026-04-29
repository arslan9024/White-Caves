import React, { FC } from 'react';
import { useWhatsAppSettings } from '../../hooks/useWhatsAppSettings';
import './WhatsAppSettingsPage.css';

const WhatsAppSettingsPage: FC = () => {
  const {
    whatsappState,
    settings,
    saving,
    savedMessage,
    activeTab,
    setActiveTab,
    handleChange,
    handleSaveSettings,
    handleInitializeConnection,
    handleDisconnect,
    testPhone,
    setTestPhone,
    testMessage,
    setTestMessage,
    sendingTest,
    handleSendTestMessage,
  } = useWhatsAppSettings();

  return (
    <div className="whatsapp-settings-page no-sidebar">
      <div className="settings-container full-width">
        <header className="settings-header">
          <h1>WhatsApp Business Integration</h1>
          <p>Manage your WhatsApp connection, settings, and messages</p>
        </header>

        {savedMessage && (
          <div className={`message ${savedMessage.includes('Error') || savedMessage.includes('Failed') ? 'error' : 'success'}`}>
            {savedMessage}
          </div>
        )}

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            📊 Status
          </button>
          <button
            className={`settings-tab ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            📱 QR Code
          </button>
          <button
            className={`settings-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            ✉️ Messages
          </button>
          <button
            className={`settings-tab ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('queue')}
          >
            📋 Queue
          </button>
          <button
            className={`settings-tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            ⚙️ Business Settings
          </button>
        </div>

        {/* STATUS TAB */}
        {activeTab === 'status' && (
          <div className="settings-section">
            <h3>Connection Status</h3>
            <div className="status-panel">
              <div className="status-item">
                <label>Connection Status:</label>
                <span className={`status-badge status-${whatsappState.session?.connectionStatus || 'disconnected'}`}>
                  {whatsappState.session?.connectionStatus || 'Disconnected'}
                </span>
              </div>
              
              {whatsappState.session?.phoneNumber && (
                <div className="status-item">
                  <label>Phone Number:</label>
                  <span>{whatsappState.session.phoneNumber}</span>
                </div>
              )}

              {whatsappState.session?.businessName && (
                <div className="status-item">
                  <label>Business Name:</label>
                  <span>{whatsappState.session.businessName}</span>
                </div>
              )}

              {whatsappState.session?.connectedAt && (
                <div className="status-item">
                  <label>Connected Since:</label>
                  <span>{new Date(whatsappState.session.connectedAt).toLocaleString()}</span>
                </div>
              )}

              <div className="status-item">
                <label>Messages Processed:</label>
                <span>{whatsappState.session?.messageCount || 0}</span>
              </div>

              <div className="status-item">
                <label>Queue Size:</label>
                <span>{whatsappState.queue.size} / {whatsappState.queue.maxSize}</span>
              </div>

              {whatsappState.error && (
                <div className="status-item error">
                  <label>Error:</label>
                  <span>{whatsappState.error}</span>
                </div>
              )}

              {whatsappState.success && (
                <div className="status-item success">
                  <label>Success:</label>
                  <span>{whatsappState.success}</span>
                </div>
              )}
            </div>

            <div className="action-buttons">
              {whatsappState.session?.connectionStatus === 'disconnected' || !whatsappState.session ? (
                <button 
                  onClick={handleInitializeConnection}
                  disabled={whatsappState.loading.connecting}
                  className="btn-primary"
                >
                  {whatsappState.loading.connecting ? 'Initializing...' : 'Initialize Connection'}
                </button>
              ) : (
                <button 
                  onClick={handleDisconnect}
                  disabled={whatsappState.loading.disconnecting}
                  className="btn-danger"
                >
                  {whatsappState.loading.disconnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* QR CODE TAB */}
        {activeTab === 'qr' && (
          <div className="settings-section">
            <h3>QR Code Scanner</h3>
            <div className="qr-panel">
              {whatsappState.qrCode ? (
                <div className="qr-container">
                  <img 
                    src={whatsappState.qrCode} 
                    alt="WhatsApp QR Code"
                    className="qr-code-image"
                    loading="lazy"
                    width={200}
                    height={200}
                  />
                  <p className="qr-instructions">
                    1. Open WhatsApp on your phone<br/>
                    2. Go to Settings → Linked Devices<br/>
                    3. Scan this QR code with your phone
                  </p>
                </div>
              ) : (
                <div className="qr-placeholder">
                  <p>No QR code available yet.</p>
                  <p className="muted">Initialize the connection to generate QR code.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="settings-section">
            <h3>Test Message</h3>
            <div className="test-message-form">
              <div className="form-group">
                <label htmlFor="testPhone">Recipient Phone (with country code)</label>
                <input
                  id="testPhone"
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+971561234567"
                  pattern="\+?[0-9]{7,15}"
                  maxLength={16}
                  required
                  disabled={!whatsappState.session?.connectionStatus.includes('authenticated')}
                />
                <small>Include country code (e.g., +971 for UAE)</small>
              </div>

              <div className="form-group">
                <label htmlFor="testMessage">Message</label>
                <textarea
                  id="testMessage"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Type your test message here..."
                  rows={4}
                  maxLength={4096}
                  required
                  disabled={!whatsappState.session?.connectionStatus.includes('authenticated')}
                />
              </div>

              <button
                onClick={handleSendTestMessage}
                disabled={sendingTest || !whatsappState.session?.connectionStatus.includes('authenticated')}
                className="btn-primary"
              >
                {sendingTest ? 'Sending...' : 'Send Test Message'}
              </button>

              {!whatsappState.session?.connectionStatus.includes('authenticated') && (
                <p className="info-text">⚠️ Connect WhatsApp first to send messages</p>
              )}
            </div>

            {whatsappState.messages.length > 0 && (
              <div className="messages-history">
                <h4>Recent Messages</h4>
                <div className="messages-list">
                  {whatsappState.messages.slice(-10).map((msg) => (
                    <div key={msg.id} className={`message-item message-${msg.direction}`}>
                      <div className="message-header">
                        <span className="message-phone">{msg.phoneNumber}</span>
                        <span className="message-time">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
                      </div>
                      <div className="message-body">{msg.body}</div>
                      <span className={`message-status status-${msg.status}`}>{msg.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUEUE TAB */}
        {activeTab === 'queue' && (
          <div className="settings-section">
            <h3>Message Queue</h3>
            <div className="queue-panel">
              <div className="queue-stats">
                <div className="queue-stat">
                  <label>Queued Messages:</label>
                  <span className="queue-number">{whatsappState.queue.size}</span>
                </div>
                <div className="queue-stat">
                  <label>Queue Capacity:</label>
                  <span className="queue-number">{whatsappState.queue.maxSize}</span>
                </div>
                <div className="queue-stat">
                  <label>Processing:</label>
                  <span className="queue-number">{whatsappState.queue.processing}</span>
                </div>
                <div className="queue-stat">
                  <label>Progress:</label>
                  <div className="queue-progress">
                    <div 
                      className="queue-progress-bar"
                      style={{ 
                        width: `${(whatsappState.queue.size / whatsappState.queue.maxSize) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>

              {whatsappState.queue.messages.length > 0 ? (
                <div className="queue-messages">
                  <h4>Pending Messages</h4>
                  <div className="queue-list">
                    {whatsappState.queue.messages.map((msg, idx) => (
                      <div key={msg.id ?? `${msg.phoneNumber}-${idx}`} className="queue-item">
                        <span className="queue-index">{idx + 1}.</span>
                        <span className="queue-phone">{msg.phoneNumber}</span>
                        <span className="queue-preview">{(msg.body || '').substring(0, 50)}...</span>
                        <span className={`queue-priority priority-${msg.priority || 'normal'}`}>
                          {msg.priority || 'normal'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="info-text">No messages in queue</p>
              )}
            </div>
          </div>
        )}

        {/* BUSINESS SETTINGS TAB */}
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
                  required
                  maxLength={100}
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
                  pattern="\+?[0-9\s\-]{7,20}"
                  maxLength={20}
                  required
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
                  maxLength={500}
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
                  maxLength={500}
                />
              </div>

              <div className="form-group">
                <label htmlFor="webhookUrl">Webhook URL</label>
                <input
                  id="webhookUrl"
                  type="url"
                  name="webhookUrl"
                  value={settings.webhookUrl}
                  onChange={handleChange}
                  placeholder="https://your-domain.com/webhook"
                  maxLength={500}
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
                  maxLength={256}
                  autoComplete="off"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="btn-save"
              >
                {saving ? 'Saving...' : 'Save Business Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppSettingsPage;
