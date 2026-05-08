/**
 * WhatsApp Integration Service
 *
 * Client-side API wrapper for WhatsApp Web integration
 * Handles all HTTP requests to backend WhatsApp endpoints
 */

import { authFetch } from '../../utils/authFetch';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/whatsapp';

export interface LinkDeviceRequest {
  accountId: string;
  phoneNumber: string;
}

export interface LinkDeviceResponse {
  success: boolean;
  data: {
    sessionId: string;
    accountId: string;
    phoneNumber: string;
    qrCode: string;
    expiresIn: number;
    status: string;
  };
}

export interface ConfirmLinkRequest {
  sessionId: string;
  authToken: string;
  phoneNumber: string;
}

export interface ConfirmLinkResponse {
  success: boolean;
  data: {
    accountId: string;
    phoneNumber: string;
    status: string;
    message: string;
  };
}

export interface Account {
  accountId: string;
  phoneNumber: string;
  status: 'linking' | 'authenticated' | 'connected' | 'disconnected';
  messageCount: number;
}

export interface Message {
  messageId: string;
  from: string;
  to: string;
  body: string;
  timestamp: Date;
  type: 'text' | 'image' | 'video' | 'document' | 'audio';
  direction: 'incoming' | 'outgoing';
  status: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  conversationId: string;
  recipientPhone: string;
  recipientName?: string;
  isGroup: boolean;
  messageCount: number;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  metadata: {
    isArchived?: boolean;
    isPinned?: boolean;
    isMuted?: boolean;
  };
}

export interface Counter {
  total: number;
  incoming: number;
  outgoing: number;
  segments?: Record<string, number>;
}

export interface Metrics {
  today: {
    total: number;
    incoming: number;
    outgoing: number;
  };
  week: {
    total: number;
    average: number;
  };
  month: {
    total: number;
    average: number;
  };
  growth: {
    daily: number;
  };
  topSegment: {
    segment: string;
    count: number;
  };
  responseRate: number;
}

type GenericApiData = Record<string, unknown>;

class WhatsAppService {
  /**
   * Device Linking
   */
  async initiateDeviceLink(accountId: string, phoneNumber: string): Promise<LinkDeviceResponse> {
    const response = await authFetch(`${API_BASE}/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate device link');
    }

    return response.json();
  }

  async confirmDeviceLink(
    sessionId: string,
    authToken: string,
    phoneNumber: string
  ): Promise<ConfirmLinkResponse> {
    const response = await authFetch(`${API_BASE}/confirm-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, authToken, phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to confirm device link');
    }

    return response.json();
  }

  /**
   * Account Management
   */
  async listAccounts(): Promise<{
    success: boolean;
    data: { accounts: Account[]; count: number };
  }> {
    const response = await authFetch(`${API_BASE}/accounts`);

    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }

