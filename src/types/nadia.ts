/**
 * NADIA WhatsApp CRM - Type Definitions
 * Core types for conversations, messages, and queue management
 */

export type MessageSender = 'CUSTOMER' | 'AGENT';
export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type Intent = 'PROPERTY_INQUIRY' | 'VIEWING_REQUEST' | 'PURCHASE_INTEREST' | 'COMPLAINT' | 'UNKNOWN';
export type ConversationStatus = 'ACTIVE' | 'PENDING' | 'CLOSED' | 'SPAM';
export type Priority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

/**
 * Message - Represents a single message in a conversation
 */
export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  sentiment?: Sentiment;
  intent?: Intent;
  entities?: Record<string, any>;
  leadScore?: number;
  timestamp: Date | string;
  createdAt?: Date | string;
}

/**
 * Conversation - Represents a customer conversation thread
 */
export interface Conversation {
  id: string;
  customerPhone: string;
  customerName?: string;
  status: ConversationStatus;
  priority: Priority;
  leadScore: number;
  assignedAgent?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  closedAt?: Date | string;
  lastMessage?: string;
  unreadCount?: number;
  messageCount?: number;
}

/**
 * QueuedConversation - Conversation waiting for agent assignment
 */
export interface QueuedConversation {
  queueId: string;
  conversationId: string;
  customerPhone: string;
  customerName?: string;
  priority: Priority;
  leadScore: number;
  createdAt: Date | string;
  waitTimeMinutes: number;
  sortOrder: number;
  status: ConversationStatus;
}

/**
 * QueueStats - Aggregate queue statistics
 */
export interface QueueStats {
  totalQueued: number;
  byPriority: {
    URGENT: number;
    HIGH: number;
    NORMAL: number;
    LOW: number;
  };
  avgResponseTimeMinutes: number;
  agentAvailability: number;
  oldestInQueueMinutes: number;
}

/**
 * Payloads for API operations
 */
export interface CreateConversationPayload {
  customerPhone: string;
  customerName?: string;
  initialMessage: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  sender: MessageSender;
}

export interface UpdateConversationPayload {
  status?: ConversationStatus;
  priority?: Priority;
  assignedAgent?: string;
  closedAt?: Date | string;
}

export interface AssignAgentPayload {
  queueId: string;
  agentPhone: string;
}

export interface ListConversationsQuery {
  status?: ConversationStatus;
  skip?: number;
  limit?: number;
  sortBy?: 'leadScore' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Redux State Structure
 */
export interface NadiaState {
  conversations: Conversation[];
  messages: Message[];
  queue: QueuedConversation[];
  stats: QueueStats;
  selectedConversationId: string | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  lastMessageSent?: Date | null;
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
