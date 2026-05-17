/**
 * Socket.io Server — White Caves Real-time Infrastructure
 *
 * Attaches to the Node.js http.Server and provides real-time event
 * broadcasting for:
 *   - WhatsApp Meta API channel  (Nadia / Nina pipeline)
 *   - WhatsApp Linda channel     (whatsapp-web.js LocalAuth)
 *   - CRM notifications
 *   - Lead updates
 *   - Nadia conversation updates
 *   - Agent presence (online / offline)
 *
 * Both WhatsApp channels are kept SEPARATE so that Nadia (Meta Business API)
 * and Linda (whatsapp-web.js LocalAuth) can evolve independently.
 *
 * Usage:
 *   import { createSocketServer, getSocketServer } from './socketServer.js';
 *   const io = createSocketServer(httpServer);          // call once at startup
 *   getSocketServer().emitMetaMessage(payload);          // call anywhere
 */

import { Server as SocketIOServer, Socket } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { verifyJwt } from '../middleware/auth.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('SocketServer');

// ─── Event Payload Types ──────────────────────────────────────────────────────

/** Fired when a message arrives via Meta Business API (Nadia / Nina pipeline) */
export interface MetaMessagePayload {
  id: string;
  conversationId: string;
  from: string;
  content: string;
  type: string;
  timestamp: Date;
  nlp?: { intent?: string; score?: number };
}

/** Fired when Meta reports a delivery/read/failed status update */
export interface MetaStatusPayload {
  messageId: string;
  dbId?: string;
  status: string;
  timestamp: Date;
  recipientId?: string;
  errors?: unknown[];
}

/** Fired when a message arrives via Linda (whatsapp-web.js LocalAuth channel) */
export interface LindaMessagePayload {
  id: string;
  from: string;
  body: string;
  timestamp: Date;
  hasMedia: boolean;
  type: string;
}

/** CRM notification pushed to authenticated users */
export interface CrmNotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

/** Lead record was created or updated */
export interface LeadUpdatedPayload {
  leadId: string;
  status: string;
  assignedTo?: string;
  score?: number;
  updatedBy?: string;
}

/** Nadia conversation state changed */
export interface ConversationUpdatedPayload {
  conversationId: string;
  status: string;
  assignedAgentId?: string;
  intent?: string;
  leadScore?: number;
}

/** Agent presence change */
export interface AgentPresencePayload {
  agentId: string;
  email: string;
  online: boolean;
  timestamp: Date;
}

// ─── Socket Server Wrapper ────────────────────────────────────────────────────

export class SocketServer {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGINS
          ? process.env.CORS_ORIGINS.split(',')
          : ['http://localhost:5000'],
        credentials: true,
      },
      // Use both polling + WebSocket so the client can upgrade after first handshake
      transports: ['polling', 'websocket'],
      pingTimeout: 60_000,
      pingInterval: 25_000,
    });

    this.setupAuthentication();
    this.setupConnectionHandlers();

    log.info('Socket.io server initialised');
  }

  // ─── Authentication ───────────────────────────────────────────────────────

  private setupAuthentication(): void {
    this.io.use((socket: Socket, next) => {
      const token =
        (socket.handshake.auth?.token as string | undefined) ||
        (socket.handshake.headers?.authorization as string | undefined)?.replace('Bearer ', '');

      if (!token) {
        // Unauthenticated clients can only join public rooms
        socket.data.user = null;
        return next();
      }

      const payload = verifyJwt(token);
      if (!payload) {
        return next(new Error('Invalid or expired JWT token'));
      }

      socket.data.user = payload;
      next();
    });
  }

  // ─── Connection Handlers ──────────────────────────────────────────────────

  private setupConnectionHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user as { id?: string; email?: string; role?: string } | null;

      if (user?.id) {
        // Join user-specific and role-specific rooms for targeted broadcasts
        socket.join(`user:${user.id}`);
        if (user.role) {
          socket.join(`role:${user.role}`);
        }
        // All authenticated CRM users
        socket.join('crm');

        log.info(
          `Socket connected: ${user.email} (${user.id}) — rooms: user:${user.id}, role:${user.role}, crm`
        );

        // Emit agent presence to colleagues
        this.io.to('crm').emit('agent:presence', {
          agentId: user.id,
          email: user.email ?? '',
          online: true,
          timestamp: new Date(),
        } satisfies AgentPresencePayload);
      } else {
        log.debug(`Socket connected: unauthenticated (${socket.id})`);
      }

      socket.on('disconnect', () => {
        if (user?.id) {
          this.io.to('crm').emit('agent:presence', {
            agentId: user.id,
            email: user.email ?? '',
            online: false,
            timestamp: new Date(),
          } satisfies AgentPresencePayload);
          log.debug(`Socket disconnected: ${user.email}`);
        }
      });

      // Client can ping to keep the connection alive from behind proxies
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date() });
      });
    });
  }

  // ─── Meta API Channel Emitters (Nadia / Nina pipeline) ───────────────────

  /** Broadcast to all CRM users: new WhatsApp message via Meta Business API */
  emitMetaMessage(payload: MetaMessagePayload): void {
    this.io.to('crm').emit('whatsapp:meta:message', payload);
  }

  /** Broadcast to all CRM users: delivery/read status change via Meta API */
  emitMetaStatus(payload: MetaStatusPayload): void {
    this.io.to('crm').emit('whatsapp:meta:status', payload);
  }

  // ─── Linda Channel Emitters (whatsapp-web.js LocalAuth) ──────────────────

  /** Broadcast to all CRM users: new WhatsApp message via Linda channel */
  emitLindaMessage(payload: LindaMessagePayload): void {
    this.io.to('crm').emit('whatsapp:linda:message', payload);
  }

  // ─── CRM Emitters ─────────────────────────────────────────────────────────

  /** Push a CRM notification to all authenticated users */
  emitNotification(payload: CrmNotificationPayload): void {
    this.io.to('crm').emit('notification:new', payload);
  }

  /** Broadcast a lead-updated event to CRM users */
  emitLeadUpdated(payload: LeadUpdatedPayload): void {
    this.io.to('crm').emit('lead:updated', payload);
  }

  /** Broadcast a Nadia conversation-updated event to CRM users */
  emitConversationUpdated(payload: ConversationUpdatedPayload): void {
    this.io.to('crm').emit('conversation:updated', payload);
  }

  // ─── Utility ──────────────────────────────────────────────────────────────

  /** Raw access to the underlying io instance when needed */
  getIO(): SocketIOServer {
    return this.io;
  }

  /** Number of currently connected sockets */
  getConnectedCount(): number {
    return this.io.sockets.sockets.size;
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _instance: SocketServer | null = null;

/**
 * Create and register the Socket.io server.
 * Must be called once with the Node.js http.Server before any route tries to
 * call getSocketServer().
 */
export function createSocketServer(httpServer: HttpServer): SocketServer {
  if (_instance) {
    log.warn('createSocketServer called more than once — reusing existing instance');
    return _instance;
  }
  _instance = new SocketServer(httpServer);
  return _instance;
}

/**
 * Retrieve the singleton SocketServer.
 * Returns null if the server has not been initialised yet (safe to call —
 * callers should guard: `getSocketServer()?.emit...`).
 */
export function getSocketServer(): SocketServer | null {
  return _instance;
}
