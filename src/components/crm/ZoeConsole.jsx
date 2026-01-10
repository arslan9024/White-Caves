import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, Bot, User, Calendar, BarChart3, Users, Phone, 
  List, Workflow, Loader2, ChevronRight, Clock, Sparkles,
  MessageSquare, History, Trash2, RefreshCw
} from 'lucide-react';
import { getAuth } from 'firebase/auth';
import './ZoeConsole.css';

const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

const QUICK_ACTIONS = [
  { id: 'briefing', label: 'Daily Briefing', icon: Calendar, query: "Give me today's briefing" },
  { id: 'metrics', label: 'View Metrics', icon: BarChart3, query: 'Show me current statistics' },
  { id: 'leads', label: 'Lead Status', icon: Users, query: 'How many leads do we have?' },
  { id: 'contacts', label: 'Find Contact', icon: Phone, query: 'Who should I contact about commercial leasing?' },
  { id: 'services', label: 'Our Services', icon: List, query: 'List all services we offer' },
  { id: 'process', label: 'Sales Process', icon: Workflow, query: 'Walk me through the sales journey' }
];

const MessageBubble = ({ message, isUser }) => {
  const formatResponse = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} className="response-heading">{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.startsWith('• **')) {
        const parts = line.replace('• **', '').split('**');
        return (
          <div key={i} className="response-item">
            <span className="item-bullet">•</span>
            <strong>{parts[0]}</strong>
            {parts[1]}
          </div>
        );
      }
      if (line.startsWith('• ')) {
        return (
          <div key={i} className="response-item">
            <span className="item-bullet">•</span>
            {line.replace('• ', '')}
          </div>
        );
      }
      if (line.match(/^\d+\.\s\*\*/)) {
        const match = line.match(/^(\d+)\.\s\*\*([^*]+)\*\*\s*-?\s*(.*)/);
        if (match) {
          return (
            <div key={i} className="response-step">
              <span className="step-number">{match[1]}</span>
              <div className="step-content">
                <strong>{match[2]}</strong>
                {match[3] && <span className="step-desc"> - {match[3]}</span>}
              </div>
            </div>
          );
        }
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*([^*]+)\*\*/g);
        return (
          <p key={i} className="response-paragraph">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        );
      }
      if (line.trim()) {
        return <p key={i} className="response-paragraph">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      <div className="message-content">
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <div className="formatted-response">
            {formatResponse(message.text)}
          </div>
        )}
        <div className="message-meta">
          <Clock size={12} />
          <span>{new Date(message.timestamp).toLocaleTimeString('en-AE', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}</span>
          {!isUser && message.confidence && (
            <span className="confidence-badge">
              <Sparkles size={12} />
              {Math.round(message.confidence * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const ZoeConsole = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const session = localStorage.getItem('zoe_session_id') || crypto.randomUUID();
    localStorage.setItem('zoe_session_id', session);
    setSessionId(session);

    setMessages([{
      id: 'welcome',
      text: "Hello! I'm **Zoe**, your Executive AI Assistant. I can help you with:\n\n• **Department Info** - Find who handles what\n• **Services** - Learn about our offerings\n• **Processes** - Understand our workflows\n• **Contacts** - Get the right person's details\n• **Daily Briefing** - Get today's summary\n• **Metrics** - View current statistics\n\nHow can I assist you today?",
      isUser: false,
      timestamp: new Date(),
      confidence: 1
    }]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        setMessages(prev => [...prev, {
          id: `auth-${Date.now()}`,
          text: "**Executive Access Required**\n\nPlease sign in with an authorized executive account to use Zoe's knowledge base. This feature is restricted to company executives for security purposes.",
          isUser: false,
          timestamp: new Date(),
          confidence: 0
        }]);
        setIsLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'x-user-id': 'executive-user',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('/api/zoe/query', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: text.trim(),
          sessionId
        })
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setMessages(prev => [...prev, {
          id: `auth-error-${Date.now()}`,
          text: data.message || "**Access Denied**\n\nYour account is not authorized for executive access. Please contact the administrator.",
          isUser: false,
          timestamp: new Date(),
          confidence: 0
        }]);
        return;
      }

      if (data.success) {
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          intent: data.intent,
          confidence: data.metadata?.confidence
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
        confidence: 0
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading, sessionId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (query) => {
    sendMessage(query);
  };

  const loadHistory = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.log('No auth token available for history');
        return;
      }
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      const response = await fetch(`/api/zoe/history?sessionId=${sessionId}&limit=20`, { headers });
      if (response.status === 401 || response.status === 403) {
        console.log('Not authorized to view history');
        return;
      }
      const data = await response.json();
      if (data.success) {
        setConversationHistory(data.history);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const clearConversation = () => {
    setMessages([{
      id: 'welcome-new',
      text: "Conversation cleared. How can I help you?",
      isUser: false,
      timestamp: new Date(),
      confidence: 1
    }]);
  };

  const toggleHistory = () => {
    if (!showHistory) {
      loadHistory();
    }
    setShowHistory(!showHistory);
  };

  return (
    <div className="zoe-console">
      <div className="console-header">
        <div className="console-title">
          <div className="zoe-avatar">
            <Bot size={24} />
          </div>
          <div className="title-text">
            <h3>Zoe AI Console</h3>
            <span className="status-indicator">
              <span className="status-dot"></span>
              Online
            </span>
          </div>
        </div>
        <div className="console-actions">
          <button 
            className={`action-btn ${showHistory ? 'active' : ''}`}
            onClick={toggleHistory}
            title="View History"
          >
            <History size={18} />
          </button>
          <button 
            className="action-btn"
            onClick={clearConversation}
            title="Clear Conversation"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="console-body">
        {showHistory && (
          <div className="history-sidebar">
            <div className="history-header">
              <h4><History size={16} /> Recent Queries</h4>
              <button onClick={() => setShowHistory(false)}>×</button>
            </div>
            <div className="history-list">
              {conversationHistory.length === 0 ? (
                <p className="no-history">No previous queries</p>
              ) : (
                conversationHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className="history-item"
                    onClick={() => {
                      sendMessage(item.query);
                      setShowHistory(false);
                    }}
                  >
                    <span className="history-query">{item.query}</span>
                    <span className="history-intent">{item.intent}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="chat-area">
          <div className="quick-actions">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.id}
                className="quick-action-btn"
                onClick={() => handleQuickAction(action.query)}
                disabled={isLoading}
              >
                <action.icon size={14} />
                {action.label}
              </button>
            ))}
          </div>

          <div className="messages-container">
            {messages.map(message => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isUser={message.isUser} 
              />
            ))}
            {isLoading && (
              <div className="message-bubble assistant loading">
                <div className="message-avatar">
                  <Bot size={18} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <Loader2 size={16} className="spinning" />
                    <span>Zoe is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Zoe anything about the company..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? <Loader2 size={18} className="spinning" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ZoeConsole;
