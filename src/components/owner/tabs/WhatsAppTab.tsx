import React, { useState } from 'react';
import type { WhatsAppTabProps } from './types';
import './TabStyles.css';

const WhatsAppTab: React.FC<WhatsAppTabProps> = ({ data, loading, onAction }) => {
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Show loading state
  if (loading) {
    return (
      <div className="whatsapp-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading WhatsApp data">
          <div className="loading-spinner" />
          <p>Loading WhatsApp data...</p>
        </div>
      </div>
    );
  }

  const stats = data?.whatsappStats || {
    totalContacts: 0,
    activeConversations: 0,
    messagesThisMonth: 0,
    responseRate: 0,
    avgResponseTime: '—',
    leadsGenerated: 0
  };

  interface WhatsAppMessage {
    id: string;
    name: string;
    time: string;
    message: string;
    contact: string;
    agent?: string;
    status: string;
  }

  const recentMessages: WhatsAppMessage[] = [];

  const templates: Array<{ id: number; name: string; category: string; uses: number }> = [];

  return (
    <div className="whatsapp-tab">
      <div className="tab-header">
        <h3>WhatsApp Business</h3>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => onAction?.('viewAnalytics')}>
            <span>📊</span> Analytics
          </button>
          <button className="whatsapp-btn" onClick={() => onAction?.('openWhatsApp')}>
            <span>💬</span> Open WhatsApp
          </button>
        </div>
      </div>

      <div className="whatsapp-stats-grid">
        <div className="whatsapp-stat">
          <span className="stat-icon">👥</span>
          <div className="stat-content">
            <span className="stat-value">{stats.totalContacts.toLocaleString()}</span>
            <span className="stat-label">Total Contacts</span>
          </div>
        </div>
        <div className="whatsapp-stat live">
          <span className="stat-icon">💬</span>
          <div className="stat-content">
            <span className="stat-value">{stats.activeConversations}</span>
            <span className="stat-label">Active Chats</span>
          </div>
        </div>
        <div className="whatsapp-stat">
          <span className="stat-icon">📨</span>
          <div className="stat-content">
            <span className="stat-value">{stats.messagesThisMonth.toLocaleString()}</span>
            <span className="stat-label">Messages This Month</span>
          </div>
        </div>
        <div className="whatsapp-stat">
          <span className="stat-icon">📈</span>
          <div className="stat-content">
            <span className="stat-value">{stats.responseRate}%</span>
            <span className="stat-label">Response Rate</span>
          </div>
        </div>
        <div className="whatsapp-stat">
          <span className="stat-icon">⏱️</span>
          <div className="stat-content">
            <span className="stat-value">{stats.avgResponseTime}</span>
            <span className="stat-label">Avg Response Time</span>
          </div>
        </div>
        <div className="whatsapp-stat">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <span className="stat-value">{stats.leadsGenerated}</span>
            <span className="stat-label">Leads Generated</span>
          </div>
        </div>
      </div>

      <div className="whatsapp-row">
        <div className="whatsapp-card">
          <h4>Recent Messages</h4>
          <div className="messages-list">
            {recentMessages.map((msg) => (
              <div key={msg.id} className={`message-item ${msg.status}`}>
                <div className="message-avatar">{msg.name.charAt(0)}</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-name">{msg.name}</span>
                    <span className="message-time">{msg.time}</span>
                  </div>
                  <p className="message-text">{msg.message}</p>
                  <div className="message-footer">
                    <span className="message-contact">{msg.contact}</span>
                    {msg.agent && <span className="message-agent">Assigned: {msg.agent}</span>}
                  </div>
                </div>
                <div className="message-actions">
                  <button className="icon-btn" title="Reply" onClick={() => onAction?.('replyMessage', msg.id)}>↩️</button>
                  <button className="icon-btn" title="Assign" onClick={() => onAction?.('assignMessage', msg.id)}>👤</button>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn" onClick={() => onAction?.('viewAllMessages')}>View All Messages →</button>
        </div>

        <div className="whatsapp-card">
          <h4>Broadcast Message</h4>
          <div className="broadcast-section">
            <textarea
              placeholder="Type your broadcast message..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              rows={4}
            />
            <div className="broadcast-options">
              <select>
                <option value="all">All Contacts</option>
                <option value="leads">Active Leads</option>
                <option value="buyers">Buyers</option>
                <option value="sellers">Sellers</option>
                <option value="tenants">Tenants</option>
              </select>
              <button 
                className="whatsapp-btn" 
                onClick={() => onAction?.('sendBroadcast', broadcastMessage)}
                disabled={!broadcastMessage.trim()}
              >
                <span>📢</span> Send Broadcast
              </button>
            </div>
          </div>

          <h4 style={{ marginTop: '24px' }}>Message Templates</h4>
          <div className="templates-list">
            {templates.map((template) => (
              <div key={template.id} className="template-item">
                <div className="template-info">
                  <span className="template-name">{template.name}</span>
                  <span className="template-category">{template.category}</span>
                </div>
                <span className="template-uses">{template.uses} uses</span>
                <button className="icon-btn" onClick={() => onAction?.('editTemplate', template.id)}>✏️</button>
              </div>
            ))}
          </div>
          <button className="secondary-btn full-width" onClick={() => onAction?.('addTemplate')}>
            <span>➕</span> Add Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WhatsAppTab);
