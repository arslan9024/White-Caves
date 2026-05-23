// Phase 6 UI Types

// Media Types
export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'other';
  size: number;
  name: string;
  mimeType: string;
  uploadedAt: string;
  conversationId?: string;
  thumbnailUrl?: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// Message Types
export interface GroupMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  mediaAttachments?: MediaFile[];
  mentions?: string[];
  timestamp: string;
  readBy?: string[];
  reactions?: {
    emoji: string;
    userIds: string[];
  }[];
}

export interface GroupConversation {
  id: string;
  name: string;
  description?: string;
  participants: string[];
  createdAt: string;
  lastMessageAt?: string;
  isArchived: boolean;
  unreadCount: number;
  avatar?: string;
}

// Search Types
export interface SearchResult {
  id: string;
  type: 'message' | 'contact' | 'file';
  title: string;
  preview: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  type?: 'all' | 'message' | 'contact' | 'file';
  dateFrom?: string;
  dateTo?: string;
  sender?: string;
  hasAttachments?: boolean;
}

// Scheduling Types
export interface ScheduledMessage {
  id: string;
  content: string;
  mediaAttachments?: MediaFile[];
  recipients: string[];
  scheduledAt: string;
  status: 'pending' | 'sent' | 'failed';
  timezone: string;
}

// Dashboard Types
export interface DashboardStats {
  totalMessages: number;
  activeConversations: number;
  totalContacts: number;
  unreadMessages: number;
  mediaSize: number;
  responseTime: number;
}

export interface ConversationMetrics {
  conversationId: string;
  messageCount: number;
  participantCount: number;
  averageResponseTime: number;
  attachmentCount: number;
  createdAt: string;
  lastActivityAt: string;
}

// Voice Note Types
export interface VoiceNote {
  id: string;
  conversationId: string;
  senderId: string;
  url: string;
  duration: number; // in seconds
  transcript?: string;
  timestamp: string;
  size: number;
}

// Emoji & Reactions Types
export interface EmojiReaction {
  emoji: string;
  userIds: string[];
  count: number;
}

export interface EmojiCategory {
  name: string;
  emojis: string[];
}

// Advanced Features Types
export interface AutoReply {
  id: string;
  trigger: string;
  response: string;
  enabled: boolean;
  createdAt: string;
}

export interface ChatBot {
  id: string;
  name: string;
  prompt: string;
  enabled: boolean;
  responseTime: number;
  accuracy: number;
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  createdAt: string;
}

// Analytics Types
export interface ConversationAnalytics {
  conversationId: string;
  messageCount: number;
  participantCount: number;
  averageMessageLength: number;
  responseTimeAverage: number;
  attachmentCount: number;
  topKeywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  engagementRate: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface UserActivity {
  userId: string;
  activeHours: string[];
  messagesPerDay: number;
  averageResponseTime: number;
  lastActive: string;
  status: 'online' | 'offline' | 'away';
}
