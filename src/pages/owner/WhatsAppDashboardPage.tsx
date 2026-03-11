import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './WhatsAppDashboardPage.css';

interface WhatsAppStats {
  totalContacts: number;
  activeChats: number;
  messages24h: number;
  responseTime: string;
}

interface WhatsAppDashboardPageProps {}

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const WhatsAppDashboardPage: FC<WhatsAppDashboardPageProps> = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user.currentUser);
  const [stats, setStats] = useState<WhatsAppStats>({
    totalContacts: 0,
    activeChats: 0,
    messages24h: 0,
    responseTime: '0s'
  });
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchWhatsAppStats();
    const interval = setInterval(fetchWhatsAppStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWhatsAppStats = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/whatsapp/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp stats:', error);
    } finally {
      setLoading(false);
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
