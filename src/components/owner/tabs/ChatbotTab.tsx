import React, { useState } from 'react';
import './TabStyles.css';

const ChatbotTab = ({ data, loading, onAction }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const stats = data?.chatbotStats || {
    totalConversations: 2456,
    successfulLeads: 189,
    avgResponseTime: 2.3,
    satisfactionRate: 92,
    activeChats: 12,
    messagesProcessed: 18945
  };

  const recentConversations = [
    { id: 1, user: '+971 50 XXX 1234', topic: 'Property Inquiry', status: 'completed', duration: '5 min', messages: 12, leadGenerated: true, timestamp: new Date().toISOString() },
    { id: 2, user: 'Website Visitor', topic: 'Rental Information', status: 'active', duration: '2 min', messages: 6, leadGenerated: false, timestamp: new Date().toISOString() },
    { id: 3, user: '+44 7700 XXX XXX', topic: 'Investment Options', status: 'completed', duration: '8 min', messages: 18, leadGenerated: true, timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 4, user: '+971 55 XXX 5678', topic: 'Viewing Booking', status: 'transferred', duration: '4 min', messages: 9, leadGenerated: true, timestamp: new Date(Date.now() - 7200000).toISOString() },
  ];

  const intents = [
    { intent: 'Property Search', count: 845, accuracy: 96 },
    { intent: 'Price Inquiry', count: 623, accuracy: 94 },
    { intent: 'Book Viewing', count: 412, accuracy: 98 },
    { intent: 'Investment Info', count: 289, accuracy: 91 },
    { intent: 'Contact Agent', count: 256, accuracy: 99 },
    { intent: 'General FAQ', count: 198, accuracy: 88 },
  ];

  return (
    <div className="chatbot-tab">
      <div className="tab-header">
        <h3>AI Chatbot Management</h3>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => onAction?.('viewAnalytics')}>
            <span>📊</span> Analytics
          </button>
          <button className="primary-btn" onClick={() => onAction?.('trainChatbot')}>
            <span>🎓</span> Training Center
          </button>
        </div>
      </div>

      <div className="chatbot-stats-grid">
        <div className="chatbot-stat">
          <span className="stat-icon">💬</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalConversations.toLocaleString()}</span>
            <span className="stat-label">Total Conversations</span>
          </div>
        </div>
        <div className="chatbot-stat">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <span className="stat-value">{stats.successfulLeads}</span>
            <span className="stat-label">Leads Generated</span>
          </div>
        </div>
        <div className="chatbot-stat">
          <span className="stat-icon">⚡</span>
          <div className="stat-content">
            <span className="stat-value">{stats.avgResponseTime}s</span>
            <span className="stat-label">Avg Response Time</span>
          </div>
        </div>
        <div className="chatbot-stat">
          <span className="stat-icon">😊</span>
          <div className="stat-content">
            <span className="stat-value">{stats.satisfactionRate}%</span>
            <span className="stat-label">Satisfaction Rate</span>
          </div>
        </div>
        <div className="chatbot-stat live">
          <span className="stat-icon">🟢</span>
          <div className="stat-content">
            <span className="stat-value">{stats.activeChats}</span>
            <span className="stat-label">Active Chats</span>
          </div>
        </div>
        <div className="chatbot-stat">
          <span className="stat-icon">📨</span>
          <div className="stat-content">
            <span className="stat-value">{stats.messagesProcessed.toLocaleString()}</span>
            <span className="stat-label">Messages Processed</span>
          </div>
        </div>
      </div>

      <div className="chatbot-row">
        <div className="chatbot-card">
          <h4>Intent Recognition Performance</h4>
          <div className="intents-list">
            {intents.map((item, index) => (
              <div key={index} className="intent-item">
                <div className="intent-info">
                  <span className="intent-name">{item.intent}</span>
                  <span className="intent-count">{item.count} matches</span>
                </div>
                <div className="intent-accuracy">
                  <div className="accuracy-bar-bg">
                    <div 
                      className="accuracy-bar" 
                      style={{ 
                        width: `${item.accuracy}%`,
                        backgroundColor: item.accuracy >= 95 ? '#22C55E' : item.accuracy >= 90 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                  <span className="accuracy-value">{item.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chatbot-card">
          <h4>Recent Conversations</h4>
          <div className="conversations-list">
            {recentConversations.map((conv) => (
              <div key={conv.id} className="conversation-item">
                <div className="conv-header">
                  <span className="conv-user">{conv.user}</span>
                  <span className={`conv-status ${conv.status}`}>{conv.status}</span>
                </div>
                <div className="conv-details">
                  <span className="conv-topic">{conv.topic}</span>
                  <span className="conv-meta">{conv.messages} messages • {conv.duration}</span>
                </div>
                {conv.leadGenerated && <span className="lead-badge">✓ Lead Generated</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chatbot-card full-width">
        <h4>Quick Actions</h4>
        <div className="chatbot-actions">
          <button className="action-card" onClick={() => onAction?.('viewTrainingData')}>
            <span className="action-icon">📚</span>
            <span className="action-title">Training Data</span>
            <span className="action-desc">View and edit training examples</span>
          </button>
          <button className="action-card" onClick={() => onAction?.('configureResponses')}>
            <span className="action-icon">⚙️</span>
            <span className="action-title">Response Templates</span>
            <span className="action-desc">Customize chatbot responses</span>
          </button>
          <button className="action-card" onClick={() => onAction?.('viewLogs')}>
            <span className="action-icon">📋</span>
            <span className="action-title">Conversation Logs</span>
            <span className="action-desc">Review all chat history</span>
          </button>
          <button className="action-card" onClick={() => onAction?.('configureRules')}>
            <span className="action-icon">🔧</span>
            <span className="action-title">Rules Engine</span>
            <span className="action-desc">Set up automation rules</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTab;
