import React from 'react';
import { Send } from 'lucide-react';
import { ChatContact } from './types';

export interface ChatViewportProps {
  activeContact: ChatContact | null;
  messageInput: string;
  onMessageInputChange: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onOpenNewChat: () => void;
}

export const ChatViewport: React.FC<ChatViewportProps> = ({
  activeContact,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  onOpenNewChat,
}) => {
  if (!activeContact) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--white, #FFFFFF)',
          borderRadius: '14px',
          border: '1px solid var(--text-secondary, #E2E8F0)',
          color: 'var(--text-secondary, #64748B)',
          padding: '2rem',
        }}
      >
        <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</span>
        <p style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', textAlign: 'center' }}>
          No Active Conversation Selected
        </p>
        <p style={{ margin: '4px 0 1rem 0', fontSize: '0.82rem', textAlign: 'center' }}>
          Start a new chat thread or link your WhatsApp device to load real incoming messages on +971 50 576 0056.
        </p>
        <button
          onClick={onOpenNewChat}
          style={{
            background: 'var(--color-06b6d4, #06B6D4)',
            color: 'var(--white, #FFFFFF)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          + Start Live WhatsApp Chat
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--white, #FFFFFF)',
        border: '1px solid var(--text-secondary, #E2E8F0)',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Chat Top Header */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          background: 'var(--color-f8fafc, #F8FAFC)',
          borderBottom: '1px solid var(--text-secondary, #E2E8F0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem' }}>{activeContact.avatar}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
              {activeContact.name}
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-25d366, #25D366)', fontWeight: 700 }}>
              {activeContact.phone} · <span style={{ color: 'var(--text-secondary, #64748B)' }}>{activeContact.tag}</span>
            </span>
          </div>
        </div>
        <span
          style={{
            background: 'rgba(37, 211, 102, 0.12)',
            color: 'var(--color-25d366, #25D366)',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '6px',
          }}
        >
          ✓ Linked Line: +971 50 576 0056
        </span>
      </div>

      {/* Messages Stream */}
      <div
        style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          background: 'var(--color-f1f5f9, #F1F5F9)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        {activeContact.messages.length > 0 ? (
          activeContact.messages.map(msg => {
            const isMe = msg.sender === 'arslan' || msg.sender === 'nina';
            const isNina = msg.sender === 'nina';

            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: isMe ? (isNina ? 'linear-gradient(135deg, #0F172A 0%, #164E63 100%)' : '#25D366') : '#FFFFFF',
                  color: isMe ? '#FFFFFF' : '#1E293B',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  border: isMe ? 'none' : '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: isMe ? 'var(--color-38bdf8, #38BDF8)' : 'var(--color-06b6d4, #06B6D4)',
                    }}
                  >
                    {msg.senderName}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary, #64748B)' }}>
                    {msg.timestamp}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.45 }}>{msg.text}</p>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary, #64748B)' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700 }}>
              Type your first message below to send a live WhatsApp message from <strong>+971 50 576 0056</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={onSendMessage}
        style={{
          padding: '0.85rem 1.25rem',
          background: 'var(--white, #FFFFFF)',
          borderTop: '1px solid var(--text-secondary, #E2E8F0)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Type live WhatsApp reply from +971 50 576 0056..."
          value={messageInput}
          onChange={e => onMessageInputChange(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1.5px solid #CBD5E1',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#25D366',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
          }}
        >
          <Send size={16} /> Send Reply
        </button>
      </form>
    </div>
  );
};

