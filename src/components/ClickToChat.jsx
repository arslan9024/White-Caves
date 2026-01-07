import React, { useState, useCallback, useEffect } from 'react';
import './ClickToChat.css';

export default function ClickToChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '971563616136';
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  useEffect(() => {
    const checkOnlineStatus = () => {
      const hour = new Date().getHours();
      setIsOnline(hour >= 9 && hour < 22);
    };
    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const quickMessages = [
    { id: 1, text: 'Property Inquiry', message: 'Hello! I would like to inquire about a property.' },
    { id: 2, text: 'Schedule Viewing', message: 'Hi! I would like to schedule a property viewing.' },
    { id: 3, text: 'Rental Information', message: 'Hello! I am interested in rental properties.' },
    { id: 4, text: 'Investment Advice', message: 'Hi! I would like to discuss investment opportunities.' },
    { id: 5, text: 'General Inquiry', message: 'Hello! I have a question about your services.' }
  ];

  const contactApps = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 32 32" width="24" height="24">
          <path fill="#25D366" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16z"/>
          <path fill="white" d="M21.305 18.694c-0.372-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.186-0.837 0.186s-0.962 1.208-1.179 1.456c-0.217 0.248-0.434 0.279-0.806 0.093-0.372-0.186-1.571-0.579-2.991-1.845-1.105-0.986-1.851-2.203-2.068-2.575s-0.023-0.573 0.163-0.758c0.167-0.166 0.372-0.434 0.558-0.651 0.186-0.217 0.248-0.372 0.372-0.62 0.124-0.248 0.062-0.465-0.031-0.651-0.093-0.186-0.837-2.015-1.147-2.759-0.303-0.724-0.611-0.626-0.837-0.638-0.217-0.011-0.465-0.014-0.713-0.014s-0.651 0.093-0.992 0.465c-0.341 0.372-1.301 1.270-1.301 3.099s1.332 3.594 1.518 3.842c0.186 0.248 2.625 4.008 6.359 5.622 0.888 0.384 1.581 0.613 2.122 0.785 0.892 0.283 1.704 0.243 2.347 0.147 0.716-0.107 2.197-0.898 2.507-1.766s0.31-1.611 0.217-1.766c-0.093-0.155-0.341-0.248-0.713-0.434z"/>
        </svg>
      ),
      url: `https://wa.me/${phoneNumber}`,
      color: '#25D366'
    },
    {
      id: 'botim',
      name: 'Botim',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="12" fill="#00C853"/>
          <path fill="white" d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      ),
      url: `botim://call?number=+${phoneNumber}`,
      color: '#00C853'
    },
    {
      id: 'gochat',
      name: 'GoChat UAE',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="12" fill="#FF6B00"/>
          <path fill="white" d="M17 8H7c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h8l4 4V10c0-1.1-.9-2-2-2zm-1 6H8v-1h8v1zm0-2H8v-1h8v1z"/>
        </svg>
      ),
      url: `https://gochat.me/+${phoneNumber}`,
      color: '#FF6B00'
    },
    {
      id: 'call',
      name: 'Call Us',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="12" fill="#DC2626" stroke="none"/>
          <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" strokeWidth="1.5" transform="translate(2, 2) scale(0.75)"/>
        </svg>
      ),
      url: `tel:+${phoneNumber}`,
      color: '#DC2626'
    }
  ];

  const openWhatsApp = useCallback((msgText) => {
    if (typeof window !== 'undefined') {
      const encodedMessage = encodeURIComponent(msgText);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }
  }, [phoneNumber]);

  const handleQuickMessage = useCallback((msgText) => {
    openWhatsApp(msgText);
    setIsExpanded(false);
  }, [openWhatsApp]);

  const handleCustomMessage = useCallback((e) => {
    e.preventDefault();
    if (message.trim()) {
      openWhatsApp(message);
      setMessage('');
      setIsExpanded(false);
    }
  }, [message, openWhatsApp]);

  const openApp = (url) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`click-to-chat ${isExpanded ? 'expanded' : ''}`}>
      {isExpanded && (
        <div className="chat-popup">
          <div className="chat-header">
            <div className="chat-header-info">
              <img src={`${baseUrl}company-logo.jpg`.replace('//', '/')} alt="White Caves" className="chat-avatar" />
              <div>
                <h4>White Caves Support</h4>
                <span className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? 'Online now' : 'Away - Leave a message'}
                </span>
              </div>
            </div>
            <button className="close-chat" onClick={() => setIsExpanded(false)}>×</button>
          </div>
          
          <div className="chat-body">
            <div className="welcome-message">
              <p>Welcome to White Caves Real Estate! How can we assist you today?</p>
            </div>

            <div className="contact-apps">
              <p className="apps-label">Contact us via:</p>
              <div className="apps-grid">
                {contactApps.map((app) => (
                  <button
                    key={app.id}
                    className="contact-app-btn"
                    onClick={() => openApp(app.url)}
                    style={{ '--app-color': app.color }}
                    title={app.name}
                  >
                    {app.icon}
                    <span>{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="quick-messages">
              <p className="quick-label">Quick Messages:</p>
              {quickMessages.map((item) => (
                <button 
                  key={item.id} 
                  className="quick-message-btn"
                  onClick={() => handleQuickMessage(item.message)}
                >
                  {item.text}
                </button>
              ))}
            </div>
            
            <form className="custom-message-form" onSubmit={handleCustomMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
              />
              <button type="submit" className="send-btn" disabled={!message.trim()}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            <div className="star-invitation">
              <p>Love our service? Leave us a review!</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="star" onClick={() => openApp('https://g.page/r/whitecaves/review')}>★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <button 
        className="chat-trigger" 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Close chat' : 'Open WhatsApp chat'}
      >
        {isExpanded ? (
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 32 32" className="whatsapp-icon">
            <path fill="currentColor" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.924 0-7.435 6.050-13.485 13.485-13.485s13.485 6.050 13.485 13.485c0 7.435-6.050 13.485-13.485 13.485zM21.305 18.694c-0.372-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.186-0.837 0.186s-0.962 1.208-1.179 1.456c-0.217 0.248-0.434 0.279-0.806 0.093-0.372-0.186-1.571-0.579-2.991-1.845-1.105-0.986-1.851-2.203-2.068-2.575s-0.023-0.573 0.163-0.758c0.167-0.166 0.372-0.434 0.558-0.651 0.186-0.217 0.248-0.372 0.372-0.62 0.124-0.248 0.062-0.465-0.031-0.651-0.093-0.186-0.837-2.015-1.147-2.759-0.303-0.724-0.611-0.626-0.837-0.638-0.217-0.011-0.465-0.014-0.713-0.014s-0.651 0.093-0.992 0.465c-0.341 0.372-1.301 1.270-1.301 3.099s1.332 3.594 1.518 3.842c0.186 0.248 2.625 4.008 6.359 5.622 0.888 0.384 1.581 0.613 2.122 0.785 0.892 0.283 1.704 0.243 2.347 0.147 0.716-0.107 2.197-0.898 2.507-1.766s0.31-1.611 0.217-1.766c-0.093-0.155-0.341-0.248-0.713-0.434z"/>
          </svg>
        )}
        {!isExpanded && <span className="chat-label">Chat with us</span>}
      </button>
    </div>
  );
}
