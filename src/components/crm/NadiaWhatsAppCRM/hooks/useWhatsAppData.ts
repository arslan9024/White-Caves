import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { DUMMY_CONVERSATIONS, QUICK_REPLIES, Conversation } from '../data/conversations';
import { NADIA_WHATSAPP_FEATURES } from '../data/features';
import { authFetch } from '../../../../utils/authFetch';

const HOT_LEAD_THRESHOLD = 80;
const WARM_LEAD_THRESHOLD = 50;

interface NadiaMessageApi {
  id: string;
  direction: 'inbound' | 'outbound';
  body: string;
  status?: string;
  timestamp: string;
}

interface NadiaConversationApi {
  id: string;
  customerPhone: string;
  status?: string;
  leadScore?: number;
  messages?: NadiaMessageApi[];
}

export const useWhatsAppData = () => {
  // Only use dummy data in development — production fetches from API
  const [conversations, setConversations] = useState<Conversation[]>(import.meta.env.DEV ? DUMMY_CONVERSATIONS : []);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showQuickReplies, setShowQuickReplies] = useState<boolean>(false);
  const [nadiaActive, setNadiaActive] = useState<boolean>(true);
  const [showFeatures, setShowFeatures] = useState<boolean>(false);
  const [showAgentAssign, setShowAgentAssign] = useState<boolean>(false);
  const [assignedAgent, setAssignedAgent] = useState<string | null>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) return;

    let cancelled = false;

    authFetch('/api/nadia/conversations?limit=50')
      .then((r: Response) => r.json() as Promise<{ data?: NadiaConversationApi[] }>)
      .then((payload) => {
        if (cancelled) return;
        const rows = Array.isArray(payload.data) ? payload.data : [];
        const mapped: Conversation[] = rows.map((conv) => {
          const messages = Array.isArray(conv.messages) ? conv.messages : [];
          const sorted = messages
            .map((m) => ({ ...m, timestampMs: new Date(m.timestamp).getTime() }))
            .sort((a, b) => a.timestampMs - b.timestampMs);
          const last = sorted[sorted.length - 1];
          const leadScore = Number(conv.leadScore ?? 0);
          const priority =
            leadScore >= HOT_LEAD_THRESHOLD
              ? 'hot'
              : leadScore >= WARM_LEAD_THRESHOLD
                ? 'warm'
                : 'cold';
          return {
            id: conv.id,
            contact: {
              name: conv.customerPhone,
              phone: conv.customerPhone,
              avatar: '',
              status: conv.status ?? 'active',
            },
            lastMessage: last?.body ?? '',
            unread: 0,
            time: last ? new Date(last.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            priority,
            tags: conv.status ? [conv.status] : [],
            messages: sorted.map((m, idx) => ({
              id: idx + 1,
              type: m.direction === 'outbound' ? 'sent' : 'received',
              text: m.body,
              time: new Date(m.timestampMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: m.status,
            })),
          };
        });
        setConversations(mapped);
      })
      .catch(() => {
        // Keep empty production state if API request fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

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

    setSelectedConversation(prev => {
      if (!prev) return prev;
      return { ...prev, messages: [...prev.messages, newMessage] };
    });

    setMessageInput('');

    if (nadiaActive) {
      const sentToConversationId = selectedConversation.id;
      aiTimerRef.current = setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: `Nadia AI: Response sent. Lead engagement score increased to ${Math.floor(Math.random() * 20) + 80}%. Recommend follow-up in 24 hours.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setConversations(prevConvs =>
          prevConvs.map(conv =>
            conv.id === sentToConversationId
              ? { ...conv, messages: [...conv.messages, aiMessage] }
              : conv
          )
        );

        setSelectedConversation(prev => {
          if (!prev || prev.id !== sentToConversationId) return prev;
          return { ...prev, messages: [...prev.messages, aiMessage] };
        });
      }, 2000);
    }
  }, [messageInput, selectedConversation, nadiaActive]);

  const handleQuickReply = useCallback((text: string) => {
    setMessageInput(text);
    setShowQuickReplies(false);
  }, []);

  const filteredConversations = useMemo(() => conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (conv.contact.phone || '').includes(searchQuery);
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
    return matchesSearch && matchesPriority;
  }), [conversations, searchQuery, filterPriority]);

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
    nadiaActive,
    setNadiaActive,
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
    features: NADIA_WHATSAPP_FEATURES
  };
};
