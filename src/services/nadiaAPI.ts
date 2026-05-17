/**
 * NADIA WhatsApp CRM - API Service Layer
 * Handles all HTTP requests to backend NADIA endpoints.
 * Uses authFetch for automatic JWT injection + session handling.
 */

import {
  Conversation,
  Message,
  QueuedConversation,
  QueueStats,
  CreateConversationPayload,
  SendMessagePayload,
  UpdateConversationPayload,
  AssignAgentPayload,
  ListConversationsQuery,
  ApiResponse,
} from '../types/nadia';
import { Config } from '../config/constants';
import { authFetch } from '../utils/authFetch';
import { createLogger } from '../utils/logger';

const log = createLogger('nadiaAPI');
const NADIA_API = `${Config.API_URL}/api/nadia`;

const CONVERSATION_STATUS_MAP: Record<string, Conversation['status']> = {
  active: 'ACTIVE',
  assigned_to_agent: 'PENDING',
  in_bot_flow: 'ACTIVE',
  closed: 'CLOSED',
};

const INTENT_MAP: Record<string, Message['intent']> = {
  property_search: 'PROPERTY_INQUIRY',
  schedule_tour: 'VIEWING_REQUEST',
  make_offer: 'PURCHASE_INTEREST',
  complaint: 'COMPLAINT',
  general_inquiry: 'UNKNOWN',
  financing: 'UNKNOWN',
  legal_enquiry: 'UNKNOWN',
  information_request: 'UNKNOWN',
};

const normalizeConversationStatus = (status: unknown): Conversation['status'] => {
  if (typeof status !== 'string') {
    return 'ACTIVE';
  }

  return CONVERSATION_STATUS_MAP[status] ?? 'ACTIVE';
};

const denormalizeConversationStatus = (
  status: UpdateConversationPayload['status']
): string | undefined => {
  switch (status) {
    case 'ACTIVE':
      return 'active';
    case 'PENDING':
      return 'assigned_to_agent';
    case 'CLOSED':
      return 'closed';
    case 'SPAM':
      return undefined;
    default:
      return undefined;
  }
};

const normalizePriority = (leadScore: number): Conversation['priority'] => {
  if (leadScore >= 75) return 'HIGH';
  if (leadScore >= 50) return 'NORMAL';
  return 'LOW';
};

const normalizeSender = (direction: unknown): Message['sender'] => {
  return direction === 'outbound' ? 'AGENT' : 'CUSTOMER';
};

const normalizeIntent = (intent: unknown): Message['intent'] | undefined => {
  if (typeof intent !== 'string') {
    return undefined;
  }

  return INTENT_MAP[intent] ?? undefined;
};

const normalizeConversation = (raw: any): Conversation => {
  const messages = Array.isArray(raw?.messages) ? raw.messages : [];
  const latestMessage = messages[0] ?? null;
  const leadScore = Number(raw?.leadScore ?? 0);

  return {
    id: String(raw?.id ?? ''),
    customerPhone: String(raw?.customerPhone ?? ''),
    customerName: raw?.customerName ? String(raw.customerName) : undefined,
    status: normalizeConversationStatus(raw?.status),
    priority: normalizePriority(leadScore),
    leadScore,
    assignedAgent: raw?.agentPhone ? String(raw.agentPhone) : undefined,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.createdAt ?? new Date().toISOString(),
    closedAt: raw?.closedAt ?? undefined,
    lastMessage: latestMessage?.body ? String(latestMessage.body) : undefined,
    unreadCount: Number(raw?.unreadCount ?? 0),
    messageCount: messages.length || Number(raw?.messageCount ?? 0),
  };
};

const normalizeMessage = (raw: any): Message => ({
  id: String(raw?.id ?? ''),
  conversationId: String(raw?.conversationId ?? ''),
  sender: normalizeSender(raw?.direction),
  content: String(raw?.body ?? raw?.content ?? ''),
  sentiment: raw?.sentiment ?? undefined,
  intent: normalizeIntent(raw?.intent),
  entities: raw?.entities ?? undefined,
  leadScore: raw?.leadScore !== undefined ? Number(raw.leadScore) : undefined,
  timestamp: raw?.timestamp ?? raw?.createdAt ?? new Date().toISOString(),
  createdAt: raw?.createdAt ?? undefined,
});

