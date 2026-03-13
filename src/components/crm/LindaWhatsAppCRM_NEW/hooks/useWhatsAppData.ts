import { useState, useCallback } from 'react';
import { DUMMY_CONVERSATIONS, QUICK_REPLIES, Conversation } from '../data/conversations';
import { LINDA_WHATSAPP_FEATURES } from '../data/features';

export const useWhatsAppData = () => {
  const [conversations, setConversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showQuickReplies, setShowQuickReplies] = useState<boolean>(false);
  const [lindaActive, setLindaActive] = useState<boolean>(true);
  const [showFeatures, setShowFeatures] = useState<boolean>(false);
  const [showAgentAssign, setShowAgentAssign] = useState<boolean>(false);
  const [assignedAgent, setAssignedAgent] = useState<string | null>(null);

  const handleAgentAssign = useCallback((agentId: string) => {
    setAssignedAgent(agentId);
    setShowAgentAssign(false);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      type: 'sent',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations(prevConvs =>
      prevConvs.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageInput }
          : conv
      )
    );

    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    setMessageInput('');

    if (lindaActive) {
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: `Linda AI: Response sent. Lead engagement score increased to ${Math.floor(Math.random() * 20) + 80}%. Recommend follow-up in 24 hours.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prevConvs =>
          prevConvs.map(conv =>
            conv.id === selectedConversation.id
              ? { ...conv, messages: [...conv.messages, aiMessage] }
              : conv
          )
        );

        setSelectedConversation(prev => ({
          ...prev,
          messages: [...prev.messages, aiMessage]
        }));
      }, 2000);
    }
  }, [messageInput, selectedConversation, lindaActive]);

  const handleQuickReply = useCallback((text: string) => {
    setMessageInput(text);
    setShowQuickReplies(false);
  }, []);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.contact.phone.includes(searchQuery);
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'hot': return '#ef4444';
      case 'warm': return '#f59e0b';
      case 'cold': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    messageInput,
    setMessageInput,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    showQuickReplies,
    setShowQuickReplies,
    lindaActive,
    setLindaActive,
    showFeatures,
    setShowFeatures,
    showAgentAssign,
    setShowAgentAssign,
    assignedAgent,
    setAssignedAgent,
    handleAgentAssign,
    handleSendMessage,
    handleQuickReply,
    filteredConversations,
    getPriorityColor,
    quickReplies: QUICK_REPLIES,
    features: LINDA_WHATSAPP_FEATURES
  };
};
