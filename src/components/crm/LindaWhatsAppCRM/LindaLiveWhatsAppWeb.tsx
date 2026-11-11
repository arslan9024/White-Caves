// FILE: src/components/crm/LindaWhatsAppCRM/LindaLiveWhatsAppWeb.tsx
/**
 * White Caves Real Estate LLC - Linda WhatsApp Web Dual-Pane Live Client
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines (Partitioned)
 */

import React, { useState, useMemo, FC } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import type { LindaConversationItem } from './LindaWhatsAppCRM.data';
import { LindaChatListPane } from './LindaChatListPane';
import { LindaChatThreadPane, type ChatMessage } from './LindaChatThreadPane';

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
    onAutoReplyWithAI?.(selectedConv);
  };

  return (
    <div
      data-testid="linda-live-whatsapp-web"
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
      <LindaChatListPane
        isDark={isDark}
        conversations={filteredConversations}
        selectedConvId={selectedConvId}
        searchFilter={searchFilter}
        onSearchChange={setSearchFilter}
        onSelectConversation={setSelectedConvId}
      />

      <LindaChatThreadPane
        isDark={isDark}
        selectedConv={selectedConv}
        activeMessages={activeMessages}
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSend={handleSend}
        onAiDraft={handleAiDraft}
      />
    </div>
  );
};

export default LindaLiveWhatsAppWeb;
