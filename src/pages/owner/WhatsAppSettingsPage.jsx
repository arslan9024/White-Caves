import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import RoleNavigation from '../../components/RoleNavigation';
import { 
  Settings, QrCode, Smartphone, Link2, Unlink, RefreshCw, 
  MessageCircle, Bot, Clock, Send, CheckCircle, AlertCircle,
  Wifi, WifiOff, Save, Plus, Trash2, ToggleLeft, ToggleRight,
  TestTube2, Loader2, Sparkles, Globe, Target, TrendingUp
} from 'lucide-react';
import './WhatsAppSettingsPage.css';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const getAuthHeaders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return { 'Content-Type': 'application/json' };
};

const WhatsAppSettingsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector(state => state.user.currentUser);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrExpiry, setQrExpiry] = useState(null);
  const [connectionMethod, setConnectionMethod] = useState('qr');
  const [notification, setNotification] = useState(null);
  
  const [settings, setSettings] = useState({
    autoReplyEnabled: true,
    chatbotEnabled: true,
    businessHoursOnly: false,
    businessHours: { start: '09:00', end: '22:00', timezone: 'Asia/Dubai' },
    welcomeMessage: 'Welcome to White Caves Real Estate! How can we assist you today with your property needs in Dubai?',
    awayMessage: 'Thank you for contacting White Caves Real Estate. We are currently away and will respond as soon as possible.',
    quickReplies: []
  });
  
  const [newQuickReply, setNewQuickReply] = useState({ trigger: '', response: '' });
  
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testHistory, setTestHistory] = useState([]);

  const fetchSession = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/whatsapp/session', { headers });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data);
        setSettings({
          autoReplyEnabled: data.autoReplyEnabled ?? true,
          chatbotEnabled: data.chatbotEnabled ?? true,
          businessHoursOnly: data.businessHoursOnly ?? false,
          businessHours: data.businessHours || { start: '09:00', end: '22:00', timezone: 'Asia/Dubai' },
          welcomeMessage: data.welcomeMessage || settings.welcomeMessage,
          awayMessage: data.awayMessage || settings.awayMessage,
          quickReplies: data.quickReplies || []
        });
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
      return;
    }
    
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success === 'connected') {
      setNotification({ type: 'success', message: 'WhatsApp connected successfully!' });
    } else if (error) {
      setNotification({ type: 'error', message: `Connection failed: ${error}` });
    }
    
    fetchSession();
  }, [user, navigate, searchParams, fetchSession]);

  const handleConnect = async (method) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers,
        body: JSON.stringify({ connectionMethod: method })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (method === 'qr') {
          setQrCode(data.qrCode);
          setQrExpiry(new Date(data.qrExpiry));
          setSession(prev => ({ ...prev, connectionStatus: 'qr_pending' }));
        } else if (method === 'meta' && data.authUrl) {
          window.location.href = data.authUrl;
        }
      } else {
        setNotification({ type: 'error', message: data.error || 'Connection failed' });
      }
    } catch (error) {
      console.error('Connection error:', error);
      setNotification({ type: 'error', message: 'Failed to initiate connection' });
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect WhatsApp?')) return;
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
        headers
      });
      
      if (response.ok) {
        setSession(prev => ({ ...prev, connectionStatus: 'disconnected' }));
        setQrCode(null);
        setNotification({ type: 'success', message: 'WhatsApp disconnected' });
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      setNotification({ type: 'error', message: 'Failed to disconnect' });
    }
  };

  const handleRefreshQr = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/whatsapp/qr/refresh', { headers });
      const data = await response.json();
      
      if (data.success) {
        setQrCode(data.qrCode);
        setQrExpiry(new Date(data.qrExpiry));
      }
    } catch (error) {
      console.error('QR refresh error:', error);
    }
  };

  const handleSimulateConnect = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/whatsapp/simulate/connect', {
        method: 'POST',
        headers
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSession(prev => ({
          ...prev,
          connectionStatus: data.connectionStatus,
          phoneNumber: data.phoneNumber,
          connectedAt: data.connectedAt
        }));
        setQrCode(null);
        setNotification({ type: 'success', message: 'Connected successfully!' });
      }
    } catch (error) {
      console.error('Simulate error:', error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/whatsapp/session/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setNotification({ type: 'success', message: 'Settings saved successfully!' });
      } else {
        setNotification({ type: 'error', message: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setNotification({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuickReply = () => {
    if (!newQuickReply.trigger || !newQuickReply.response) return;
    
    setSettings(prev => ({
      ...prev,
      quickReplies: [...prev.quickReplies, { ...newQuickReply, enabled: true }]
    }));
    setNewQuickReply({ trigger: '', response: '' });
  };

  const handleRemoveQuickReply = (index) => {
    setSettings(prev => ({
      ...prev,
      quickReplies: prev.quickReplies.filter((_, i) => i !== index)
    }));
  };

  const toggleQuickReply = (index) => {
    setSettings(prev => ({
      ...prev,
      quickReplies: prev.quickReplies.map((qr, i) => 
        i === index ? { ...qr, enabled: !qr.enabled } : qr
      )
    }));
  };

  const handleTestChatbot = async () => {
    if (!testMessage.trim()) return;
    
    setTestLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/whatsapp/chatbot/test', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: testMessage })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestResult(data);
        setTestHistory(prev => [{
          input: testMessage,
          response: data.response,
          intent: data.intent,
          confidence: data.confidence,
          language: data.language,
          leadScore: data.leadScore,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        setTestMessage('');
      }
    } catch (error) {
      console.error('Chatbot test error:', error);
      setTestResult({ error: 'Failed to test chatbot' });
    } finally {
      setTestLoading(false);
    }
  };

  const handleClearTestContext = async () => {
    try {
      const headers = await getAuthHeaders();
      await fetch('/api/whatsapp/chatbot/clear-context', {
        method: 'POST',
        headers
      });
      setTestHistory([]);
      setTestResult(null);
      setNotification({ type: 'success', message: 'Test conversation cleared' });
    } catch (error) {
      console.error('Clear context error:', error);
    }
  };

  const isConnected = session?.connectionStatus === 'connected' || session?.connectionStatus === 'authenticated';

  if (loading) {
    return (
      <div className="whatsapp-settings-page">
        <RoleNavigation role="owner" userName={user?.displayName || user?.email} />
        <div className="loading-container">
          <RefreshCw size={40} className="spin" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="whatsapp-settings-page">
      <RoleNavigation role="owner" userName={user?.displayName || user?.email} />
      
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {notification.message}
          <button onClick={() => setNotification(null)}>&times;</button>
        </div>
      )}
      
      <div className="settings-container">
        <div className="settings-header">
          <h1><Settings size={28} /> WhatsApp Connection Settings</h1>
          <p>Connect and configure your WhatsApp Business account</p>
        </div>

        <div className="settings-grid">
          <div className="settings-card connection-card">
            <div className="card-header">
              <h2><Smartphone size={22} /> Account Connection</h2>
              <div className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            
            {isConnected ? (
              <div className="connected-info">
                <div className="phone-display">
                  <MessageCircle size={24} />
                  <div>
                    <span className="phone-number">{session?.phoneNumber || '+971 56 361 6136'}</span>
                    <span className="business-name">{session?.businessName || 'White Caves Real Estate'}</span>
                  </div>
                </div>
                <div className="connection-stats">
                  <div className="stat">
                    <span className="stat-value">{session?.messageCount?.sent || 0}</span>
                    <span className="stat-label">Sent</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{session?.messageCount?.received || 0}</span>
                    <span className="stat-label">Received</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{session?.connectedAt ? new Date(session.connectedAt).toLocaleDateString() : '-'}</span>
                    <span className="stat-label">Connected Since</span>
                  </div>
                </div>
                <button className="disconnect-btn" onClick={handleDisconnect}>
                  <Unlink size={18} /> Disconnect Account
                </button>
              </div>
            ) : (
              <div className="connection-options">
                <div className="connection-tabs">
                  <button 
                    className={`tab ${connectionMethod === 'qr' ? 'active' : ''}`}
                    onClick={() => setConnectionMethod('qr')}
                  >
                    <QrCode size={18} /> QR Code
                  </button>
                  <button 
                    className={`tab ${connectionMethod === 'meta' ? 'active' : ''}`}
                    onClick={() => setConnectionMethod('meta')}
                  >
                    <Link2 size={18} /> Meta Business
                  </button>
                </div>
                
                {connectionMethod === 'qr' ? (
                  <div className="qr-section">
                    {qrCode ? (
                      <div className="qr-display">
                        <div className="qr-placeholder">
                          <QrCode size={120} />
                          <p>Scan with WhatsApp</p>
                        </div>
                        <div className="qr-actions">
                          <button className="refresh-btn" onClick={handleRefreshQr}>
                            <RefreshCw size={16} /> Refresh QR
                          </button>
                          <button className="simulate-btn" onClick={handleSimulateConnect}>
                            <CheckCircle size={16} /> Simulate Connected
                          </button>
                        </div>
                        {qrExpiry && (
                          <p className="qr-expiry">
                            Expires: {new Date(qrExpiry).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="qr-instructions">
                        <div className="instruction-steps">
                          <div className="step">
                            <span className="step-num">1</span>
                            <span>Open WhatsApp on your phone</span>
                          </div>
                          <div className="step">
                            <span className="step-num">2</span>
                            <span>Go to Settings → Linked Devices</span>
                          </div>
                          <div className="step">
                            <span className="step-num">3</span>
                            <span>Tap "Link a Device"</span>
                          </div>
                          <div className="step">
                            <span className="step-num">4</span>
                            <span>Scan the QR code below</span>
                          </div>
                        </div>
                        <button className="connect-btn" onClick={() => handleConnect('qr')}>
                          <QrCode size={18} /> Generate QR Code
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="meta-section">
                    <p className="meta-description">
                      Connect using your Meta Business Suite account. This provides full WhatsApp Business API access with advanced features.
                    </p>
                    <ul className="meta-features">
                      <li><CheckCircle size={14} /> Official Business API</li>
                      <li><CheckCircle size={14} /> Verified Business Badge</li>
                      <li><CheckCircle size={14} /> Message Templates</li>
                      <li><CheckCircle size={14} /> Analytics & Insights</li>
                    </ul>
                    <button className="connect-btn meta" onClick={() => handleConnect('meta')}>
                      <Link2 size={18} /> Connect with Meta
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="settings-card automation-card">
            <div className="card-header">
              <h2><Bot size={22} /> Automation Settings</h2>
            </div>
            
            <div className="toggle-group">
              <div className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-label">AI Chatbot</span>
                  <span className="toggle-desc">Automatically respond to inquiries using AI</span>
                </div>
                <button 
                  className={`toggle-btn ${settings.chatbotEnabled ? 'on' : 'off'}`}
                  onClick={() => setSettings(prev => ({ ...prev, chatbotEnabled: !prev.chatbotEnabled }))}
                >
                  {settings.chatbotEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-label">Auto-Reply</span>
                  <span className="toggle-desc">Send automatic responses to new messages</span>
                </div>
                <button 
                  className={`toggle-btn ${settings.autoReplyEnabled ? 'on' : 'off'}`}
                  onClick={() => setSettings(prev => ({ ...prev, autoReplyEnabled: !prev.autoReplyEnabled }))}
                >
                  {settings.autoReplyEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
              
              <div className="toggle-item">
                <div className="toggle-info">
                  <span className="toggle-label">Business Hours Only</span>
                  <span className="toggle-desc">Only auto-respond during business hours</span>
                </div>
                <button 
                  className={`toggle-btn ${settings.businessHoursOnly ? 'on' : 'off'}`}
                  onClick={() => setSettings(prev => ({ ...prev, businessHoursOnly: !prev.businessHoursOnly }))}
                >
                  {settings.businessHoursOnly ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            </div>
            
            {settings.businessHoursOnly && (
              <div className="business-hours">
                <h4><Clock size={16} /> Business Hours</h4>
                <div className="hours-inputs">
                  <div className="input-group">
                    <label>Start</label>
                    <input 
                      type="time" 
                      value={settings.businessHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        businessHours: { ...prev.businessHours, start: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="input-group">
                    <label>End</label>
                    <input 
                      type="time" 
                      value={settings.businessHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        businessHours: { ...prev.businessHours, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="settings-card messages-card">
            <div className="card-header">
              <h2><MessageCircle size={22} /> Message Templates</h2>
            </div>
            
            <div className="message-template">
              <label>Welcome Message</label>
              <textarea 
                value={settings.welcomeMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                placeholder="Message sent to new contacts..."
                rows={3}
              />
            </div>
            
            <div className="message-template">
              <label>Away Message</label>
              <textarea 
                value={settings.awayMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, awayMessage: e.target.value }))}
                placeholder="Message sent outside business hours..."
                rows={3}
              />
            </div>
          </div>

          <div className="settings-card quick-replies-card">
            <div className="card-header">
              <h2><Send size={22} /> Quick Replies</h2>
            </div>
            
            <div className="quick-replies-list">
              {settings.quickReplies.length === 0 ? (
                <p className="empty-state">No quick replies configured</p>
              ) : (
                settings.quickReplies.map((qr, index) => (
                  <div key={index} className={`quick-reply-item ${qr.enabled ? '' : 'disabled'}`}>
                    <div className="qr-content">
                      <span className="trigger">/{qr.trigger}</span>
                      <span className="response">{qr.response}</span>
                    </div>
                    <div className="qr-actions">
                      <button onClick={() => toggleQuickReply(index)}>
                        {qr.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button onClick={() => handleRemoveQuickReply(index)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="add-quick-reply">
              <input 
                type="text" 
                placeholder="Trigger (e.g., price)"
                value={newQuickReply.trigger}
                onChange={(e) => setNewQuickReply(prev => ({ ...prev, trigger: e.target.value }))}
              />
              <input 
                type="text" 
                placeholder="Response message..."
                value={newQuickReply.response}
                onChange={(e) => setNewQuickReply(prev => ({ ...prev, response: e.target.value }))}
              />
              <button onClick={handleAddQuickReply}>
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="settings-card chatbot-test-card">
            <div className="card-header">
              <h2><TestTube2 size={22} /> Chatbot Testing</h2>
              {testHistory.length > 0 && (
                <button className="clear-btn" onClick={handleClearTestContext}>
                  <Trash2 size={14} /> Clear
                </button>
              )}
            </div>
            
            <div className="test-input-section">
              <div className="test-input-wrapper">
                <input
                  type="text"
                  placeholder="Type a test message (English or Arabic)..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTestChatbot()}
                  disabled={testLoading}
                />
                <button 
                  className="test-btn" 
                  onClick={handleTestChatbot}
                  disabled={testLoading || !testMessage.trim()}
                >
                  {testLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                </button>
              </div>
              <p className="test-hint">Test how the AI chatbot responds to customer messages</p>
            </div>
            
            {testResult && !testResult.error && (
              <div className="test-result">
                <div className="result-header">
                  <Sparkles size={16} /> AI Response
                </div>
                <div className="result-response">{testResult.response}</div>
                <div className="result-metrics">
                  <div className="metric">
                    <Target size={14} />
                    <span className="metric-label">Intent:</span>
                    <span className="metric-value">{testResult.intent}</span>
                  </div>
                  <div className="metric">
                    <TrendingUp size={14} />
                    <span className="metric-label">Confidence:</span>
                    <span className="metric-value">{testResult.confidence}%</span>
                  </div>
                  <div className="metric">
                    <Globe size={14} />
                    <span className="metric-label">Language:</span>
                    <span className="metric-value">{testResult.language === 'ar' ? 'Arabic' : 'English'}</span>
                  </div>
                  <div className="metric">
                    <Sparkles size={14} />
                    <span className="metric-label">Lead Score:</span>
                    <span className="metric-value">{testResult.leadScore}/100</span>
                  </div>
                </div>
                {testResult.suggestedActions?.length > 0 && (
                  <div className="suggested-actions">
                    <span className="actions-label">Suggested Actions:</span>
                    {testResult.suggestedActions.map((action, i) => (
                      <span key={i} className="action-chip">{action}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {testHistory.length > 0 && (
              <div className="test-history">
                <h4>Recent Tests</h4>
                {testHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-input">
                      <span className="direction">You:</span> {item.input}
                    </div>
                    <div className="history-response">
                      <span className="direction">Bot:</span> {item.response}
                    </div>
                    <div className="history-meta">
                      <span>{item.intent}</span>
                      <span>{item.confidence}%</span>
                      <span>{item.language === 'ar' ? 'AR' : 'EN'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        
        <div className="settings-actions">
          <button className="save-btn" onClick={handleSaveSettings} disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSettingsPage;
