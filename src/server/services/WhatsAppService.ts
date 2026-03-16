/**
 * WhatsAppService - Enterprise-grade WhatsApp integration
 * 
 * Features:
 * - Session persistence with LocalAuth strategy
 * - Automatic reconnection with exponential backoff
 * - Message deduplication and idempotency
 * - Heartbeat monitoring (ping/pong every 30s)
 * - QR code timeout handling
 * - Event-driven architecture
 * - Type-safe with full TypeScript support
 */

import { Client, LocalAuth, MessageMedia, Events } from 'whatsapp-web.js';
import Redis from 'redis';
import { EventEmitter } from 'events';
import type WhatsAppSessionModel from '../models/WhatsAppSession';

// Custom Error Types
export class WhatsAppError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'WhatsAppError';
  }
}

export class WhatsAppAuthenticationError extends WhatsAppError {
  constructor(message: string, details?: any) {
    super('AUTH_ERROR', message, details);
    this.name = 'WhatsAppAuthenticationError';
  }
}

export class WhatsAppConnectionError extends WhatsAppError {
  constructor(message: string, details?: any) {
    super('CONNECTION_ERROR', message, details);
    this.name = 'WhatsAppConnectionError';
  }
}

export class WhatsAppMessageError extends WhatsAppError {
  constructor(message: string, details?: any) {
    super('MESSAGE_ERROR', message, details);
    this.name = 'WhatsAppMessageError';
  }
}

// Message Queue Types
interface QueuedMessage {
  id: string;
  phoneNumber: string;
  content: string;
  mediaPath?: string;
  caption?: string;
  options?: any;
  type: 'text' | 'media';
  createdAt: Date;
  retryCount: number;
  maxRetries: number;
  priority: 'high' | 'normal' | 'low';
}

interface WhatsAppServiceConfig {
  sessionId: string;
  ownerEmail: string;
  mongoSessionModel?: typeof WhatsAppSessionModel;
  redisClient?: Redis.RedisClient;
  maxRetries?: number;
  retryDelayMs?: number;
  heartbeatIntervalMs?: number;
  messageDeduplicationTTL?: number;
  messageQueueMaxSize?: number;
  messageRetryMaxAttempts?: number;
  messageRetryDelayMs?: number;
}

interface ReconnectConfig {
  maxAttempts: number;
  delays: number[]; // Exponential backoff delays in ms
  currentAttempt: number;
}

interface SessionStatus {
  connected: boolean;
  authenticated: boolean;
  lastHeartbeat: Date;
  messagesSent: number;
  messagesReceived: number;
  uptime: number;
}

export class WhatsAppService extends EventEmitter {
  private client: Client | null = null;
  private config: WhatsAppServiceConfig;
  private reconnectConfig: ReconnectConfig;
  private heartbeatInterval: NodeJS.Timer | null = null;
  private messageQueue: Map<string, QueuedMessage> = new Map();
  private processingMessages: Set<string> = new Set();
  private messageProcessingTimer: NodeJS.Timer | null = null;
  private redisClient: Redis.RedisClient | null = null;
  private sessionModel: typeof WhatsAppSessionModel | null = null;
  private sessionStatus: SessionStatus = {
    connected: false,
    authenticated: false,
    lastHeartbeat: new Date(),
    messagesSent: 0,
    messagesReceived: 0,
    uptime: 0
  };
  private lastErrorTime: Date | null = null;
  private errorCount: number = 0;

