import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, Phone, Video, MoreVertical, Search, 
  Paperclip, Smile, Mic, Check, CheckCheck, Clock, Bot, 
  User, Star, Tag, Filter, RefreshCw, Download, Archive, Zap
} from 'lucide-react';
import AssistantFeatureMatrix from './shared/AssistantFeatureMatrix';
import { LINDA_FEATURES } from './data/assistantFeatures';
import './LindaWhatsAppCRM.css';

const DUMMY_CONVERSATIONS = [
  {
    id: 'conv-1',
    contact: {
      name: 'Mohammed Al Rashid',
      phone: '+971501234567',
      avatar: 'https://i.pravatar.cc/150?img=11',
      status: 'online'
    },
    lastMessage: 'I am interested in the Marina apartment',
    unread: 3,
    time: '2 min ago',
    priority: 'hot',
    tags: ['buyer', 'luxury'],
    messages: [
      { id: 1, type: 'received', text: 'Hello, I saw your property listing', time: '10:30 AM', status: 'read' },
      { id: 2, type: 'sent', text: 'Hi Mohammed! Which property are you interested in?', time: '10:32 AM', status: 'read' },
      { id: 3, type: 'received', text: 'The 3BR apartment in Dubai Marina', time: '10:33 AM', status: 'read' },
      { id: 4, type: 'received', text: 'What is the asking price?', time: '10:33 AM', status: 'read' },
      { id: 5, type: 'ai', text: 'Linda AI: This lead shows high buying intent. Recommend scheduling a viewing within 24 hours.', time: '10:34 AM' },
      { id: 6, type: 'received', text: 'I am interested in the Marina apartment', time: '10:35 AM', status: 'delivered' }
    ]
  },
  {
    id: 'conv-2',
    contact: {
      name: 'Sarah Williams',
      phone: '+971502345678',
      avatar: 'https://i.pravatar.cc/150?img=5',
      status: 'offline'
    },
    lastMessage: 'Can we schedule a viewing?',
    unread: 0,
    time: '1 hour ago',
    priority: 'warm',
    tags: ['tenant', 'family'],
    messages: [
      { id: 1, type: 'received', text: 'Hi, I need a 2BR apartment for rent', time: '9:00 AM', status: 'read' },
      { id: 2, type: 'sent', text: 'Hello Sarah! We have several options. What is your budget?', time: '9:05 AM', status: 'read' },
      { id: 3, type: 'received', text: 'Around 80-100k per year', time: '9:10 AM', status: 'read' },
      { id: 4, type: 'received', text: 'Can we schedule a viewing?', time: '9:15 AM', status: 'read' }
    ]
  },
  {
    id: 'conv-3',
    contact: {
      name: 'Ahmad Khalil',
      phone: '+971503456789',
      avatar: 'https://i.pravatar.cc/150?img=12',
      status: 'away'
    },
    lastMessage: 'Thank you, will get back to you',
    unread: 0,
    time: '3 hours ago',
    priority: 'cold',
    tags: ['investor'],
    messages: [
      { id: 1, type: 'received', text: 'Looking for investment properties', time: '7:00 AM', status: 'read' },
      { id: 2, type: 'sent', text: 'We have great ROI properties in Business Bay', time: '7:30 AM', status: 'read' },
      { id: 3, type: 'received', text: 'Thank you, will get back to you', time: '8:00 AM', status: 'read' }
    ]
  }
];

const QUICK_REPLIES = [
  { id: 1, text: 'Thank you for your interest! How can I help you today?' },
  { id: 2, text: 'Would you like to schedule a property viewing?' },
  { id: 3, text: 'I will send you more details about this property.' },
  { id: 4, text: 'What is your preferred budget range?' },
  { id: 5, text: 'Our office hours are 9 AM to 6 PM, Sunday to Thursday.' }
];

