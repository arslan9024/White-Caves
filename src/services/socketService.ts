/**
 * Socket Service — White Caves Frontend Real-time Client
 *
 * Singleton Socket.io-client that connects to the White Caves server.
 * Provides strongly-typed event subscriptions for:
 *   - WhatsApp Meta API channel  (Nadia / Nina pipeline)   → whatsapp:meta:message, whatsapp:meta:status
 *   - WhatsApp Linda channel     (whatsapp-web.js)         → whatsapp:linda:message
 *   - CRM notifications                                    → notification:new
 *   - Lead updates                                         → lead:updated
 *   - Nadia conversation updates                           → conversation:updated
 *   - Agent presence                                       → agent:presence
 *
 * Both WhatsApp channels remain separate so Nadia and Linda pipelines
 * can evolve independently without coupling.
 */

import { io, Socket } from 'socket.io-client';

// ─── Event Payload Types (mirror server/services/socketServer.ts) ─────────────

export interface MetaMessagePayload {
  id: string;
  conversationId: string;
  from: string;
  content: string;
  type: string;
  timestamp: Date;
  nlp?: { intent?: string; score?: number };
}

export interface MetaStatusPayload {
  messageId: string;
  dbId?: string;
  status: string;
  timestamp: Date;
  recipientId?: string;
  errors?: unknown[];
}

export interface LindaMessagePayload {
  id: string;
  from: string;
  body: string;
  timestamp: Date;
  hasMedia: boolean;
  type: string;
}

export interface CrmNotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface LeadUpdatedPayload {
  leadId: string;
  status: string;
  assignedTo?: string;
  score?: number;
  updatedBy?: string;
}

export interface ConversationUpdatedPayload {
  conversationId: string;
  status: string;
  assignedAgentId?: string;
  intent?: string;
  leadScore?: number;
}

export interface AgentPresencePayload {
  agentId: string;
  email: string;
  online: boolean;
  timestamp: Date;
}

// ─── Typed Server-to-Client Events ───────────────────────────────────────────

interface ServerToClientEvents {
  'whatsapp:meta:message': (payload: MetaMessagePayload) => void;
  'whatsapp:meta:status': (payload: MetaStatusPayload) => void;
  'whatsapp:linda:message': (payload: LindaMessagePayload) => void;
  'notification:new': (payload: CrmNotificationPayload) => void;
  'lead:updated': (payload: LeadUpdatedPayload) => void;
  'conversation:updated': (payload: ConversationUpdatedPayload) => void;
  'agent:presence': (payload: AgentPresencePayload) => void;
  pong: (data: { timestamp: Date }) => void;
}

interface ClientToServerEvents {
  ping: () => void;
}

// ─── Connection State ─────────────────────────────────────────────────────────

export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

type StatusListener = (status: SocketStatus) => void;

// ─── Service ──────────────────────────────────────────────────────────────────

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private status: SocketStatus = 'disconnected';
  private statusListeners: StatusListener[] = [];

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Connect to the Socket.io server using the provided JWT token.
   * Safe to call multiple times — reconnects only if currently disconnected.
   */
  connect(token: string): void {
    if (this.socket?.connected) return;

    this.setStatus('connecting');

    const serverUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001';

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 30_000,
      timeout: 20_000,
    }) as Socket<ServerToClientEvents, ClientToServerEvents>;

    this.socket.on('connect', () => {
      this.setStatus('connected');
    });

    this.socket.on('disconnect', () => {
      this.setStatus('disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[SocketService] Connection error:', err.message);
      this.setStatus('error');
    });
  }

  /** Disconnect and clean up the socket. */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.setStatus('disconnected');
  }

  // ─── Event Subscriptions ───────────────────────────────────────────────────

  /** New WhatsApp message via Meta Business API (Nadia / Nina pipeline) */
  onMetaMessage(handler: (payload: MetaMessagePayload) => void): () => void {
    this.socket?.on('whatsapp:meta:message', handler);
    return () => this.socket?.off('whatsapp:meta:message', handler);
  }

  /** Meta API delivery/read status change */
  onMetaStatus(handler: (payload: MetaStatusPayload) => void): () => void {
    this.socket?.on('whatsapp:meta:status', handler);
    return () => this.socket?.off('whatsapp:meta:status', handler);
  }

  /** New WhatsApp message via Linda channel (whatsapp-web.js LocalAuth) */
  onLindaMessage(handler: (payload: LindaMessagePayload) => void): () => void {
    this.socket?.on('whatsapp:linda:message', handler);
    return () => this.socket?.off('whatsapp:linda:message', handler);
  }

  /** CRM notification pushed from server */
  onNotification(handler: (payload: CrmNotificationPayload) => void): () => void {
    this.socket?.on('notification:new', handler);
    return () => this.socket?.off('notification:new', handler);
  }

  /** Lead record created or updated */
  onLeadUpdated(handler: (payload: LeadUpdatedPayload) => void): () => void {
    this.socket?.on('lead:updated', handler);
    return () => this.socket?.off('lead:updated', handler);
  }

  /** Nadia conversation state changed */
  onConversationUpdated(handler: (payload: ConversationUpdatedPayload) => void): () => void {
    this.socket?.on('conversation:updated', handler);
    return () => this.socket?.off('conversation:updated', handler);
  }

  /** Agent came online or went offline */
  onAgentPresence(handler: (payload: AgentPresencePayload) => void): () => void {
    this.socket?.on('agent:presence', handler);
    return () => this.socket?.off('agent:presence', handler);
  }

  // ─── Status ────────────────────────────────────────────────────────────────

  getStatus(): SocketStatus {
    return this.status;
  }

  onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private setStatus(status: SocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.statusListeners.forEach(l => l(status));
    }
  }

  isConnected(): boolean {
    return this.status === 'connected';
  }
}

// Export singleton
const socketService = new SocketService();
export default socketService;