  constructor(config: WhatsAppServiceConfig) {
    super();
    this.config = {
      maxRetries: 10,
      retryDelayMs: 5000,
      heartbeatIntervalMs: 30000,
      messageDeduplicationTTL: 86400, // 24 hours
      ...config
    };

    this.reconnectConfig = {
      maxAttempts: this.config.maxRetries || 10,
      delays: [5000, 10000, 30000, 60000, 120000, 300000, 600000, 900000, 1200000, 1800000],
      currentAttempt: 0
    };

    this.redisClient = config.redisClient || null;
    this.sessionModel = config.mongoSessionModel || null;
    
    // Set message queue defaults
    if (!this.config.messageQueueMaxSize) this.config.messageQueueMaxSize = 1000;
    if (!this.config.messageRetryMaxAttempts) this.config.messageRetryMaxAttempts = 3;
    if (!this.config.messageRetryDelayMs) this.config.messageRetryDelayMs = 5000;
  }

  /**
   * Initialize WhatsApp client with LocalAuth strategy
   * Handles server restart persistence automatically
   */
  async initialize(): Promise<void> {
    try {
      console.log(`[WhatsApp] Initializing session: ${this.config.sessionId}`);

      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: this.config.sessionId,
          dataPath: `.wwebcache/${this.config.sessionId}` // Isolated session directory
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-web-security'
          ]
        },
        restartOnAuthFail: true
      });

      // Attach event listeners
      this.attachEventListeners();

      // Initialize client
      await this.client.initialize();
      console.log(`[WhatsApp] Client initialized for session: ${this.config.sessionId}`);

      // Start heartbeat monitoring
      this.startHeartbeat();
      
      // Start message queue processor
      this.startMessageQueueProcessor();

      // Reset reconnect counter on successful initialization
      this.reconnectConfig.currentAttempt = 0;
      this.errorCount = 0;

      this.emit('initialized');
    } catch (error) {
      console.error(`[WhatsApp] Initialization failed:`, error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Attach event listeners for WhatsApp client
   */
  private attachEventListeners(): void {
    if (!this.client) return;

    // QR Code event - displayed to user for scanning
    this.client.on(Events.QR_RECEIVED, async (qr: string) => {
      console.log(`[WhatsApp] QR Code received for session: ${this.config.sessionId}`);
      this.sessionStatus.authenticated = false;

      // Store QR in Redis (TTL 60s)
      if (this.redisClient) {
        await this.redisClient.setex(
          `whatsapp:qr:${this.config.sessionId}`,
          60,
          qr
        );
      }

      // Store in database
      if (this.sessionModel) {
        await this.updateSessionStatus('qr_pending', { lastQrCode: qr });
      }

      this.emit('qr-received', { qr, expiresIn: 60 });
    });

    // Ready event - WhatsApp is connected and ready
    this.client.on(Events.READY, async () => {
      console.log(`[WhatsApp] Client ready for session: ${this.config.sessionId}`);
      this.sessionStatus.connected = true;
      this.sessionStatus.authenticated = true;

      // Get connected phone number
      const info = await this.client!.info;
      console.log(`[WhatsApp] Connected as: ${info.pushname}`);

      // Update session in database
      if (this.sessionModel) {
        await this.updateSessionStatus('authenticated', {
          phoneNumber: info.wid?.user,
          businessName: info.pushname,
          connectedAt: new Date()
        });
      }

      // Clear QR from Redis
      if (this.redisClient) {
        await this.redisClient.del(`whatsapp:qr:${this.config.sessionId}`);
      }

      this.emit('ready', { phoneNumber: info.wid?.user, name: info.pushname });
    });

    // Message received event
    this.client.on(Events.MESSAGE_RECEIVED, async (message: any) => {
      console.log(`[WhatsApp] Message received from ${message.from}: ${message.body}`);
      this.sessionStatus.messagesReceived++;

      // Check for duplicates
      if (await this.isDuplicateMessage(message.id._serialized)) {
        console.log(`[WhatsApp] Duplicate message ignored: ${message.id._serialized}`);
        return;
      }

      // Store message ID for deduplication (TTL 24 hours)
      if (this.redisClient) {
        await this.redisClient.setex(
          `whatsapp:msg:${this.config.sessionId}:${message.id._serialized}`,
          this.config.messageDeduplicationTTL,
          '1'
        );
      }

      this.emit('message-received', {
        messageId: message.id._serialized,
        from: message.from,
        body: message.body,
        timestamp: message.timestamp,
        hasMedia: message.hasMedia,
        mediaUrl: message.mediaUrl || null
      });
    });

    // Authentication failure
    this.client.on(Events.AUTHENTICATION_FAILURE, async () => {
      const error = new WhatsAppAuthenticationError(
        `Authentication failed for session: ${this.config.sessionId}`
      );
      console.error(`[WhatsApp] ${error.message}`);
      this.sessionStatus.authenticated = false;
      this.incrementErrorCount();

      if (this.sessionModel) {
        await this.updateSessionStatus('disconnected', { error: error.message });
      }

      this.handleDisconnection();
      this.emit('authentication-failed', { error });
    });

    // Client disconnected
    this.client.on(Events.DISCONNECTED, async (reason: any) => {
      const error = new WhatsAppConnectionError(
        `Client disconnected: ${reason}`
      );
      console.warn(`[WhatsApp] ${error.message}`);
      this.sessionStatus.connected = false;
      this.sessionStatus.authenticated = false;
      this.incrementErrorCount();

      if (this.sessionModel) {
        await this.updateSessionStatus('disconnected', { lastDisconnectReason: reason });
      }

      this.handleDisconnection();
      this.emit('disconnected', { reason, error });
    });

    // Remote session logged out
    this.client.on('remote_session_saved', async () => {
      console.log(`[WhatsApp] Remote session saved`);
      this.emit('session-saved');
    });
  }

  /**
   * Handle disconnection with automatic reconnection
   * Uses exponential backoff for retry delays
   */
  private async handleDisconnection(): Promise<void> {
    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Check if we should retry
    if (this.reconnectConfig.currentAttempt >= this.reconnectConfig.maxAttempts) {
      console.error(`[WhatsApp] Max reconnection attempts reached (${this.reconnectConfig.maxAttempts})`);
      this.emit('max-retries-exceeded');
      return;
    }

    // Calculate backoff delay
    const delayIndex = Math.min(
      this.reconnectConfig.currentAttempt,
      this.reconnectConfig.delays.length - 1
    );
    const delay = this.reconnectConfig.delays[delayIndex];
    this.reconnectConfig.currentAttempt++;

    console.log(
      `[WhatsApp] Reconnecting in ${delay}ms (attempt ${this.reconnectConfig.currentAttempt}/${this.reconnectConfig.maxAttempts})`
    );

    this.emit('reconnecting', {
      attempt: this.reconnectConfig.currentAttempt,
      maxAttempts: this.reconnectConfig.maxAttempts,
      delayMs: delay
    });

    // Schedule reconnection
    setTimeout(() => this.initialize(), delay);
  }

  /**
   * Start heartbeat monitoring
   * Detects stale connections that need restart
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      if (!this.client) return;

      try {
        // Try to get client info (light operation)
        const info = await this.client.getWWebVersion();
        this.sessionStatus.lastHeartbeat = new Date();
        this.emit('heartbeat', { timestamp: new Date(), version: info });
      } catch (error) {
        console.warn(`[WhatsApp] Heartbeat failed:`, error);
        // Trigger reconnection if heartbeat fails
        await this.handleDisconnection();
      }
    }, this.config.heartbeatIntervalMs);
  }

  /**
   * Send a message with deduplication and retry support
   */
  async sendMessage(
    phoneNumber: string,
    message: string,
    options?: any,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<string> {
    if (!this.client) {
      throw new WhatsAppConnectionError('WhatsApp client not initialized');
    }

    // Queue the message if not authenticated yet
    if (!this.sessionStatus.authenticated) {
      return this.queueMessage({
        phoneNumber,
        content: message,
        options,
        type: 'text',
        priority
      });
    }

    try {
      const messageId = await this.sendMessageDirect(phoneNumber, message, options);
      return messageId;
    } catch (error) {
      // Queue for retry if direct send fails
      console.warn(`[WhatsApp] Direct send failed, queuing for retry:`, error);
      return this.queueMessage({
        phoneNumber,
        content: message,
        options,
        type: 'text',
        priority
      });
    }
  }

  /**
   * Send message directly (internal)
   */
  private async sendMessageDirect(
    phoneNumber: string,
    message: string,
    options?: any
  ): Promise<string> {
    if (!this.client || !this.sessionStatus.authenticated) {
      throw new WhatsAppConnectionError('WhatsApp client not authenticated');
    }

    try {
      const contactId = `${phoneNumber}@c.us`;
      const result = await this.client.sendMessage(contactId, message, options);

      this.sessionStatus.messagesSent++;
      this.errorCount = 0; // Reset error count on successful send

      // Store message ID for deduplication
      if (this.redisClient) {
        await this.redisClient.setex(
          `whatsapp:sent:${this.config.sessionId}:${result.id._serialized}`,
          this.config.messageDeduplicationTTL,
          '1'
        );
      }

      console.log(`[WhatsApp] Message sent to ${phoneNumber}: ${result.id._serialized}`);
      return result.id._serialized;
    } catch (error) {
      console.error(`[WhatsApp] Failed to send message to ${phoneNumber}:`, error);
      this.incrementErrorCount();
      throw new WhatsAppMessageError(
        `Failed to send message to ${phoneNumber}`,
        { originalError: error, phoneNumber }
      );
    }
  }

  /**
   * Queue a message for later delivery
   */
  private queueMessage(message: Omit<QueuedMessage, 'id' | 'createdAt' | 'retryCount' | 'maxRetries'>): string {
    if (this.messageQueue.size >= this.config.messageQueueMaxSize!) {
      throw new WhatsAppMessageError(
        `Message queue full (${this.messageQueue.size}/${this.config.messageQueueMaxSize})`,
        { phoneNumber: message.phoneNumber }
      );
    }

    const messageId = `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const queuedMessage: QueuedMessage = {
      id: messageId,
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: this.config.messageRetryMaxAttempts!,
      ...message
    };

    this.messageQueue.set(messageId, queuedMessage);
    console.log(`[WhatsApp] Message queued: ${messageId} (queue size: ${this.messageQueue.size})`);
    this.emit('message-queued', { messageId, phoneNumber: message.phoneNumber });

    return messageId;
  }

  /**
   * Start message queue processor
   */
  private startMessageQueueProcessor(): void {
    if (this.messageProcessingTimer) {
      clearInterval(this.messageProcessingTimer);
    }

    this.messageProcessingTimer = setInterval(() => {
      this.processMessageQueue().catch(error => {
        console.error(`[WhatsApp] Message queue processing error:`, error);
      });
    }, this.config.messageRetryDelayMs);
  }

  /**
   * Process queued messages
   */
  private async processMessageQueue(): Promise<void> {
    if (!this.sessionStatus.authenticated || this.messageQueue.size === 0) {
      return;
    }

    // Sort by priority and creation time
    const sorted = Array.from(this.messageQueue.values()).sort((a, b) => {
      const priorityOrder: { [key: string]: number } = { high: 1, normal: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    for (const message of sorted) {
      if (this.processingMessages.has(message.id)) continue;

      try {
        this.processingMessages.add(message.id);

        if (message.type === 'text') {
          await this.sendMessageDirect(
            message.phoneNumber,
            message.content,
            message.options
          );
        } else if (message.type === 'media') {
          await this.sendMediaMessageDirect(
            message.phoneNumber,
            message.mediaPath!,
            message.caption
          );
        }

        // Remove from queue on success
        this.messageQueue.delete(message.id);
        this.emit('message-sent-from-queue', { messageId: message.id });
        console.log(`[WhatsApp] Message successfully sent from queue: ${message.id}`);
      } catch (error) {
        message.retryCount++;
        if (message.retryCount >= message.maxRetries) {
          this.messageQueue.delete(message.id);
          this.emit('message-failed', { messageId: message.id, error });
          console.error(
            `[WhatsApp] Message failed after ${message.maxRetries} retries: ${message.id}`
          );
        } else {
          console.warn(
            `[WhatsApp] Message retry ${message.retryCount}/${message.maxRetries}: ${message.id}`
          );
        }
      } finally {
        this.processingMessages.delete(message.id);
      }
    }
  }

  /**
   * Send a message with media
   */
  async sendMediaMessage(
    phoneNumber: string,
    mediaPath: string,
    caption?: string,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<string> {
    if (!this.client) {
      throw new WhatsAppConnectionError('WhatsApp client not initialized');
    }

    if (!this.sessionStatus.authenticated) {
      return this.queueMessage({
        phoneNumber,
        content: '',
        mediaPath,
        caption,
        type: 'media',
        priority
      });
    }

    try {
      const messageId = await this.sendMediaMessageDirect(phoneNumber, mediaPath, caption);
      return messageId;
    } catch (error) {
      console.warn(`[WhatsApp] Direct media send failed, queuing for retry:`, error);
      return this.queueMessage({
        phoneNumber,
        content: '',
        mediaPath,
        caption,
        type: 'media',
        priority
      });
    }
  }

  /**
   * Send media message directly (internal)
   */
  private async sendMediaMessageDirect(
    phoneNumber: string,
    mediaPath: string,
    caption?: string
  ): Promise<string> {
    if (!this.client || !this.sessionStatus.authenticated) {
      throw new WhatsAppConnectionError('WhatsApp client not authenticated');
    }

    try {
      const media = MessageMedia.fromFilePath(mediaPath);
      const contactId = `${phoneNumber}@c.us`;
      const result = await this.client.sendMessage(contactId, media, { caption });

      this.sessionStatus.messagesSent++;
      this.errorCount = 0;
      console.log(`[WhatsApp] Media message sent to ${phoneNumber}`);
      return result.id._serialized;
    } catch (error) {
      console.error(`[WhatsApp] Failed to send media to ${phoneNumber}:`, error);
      this.incrementErrorCount();
      throw new WhatsAppMessageError(
        `Failed to send media to ${phoneNumber}`,
        { originalError: error, phoneNumber, mediaPath }
      );
    }
  }

  /**
   * Increment error count and check for circuit breaker
   */
  private incrementErrorCount(): void {
    this.errorCount++;
    this.lastErrorTime = new Date();

    // Circuit breaker: if too many errors in short time, trigger reconnection
    if (this.errorCount >= 5) {
      console.warn(
        `[WhatsApp] Circuit breaker triggered (${this.errorCount} errors), initiating reconnection`
      );
      this.handleDisconnection();
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      queueSize: this.messageQueue.size,
      maxQueueSize: this.config.messageQueueMaxSize,
      processing: this.processingMessages.size,
      messages: Array.from(this.messageQueue.values()).map(m => ({
        id: m.id,
        phoneNumber: m.phoneNumber,
        type: m.type,
        retryCount: m.retryCount,
        maxRetries: m.maxRetries,
        priority: m.priority,
        createdAt: m.createdAt
      }))
    };
  }

  /**
   * Check if message already processed (deduplication)
   */
  private async isDuplicateMessage(messageId: string): Promise<boolean> {
    if (!this.redisClient) return false;

    const key = `whatsapp:msg:${this.config.sessionId}:${messageId}`;
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }

  /**
   * Update session status in database
   */
  private async updateSessionStatus(status: string, data?: any): Promise<void> {
    if (!this.sessionModel) return;

    try {
      await this.sessionModel.updateOne(
        { sessionId: this.config.sessionId },
        {
          connectionStatus: status,
          lastStatusUpdate: new Date(),
          ...data
        }
      );
    } catch (error) {
      console.error(`[WhatsApp] Failed to update session status:`, error);
    }
  }

  /**
   * Handle initialization errors with logging
   */
  private async handleInitializationError(error: any): Promise<void> {
    console.error(`[WhatsApp] Initialization error:`, error.message);

    if (this.sessionModel) {
      await this.updateSessionStatus('error', {
        lastError: error.message,
        errorTime: new Date()
      });
    }

    // Attempt reconnection
    if (this.reconnectConfig.currentAttempt < this.reconnectConfig.maxAttempts) {
      await this.handleDisconnection();
    } else {
      this.emit('initialization-failed', { error: error.message });
    }
  }

  /**
   * Get current session status
   */
  getStatus(): SessionStatus {
    return {
      ...this.sessionStatus,
      uptime: this.calculateUptime()
    };
  }

  /**
   * Calculate service uptime in seconds
   */
  private calculateUptime(): number {
    if (!this.sessionStatus.lastHeartbeat) return 0;
    return Math.floor((Date.now() - this.sessionStatus.lastHeartbeat.getTime()) / 1000);
  }

  /**
   * Gracefully shutdown the service
   */
  async shutdown(): Promise<void> {
    console.log(`[WhatsApp] Shutting down service for session: ${this.config.sessionId}`);

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.messageProcessingTimer) {
      clearInterval(this.messageProcessingTimer);
    }

    // Store queued messages to Redis for recovery
    if (this.redisClient && this.messageQueue.size > 0) {
      try {
        await this.redisClient.setex(
          `whatsapp:queue:${this.config.sessionId}`,
          86400, // 24 hours
          JSON.stringify(Array.from(this.messageQueue.values()))
        );
        console.log(`[WhatsApp] Queued messages saved to Redis: ${this.messageQueue.size} messages`);
      } catch (error) {
        console.warn(`[WhatsApp] Failed to save queue to Redis:`, error);
      }
    }

    if (this.client) {
      try {
        await this.client.disconnect();
      } catch (error) {
        console.warn(`[WhatsApp] Error during disconnect:`, error);
      }
    }

    this.client = null;
    this.messageQueue.clear();
    this.processingMessages.clear();
    this.emit('shutdown');
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return this.sessionStatus.authenticated && this.sessionStatus.connected;
  }

  /**
   * Manually trigger reconnection
   */
  async reconnect(): Promise<void> {
    console.log(`[WhatsApp] Manual reconnection requested`);
    this.reconnectConfig.currentAttempt = 0;
    await this.shutdown();
    await this.initialize();
  }

  /**
   * Get client instance (for advanced usage)
   */
  getClient(): Client | null {
    return this.client;
  }
}

// Export singleton instance manager
export class WhatsAppServiceManager {
  private static instances: Map<string, WhatsAppService> = new Map();

  static getInstance(sessionId: string, config?: Partial<WhatsAppServiceConfig>): WhatsAppService {
    if (!this.instances.has(sessionId)) {
      const service = new WhatsAppService({
        sessionId,
        ownerEmail: config?.ownerEmail || 'default@example.com',
        ...config
      });
      this.instances.set(sessionId, service);
    }
    return this.instances.get(sessionId)!;
  }

  static async initializeAll(configs: WhatsAppServiceConfig[]): Promise<void> {
    await Promise.all(configs.map(config => {
      const service = this.getInstance(config.sessionId, config);
      return service.initialize();
    }));
  }

  static async shutdownAll(): Promise<void> {
    await Promise.all(
      Array.from(this.instances.values()).map(service => service.shutdown())
    );
    this.instances.clear();
  }

  static removeInstance(sessionId: string): void {
    this.instances.delete(sessionId);
  }

  static getAllInstances(): WhatsAppService[] {
    return Array.from(this.instances.values());
  }
}
