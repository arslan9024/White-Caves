import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { MessageCircle, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Mic, Check, CheckCheck, Clock, Users, TrendingUp, Bot, Bell, Settings } from 'lucide-react';
import './WhatsAppDashboardPage.css';

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

const WhatsAppDashboardPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);
  const [isConnected, setIsConnected] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalMessages: 156,
    unread: 8,
    todayMessages: 24,
    responseRate: '94%'
  });

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Ahmed Hassan', phone: '+971501234567', lastMessage: 'I am interested in the villa at Palm Jumeirah', time: '2 min ago', unread: 2, avatar: null },
    { id: 2, name: 'Sarah Johnson', phone: '+971502345678', lastMessage: 'Can we schedule a viewing tomorrow?', time: '15 min ago', unread: 1, avatar: null },
    { id: 3, name: 'Mohammed Ali', phone: '+971503456789', lastMessage: 'Thank you for the information!', time: '1 hr ago', unread: 0, avatar: null },
    { id: 4, name: 'Emily Chen', phone: '+971504567890', lastMessage: 'What is the price for the Downtown apartment?', time: '2 hrs ago', unread: 3, avatar: null },
    { id: 5, name: 'Khalid Rahman', phone: '+971505678901', lastMessage: 'Please send me more details', time: 'Yesterday', unread: 0, avatar: null },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, content: 'Hello! I am interested in the Palm Jumeirah villa', direction: 'incoming', time: '10:30 AM', status: 'read' },
    { id: 2, content: 'Thank you for your interest! The 5-bedroom villa is priced at AED 15,000,000. Would you like to schedule a viewing?', direction: 'outgoing', time: '10:32 AM', status: 'read' },
    { id: 3, content: 'Yes, that would be great. Is tomorrow afternoon available?', direction: 'incoming', time: '10:35 AM', status: 'read' },
    { id: 4, content: 'Let me check our schedule. One moment please.', direction: 'outgoing', time: '10:36 AM', status: 'delivered' },
  ]);

  useEffect(() => {
    if (!user || user.email !== OWNER_EMAIL) {
      navigate('/');
    }
    setIsConnected(true);
  }, [user, navigate]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: messages.length + 1,
      content: newMessage,
      direction: 'outgoing',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Check size={14} className="status-icon sent" />;
      case 'delivered': return <CheckCheck size={14} className="status-icon delivered" />;
      case 'read': return <CheckCheck size={14} className="status-icon read" />;
      default: return <Clock size={14} className="status-icon pending" />;
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  if (!isConnected) {
    return (
      <div className="whatsapp-dashboard no-sidebar">
        <div className="whatsapp-setup-wizard">
          <div className="setup-card">
            <div className="setup-icon">💬</div>
            <h2>Connect WhatsApp Business</h2>
            <p>Link your WhatsApp Business account to manage customer conversations directly from your dashboard.</p>
            <div className="setup-steps">
              <div className="step"><span>1</span> Connect Meta Business Account</div>
              <div className="step"><span>2</span> Verify Phone Number</div>
              <div className="step"><span>3</span> Configure Settings</div>
              <div className="step"><span>4</span> Test Connection</div>
            </div>
            <Link to="/owner/whatsapp/settings" className="setup-btn">
              Connect WhatsApp Account
            </Link>
            <p className="setup-note">This feature is exclusive to the company owner.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="whatsapp-dashboard no-sidebar">
      <div className="whatsapp-content full-width">
        <div className="whatsapp-header">
          <div className="header-left">
            <h1><MessageCircle size={28} /> WhatsApp Business Manager</h1>
            <div className="connection-status connected">
              <span className="status-dot"></span>
              Connected • +971 56 361 6136
            </div>
          </div>
          <div className="header-actions">
            <Link to="/owner/whatsapp/chatbot" className="header-btn">
              <Bot size={18} /> Chatbot Rules
            </Link>
            <Link to="/owner/whatsapp/analytics" className="header-btn">
              <TrendingUp size={18} /> Analytics
            </Link>
            <Link to="/owner/whatsapp/settings" className="header-btn">
              <Settings size={18} /> Settings
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalMessages}</span>
              <span className="stat-label">Total Messages</span>
            </div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <span className="stat-value">{stats.unread}</span>
              <span className="stat-label">Unread</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-value">{stats.todayMessages}</span>
              <span className="stat-label">Today</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <span className="stat-value">{stats.responseRate}</span>
              <span className="stat-label">Response Rate</span>
            </div>
          </div>
        </div>

        <div className="chat-container">
          <div className="contacts-panel">
            <div className="contacts-header">
              <h3>Conversations</h3>
              <button className="new-chat-btn">+</button>
            </div>
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="contacts-list">
              {filteredContacts.map(contact => (
                <div 
                  key={contact.id} 
                  className={`contact-item ${activeChat === contact.id ? 'active' : ''} ${contact.unread > 0 ? 'unread' : ''}`}
                  onClick={() => setActiveChat(contact.id)}
                >
                  <div className="contact-avatar">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="contact-info">
                    <div className="contact-header">
                      <span className="contact-name">{contact.name}</span>
                      <span className="contact-time">{contact.time}</span>
                    </div>
                    <div className="contact-preview">
                      <span className="last-message">{contact.lastMessage}</span>
                      {contact.unread > 0 && (
                        <span className="unread-badge">{contact.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chat-panel">
            {activeChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-contact-info">
                    <div className="contact-avatar">
                      {contacts.find(c => c.id === activeChat)?.name.charAt(0)}
                    </div>
                    <div>
                      <h4>{contacts.find(c => c.id === activeChat)?.name}</h4>
                      <span className="contact-phone">
                        {contacts.find(c => c.id === activeChat)?.phone}
                      </span>
                    </div>
                  </div>
                  <div className="chat-actions">
                    <button className="action-btn"><Phone size={20} /></button>
                    <button className="action-btn"><Video size={20} /></button>
                    <button className="action-btn"><MoreVertical size={20} /></button>
                  </div>
                </div>

                <div className="messages-container">
                  {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.direction}`}>
                      <div className="message-content">
                        {msg.content}
                        <div className="message-meta">
                          <span className="message-time">{msg.time}</span>
                          {msg.direction === 'outgoing' && getStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form className="message-input-form" onSubmit={handleSendMessage}>
                  <button type="button" className="input-btn"><Smile size={22} /></button>
                  <button type="button" className="input-btn"><Paperclip size={22} /></button>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  {newMessage ? (
                    <button type="submit" className="send-btn"><Send size={22} /></button>
                  ) : (
                    <button type="button" className="input-btn"><Mic size={22} /></button>
                  )}
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <MessageCircle size={64} />
                <h3>Select a conversation</h3>
                <p>Choose a contact from the list to start messaging</p>
              </div>
            )}
          </div>

          <div className="quick-actions-panel">
            <h3>Quick Actions</h3>
            <div className="quick-action-list">
              <button className="quick-action">
                <span className="qa-icon">📱</span>
                <span>New Message</span>
              </button>
              <button className="quick-action">
                <span className="qa-icon">🤖</span>
                <span>Chatbot Rules</span>
              </button>
              <button className="quick-action">
                <span className="qa-icon">📢</span>
                <span>Broadcast</span>
              </button>
              <button className="quick-action">
                <span className="qa-icon">📊</span>
                <span>Analytics</span>
              </button>
              <button className="quick-action">
                <span className="qa-icon">⚙️</span>
                <span>Settings</span>
              </button>
            </div>

            <h3>Quick Replies</h3>
            <div className="quick-replies">
              <button className="quick-reply" onClick={() => setNewMessage('Thank you for your interest! How can I help you?')}>
                Thank you for your interest!
              </button>
              <button className="quick-reply" onClick={() => setNewMessage('I will check and get back to you shortly.')}>
                Let me check for you
              </button>
              <button className="quick-reply" onClick={() => setNewMessage('Would you like to schedule a property viewing?')}>
                Schedule viewing?
              </button>
              <button className="quick-reply" onClick={() => setNewMessage('Please share your contact details and preferred time.')}>
                Request contact info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDashboardPage;
