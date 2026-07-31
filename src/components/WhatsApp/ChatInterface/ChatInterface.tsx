/**
 * ChatInterface Component
 *
 * Main WhatsApp chat interface with message list and composer.
 * Supports a prop-driven interface for easy testing.
 */

import React, { useState, useEffect, useRef } from 'react';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MAX_VISIBLE = 50;

const getViewportClass = () => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
  if (w <= 480) return 'mobile';
  if (w <= 768) return 'tablet';
  return 'desktop';
};

export interface ChatMessage {
  id: string;
  content: string;
  fromMe: boolean;
  timestamp: Date | string;
  status?: string;
  contentType?: string;
}

interface ChatInterfaceProps {
  conversationId?: string;
  contactName: string;
  contactNumber: string;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void | Promise<void>;
  onSendMedia?: (file: File) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  contactName,
  contactNumber,
  messages,
  onSendMessage,
  onSendMedia,
  isLoading = false,
  error = null,
}) => {
  const [messageText, setMessageText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [viewportClass] = useState(getViewportClass);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    textInputRef.current?.focus();
  }, []);

  const doSend = async (text: string) => {
    setSendError(null);
    setPendingText(null);
    try {
      await onSendMessage(text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message';
      setSendError(msg);
      setPendingText(text);
    }
  };

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || isLoading) return;
    setMessageText('');
    await doSend(text);
  };

  const handleRetry = async () => {
    if (pendingText) await doSend(pendingText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendMedia) onSendMedia(file);
  };

  // Virtualize: render only last MAX_VISIBLE messages
  const visibleMessages = messages.slice(-MAX_VISIBLE);

  return (
    <div
      data-testid="chat-interface"
      className={`chat-interface ${viewportClass}`}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Screen-reader live region */}
      <div role="status" aria-live="polite" style={{ position: 'absolute', left: '-9999px' }} />

      {/* Header */}
      <div className="chat-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-e0e0e0, #e0e0e0)', background: 'var(--color-f5f5f5, #f5f5f5)' }}>
        <div className="contact-name" style={{ fontWeight: 600 }}>{contactName}</div>
        <div className="contact-number" style={{ fontSize: 12, color: 'var(--color-666, #666)' }}>{contactNumber}</div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div data-testid="chat-loading" style={{ padding: 16, textAlign: 'center' }}>
          Loading messages...
        </div>
      )}

      {/* External error */}
      {error && (
        <div role="alert" style={{ padding: '8px 16px', background: 'var(--color-f8d7da, #f8d7da)', color: 'var(--color-721c24, #721c24)' }}>
          {error}
        </div>
      )}

      {/* Send error + retry */}
      {sendError && (
        <div role="alert" style={{ padding: '8px 16px', background: 'var(--color-fff3cd, #fff3cd)', color: 'var(--color-856404, #856404)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{sendError}</span>
          <button type="button" aria-label="Retry" onClick={handleRetry} style={{ background: 'none', border: '1px solid currentColor', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="messages-list" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {visibleMessages.map((msg, index) => {
          const d = new Date(msg.timestamp);
          const dateStr = `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
          const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const prev = index > 0 ? new Date(visibleMessages[index - 1].timestamp) : null;
          const showDateSeparator =
            !prev ||
            prev.getFullYear() !== d.getFullYear() ||
            prev.getMonth() !== d.getMonth() ||
            prev.getDate() !== d.getDate();
          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#999',
                    textAlign: 'center',
                    margin: '4px 0 8px',
                  }}
                >
                  {dateStr}
                </div>
              )}
              <div
                data-testid={`message-${msg.id}`}
                className={`message ${msg.fromMe ? 'sent' : 'received'}`}
                style={{ display: 'flex', justifyContent: msg.fromMe ? 'flex-end' : 'flex-start', marginBottom: 8 }}
              >
                <div>
                  <div style={{ background: msg.fromMe ? 'var(--color-25d366, #25d366)' : 'var(--color-e5e5ea, #e5e5ea)', padding: '8px 12px', borderRadius: 8 }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-999, #999)', marginTop: 2 }}>
                    {timeStr}
                  </div>
                  <div data-testid="message-status" style={{ fontSize: 11, color: 'var(--color-aaa, #aaa)' }}>
                    {msg.status || 'sent'}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--color-e0e0e0, #e0e0e0)', background: 'var(--color-f5f5f5, #f5f5f5)', alignItems: 'center' }}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {/* Attach button */}
        <button
          type="button"
          aria-label="Attach media"
          tabIndex={-1}
          onClick={() => fileInputRef.current?.click()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}
        >
          📎
        </button>

        <input
          ref={textInputRef}
          type="text"
          placeholder="Type a message"
          aria-label="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoFocus
          style={{ flex: 1, padding: '8px 12px', borderRadius: 20, border: '1px solid var(--color-ddd, #ddd)', fontSize: 14, outline: 'none' }}
        />

        <button
          type="submit"
          aria-label="Send"
          disabled={!messageText.trim() || isLoading}
          style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--color-25d366, #25d366)', color: 'white', cursor: 'pointer', fontSize: 18 }}
        >
          ➤
        </button>
      </form>
    </div>
  );
};
