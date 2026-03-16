import React, { FC, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './WhatsAppSettingsPage.css';
import type { RootState, AppDispatch } from '../../store';
import {
  connectWhatsApp,
  disconnectWhatsApp,
  sendWhatsAppMessage,
  fetchWhatsAppHistory
} from '../../store/slices/whatsappSlice';

interface WhatsAppSettings {
  businessName: string;
  businessPhone: string;
  businessDescription: string;
  profileImage: string;
  webhookUrl: string;
  apiToken: string;
}

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WhatsAppSettingsPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: any) => state.user.currentUser);
  const whatsappState = useSelector((state: RootState) => state.whatsapp);
  
  // Local component state
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
  const [activeTab, setActiveTab] = useState<string>('status');
  
  // Message testing state
  const [testPhone, setTestPhone] = useState<string>('');
  const [testMessage, setTestMessage] = useState<string>('');
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  
  // WebSocket state
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Authorization check
  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch initial settings
  useEffect(() => {
    fetchSettings();
  }, []);

  // Setup WebSocket for real-time status updates
  useEffect(() => {
    setupWebSocket();

    return () => {
      cleanupWebSocket();
    };
  }, [whatsappState.session?.sessionId]);

  // Status polling fallback
  useEffect(() => {
    if (whatsappState.session?.connectionStatus === 'connecting' || 
        whatsappState.session?.connectionStatus === 'qr_pending') {
      const pollInterval = setInterval(() => {
        pollConnectionStatus();
      }, 3000);

      return () => clearInterval(pollInterval);
    }
  }, [whatsappState.session?.connectionStatus]);

  // ================================
  // WebSocket & Polling Methods
  // ================================

  const setupWebSocket = (): void => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/whatsapp/status`;
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('[WhatsApp] WebSocket connected');
      };

      wsRef.current.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[WhatsApp] Status update:', data);
          // Redux state can be updated here if needed
        } catch (error) {
          console.error('[WhatsApp] Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error: Event) => {
        console.error('[WhatsApp] WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        console.log('[WhatsApp] WebSocket disconnected');
        scheduleWebSocketReconnect();
      };
    } catch (error) {
      console.error('[WhatsApp] Failed to setup WebSocket:', error);
    }
  };

  const scheduleWebSocketReconnect = (): void => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setupWebSocket();
    }, 5000);
  };

  const cleanupWebSocket = (): void => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  };

  const pollConnectionStatus = async (): Promise<void> => {
    try {
      const response = await fetch('/api/whatsapp/session');
      
      if (response.ok) {
        const data = await response.json();
        console.log('[WhatsApp] Status poll:', data);
      }
    } catch (error) {
      console.error('[WhatsApp] Status poll failed:', error);
    }
  };

  // ================================
  // Settings API Methods
  // ================================

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
      } else {
        setSavedMessage('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSavedMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // Connection Management Methods
  // ================================

  const handleInitializeConnection = async (): Promise<void> => {
    try {
      const response = await fetch('/api/whatsapp/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: `session_${Date.now()}`,
          ownerEmail: OWNER_EMAIL 
        })
      });

      if (!response.ok) {
        setSavedMessage('Failed to initialize connection');
        return;
      }

      setSavedMessage('WhatsApp service initialized!');
      
      // Trigger Redux action to connect
      try {
        await dispatch(connectWhatsApp()).unwrap();
      } catch (dispatchError) {
        console.error('Redux dispatch error:', dispatchError);
      }
    } catch (error) {
      console.error('Error initializing connection:', error);
      setSavedMessage('Error initializing connection');
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    try {
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setSavedMessage('WhatsApp disconnected successfully');
        try {
          await dispatch(disconnectWhatsApp()).unwrap();
        } catch (dispatchError) {
          console.error('Redux dispatch error:', dispatchError);
        }
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      setSavedMessage('Error disconnecting');
    }
  };

  // ================================
  // Message Methods
  // ================================

  const handleSendTestMessage = async (): Promise<void> => {
    if (!testPhone || !testMessage) {
      setSavedMessage('Please enter phone and message');
      return;
    }

    try {
      setSendingTest(true);
      const response = await fetch('/api/whatsapp/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: testPhone,
          message: testMessage,
          priority: 'normal'
        })
      });

      if (response.ok) {
        setSavedMessage('Test message sent successfully!');
        setTestMessage('');
        setTimeout(() => setSavedMessage(''), 3000);
      } else {
        setSavedMessage('Failed to send test message');
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      setSavedMessage('Error sending test message');
    } finally {
      setSendingTest(false);
    }
  };

  // ================================
  // Render
  // ================================

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
                        <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
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
                      <div key={idx} className="queue-item">
                        <span className="queue-index">{idx + 1}.</span>
                        <span className="queue-phone">{msg.phoneNumber}</span>
                        <span className="queue-preview">{msg.body.substring(0, 50)}...</span>
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
