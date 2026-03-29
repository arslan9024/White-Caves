import React, { useState } from 'react';
import type { ChatbotTabProps } from './types';
import './TabStyles.css';

const ChatbotTab: React.FC<ChatbotTabProps> = ({ data, loading, onAction }) => {
  const [activeSection, setActiveSection] = useState('overview');

  // Show loading state
  if (loading) {
    return (
      <div className="chatbot-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading chatbot data">
          <div className="loading-spinner" />
          <p>Loading chatbot data...</p>
        </div>
      </div>
    );
  }

  const stats = data?.chatbotStats || {
    totalConversations: 0,
    successfulLeads: 0,
    avgResponseTime: 0,
    satisfactionRate: 0,
    activeChats: 0,
    messagesProcessed: 0
  };

  const recentConversations: Array<{ id: number; user: string; topic: string; status: string; duration: string; messages: number; leadGenerated: boolean; timestamp: string }> = [];

  const intents: Array<{ intent: string; count: number; accuracy: number }> = [];

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
            {intents.map((item) => (
              <div key={item.intent} className="intent-item">
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

export default React.memo(ChatbotTab);
