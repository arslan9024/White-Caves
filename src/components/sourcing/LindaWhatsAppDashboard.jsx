import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, Send, Phone, Video, MapPin, Zap, X } from 'lucide-react';
import './LindaWhatsAppDashboard.css';

/**
 * Linda WhatsApp Web Dashboard
 * Manages WhatsApp conversations and displays property opportunities
 * extracted from messages with one-click add to Mary inventory
 */
export default function LindaWhatsAppDashboard() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showOpportunity, setShowOpportunity] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for conversations
  useEffect(() => {
    setLoading(true);
    // Simulate API call to fetch conversations
    setTimeout(() => {
      setConversations([
        {
          id: 'chat_1',
          name: 'Ahmed Al Mansouri',
          phone: '+971501234567',
          lastMessage: 'I have a 4BR villa in Arabian Ranches for rent at 8,000/month',
          lastMessageTime: '10:30 AM',
          unread: 2,
          hasOpportunity: true,
          opportunityConfidence: 92
        },
        {
          id: 'chat_2',
          name: 'Fatima Al Mazrouei',
          phone: '+971502345678',
          lastMessage: 'Available 2BR apartment Downtown Dubai',
          lastMessageTime: '9:15 AM',
          unread: 0,
          hasOpportunity: true,
          opportunityConfidence: 78
        },
        {
          id: 'chat_3',
          name: 'Mohammed Khan',
          phone: '+971503456789',
          lastMessage: 'Thanks for the information about the property',
          lastMessageTime: '8:45 AM',
          unread: 1,
          hasOpportunity: false,
          opportunityConfidence: 0
        },
        {
          id: 'chat_4',
          name: 'Sarah Johnson',
          phone: '+971504567890',
          lastMessage: 'Selling penthouse in Marina - premium location',
          lastMessageTime: '7:20 AM',
          unread: 0,
          hasOpportunity: true,
          opportunityConfidence: 85
        },
        {
          id: 'chat_5',
          name: 'Khalid Rashid',
          phone: '+971505678901',
          lastMessage: 'Townhouse in Jumeirah for lease agreement',
          lastMessageTime: 'Yesterday',
          unread: 3,
          hasOpportunity: true,
          opportunityConfidence: 88
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      setLoading(true);
      setTimeout(() => {
        const mockMessages = [
          {
            id: 'msg_1',
            sender: selectedConversation.name,
            isMe: false,
            content: 'Hi, I have a property for rent in Dubai',
            timestamp: '10:15 AM',
            hasOpportunity: false
          },
          {
            id: 'msg_2',
            sender: 'Linda',
            isMe: true,
            content: 'Great! Tell me more about the property',
            timestamp: '10:16 AM',
            hasOpportunity: false
          },
          {
            id: 'msg_3',
            sender: selectedConversation.name,
            isMe: false,
            content: selectedConversation.lastMessage,
            timestamp: selectedConversation.lastMessageTime,
            hasOpportunity: true,
            opportunity: {
              type: 'villa',
              location: 'Arabian Ranches',
              bedrooms: 4,
              price: 8000,
              currency: 'AED',
              frequency: 'monthly',
              availability: 'for_rent',
              furnishing: 'furnished',
              features: ['pool', 'gym', 'parking', 'garden'],
              confidence: 92
            }
          }
        ];
        setMessages(mockMessages);
        setLoading(false);
      }, 300);
    }
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conv.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'opportunity' && conv.hasOpportunity) ||
                         (filterStatus === 'unread' && conv.unread > 0);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: `msg_${Date.now()}`,
        sender: 'Linda',
        isMe: true,
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasOpportunity: false
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleQuickAddOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowOpportunity(true);
  };

  const handleConfirmAddToMary = () => {
    // In production, this would call PropertySourcingService.convertOpportunityToProperty
    console.log('Adding opportunity to Mary inventory:', selectedOpportunity);
    setShowOpportunity(false);
    setSelectedOpportunity(null);
  };

  return (
    <div className="linda-dashboard">
      {/* Header */}
      <div className="linda-header">
        <div className="linda-header-content">
          <div className="linda-title">
            <MessageCircle size={24} />
            <h1>Linda WhatsApp Web</h1>
          </div>
          <p className="linda-subtitle">WhatsApp conversation analysis & property sourcing</p>
        </div>
      </div>

      <div className="linda-container">
        {/* Conversations List */}
        <div className="linda-conversations-panel">
          <div className="linda-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="linda-search-input"
            />
          </div>

          {/* Filter tabs */}
          <div className="linda-filter-tabs">
            <button
              className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`filter-tab ${filterStatus === 'opportunity' ? 'active' : ''}`}
              onClick={() => setFilterStatus('opportunity')}
            >
              <Zap size={14} /> Opportunity
            </button>
            <button
              className={`filter-tab ${filterStatus === 'unread' ? 'active' : ''}`}
              onClick={() => setFilterStatus('unread')}
            >
              Unread
            </button>
          </div>

          {/* Conversations list */}
          <div className="linda-conversations-list">
            {loading ? (
              <div className="loading-placeholder">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="empty-state">No conversations found</div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''} ${conv.hasOpportunity ? 'has-opportunity' : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {conv.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{conv.name}</h3>
                      <span className="conversation-time">{conv.lastMessageTime}</span>
                    </div>
                    <p className="conversation-preview">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="unread-badge">{conv.unread}</div>
                  )}
                  {conv.hasOpportunity && (
                    <div className="opportunity-indicator" title={`Confidence: ${conv.opportunityConfidence}%`}>
                      <Zap size={14} />
                      {conv.opportunityConfidence}%
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="linda-messages-panel">
          {selectedConversation ? (
            <>
              {/* Message header */}
              <div className="message-header">
                <div className="message-contact-info">
                  <div className="contact-avatar">
                    {selectedConversation.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2>{selectedConversation.name}</h2>
                    <p className="contact-phone">{selectedConversation.phone}</p>
                  </div>
                </div>
                <div className="message-actions">
                  <button className="action-btn" title="Call">
                    <Phone size={18} />
                  </button>
                  <button className="action-btn" title="Video call">
                    <Video size={18} />
                  </button>
                  <button className="action-btn" title="Location">
                    <MapPin size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-thread">
                {loading ? (
                  <div className="loading-messages">Loading messages...</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.isMe ? 'outgoing' : 'incoming'}`}>
                      {/* Text message */}
                      <div className="message-bubble">
                        <p>{msg.content}</p>
                        <span className="message-time">{msg.timestamp}</span>
                      </div>

                      {/* Property opportunity card */}
                      {msg.hasOpportunity && msg.opportunity && (
                        <div className="opportunity-card">
                          <div className="opportunity-header">
                            <h4>Property Opportunity Detected</h4>
                            <div className="confidence-badge" style={{ 
                              backgroundColor: msg.opportunity.confidence >= 80 ? '#10B981' : 
                                             msg.opportunity.confidence >= 60 ? '#F59E0B' : '#EF4444'
                            }}>
                              {msg.opportunity.confidence}% Confidence
                            </div>
                          </div>

                          <div className="opportunity-details">
                            <div className="detail-row">
                              <span className="label">Type:</span>
                              <span className="value">{msg.opportunity.type}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Location:</span>
                              <span className="value">{msg.opportunity.location}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Bedrooms:</span>
                              <span className="value">{msg.opportunity.bedrooms}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Price:</span>
                              <span className="value">
                                AED {msg.opportunity.price.toLocaleString()} {msg.opportunity.frequency}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Status:</span>
                              <span className="value">{msg.opportunity.availability.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Furnishing:</span>
                              <span className="value">{msg.opportunity.furnishing}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Features:</span>
                              <div className="features-list">
                                {msg.opportunity.features.map((f, i) => (
                                  <span key={i} className="feature-tag">{f}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <button
                            className="quick-add-btn"
                            onClick={() => handleQuickAddOpportunity(msg.opportunity)}
                          >
                            <Zap size={16} /> Quick Add to Mary
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Message input */}
              <div className="message-input-area">
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
            <div className="empty-message-panel">
              <MessageCircle size={48} />
              <h3>Select a conversation to view messages</h3>
              <p>Choose a conversation from the list to view messages and opportunities</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Add Modal */}
      {showOpportunity && selectedOpportunity && (
        <div className="modal-overlay" onClick={() => setShowOpportunity(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quick Add Property to Mary</h3>
              <button className="close-btn" onClick={() => setShowOpportunity(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="extraction-preview">
                <h4>Extracted Information</h4>
                <div className="preview-grid">
                  <div className="preview-field">
                    <label>Property Type</label>
                    <p>{selectedOpportunity.type}</p>
                  </div>
                  <div className="preview-field">
                    <label>Location</label>
                    <p>{selectedOpportunity.location}</p>
                  </div>
                  <div className="preview-field">
                    <label>Bedrooms</label>
                    <p>{selectedOpportunity.bedrooms}</p>
                  </div>
                  <div className="preview-field">
                    <label>Price (Monthly)</label>
                    <p>AED {selectedOpportunity.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Additional Details</h4>
                <div className="form-group">
                  <label>Furnished Status</label>
                  <select defaultValue={selectedOpportunity.furnishing} className="form-input">
                    <option>furnished</option>
                    <option>semi_furnished</option>
                    <option>unfurnished</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Owner Relationship Type</label>
                  <select className="form-input">
                    <option>direct_owner</option>
                    <option>property_manager</option>
                    <option>broker</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Publish immediately</label>
                  <input type="checkbox" defaultChecked className="form-checkbox" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowOpportunity(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleConfirmAddToMary}>
                Add to Mary Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
