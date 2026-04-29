import React, { FC, useState, useEffect } from 'react';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';

const log = createLogger('WhatsAppDashboard');
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import './WhatsAppDashboardPage.css';

interface WhatsAppStats {
  totalContacts: number;
  activeChats: number;
  messages24h: number;
  responseTime: string;
}

const WhatsAppDashboardPage: FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [stats, setStats] = useState<WhatsAppStats>({
    totalContacts: 0,
    activeChats: 0,
    messages24h: 0,
    responseTime: '0s'
  });
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    isMountedRef.current = true;
    const controller = new AbortController();
    const doFetch = () => fetchWhatsAppStats(controller.signal);
    doFetch();
    const interval = setInterval(doFetch, 30000);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  const fetchWhatsAppStats = async (signal?: AbortSignal): Promise<void> => {
    try {
      if (!isMountedRef.current) return;
      setLoading(true);
      setError(null);
      const response = await authFetch('/api/whatsapp/stats', { signal });
      if (!isMountedRef.current) return;
      if (response.ok) {
        const data = await response.json();
        if (isMountedRef.current) setStats(data);
      } else {
        const message = `Failed to load stats (${response.status})`;
        log.warn(message);
        if (isMountedRef.current) setError(message);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Network error';
      log.error('Error fetching WhatsApp stats:', err);
      if (isMountedRef.current) setError(message);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'messages', label: 'Messages' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'broadcasts', label: 'Broadcasts' },
  ];

  return (
    <div className="whatsapp-dashboard-page no-sidebar">
      <div className="whatsapp-container full-width">
        <header className="whatsapp-header">
          <div className="whatsapp-logo">
            <span>💬</span>
            <h1>WhatsApp Dashboard</h1>
          </div>
          <p>Manage your business messaging</p>
        </header>

        <div className="whatsapp-stats-grid">
          <div className="whatsapp-stat-card">
            <span className="stat-icon">📞</span>
            <h3>Total Contacts</h3>
            <p className="stat-value">{stats.totalContacts}</p>
          </div>
          <div className="whatsapp-stat-card">
            <span className="stat-icon">💬</span>
            <h3>Active Chats</h3>
            <p className="stat-value">{stats.activeChats}</p>
          </div>
          <div className="whatsapp-stat-card">
            <span className="stat-icon">📨</span>
            <h3>Messages (24h)</h3>
            <p className="stat-value">{stats.messages24h}</p>
          </div>
          <div className="whatsapp-stat-card">
            <span className="stat-icon">⚡</span>
            <h3>Avg Response</h3>
            <p className="stat-value">{stats.responseTime}</p>
          </div>
        </div>

        <div className="whatsapp-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`whatsapp-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="whatsapp-content">
          {activeTab === 'overview' && (
            <div className="whatsapp-section">
              <h2>WhatsApp Business Manager</h2>
              <p>Manage all your WhatsApp communications from one dashboard</p>
              <div className="whatsapp-features">
                <div className="feature">
                  <h4>📨 Message Management</h4>
                  <p>Send, receive, and organize messages</p>
                </div>
                <div className="feature">
                  <h4>📋 Contact Groups</h4>
                  <p>Organize contacts into teams</p>
                </div>
                <div className="feature">
                  <h4>📊 Analytics</h4>
                  <p>Track engagement and response rates</p>
                </div>
                <div className="feature">
                  <h4>🤖 Chatbot Integration</h4>
                  <p>Automated responses and workflows</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="whatsapp-section">
              <h2>Messages</h2>
              <p>View and manage all messages</p>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="whatsapp-section">
              <h2>Contacts</h2>
              <p>Manage your WhatsApp contacts</p>
            </div>
          )}

          {activeTab === 'broadcasts' && (
            <div className="whatsapp-section">
              <h2>Broadcast Lists</h2>
              <p>Create and manage broadcast campaigns</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDashboardPage;
