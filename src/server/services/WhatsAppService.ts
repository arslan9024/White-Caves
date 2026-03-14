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

interface WhatsAppServiceConfig {
  sessionId: string;
  ownerEmail: string;
  mongoSessionModel?: typeof WhatsAppSessionModel;
  redisClient?: Redis.RedisClient;
  maxRetries?: number;
  retryDelayMs?: number;
  heartbeatIntervalMs?: number;
  messageDeduplicationTTL?: number;
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
  private messageQueue: Map<string, Promise<any>> = new Map();
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

      // Reset reconnect counter on successful initialization
      this.reconnectConfig.currentAttempt = 0;

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
      console.error(`[WhatsApp] Authentication failed for session: ${this.config.sessionId}`);
      this.sessionStatus.authenticated = false;

      if (this.sessionModel) {
        await this.updateSessionStatus('disconnected', { error: 'Authentication failed' });
      }

      this.handleDisconnection();
      this.emit('authentication-failed');
    });

    // Client disconnected
    this.client.on(Events.DISCONNECTED, async (reason: any) => {
      console.warn(`[WhatsApp] Disconnected: ${reason}`);
      this.sessionStatus.connected = false;
      this.sessionStatus.authenticated = false;

      if (this.sessionModel) {
        await this.updateSessionStatus('disconnected', { lastDisconnectReason: reason });
      }

      this.handleDisconnection();
      this.emit('disconnected', { reason });
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
   * Send a message with deduplication support
   */
  async sendMessage(phoneNumber: string, message: string, options?: any): Promise<string> {
    if (!this.client || !this.sessionStatus.authenticated) {
      throw new Error('WhatsApp client not authenticated');
    }

    try {
      const contactId = `${phoneNumber}@c.us`;
      const result = await this.client.sendMessage(contactId, message, options);

      this.sessionStatus.messagesSent++;

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
      throw error;
    }
  }

  /**
   * Send a message with media
   */
  async sendMediaMessage(phoneNumber: string, mediaPath: string, caption?: string): Promise<string> {
    if (!this.client || !this.sessionStatus.authenticated) {
      throw new Error('WhatsApp client not authenticated');
    }

    try {
      const media = MessageMedia.fromFilePath(mediaPath);
      const contactId = `${phoneNumber}@c.us`;
      const result = await this.client.sendMessage(contactId, media, { caption });

      this.sessionStatus.messagesSent++;
      console.log(`[WhatsApp] Media message sent to ${phoneNumber}`);
      return result.id._serialized;
    } catch (error) {
      console.error(`[WhatsApp] Failed to send media to ${phoneNumber}:`, error);
      throw error;
    }
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

    if (this.client) {
      try {
        await this.client.disconnect();
      } catch (error) {
        console.warn(`[WhatsApp] Error during disconnect:`, error);
      }
    }

    this.client = null;
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
}
