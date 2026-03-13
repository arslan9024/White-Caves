import React, { useRef, useEffect } from 'react';
import { MessageCircle, Send, Paperclip, Smile, Search, Filter, Plus } from 'lucide-react';

export const ConversationsTab = ({ data }) => {
  const {
    filteredConversations,
    selectedConversation,
    setSelectedConversation,
    messageInput,
    setMessageInput,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    handleSendMessage,
    getPriorityColor
  } = data;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  return (
    <div className="conversations-tab">
      <div className="conversations-container">
        {/* Conversations List */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              {['all', 'hot', 'warm', 'cold'].map(priority => (
                <button
                  key={priority}
                  className={`filter-btn ${filterPriority === priority ? 'active' : ''}`}
                  onClick={() => setFilterPriority(priority)}
                  style={priority !== 'all' ? { '--filter-color': getPriorityColor(priority) } : {}}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="conversations-list">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'selected' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="conv-avatar-wrapper">
                  <img src={conv.contact.avatar} alt={conv.contact.name} className="conv-avatar" />
                  <span className={`status-dot ${conv.contact.status}`} />
                </div>
                <div className="conv-info">
                  <div className="conv-header">
                    <span className="conv-name">{conv.contact.name}</span>
                    <span className="conv-time">{conv.time}</span>
                  </div>
                  <div className="conv-preview">
                    <p className="conv-last-message">{conv.lastMessage}</p>
                    <div className="conv-badges">
                      {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                      <span className="priority-badge" style={{ backgroundColor: getPriorityColor(conv.priority) }}>
                        {conv.priority}
                      </span>
                    </div>
                  </div>
                  <div className="conv-tags">
                    {conv.tags.map(tag => (
                      <span key={tag} className="conv-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <img src={selectedConversation.contact.avatar} alt="Contact" className="contact-avatar" />
                <div className="contact-info">
                  <h3>{selectedConversation.contact.name}</h3>
                  <span className="contact-status">{selectedConversation.contact.status}</span>
                </div>
              </div>

              <div className="messages-container">
                {selectedConversation.messages.map(msg => (
                  <div key={msg.id} className={`message ${msg.type}`}>
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                    {msg.type === 'sent' && msg.status && (
                      <span className={`message-status ${msg.status}`} title={msg.status} />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                <div className="input-controls">
                  <button className="input-btn">
                    <Paperclip size={18} />
                  </button>
                  <button className="input-btn">
                    <Smile size={18} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="message-input"
                />
                <button className="send-btn" onClick={handleSendMessage}>
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <MessageCircle size={48} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
