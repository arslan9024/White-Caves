/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyJwt } from '../middleware/auth.js';
import logger from '../utils/logger.js';

interface ConnectedUser {
  userId: string;
  socketId: string;
  accountId: string;
  connectedAt: Date;
  lastActivity: Date;
}

interface TypingUser {
  userId: string;
  conversationId: string;
  startedAt: Date;
}

export class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, ConnectedUser> = new Map();
  private typingUsers: Map<string, TypingUser> = new Map();
  private userSockets: Map<string, string[]> = new Map(); // userId -> socketIds
  private conversationRooms: Map<string, Set<string>> = new Map(); // conversationId -> socketIds

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupCleanupInterval();
  }

  /**
   * Setup authentication middleware
   */
  private setupMiddleware(): void {
    this.io.use((socket: any, next: any) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const payload = verifyJwt(token);
        if (!payload) {
          return next(new Error('Invalid token'));
        }
        socket.data.userId = payload.id;
        next();
      } catch (error) {
        logger.error('WebSocket auth error:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  /**
   * Setup connection and event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId;
      const accountId = socket.data.accountId;

      logger.info(`User ${userId} connected via socket ${socket.id}`);

      // Track connected user
      this.connectedUsers.set(socket.id, {
        userId,
        socketId: socket.id,
        accountId,
        connectedAt: new Date(),
        lastActivity: new Date(),
      });

      // Track user sockets
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId)!.push(socket.id);

      // Broadcast user online status
      this.broadcastUserStatus(userId, 'online');

      // Handle conversation joins
      socket.on('join-conversation', (conversationId: string) => {
        this.handleConversationJoin(socket, conversationId);
      });

      // Handle conversation leaves
      socket.on('leave-conversation', (conversationId: string) => {
        this.handleConversationLeave(socket, conversationId);
      });

      // Handle new messages
      socket.on('message', (data: any) => {
        this.handleNewMessage(socket, data);
      });

      // Handle message updates
      socket.on('message-update', (data: any) => {
        this.handleMessageUpdate(socket, data);
      });

      // Handle message deletion
      socket.on('message-delete', (data: any) => {
        this.handleMessageDelete(socket, data);
      });

      // Handle read receipts
      socket.on('message-read', (data: any) => {
        this.handleMessageRead(socket, data);
      });

      // Handle typing indicators
      socket.on('typing-start', (data: any) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing-stop', (data: any) => {
        this.handleTypingStop(socket, data);
      });

      // Handle presence updates
      socket.on('presence-update', (data: any) => {
        this.handlePresenceUpdate(socket, data);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  /**
   * Handle conversation join
   */
  private handleConversationJoin(socket: Socket, conversationId: string): void {
    socket.join(`conversation:${conversationId}`);

    if (!this.conversationRooms.has(conversationId)) {
      this.conversationRooms.set(conversationId, new Set());
    }
    this.conversationRooms.get(conversationId)!.add(socket.id);

    logger.debug(`User joined conversation: ${conversationId}`);

    // Notify others in conversation
    socket.to(`conversation:${conversationId}`).emit('user-joined', {
      userId: socket.data.userId,
      conversationId,
      timestamp: new Date(),
    });
  }

  /**
   * Handle conversation leave
   */
  private handleConversationLeave(socket: Socket, conversationId: string): void {
    socket.leave(`conversation:${conversationId}`);

    const room = this.conversationRooms.get(conversationId);
    if (room) {
      room.delete(socket.id);
      if (room.size === 0) {
        this.conversationRooms.delete(conversationId);
      }
    }

    logger.debug(`User left conversation: ${conversationId}`);

    // Notify others in conversation
    socket.to(`conversation:${conversationId}`).emit('user-left', {
      userId: socket.data.userId,
      conversationId,
      timestamp: new Date(),
    });
  }

  /**
   * Handle new message
   */
  private handleNewMessage(socket: Socket, data: any): void {
    const { conversationId, content, contentType } = data;

    logger.info(`New message in conversation ${conversationId}`);

    // Broadcast to all in conversation
    this.io.to(`conversation:${conversationId}`).emit('message-received', {
      id: data.id || `msg-${Date.now()}`,
      conversationId,
      userId: socket.data.userId,
      content,
      contentType,
      timestamp: new Date(),
      status: 'sent',
    });

    // Update last activity
    const user = this.connectedUsers.get(socket.id);
    if (user) {
      user.lastActivity = new Date();
    }
  }

  /**
   * Handle message update
   */
  private handleMessageUpdate(socket: Socket, data: any): void {
    const { conversationId, messageId, content } = data;

    logger.info(`Message ${messageId} updated`);

    this.io.to(`conversation:${conversationId}`).emit('message-updated', {
      messageId,
      conversationId,
      content,
      updatedAt: new Date(),
      updatedBy: socket.data.userId,
    });
  }

  /**
   * Handle message deletion
   */
  private handleMessageDelete(socket: Socket, data: any): void {
    const { conversationId, messageId } = data;

    logger.info(`Message ${messageId} deleted`);

    this.io.to(`conversation:${conversationId}`).emit('message-deleted', {
      messageId,
      conversationId,
      deletedAt: new Date(),
      deletedBy: socket.data.userId,
    });
  }

  /**
   * Handle message read receipt
   */
  private handleMessageRead(socket: Socket, data: any): void {
    const { conversationId, messageId } = data;

    this.io.to(`conversation:${conversationId}`).emit('message-read', {
      messageId,
      conversationId,
      readBy: socket.data.userId,
      readAt: new Date(),
    });
  }

  /**
   * Handle typing start
   */
  private handleTypingStart(socket: Socket, data: any): void {
    const { conversationId } = data;
    const userId = socket.data.userId;

    const key = `${conversationId}:${userId}`;
    this.typingUsers.set(key, {
      userId,
      conversationId,
      startedAt: new Date(),
    });

    socket.to(`conversation:${conversationId}`).emit('user-typing', {
      userId,
      conversationId,
    });
  }

  /**
   * Handle typing stop
   */
  private handleTypingStop(socket: Socket, data: any): void {
    const { conversationId } = data;
    const userId = socket.data.userId;

    const key = `${conversationId}:${userId}`;
    this.typingUsers.delete(key);

    socket.to(`conversation:${conversationId}`).emit('user-stopped-typing', {
      userId,
      conversationId,
    });
  }

  /**
   * Handle presence update
   */
  private handlePresenceUpdate(socket: Socket, data: any): void {
    const userId = socket.data.userId;
    const { status, lastSeen } = data;

    // Broadcast presence to all connected users of this user
    this.io.to(`user:${userId}`).emit('presence-update', {
      userId,
      status,
      lastSeen: lastSeen || new Date(),
    });

    // Update local user record
    const user = this.connectedUsers.get(socket.id);
    if (user) {
      user.lastActivity = new Date();
    }
  }

  /**
   * Handle disconnect
   */
  private handleDisconnect(socket: Socket): void {
    const userId = socket.data.userId;

    logger.info(`User ${userId} disconnected`);

    // Remove from connected users
    this.connectedUsers.delete(socket.id);

    // Remove from user sockets
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      const index = sockets.indexOf(socket.id);
      if (index > -1) {
        sockets.splice(index, 1);
      }
      if (sockets.length === 0) {
        this.userSockets.delete(userId);
        this.broadcastUserStatus(userId, 'offline');
      }
    }

    // Remove from conversation rooms
    for (const [conversationId, socketIds] of this.conversationRooms.entries()) {
      if (socketIds.has(socket.id)) {
        socketIds.delete(socket.id);
        if (socketIds.size === 0) {
          this.conversationRooms.delete(conversationId);
        }
      }
    }

    // Remove typing indicator
    for (const [key] of this.typingUsers.entries()) {
      if (key.startsWith(`*:${userId}`)) {
        this.typingUsers.delete(key);
      }
    }
  }

  /**
   * Setup cleanup interval for stale data
   */
  private setupCleanupInterval(): void {
    setInterval(
      () => {
        const now = new Date();
        const TIMEOUT = 30 * 60 * 1000; // 30 minutes

        // Clean up stale typing indicators
        for (const [key, value] of this.typingUsers.entries()) {
          if (now.getTime() - value.startedAt.getTime() > TIMEOUT) {
            this.typingUsers.delete(key);
          }
        }

        logger.debug(
          `WebSocket cleanup: ${this.connectedUsers.size} users, ${this.typingUsers.size} typing`
        );
      },
      5 * 60 * 1000
    ); // Every 5 minutes
  }

  /**
   * Broadcast message to conversation
   */
  public emitToConversation(conversationId: string, event: string, data: any): void {
    this.io.to(`conversation:${conversationId}`).emit(event, {
      ...data,
      timestamp: new Date(),
    });
  }

  /**
   * Emit to specific user
   */
  public emitToUser(userId: string, event: string, data: any): void {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach(socketId => {
        this.io.to(socketId).emit(event, {
          ...data,
          timestamp: new Date(),
        });
      });
    }
  }

  /**
   * Broadcast user status change
   */
  public broadcastUserStatus(userId: string, status: 'online' | 'offline'): void {
    this.io.emit('user-status-changed', {
      userId,
      status,
      timestamp: new Date(),
    });
  }

  /**
   * Get connected users count
   */
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get conversation members
   */
  public getConversationMembers(conversationId: string): string[] {
    const room = this.conversationRooms.get(conversationId);
    if (!room) return [];

    const members: string[] = [];
    room.forEach(socketId => {
      const user = this.connectedUsers.get(socketId);
      if (user && !members.includes(user.userId)) {
        members.push(user.userId);
      }
    });
    return members;
  }

  /**
   * Check if user is online
   */
  public isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return sockets ? sockets.length > 0 : false;
  }

  /**
   * Get user's socket IDs
   */
  public getUserSockets(userId: string): string[] {
    return this.userSockets.get(userId) || [];
  }

  /**
   * Disconnect user
   */
  public disconnectUser(userId: string): void {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach(socketId => {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect();
        }
      });
    }
  }

  /**
   * Get stats
   */
  public getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      activeConversations: this.conversationRooms.size,
      typingUsers: this.typingUsers.size,
      totalConnections: this.io.sockets.sockets.size,
    };
  }
}

export default WebSocketService;
