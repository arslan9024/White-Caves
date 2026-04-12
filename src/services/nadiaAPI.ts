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
} from '@/types/nadia';
import { Config } from '@/config/constants';
import { authFetch } from '@/utils/authFetch';
import { createLogger } from '@/utils/logger';

const log = createLogger('nadiaAPI');
const NADIA_API = `${Config.API_URL}/api/nadia`;

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `API Error: ${response.status} ${response.statusText}`
      );
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
    return fetchApi<Conversation>('/conversations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch all conversations with optional filters
   */
  list: async (query?: ListConversationsQuery): Promise<Conversation[]> => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.skip !== undefined) params.append('skip', query.skip.toString());
    if (query?.limit !== undefined) params.append('limit', query.limit.toString());
    if (query?.sortBy) params.append('sortBy', query.sortBy);
    if (query?.sortDirection) params.append('sortDirection', query.sortDirection);

    const endpoint = params.toString() ? `/conversations?${params}` : '/conversations';
    return fetchApi<Conversation[]>(endpoint);
  },

  /**
   * Get single conversation by ID
   */
  getById: async (id: string): Promise<Conversation> => {
    return fetchApi<Conversation>(`/conversations/${id}`);
  },

  /**
   * Update conversation (status, priority, agent assignment)
   */
  update: async (id: string, payload: UpdateConversationPayload): Promise<Conversation> => {
    return fetchApi<Conversation>(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Close a conversation
   */
  close: async (id: string, reason?: string): Promise<Conversation> => {
    return conversationsAPI.update(id, {
      status: 'CLOSED',
      closedAt: new Date(),
    });
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
    return fetchApi<Message>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
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
      skip: skip.toString(),
      limit: limit.toString(),
    });
    return fetchApi<Message[]>(
      `/conversations/${conversationId}/messages?${params}`
    );
  },

  /**
   * Get single message by ID
   */
  getById: async (conversationId: string, messageId: string): Promise<Message> => {
    return fetchApi<Message>(`/conversations/${conversationId}/messages/${messageId}`);
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
    return fetchApi<QueuedConversation[]>('/queue');
  },

  /**
   * Assign queued conversation to agent
   */
  assignAgent: async (
    queueId: string,
    agentPhone: string
  ): Promise<QueuedConversation> => {
    return fetchApi<QueuedConversation>(`/queue/${queueId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ agentPhone }),
    });
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
  loadConversationThread: async (conversationId: string): Promise<{
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
