// FILE: src/components/crm/LindaWhatsAppCRM/LindaChatThreadPane.tsx
/**
 * White Caves Real Estate LLC - Linda WhatsApp Web Chat Thread Pane
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import {
  Send,
  Sparkles,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Bot,
} from 'lucide-react';
import type { LindaConversationItem } from './LindaWhatsAppCRM.data';

export interface ChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'bot';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface LindaChatThreadPaneProps {
  isDark: boolean;
  selectedConv: LindaConversationItem | undefined;
  activeMessages: ChatMessage[];
  inputMessage: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onAiDraft: () => void;
}

export const LindaChatThreadPane: FC<LindaChatThreadPaneProps> = ({
  isDark,
  selectedConv,
  activeMessages,
  inputMessage,
  onInputChange,
  onSend,
  onAiDraft,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: isDark ? '#0B141A' : '#EFEAE2',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 16px',
          background: isDark ? '#202C33' : '#F0F2F5',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #D1D7DB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: selectedConv?.gorahaSaved ? '#059669' : '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {selectedConv?.contactName.slice(0, 2).toUpperCase() || 'WA'}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#E9EDEF' : '#111B21' }}>
              {selectedConv?.contactName || 'No Conversation Selected'}
            </div>
            <div style={{ fontSize: 11, color: isDark ? '#8696A0' : '#667781' }}>
              {selectedConv?.phone} · <span style={{ color: '#25D366' }}>{selectedConv?.unit}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onAiDraft}
            data-testid="linda-ai-draft-btn"
            style={{
              background: 'rgba(37, 211, 102, 0.15)',
              border: '1px solid #25D366',
              color: isDark ? '#4ADE80' : '#15803D',
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <Sparkles size={12} /> Linda Copilot Draft
          </button>
          <Phone size={17} color={isDark ? '#AEBAC1' : '#54656F'} style={{ cursor: 'pointer' }} />
          <Video size={17} color={isDark ? '#AEBAC1' : '#54656F'} style={{ cursor: 'pointer' }} />
          <MoreVertical size={17} color={isDark ? '#AEBAC1' : '#54656F'} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* Message Thread Body */}
      <div
        data-testid="wa-message-thread"
        style={{
          flex: 1,
          padding: '20px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(17,27,33,0.9) 0%, rgba(11,20,26,1) 100%)'
            : 'radial-gradient(ellipse at center, rgba(240,242,245,0.7) 0%, rgba(239,234,226,1) 100%)',
        }}
      >
        {activeMessages.map(msg => {
          const isOutbound = msg.sender === 'agent' || msg.sender === 'bot';
          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isOutbound ? 'flex-end' : 'flex-start',
                maxWidth: '72%',
                background: isOutbound
                  ? isDark
                    ? '#005C4B'
                    : '#D9FDD3'
                  : isDark
                  ? '#202C33'
                  : '#FFFFFF',
                color: isDark ? '#E9EDEF' : '#111B21',
                borderRadius: 10,
                padding: '8px 12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                fontSize: 13,
                lineHeight: '18px',
              }}
            >
              {msg.sender === 'bot' && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: isDark ? '#25D366' : '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  <Bot size={11} /> AI Auto-Assisted (Linda)
                </div>
              )}
              <div>{msg.text}</div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 4,
                  fontSize: 10,
                  color: isDark ? '#8696A0' : '#667781',
                }}
              >
                <span>{msg.timestamp}</span>
                {isOutbound && <CheckCheck size={12} color="#53BDEB" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Dock */}
      <div
        style={{
          padding: '10px 16px',
          background: isDark ? '#202C33' : '#F0F2F5',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #D1D7DB',
        }}
      >
        <Smile size={20} color={isDark ? '#8696A0' : '#54656F'} style={{ cursor: 'pointer' }} />
        <Paperclip size={20} color={isDark ? '#8696A0' : '#54656F'} style={{ cursor: 'pointer' }} />
        <input
          type="text"
          placeholder="Type a message (or click Linda Copilot Draft)..."
          data-testid="wa-message-input"
          value={inputMessage}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') onSend();
          }}
          style={{
            flex: 1,
            background: isDark ? '#2A3942' : '#FFFFFF',
            border: 'none',
            outline: 'none',
            borderRadius: 8,
            padding: '10px 14px',
            color: isDark ? '#D1D7DB' : '#111B21',
            fontSize: 13,
          }}
        />
        <button
          onClick={onSend}
          data-testid="wa-send-btn"
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#25D366',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#FFFFFF',
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