const LindaWhatsAppCRM = () => {
  const [conversations, setConversations] = useState(DUMMY_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [lindaActive, setLindaActive] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      type: 'sent',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prevConvs => 
      prevConvs.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageInput }
          : conv
      )
    );

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    setMessageInput('');

    // Simulate Linda AI response after 2 seconds
    if (lindaActive) {
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: `Linda AI: Response sent. Lead engagement score increased to ${Math.floor(Math.random() * 20) + 80}%. Recommend follow-up in 24 hours.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prevConvs => 
          prevConvs.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, messages: [...conv.messages, aiMessage] }
              : conv
          )
        );

        setSelectedConversation(prev => ({
          ...prev,
          messages: [...prev.messages, aiMessage]
        }));
      }, 2000);
    }
  };

  const handleQuickReply = (text) => {
    setMessageInput(text);
    setShowQuickReplies(false);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.contact.phone.includes(searchQuery);
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'hot': return '#ef4444';
      case 'warm': return '#f59e0b';
      case 'cold': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="linda-crm-container">
      {/* Header */}
      <div className="linda-header">
        <div className="linda-info">
          <div className="linda-avatar">
            <Bot size={24} />
          </div>
          <div className="linda-details">
            <h2>Linda - WhatsApp Assistant</h2>
            <span className={`linda-status ${lindaActive ? 'active' : 'inactive'}`}>
              {lindaActive ? 'AI Active' : 'AI Paused'}
            </span>
          </div>
        </div>
        <div className="linda-actions">
          <button 
            className={`linda-toggle ${lindaActive ? 'active' : ''}`}
            onClick={() => setLindaActive(!lindaActive)}
          >
            {lindaActive ? 'Pause Linda' : 'Activate Linda'}
          </button>
          <button className="linda-action-btn">
            <RefreshCw size={18} />
          </button>
          <button className="linda-action-btn">
            <Download size={18} />
          </button>
          <button 
            className={`linda-action-btn features ${showFeatures ? 'active' : ''}`}
            onClick={() => setShowFeatures(!showFeatures)}
          >
            <Zap size={18} />
            <span>Features ({LINDA_FEATURES.length})</span>
          </button>
        </div>
      </div>

      {showFeatures && (
        <div className="linda-features-panel">
          <AssistantFeatureMatrix 
            features={LINDA_FEATURES}
            title="Linda's WhatsApp CRM Capabilities"
            accentColor="#25d366"
            categories={['Communication', 'AI Features', 'Automation', 'CRM', 'Organization']}
          />
        </div>
      )}

      <div className="linda-main">
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
                      {conv.unread > 0 && (
                        <span className="unread-badge">{conv.unread}</span>
                      )}
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(conv.priority) }}
                      >
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

          <div className="conversations-stats">
            <div className="stat-item">
              <span className="stat-value">{conversations.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ef4444' }}>
                {conversations.filter(c => c.priority === 'hot').length}
              </span>
              <span className="stat-label">Hot Leads</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#22c55e' }}>
                {conversations.reduce((acc, c) => acc + c.unread, 0)}
              </span>
              <span className="stat-label">Unread</span>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-panel">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-contact-info">
                  <img 
                    src={selectedConversation.contact.avatar} 
                    alt={selectedConversation.contact.name} 
                    className="chat-avatar"
                  />
                  <div className="chat-contact-details">
                    <h3>{selectedConversation.contact.name}</h3>
                    <span className="chat-phone">{selectedConversation.contact.phone}</span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-btn"><Phone size={18} /></button>
                  <button className="chat-action-btn"><Video size={18} /></button>
                  <button className="chat-action-btn"><Star size={18} /></button>
                  <button className="chat-action-btn"><Archive size={18} /></button>
                  <button className="chat-action-btn"><MoreVertical size={18} /></button>
                </div>
              </div>

              <div className="chat-messages">
                {selectedConversation.messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`message ${message.type}`}
                  >
                    {message.type === 'ai' && (
                      <div className="ai-indicator">
                        <Bot size={14} />
                      </div>
                    )}
                    <div className="message-content">
                      <p>{message.text}</p>
                      <div className="message-meta">
                        <span className="message-time">{message.time}</span>
                        {message.type === 'sent' && (
                          <span className="message-status">
                            {message.status === 'read' ? <CheckCheck size={14} /> : 
                             message.status === 'delivered' ? <CheckCheck size={14} /> : 
                             <Check size={14} />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {showQuickReplies && (
                <div className="quick-replies-panel">
                  <div className="quick-replies-header">
                    <span>Quick Replies</span>
                    <button onClick={() => setShowQuickReplies(false)}>&times;</button>
                  </div>
                  <div className="quick-replies-list">
                    {QUICK_REPLIES.map(reply => (
                      <button 
                        key={reply.id}
                        className="quick-reply-btn"
                        onClick={() => handleQuickReply(reply.text)}
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="chat-input-area">
                <button className="input-action-btn" onClick={() => setShowQuickReplies(!showQuickReplies)}>
                  <Smile size={20} />
                </button>
                <button className="input-action-btn">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="input-action-btn">
                  <Mic size={20} />
                </button>
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <MessageCircle size={64} />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the left panel to start chatting</p>
            </div>
          )}
        </div>

        {/* AI Insights Panel */}
        {selectedConversation && (
          <div className="insights-panel">
            <div className="insights-header">
              <Bot size={20} />
              <h3>Linda AI Insights</h3>
            </div>

            <div className="insight-card">
              <h4>Lead Score</h4>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: selectedConversation.priority === 'hot' ? '85%' : 
                           selectedConversation.priority === 'warm' ? '60%' : '35%',
                    backgroundColor: getPriorityColor(selectedConversation.priority)
                  }}
                />
              </div>
              <span className="score-value">
                {selectedConversation.priority === 'hot' ? '85' : 
                 selectedConversation.priority === 'warm' ? '60' : '35'}/100
              </span>
            </div>

            <div className="insight-card">
              <h4>Detected Intent</h4>
              <div className="intent-tags">
                <span className="intent-tag">Property Inquiry</span>
                <span className="intent-tag">Price Check</span>
                {selectedConversation.priority === 'hot' && (
                  <span className="intent-tag highlight">Ready to Buy</span>
                )}
              </div>
            </div>

            <div className="insight-card">
              <h4>Recommended Actions</h4>
              <ul className="action-list">
                <li><Clock size={14} /> Schedule viewing within 24h</li>
                <li><Tag size={14} /> Send property brochure</li>
                <li><User size={14} /> Assign to senior agent</li>
              </ul>
            </div>

            <div className="insight-card">
              <h4>Contact Summary</h4>
              <div className="contact-summary">
                <p><strong>Messages:</strong> {selectedConversation.messages.length}</p>
                <p><strong>Response Time:</strong> ~5 min avg</p>
                <p><strong>First Contact:</strong> 2 days ago</p>
              </div>
            </div>

            <button className="generate-report-btn">
              <Download size={16} />
              Generate Lead Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LindaWhatsAppCRM;
