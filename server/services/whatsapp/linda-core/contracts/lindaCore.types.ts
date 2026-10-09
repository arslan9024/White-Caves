import type { WhatsAppEngineStatus } from '../../WhatsAppEngine.js';
import type { LindaConfig, WhatsAppMessage } from '../../lindaClient.js';

export type LindaCoreMode = 'legacy' | 'shadow' | 'active';

export interface LindaConversationSummary {
  id: string;
  name: string;
  unreadCount: number;
  lastMessage?: string;
}

export interface LindaBroadcastResult {
  phone: string;
  messageId?: string;
  error?: string;
}

export interface LindaStatsSnapshot {
  status: WhatsAppEngineStatus;
  isConnected: boolean;
  queuedMessages: number;
  reconnectAttempts: number;
  messagesSent: number;
  messagesReceived: number;
}

export interface LindaCoreClientContract {
  initialize(): Promise<void>;
  sendMessage(phoneNumber: string, message: string): Promise<string>;
  broadcastMessage(phoneNumbers: string[], message: string): Promise<LindaBroadcastResult[]>;
  getMessageQueue(): WhatsAppMessage[];
  getConversations(): Promise<LindaConversationSummary[]>;
  getConversationHistory(phoneNumber: string, limit?: number): Promise<WhatsAppMessage[]>;
  getQRCode(): string | null;
  disconnect(): Promise<void>;
  getStatus(): WhatsAppEngineStatus;
  isConnected(): boolean;
  getStats(): LindaStatsSnapshot;
}

export interface LindaCoreAdapterOptions {
  mode: LindaCoreMode;
  config?: LindaConfig;
}
