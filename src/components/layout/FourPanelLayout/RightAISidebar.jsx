import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, Send, Zap, Phone, FileText, Settings } from 'lucide-react';
import { getAllAssistants } from '../../../config/assistantRegistry';
import './RightAISidebar.css';

/**
 * RightAISidebar Component
 * 
 * AI Assistant Hub featuring all 32 assistants:
 * - Display all assistants with avatars, roles, status
 * - Context-aware tooling (shows relevant assistant for current task)
 * - Direct chat interface with selected assistant
 * - Quick action buttons
 * - Department grouping and search
 * - Assistant status indicators
 * - Performance metrics
 * - Integration quick-links
 */

export default function RightAISidebar({ activeAssistant: initialActive }) {
  const dispatch = useDispatch();
  const [activeAssistant, setActiveAssistant] = useState(initialActive || 'zoe');
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [expandedDept, setExpandedDept] = useState(null);
  
  const allAssistants = getAllAssistants();
  const selectedAssistant = allAssistants.find(a => a.id === activeAssistant);
  
  // Redux state
  const selectedObject = useSelector(state => state.navigation?.selectedObject);
  const contextualAssistants = useSelector(state => state.ai?.contextualAssistants || []);
  
  // Group assistants by department
  const assistantsByDept = allAssistants.reduce((acc, assistant) => {
    if (!acc[assistant.department]) {
      acc[assistant.department] = [];
    }
    acc[assistant.department].push(assistant);
    return acc;
  }, {});
  
  // Filter based on search
  const getFilteredAssistants = (dept) => {
    if (!searchQuery) return assistantsByDept[dept] || [];
    return (assistantsByDept[dept] || []).filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
    
    // Simulate assistant response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: `${selectedAssistant?.name} is processing your request: "${newMessage}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 500);
  };
  
  const selectAssistant = (assistantId) => {
    setActiveAssistant(assistantId);
    setChatMessages([]);
    dispatch({
      type: 'SELECT_ASSISTANT',
      payload: assistantId
    });
  };
  
  const getDeptColor = (dept) => {
    const colorMap = {
      communications: '#25D366',
      operations: '#3B82F6',
      sales: '#8B5CF6',
      finance: '#F59E0B',
      marketing: '#EC4899',
      executive: '#10B981',
      compliance: '#6366F1',
      technology: '#0EA5E9',
      legal: '#DC2626',
      intelligence: '#0D9488'
    };
    return colorMap[dept] || '#6B7280';
  };
  
  return (
    <div className="right-sidebar-content">
      {/* Header */}
      <div className="sidebar-header">
        <h2>AI Assistants</h2>
        <p className="sidebar-subtitle">32 Specialists</p>
      </div>
      
      {/* Contextual Suggestions */}
      {selectedObject && contextualAssistants.length > 0 && (
        <div className="contextual-section">
          <p className="contextual-label">For this object:</p>
          <div className="contextual-assistants">
            {contextualAssistants.slice(0, 3).map(assistantId => {
              const assistant = allAssistants.find(a => a.id === assistantId);
              return assistant ? (
                <button
                  key={assistantId}
                  className="contextual-btn"
                  onClick={() => selectAssistant(assistantId)}
                  title={assistant.name}
                >
                  <span>{assistant.avatar}</span>
                  <span className="contextual-name">{assistant.name}</span>
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={`tab ${showChat ? 'active' : ''}`}
          onClick={() => setShowChat(true)}
        >
          <MessageSquare size={16} />
          <span>Chat</span>
        </button>
        <button
          className={`tab ${!showChat ? 'active' : ''}`}
          onClick={() => setShowChat(false)}
        >
          <Zap size={16} />
          <span>All</span>
        </button>
      </div>
      
      {/* Chat View */}
      {showChat && selectedAssistant && (
        <div className="chat-view">
          {/* Assistant Info */}
          <div className="assistant-header">
            <div className="assistant-avatar">{selectedAssistant.avatar}</div>
            <div className="assistant-info">
              <h3>{selectedAssistant.name}</h3>
              <p className="assistant-role">{selectedAssistant.title}</p>
              <span className="online-status">🟢 Online</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="action-btn" title="Call">
              <Phone size={16} />
            </button>
            <button className="action-btn" title="Documents">
              <FileText size={16} />
            </button>
            <button className="action-btn" title="Settings">
              <Settings size={16} />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="empty-chat">
                <p className="empty-title">Start a conversation</p>
                <p className="empty-subtitle">Ask {selectedAssistant.name} anything related to {selectedAssistant.title.toLowerCase()}</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="message-content">
                    <p>{msg.content}</p>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Chat Input */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder={`Ask ${selectedAssistant.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      
      {/* All Assistants View */}
      {!showChat && (
        <div className="assistants-list-view">
          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search assistants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* Departments */}
          <div className="departments-container">
            {Object.keys(assistantsByDept).map(dept => {
              const filtered = getFilteredAssistants(dept);
              if (filtered.length === 0 && searchQuery) return null;
              
              return (
                <div key={dept} className="department-group">
                  <button
                    className="department-header"
                    onClick={() => setExpandedDept(expandedDept === dept ? null : dept)}
                    style={{ borderLeftColor: getDeptColor(dept) }}
                  >
                    <span className="dept-name">
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </span>
                    <span className="dept-count">{filtered.length}</span>
                  </button>
                  
                  {expandedDept === dept && (
                    <div className="assistants-in-dept">
                      {filtered.map(assistant => (
                        <button
                          key={assistant.id}
                          className={`assistant-item ${activeAssistant === assistant.id ? 'active' : ''}`}
                          onClick={() => selectAssistant(assistant.id)}
                        >
                          <span className="assistant-avatar">{assistant.avatar}</span>
                          <div className="assistant-details">
                            <p className="assistant-name">{assistant.name}</p>
                            <p className="assistant-title">{assistant.title}</p>
                          </div>
                          <span className="status-dot"></span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
