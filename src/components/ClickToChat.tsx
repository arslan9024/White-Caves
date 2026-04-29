import React, { FC, useState, useCallback, useEffect, useRef } from 'react';
import { Config } from '../config/constants';
import {
  ClickToChatContainer,
  ChatTrigger,
  ChatLabel,
  WhatsAppIconSmall,
  ChatPopup,
  ChatHeader,
  ChatHeaderInfo,
  ChatAvatar,
  ChatHeaderTitle,
  OnlineStatus,
  CloseChat,
  ChatBody,
  WelcomeMessage,
  QuickMessages,
  QuickLabel,
  QuickMessageBtn,
  CustomMessageForm,
  MessageInput,
  SendBtn,
  ContactAppsContainer,
  ChatAppBtn
} from './ClickToChat.styles';

interface QuickMessage {
  id: number;
  text: string;
  message: string;
}

interface ContactApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_AI_MESSAGES: ChatMessage[] = [
  { role: 'assistant', content: "Hi! I'm Zoe, your AI property assistant. How can I help you today? 🏠" },
];

const ClickToChat: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai' | 'contact'>('ai');
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>(INITIAL_AI_MESSAGES);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const rawPhone = import.meta.env.VITE_WHATSAPP_NUMBER || Config.COMPANY.WHATSAPP;
  // Sanitize phone: strip everything except digits, then ensure exactly one leading +
  const phoneDigits = rawPhone.replace(/[^\d]/g, '');
  const phoneNumber = `+${phoneDigits}`;
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  useEffect(() => {
    const checkOnlineStatus = () => {
      // Use Dubai time (UTC+4) regardless of user's local timezone
      const dubaiHour = parseInt(
        new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false }).format(new Date()),
        10
      );
      setIsOnline(dubaiHour >= 9 && dubaiHour < 22);
    };
    checkOnlineStatus();
    const interval = setInterval(checkOnlineStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close on Escape key and trap focus within popup
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
        triggerRef.current?.focus();
        return;
      }
      // Focus trap
      if (e.key === 'Tab' && popupRef.current) {
        const focusable = popupRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);
  
  const quickMessages: QuickMessage[] = [
    { id: 1, text: 'Property Inquiry', message: 'Hello! I would like to inquire about a property.' },
    { id: 2, text: 'Schedule Viewing', message: 'Hi! I would like to schedule a property viewing.' },
    { id: 3, text: 'Rental Information', message: 'Hello! I am interested in rental properties.' },
    { id: 4, text: 'Investment Advice', message: 'Hi! I would like to discuss investment opportunities.' },
    { id: 5, text: 'General Inquiry', message: 'Hello! I have a question about your services.' }
  ];

  const contactApps: ContactApp[] = [
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
      url: `botim://call?number=${phoneNumber}`,
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
      url: `https://gochat.me/${phoneNumber}`,
      color: '#FF6B00'
    },
    {
      id: 'call',
      name: 'Call Us',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="12" fill="#D4AF37" stroke="none"/>
          <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" strokeWidth="1.5" transform="translate(2, 2) scale(0.75)"/>
        </svg>
      ),
      url: `tel:${phoneNumber}`,
      color: '#D4AF37'
    }
  ];

  const openWhatsApp = useCallback((msgText: string) => {
    if (typeof window !== 'undefined') {
      if (!/^\+\d{7,15}$/.test(phoneNumber)) return; // Validate phone format
      const encodedMessage = encodeURIComponent(msgText);
      window.open(`https://wa.me/${phoneDigits}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    }
  }, [phoneNumber, phoneDigits]);

  const sendAiMessage = useCallback(async (text: string) => {
    if (!text.trim() || isAiTyping) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const updated = [...aiMessages, userMsg];
    setAiMessages(updated);
    setAiInput('');
    setIsAiTyping(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      if (!res.ok) throw new Error('API error');
      const data = (await res.json()) as { reply: string };
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setAiMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again or contact us directly via WhatsApp." },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  }, [aiMessages, isAiTyping]);

  // Scroll to latest message
  useEffect(() => {
    if (activeTab === 'ai') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiTyping, activeTab]);

  const handleQuickMessage = useCallback((msgText: string) => {
    openWhatsApp(msgText);
    setIsExpanded(false);
  }, [openWhatsApp]);

  const handleCustomMessage = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      openWhatsApp(message);
      setMessage('');
      setIsExpanded(false);
    }
  }, [message, openWhatsApp]);

  const openApp = useCallback((url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <ClickToChatContainer>
      <ChatTrigger
        ref={triggerRef}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Close chat widget' : 'Open chat widget'}
        aria-expanded={isExpanded}
        aria-haspopup="dialog"
        title="Chat with us"
      >
        <WhatsAppIconSmall viewBox="0 0 32 32" aria-hidden="true">
          <path fill="#25D366" d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16z"/>
          <path fill="white" d="M21.305 18.694c-0.372-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.186-0.837 0.186s-0.962 1.208-1.179 1.456c-0.217 0.248-0.434 0.279-0.806 0.093-0.372-0.186-1.571-0.579-2.991-1.845-1.105-0.986-1.851-2.203-2.068-2.575s-0.023-0.573 0.163-0.758c0.167-0.166 0.372-0.434 0.558-0.651 0.186-0.217 0.248-0.372 0.372-0.62 0.124-0.248 0.062-0.465-0.031-0.651-0.093-0.186-0.837-2.015-1.147-2.759-0.303-0.724-0.611-0.626-0.837-0.638-0.217-0.011-0.465-0.014-0.713-0.014s-0.651 0.093-0.992 0.465c-0.341 0.372-1.301 1.270-1.301 3.099s1.332 3.594 1.518 3.842c0.186 0.248 2.625 4.008 6.359 5.622 0.888 0.384 1.581 0.613 2.122 0.785 0.892 0.283 1.704 0.243 2.347 0.147 0.716-0.107 2.197-0.898 2.507-1.766s0.31-1.611 0.217-1.766c-0.093-0.155-0.341-0.248-0.713-0.434z"/>
        </WhatsAppIconSmall>
        <ChatLabel>Chat</ChatLabel>
      </ChatTrigger>

      {isExpanded && (
        <ChatPopup ref={popupRef} role="dialog" aria-modal="true" aria-label="White Caves chat support">
          <ChatHeader>
            <ChatHeaderInfo>
              <ChatAvatar src={`${baseUrl}company-logo.jpg`.replace('//', '/')} alt="White Caves" />
              <div>
                <ChatHeaderTitle>White Caves Support</ChatHeaderTitle>
                <OnlineStatus $isOnline={isOnline}>
                  {isOnline ? 'Online now' : 'Away - Leave a message'}
                </OnlineStatus>
              </div>
            </ChatHeaderInfo>
            <CloseChat onClick={() => { setIsExpanded(false); triggerRef.current?.focus(); }} aria-label="Close chat">×</CloseChat>
          </ChatHeader>
          
          <ChatBody>
            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('ai')}
                style={{
                  flex: 1, padding: '0.6rem', border: 'none', cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.85rem', background: 'none', borderBottom: activeTab === 'ai' ? '2px solid #E31E24' : '2px solid transparent',
                  color: activeTab === 'ai' ? '#E31E24' : '#6b7280', transition: 'all 0.2s',
                }}
                aria-selected={activeTab === 'ai'}
              >
                🤖 AI Chat
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                style={{
                  flex: 1, padding: '0.6rem', border: 'none', cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.85rem', background: 'none', borderBottom: activeTab === 'contact' ? '2px solid #25D366' : '2px solid transparent',
                  color: activeTab === 'contact' ? '#25D366' : '#6b7280', transition: 'all 0.2s',
                }}
                aria-selected={activeTab === 'contact'}
              >
                💬 Contact Us
              </button>
            </div>

            {activeTab === 'ai' ? (
              <>
                {/* AI message list */}
                <div style={{ height: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.25rem 0' }}>
                  {aiMessages.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '80%', padding: '0.5rem 0.75rem', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          background: msg.role === 'user' ? '#E31E24' : '#f3f4f6',
                          color: msg.role === 'user' ? '#fff' : '#111827',
                          fontSize: '0.82rem', lineHeight: 1.4,
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{ padding: '0.5rem 0.75rem', borderRadius: '12px 12px 12px 2px', background: '#f3f4f6', color: '#6b7280', fontSize: '0.82rem', fontStyle: 'italic' }}>
                        Zoe is typing…
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* AI input */}
                <form
                  onSubmit={e => { e.preventDefault(); sendAiMessage(aiInput); }}
                  style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}
                >
                  <input
                    type="text"
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    placeholder="Ask Zoe anything…"
                    disabled={isAiTyping}
                    aria-label="Ask Zoe"
                    style={{
                      flex: 1, padding: '0.5rem 0.75rem', borderRadius: 20, border: '1px solid #e5e7eb',
                      fontSize: '0.85rem', outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!aiInput.trim() || isAiTyping}
                    aria-label="Send to Zoe"
                    style={{
                      background: '#E31E24', color: '#fff', border: 'none', borderRadius: '50%',
                      width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: aiInput.trim() && !isAiTyping ? 'pointer' : 'not-allowed', flexShrink: 0,
                      opacity: aiInput.trim() && !isAiTyping ? 1 : 0.5,
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <>
                <WelcomeMessage>
                  <p>Welcome to White Caves Real Estate! How can we assist you today?</p>
                </WelcomeMessage>

                <ContactAppsContainer>
                  <QuickLabel>Contact us via:</QuickLabel>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {contactApps.map((app) => (
                      <ChatAppBtn
                        key={app.id}
                        onClick={() => openApp(app.url)}
                        aria-label={`Contact us via ${app.name}`}
                        title={app.name}
                        $appColor={app.color}
                      >
                        {app.icon}
                        <span>{app.name}</span>
                      </ChatAppBtn>
                    ))}
                  </div>
                </ContactAppsContainer>

                <QuickMessages>
                  <QuickLabel>Quick Messages:</QuickLabel>
                  {quickMessages.map((item) => (
                    <QuickMessageBtn
                      key={item.id}
                      onClick={() => handleQuickMessage(item.message)}
                    >
                      {item.text}
                    </QuickMessageBtn>
                  ))}
                </QuickMessages>

                <CustomMessageForm onSubmit={handleCustomMessage}>
                  <MessageInput
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    aria-label="Type your message"
                  />
                  <SendBtn type="submit" disabled={!message.trim()} aria-label="Send message">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </SendBtn>
                </CustomMessageForm>
              </>
            )}
          </ChatBody>
        </ChatPopup>
      )}
    </ClickToChatContainer>
  );
};

export default ClickToChat;
