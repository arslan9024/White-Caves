// FILE: src/components/crm/LindaWhatsAppCRM/LindaLiveWhatsAppWeb.tsx
/**
 * White Caves Real Estate LLC - Linda WhatsApp Web Dual-Pane Live Client
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { useState, useMemo, FC } from 'react';
import {
  Search,
  Send,
  Sparkles,
  CheckCheck,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Shield,
  Bot,
  UserCheck,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import type { LindaConversationItem } from './LindaWhatsAppCRM.data';

export interface ChatMessage {
  id: string;
  sender: 'client' | 'agent' | 'bot';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface LindaLiveWhatsAppWebProps {
  conversations: LindaConversationItem[];
  onSendMessage?: (convId: string, text: string) => void;
  onAutoReplyWithAI?: (conv: LindaConversationItem) => void;
}

const SAMPLE_THREAD_MAP: Record<string, ChatMessage[]> = {
  'conv-1': [
    { id: 'm1', sender: 'client', text: 'Hi Arslan, I am considering listing my 3BR Villa in Vardon.', timestamp: '10:14 AM' },
    { id: 'm2', sender: 'bot', text: 'Hello Tariq! Linda here from White Caves. We currently have 3 pre-qualified cash buyers looking for Vardon 3BR villas. May I know when the property is vacant?', timestamp: '10:15 AM', status: 'read' },
    { id: 'm3', sender: 'client', text: 'Yes, the tenant vacates next month. Send me the Form A listing agreement.', timestamp: '10:18 AM' },
  ],
  'conv-2': [
    { id: 'm4', sender: 'client', text: 'Can I view the penthouse at Address Downtown today at 4 PM?', timestamp: '11:02 AM' },
    { id: 'm5', sender: 'agent', text: 'Good morning! Yes, let me coordinate with the building security for the access pass.', timestamp: '11:04 AM', status: 'read' },
    { id: 'm6', sender: 'client', text: 'Perfect. Looking forward to it.', timestamp: '11:05 AM' },
  ],
  'conv-3': [
    { id: 'm7', sender: 'client', text: 'Are there any new offplan launches in Dubai Islands with post-handover payment plans?', timestamp: '01:20 PM' },
    { id: 'm8', sender: 'bot', text: 'Greetings Elena! Yes, Nakheel just announced Rixos Financial Bay with an 80/20 5-year post-handover plan. Sending you the master brochure and floor plans now.', timestamp: '01:21 PM', status: 'delivered' },
  ],
};

export const LindaLiveWhatsAppWeb: FC<LindaLiveWhatsAppWebProps> = ({
  conversations,
  onSendMessage,
  onAutoReplyWithAI,
}) => {
  const { isDark } = useTheme();
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || 'conv-1');
  const [searchFilter, setSearchFilter] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(SAMPLE_THREAD_MAP);

  const selectedConv = useMemo(
    () => conversations.find(c => c.id === selectedConvId) || conversations[0],
    [conversations, selectedConvId]
  );

  const filteredConversations = useMemo(() => {
    if (!searchFilter.trim()) return conversations;
    const q = searchFilter.toLowerCase();
    return conversations.filter(
      c =>
        c.contactName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.cluster.toLowerCase().includes(q) ||
        c.unit.toLowerCase().includes(q)
    );
  }, [conversations, searchFilter]);

  const activeMessages = chatMessages[selectedConv?.id || ''] || [
    {
      id: 'default-1',
      sender: 'client',
      text: selectedConv?.lastMessage || 'Hello White Caves team',
      timestamp: selectedConv?.timestamp || 'Just now',
    },
  ];

  const handleSend = () => {
    if (!inputMessage.trim() || !selectedConv) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'agent',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedConv.id]: [...(prev[selectedConv.id] || []), newMsg],
    }));

    onSendMessage?.(selectedConv.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleAiDraft = () => {
    if (!selectedConv) return;
    const aiDraft = `Thank you ${selectedConv.contactName}. White Caves Luxury Desk has reviewed your ${selectedConv.unit} inquiry. We have prepared the verified DLD paperwork for your review.`;
    setInputMessage(aiDraft);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        height: '620px',
        borderRadius: 14,
        overflow: 'hidden',
        border: isDark ? '1px solid rgba(37, 211, 102, 0.35)' : '1px solid #CBD5E1',
        background: isDark ? '#0B141A' : '#FFFFFF',
        boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* ── Left Pane: WhatsApp Web Chat List ─────────────────────── */}
      <div
        style={{
          borderRight: isDark ? '1px solid #202C33' : '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          background: isDark ? '#111B21' : '#F0F2F5',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '12px 16px',
            background: isDark ? '#202C33' : '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              WA
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#E9EDEF' : '#111B21' }}>
                WhatsApp Web Desk
              </div>
              <div style={{ fontSize: 10, color: '#25D366', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366' }} />
                Online (Background Daemon)
              </div>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#8696A0' : '#54656F' }}>
            {conversations.length} Active
          </span>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '8px 12px', background: isDark ? '#111B21' : '#FFFFFF' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: isDark ? '#202C33' : '#F0F2F5',
              padding: '6px 12px',
              borderRadius: 8,
            }}
          >
            <Search size={14} color={isDark ? '#8696A0' : '#54656F'} />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: isDark ? '#D1D7DB' : '#111B21',
                fontSize: 12,
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* Conversations Scrollable List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.map(conv => {
            const isSelected = conv.id === selectedConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #E2E8F0',
                  background: isSelected
                    ? isDark
                      ? '#2A3942'
                      : '#E9EDEF'
                    : 'transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: conv.gorahaSaved ? '#059669' : '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {conv.contactName.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isDark ? '#E9EDEF' : '#111B21',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {conv.contactName}
                    </span>
                    <span style={{ fontSize: 10, color: isDark ? '#8696A0' : '#667781' }}>
                      {conv.timestamp}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: isDark ? '#8696A0' : '#667781',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: 2,
                    }}
                  >
                    {conv.lastMessage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Pane: Active WhatsApp Web Conversation Thread ─── */}
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
              {selectedConv?.contactName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#E9EDEF' : '#111B21' }}>
                {selectedConv?.contactName}
              </div>
              <div style={{ fontSize: 11, color: isDark ? '#8696A0' : '#667781' }}>
                {selectedConv?.phone} · <span style={{ color: '#25D366' }}>{selectedConv?.unit}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleAiDraft}
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
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
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
            onClick={handleSend}
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
    </div>
  );
};

export default LindaLiveWhatsAppWeb;
