import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { QUICK_REPLIES, DUMMY_CONVERSATIONS, Conversation, Message } from '../data/conversations';
import { NADIA_WHATSAPP_FEATURES } from '../data/features';
import { authFetch } from '../../../../utils/authFetch';

// API response types
interface NadiaMessageApiItem {
  id: string;
  direction: string;
  body: string;
  status: string;
  timestamp: string;
}

interface NadiaConversationApiItem {
  id: string;
  customerPhone: string;
  status: string;
  intent: string | null;
  leadScore: number;
  updatedAt: string;
  messages: NadiaMessageApiItem[];
}

interface NadiaConversationsApiResponse {
  success?: boolean;
  data?: NadiaConversationApiItem[];
}

function mapNadiaMessageToMessage(m: NadiaMessageApiItem, index: number): Message {
  return {
    id: index + 1,
    type: m.direction === 'inbound' ? 'received' : 'sent',
    text: m.body,
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: m.status,
  };
}

function leadScoreToPriority(score: number): string {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

function mapNadiaConversation(c: NadiaConversationApiItem): Conversation {
  const msgs = [...c.messages].reverse();
  const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].body : '';
  return {
    id: c.id,
    contact: {
      name: c.customerPhone,
      phone: c.customerPhone,
      avatar: '',
      status: c.status === 'closed' ? 'offline' : 'online',
    },
    lastMessage: lastMsg,
    unread: 0,
    time: new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    priority: leadScoreToPriority(c.leadScore),
    tags: c.intent ? [c.intent] : [],
    messages: msgs.map(mapNadiaMessageToMessage),
  };
}

export const useWhatsAppData = () => {
  const [conversations, setConversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [loading, setLoading] = useState<boolean>(true);
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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

  // Fetch conversations from live API on mount
  useEffect(() => {
    authFetch('/api/nadia/conversations?limit=50')
      .then((r: Response) => r.json() as Promise<NadiaConversationsApiResponse>)
      .then(res => {
        if (res.data) {
          setConversations(res.data.map(mapNadiaConversation));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
      status: 'sent',
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
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  const filteredConversations = useMemo(
    () =>
      conversations.filter(conv => {
        const matchesSearch =
          conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (conv.contact.phone || '').includes(searchQuery);
        const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
        return matchesSearch && matchesPriority;
      }),
    [conversations, searchQuery, filterPriority]
  );

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'hot':
        return '#ef4444';
      case 'warm':
        return '#f59e0b';
      case 'cold':
        return '#3b82f6';
      default:
        return '#6b7280';
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
    features: NADIA_WHATSAPP_FEATURES,
    loading,
  };
};