    return response.json();
  }

  async getAccount(accountId: string): Promise<{ success: boolean; data: Account }> {
    const response = await authFetch(`${API_BASE}/account/${accountId}`);

    if (!response.ok) {
      throw new Error('Account not found');
    }

    return response.json();
  }

  async connectAccount(accountId: string): Promise<{ success: boolean; data: Account }> {
    const response = await authFetch(`${API_BASE}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to connect account');
    }

    return response.json();
  }

  async disconnectAccount(accountId: string): Promise<{ success: boolean; data: Account }> {
    const response = await authFetch(`${API_BASE}/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to disconnect account');
    }

    return response.json();
  }

  async unlinkAccount(
    accountId: string
  ): Promise<{ success: boolean; data: { accountId: string; status: string } }> {
    const response = await authFetch(`${API_BASE}/unlink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to unlink account');
    }

    return response.json();
  }

  /**
   * Messaging
   */
  async sendMessage(
    accountId: string,
    recipientPhone: string,
    message: string
  ): Promise<{ success: boolean; data: Message }> {
    const response = await authFetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, recipientPhone, message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  }

  /**
   * Conversations
   */
  async getConversations(
    accountId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<{ success: boolean; data: Conversation[] }> {
    const params = new URLSearchParams({ limit: limit.toString(), skip: skip.toString() });
    const response = await authFetch(`${API_BASE}/conversations/${accountId}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    return response.json();
  }

  async getConversationMessages(
    conversationId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<{ success: boolean; data: Message[] }> {
    const params = new URLSearchParams({ limit: limit.toString(), skip: skip.toString() });
    const response = await authFetch(
      `${API_BASE}/conversation/${conversationId}/messages?${params}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  async getConversationStats(
    conversationId: string,
    accountId: string
  ): Promise<{ success: boolean; data: GenericApiData }> {
    const response = await authFetch(
      `${API_BASE}/conversation/${conversationId}/stats?accountId=${accountId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch conversation stats');
    }

    return response.json();
  }

  async markConversationAsRead(
    conversationId: string,
    accountId: string
  ): Promise<{ success: boolean; data: { messagesMarked: number } }> {
    const response = await authFetch(`${API_BASE}/conversation/${conversationId}/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark as read');
    }

    return response.json();
  }

  async searchConversations(
    accountId: string,
    query: string,
    limit: number = 20
  ): Promise<{ success: boolean; data: Conversation[] }> {
    const params = new URLSearchParams({ accountId, q: query, limit: limit.toString() });
    const response = await authFetch(`${API_BASE}/search/conversations?${params}`);

    if (!response.ok) {
      throw new Error('Failed to search conversations');
    }

    return response.json();
  }

  async searchMessages(
    accountId: string,
    query: string,
    conversationId?: string,
    limit: number = 50
  ): Promise<{ success: boolean; data: Message[] }> {
    const params = new URLSearchParams({ accountId, q: query, limit: limit.toString() });
    if (conversationId) {
      params.append('conversationId', conversationId);
    }
    const response = await authFetch(`${API_BASE}/search/messages?${params}`);

    if (!response.ok) {
      throw new Error('Failed to search messages');
    }

    return response.json();
  }

  /**
   * Analytics
   */
  async getCounters(
    accountId: string,
    period: 'day' | 'week' | 'month' | 'all' = 'all'
  ): Promise<{ success: boolean; data: GenericApiData }> {
    const response = await authFetch(`${API_BASE}/counters/${accountId}?period=${period}`);

    if (!response.ok) {
      throw new Error('Failed to fetch counters');
    }

    return response.json();
  }

  async getTodayCounters(accountId: string): Promise<{ success: boolean; data: GenericApiData }> {
    const response = await authFetch(`${API_BASE}/counters/${accountId}/today`);

    if (!response.ok) {
      throw new Error('Failed to fetch today counters');
    }

    return response.json();
  }

  async getWeekCounters(accountId: string): Promise<{ success: boolean; data: GenericApiData }> {
    const response = await authFetch(`${API_BASE}/counters/${accountId}/week`);

    if (!response.ok) {
      throw new Error('Failed to fetch week counters');
    }

    return response.json();
  }

  async getMonthCounters(accountId: string): Promise<{ success: boolean; data: GenericApiData }> {
    const response = await authFetch(`${API_BASE}/counters/${accountId}/month`);

    if (!response.ok) {
      throw new Error('Failed to fetch month counters');
    }

    return response.json();
  }

  async getMetrics(accountId: string): Promise<{ success: boolean; data: Metrics }> {
    const response = await authFetch(`${API_BASE}/metrics/${accountId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    return response.json();
  }

  async getTrends(
    accountId: string,
    days: number = 7
  ): Promise<{ success: boolean; data: GenericApiData[] }> {
    const response = await authFetch(`${API_BASE}/trends/${accountId}?days=${days}`);

    if (!response.ok) {
      throw new Error('Failed to fetch trends');
    }

    return response.json();
  }

  async getSegmentBreakdown(
    accountId: string,
    period: 'today' | 'week' | 'month' | 'all' = 'today'
  ): Promise<{ success: boolean; data: GenericApiData }> {
    const response = await authFetch(`${API_BASE}/segments/${accountId}?period=${period}`);

    if (!response.ok) {
      throw new Error('Failed to fetch segment breakdown');
    }

    return response.json();
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();