const normalizeQueuedConversation = (raw: any, sortOrder = 0): QueuedConversation => ({
  queueId: String(raw?.queueId ?? raw?.id ?? ''),
  conversationId: String(raw?.conversationId ?? raw?.conversation?.id ?? ''),
  customerPhone: String(raw?.customerPhone ?? raw?.conversation?.customerPhone ?? ''),
  customerName: raw?.customerName ?? raw?.conversation?.customerName ?? undefined,
  priority:
    Number(raw?.priority ?? 0) <= 3 ? 'URGENT' : Number(raw?.priority ?? 0) <= 6 ? 'NORMAL' : 'LOW',
  leadScore: Number(raw?.leadScore ?? raw?.conversation?.leadScore ?? 0),
  createdAt: raw?.queuedAt ?? raw?.createdAt ?? new Date().toISOString(),
  waitTimeMinutes: Number(raw?.waitTimeMinutes ?? 0),
  sortOrder,
  status: normalizeConversationStatus(raw?.status ?? raw?.conversation?.status),
});

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${NADIA_API}${endpoint}`;

  try {
    const response = await authFetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(e => {
        log.debug('Non-JSON error response:', e);
        return {};
      });
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API returned success: false');
    }

    return data.data;
  } catch (error) {
    log.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * CONVERSATIONS API
 */
const conversationsAPI = {
  /**
   * Create a new conversation
   */
  create: async (payload: CreateConversationPayload): Promise<Conversation> => {
    const data = await fetchApi<any>('/conversations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return normalizeConversation(data);
  },

  /**
   * Fetch all conversations with optional filters
   */
  list: async (query?: ListConversationsQuery): Promise<Conversation[]> => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.skip !== undefined) params.append('offset', query.skip.toString());
    if (query?.limit !== undefined) params.append('limit', query.limit.toString());
    if (query?.sortBy) params.append('sortBy', query.sortBy);
    if (query?.sortDirection) params.append('sortOrder', query.sortDirection);

    const endpoint = params.toString() ? `/conversations?${params}` : '/conversations';
    const data = await fetchApi<any[]>(endpoint);
    return data.map(normalizeConversation);
  },

  /**
   * Get single conversation by ID
   */
  getById: async (id: string): Promise<Conversation> => {
    const data = await fetchApi<any>(`/conversations/${id}`);
    return normalizeConversation(data);
  },

  /**
   * Update conversation (status, priority, agent assignment)
   */
  update: async (id: string, payload: UpdateConversationPayload): Promise<Conversation> => {
    const requestPayload = {
      ...(payload.status ? { status: denormalizeConversationStatus(payload.status) } : {}),
      ...(payload.assignedAgent ? { agentPhone: payload.assignedAgent } : {}),
    };

    const data = await fetchApi<any>(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(requestPayload),
    });
    return normalizeConversation(data);
  },

  /**
   * Close a conversation
   */
  close: async (id: string, reason?: string): Promise<Conversation> => {
    const data = await fetchApi<any>(`/conversations/${id}/close`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });

    return normalizeConversation(data);
  },
};

/**
 * MESSAGES API
 */
const messagesAPI = {
  /**
   * Send a message in a conversation
   */
  send: async (conversationId: string, payload: SendMessagePayload): Promise<Message> => {
    const endpoint =
      payload.sender === 'AGENT'
        ? `/conversations/${conversationId}/reply`
        : `/conversations/${conversationId}/messages`;

    const body =
      payload.sender === 'AGENT'
        ? { content: payload.content }
        : { content: payload.content, senderType: 'customer' };

    const data = await fetchApi<any>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return normalizeMessage(data);
  },

  /**
   * Get all messages for a conversation
   */
  listByConversation: async (
    conversationId: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<Message[]> => {
    const params = new URLSearchParams({
      offset: skip.toString(),
      limit: limit.toString(),
    });
    return fetchApi<any[]>(`/conversations/${conversationId}/messages?${params}`).then(messages =>
      messages.map(normalizeMessage)
    );
  },

  /**
   * Get single message by ID
   */
  getById: async (conversationId: string, messageId: string): Promise<Message> => {
    const data = await fetchApi<any>(`/conversations/${conversationId}/messages/${messageId}`);
    return normalizeMessage(data);
  },
};

/**
 * QUEUE API
 */
const queueAPI = {
  /**
   * Get current queue of waiting conversations
   */
  list: async (): Promise<QueuedConversation[]> => {
    const data = await fetchApi<any[]>('/queue');
    return data.map((item, index) => normalizeQueuedConversation(item, index));
  },

  /**
   * Assign queued conversation to agent
   */
  assignAgent: async (queueId: string, agentPhone: string): Promise<QueuedConversation> => {
    const data = await fetchApi<any>(`/queue/${queueId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ agentPhone }),
    });

    return normalizeQueuedConversation(data);
  },

  /**
   * Get queue statistics
   */
  getStats: async (): Promise<QueueStats> => {
    return fetchApi<QueueStats>('/queue-stats');
  },
};

/**
 * HEALTH API
 */
const healthAPI = {
  /**
   * Check if NADIA service is running
   */
  check: async (): Promise<{ status: string; timestamp: string }> => {
    return fetchApi<{ status: string; timestamp: string }>('/health');
  },
};

/**
 * Batch operations
 */
const batchAPI = {
  /**
   * Load all initial data for dashboard
   */
  loadDashboard: async (): Promise<{
    conversations: Conversation[];
    queue: QueuedConversation[];
    stats: QueueStats;
  }> => {
    try {
      const [conversations, queue, stats] = await Promise.all([
        conversationsAPI.list({ limit: 100, sortBy: 'leadScore', sortDirection: 'desc' }),
        queueAPI.list(),
        queueAPI.getStats(),
      ]);

      return { conversations, queue, stats };
    } catch (error) {
      log.error('Error loading dashboard data:', error);
      throw error;
    }
  },

  /**
   * Load conversation with all its messages
   */
  loadConversationThread: async (
    conversationId: string
  ): Promise<{
    conversation: Conversation;
    messages: Message[];
  }> => {
    try {
      const [conversation, messages] = await Promise.all([
        conversationsAPI.getById(conversationId),
        messagesAPI.listByConversation(conversationId, 0, 100),
      ]);

      return { conversation, messages };
    } catch (error) {
      log.error(`Error loading conversation ${conversationId}:`, error);
      throw error;
    }
  },
};

/**
 * Export all API groups for easy access
 */
export const nadiaAPI = {
  conversations: conversationsAPI,
  messages: messagesAPI,
  queue: queueAPI,
  health: healthAPI,
  batch: batchAPI,
};

export default nadiaAPI;
