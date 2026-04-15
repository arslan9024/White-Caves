/**
 * Linda - WhatsApp LocalAuth Client
 * Handles real WhatsApp message ingestion via LocalAuth (no credentials needed)
 * Features: Session persistence, real-time message receiving, bidirectional messaging
 * Status: This is a template - actual implementation requires whatsapp-web.js
 */

import { EventEmitter } from 'events';
import { createLogger } from '../../utils/logger.js';

const log = createLogger('Linda');

export interface WhatsAppMessage {
  id: string;
  from: string; // Phone number
  to?: string;
  body: string;
  timestamp: Date;
  isFromMe: boolean;
  hasMedia: boolean;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
}

export interface LindaConfig {
  authStrategy: 'LOCAL_AUTH' | 'CLOUD';
  sessionPath: string; // Default: ~/.linda-session
  headless: boolean;
  port?: number;
  autoRestart: boolean;
  maxReconnectAttempts: number;
  reconnectDelay: number; // ms
}

export enum LindaStatus {
  DISCONNECTED = 'DISCONNECTED',
  AUTHENTICATING = 'AUTHENTICATING',
  READY = 'READY',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
}

/**
 * Linda WhatsApp Client
 * Wrapper around whatsapp-web.js with LocalAuth
 */
export class LindaClient extends EventEmitter {
  private status: LindaStatus = LindaStatus.DISCONNECTED;
  private config: LindaConfig;
  private reconnectAttempts = 0;
  private sessionActive = false;
  private messageQueue: WhatsAppMessage[] = [];

  constructor(config: Partial<LindaConfig> = {}) {
    super();

    this.config = {
      authStrategy: 'LOCAL_AUTH',
      sessionPath: process.env.LINDA_SESSION_PATH || './.linda-session',
      headless: process.env.LINDA_HEADLESS !== 'false',
      autoRestart: true,
      maxReconnectAttempts: 5,
      reconnectDelay: process.env.LINDA_RECONNECT_DELAY ? parseInt(process.env.LINDA_RECONNECT_DELAY) : 5000,
      ...config,
    };
  }

  /**
   * Initialize WhatsApp connection
   * Note: In real implementation, this would use whatsapp-web.js
   */
  public async initialize(): Promise<void> {
    try {
      this.setStatus(LindaStatus.AUTHENTICATING);

      log.info('Initializing WhatsApp LocalAuth client...');
      log.info(`Session path: ${this.config.sessionPath}`);

      // In production, this would be:
      // const { Client } = require('whatsapp-web.js');
      // const LocalAuth = require('whatsapp-web.js/lib/stores/LocalAuth');
      //
      // this.client = new Client({
      //   authStrategy: new LocalAuth({ clientId: 'linda' }),
      //   puppeteer: {
      //     headless: this.config.headless,
      //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
      //     executablePath: process.platform === 'win32' ? undefined : '/usr/bin/chromium'
      //   },
      //   restartOnAuthFail: true,
      //   takeoverOnConflict: true,
      //   qrTimeout: 0,
      // });

      // Setup event listeners
      this.setupEventListeners();

      // Emit ready event
      this.setStatus(LindaStatus.READY);
      this.sessionActive = true;
      this.reconnectAttempts = 0;

      log.info('WhatsApp client ready!');
      this.emit('ready');
    } catch (error) {
      this.setStatus(LindaStatus.ERROR);
      log.error('Initialization failed:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Note: These would be real whatsapp-web.js event handlers:

    // QR Code (for initial auth)
    // this.client.on('qr', (qr) => {
    //   console.log('[Linda] QR Code generated - scan to authenticate');
    //   this.emit('qr', qr);
    // });

    // Authentication failed
    // this.client.on('auth_failure', (msg) => {
    //   console.error('[Linda] Auth failure:', msg);
    //   this.setStatus(LindaStatus.ERROR);
    //   this.emit('auth_failure', msg);
    // });

    // Ready (authenticated)
    // this.client.on('ready', () => {
    //   console.log('[Linda] Client ready and authenticated');
    //   this.setStatus(LindaStatus.READY);
    // });

    // Message received
    // this.client.on('message', async (message) => {
    //   await this.handleIncomingMessage(message);
    // });

    // Disconnected
    // this.client.on('disconnected', (reason) => {
    //   console.log('[Linda] Disconnected:', reason);
    //   this.setStatus(LindaStatus.DISCONNECTED);
    //   this.sessionActive = false;
    //   this.attemptReconnect();
    // });

    log.info('Event listeners setup complete');
  }

  /**
   * Handle incoming message from WhatsApp
   */
  private async handleIncomingMessage(message: any): Promise<void> {
    try {
      // Note: In real implementation:
      // const chat = await message.getChat();
      // const contact = await message.getContact();

      const wrappedMessage: WhatsAppMessage = {
        id: message.id?.id || `msg_${Date.now()}`,
        from: message.from,
        to: message.to,
        body: message.body,
        timestamp: new Date(message.timestamp * 1000),
        isFromMe: message.fromMe || false,
        hasMedia: message.hasMedia || false,
        type: this.detectMessageType(message),
      };

      // Add to queue
      this.messageQueue.push(wrappedMessage);

      // Emit event
      this.emit('message', wrappedMessage);

      log.info(`Message received from ${wrappedMessage.from}: ${wrappedMessage.body.substring(0, 50)}`);
    } catch (error) {
      log.error('Error handling message:', error);
    }
  }

  /**
   * Detect message type
   */
  private detectMessageType(
    message: any
  ): 'text' | 'image' | 'document' | 'audio' | 'video' {
    if (!message.hasMedia) return 'text';

    const mimeType = message.mimetype || '';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('audio')) return 'audio';
    if (mimeType.includes('video')) return 'video';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document';

    return 'text';
  }

  /**
   * Send message to WhatsApp contact
   */
  public async sendMessage(phoneNumber: string, message: string): Promise<string> {
    try {
      // Note: In real implementation:
      // const number = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
      // const msg = await this.client.sendMessage(number, message);
      // return msg.id?.id;

      if (!this.sessionActive) {
        throw new Error('Linda session not active');
      }

      const messageId = `msg_${Date.now()}_${Math.random().toString(36)}`;

      log.info(`Message sent to ${phoneNumber}: ${message.substring(0, 50)}`);

      this.emit('message_sent', {
        to: phoneNumber,
        message,
        messageId,
        timestamp: new Date(),
      });

      return messageId;
    } catch (error) {
      log.error('Error sending message:', error);
      this.emit('error', { type: 'send_failed', error });
      throw error;
    }
  }

  /**
   * Get message queue (polling mechanism)
   */
  public getMessageQueue(): WhatsAppMessage[] {
    const messages = [...this.messageQueue];
    this.messageQueue = [];
    return messages;
  }

  /**
   * Get conversation list
   */
  public async getConversations(): Promise<any[]> {
    try {
      // Note: In real implementation:
      // const chats = await this.client.getChats();
      // return chats.map(chat => ({ id: chat.id, name: chat.name, lastMessage: chat.lastMessage }));

      log.info('Fetching conversations');
      return [];
    } catch (error) {
      log.error('Error getting conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  public async getConversationHistory(phoneNumber: string, limit: number = 50): Promise<WhatsAppMessage[]> {
    try {
      // Note: In real implementation:
      // const number = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
      // const chat = await this.client.getChatById(number);
      // const messages = await chat.fetchMessages({ limit });

      log.info(`Fetching conversation history for ${phoneNumber}`);
      return [];
    } catch (error) {
      log.error('Error getting conversation history:', error);
      throw error;
    }
  }

  /**
   * Close/disconnect client
   */
  public async disconnect(): Promise<void> {
    try {
      // Note: In real implementation:
      // await this.client.destroy();

      this.setStatus(LindaStatus.DISCONNECTED);
      this.sessionActive = false;
      log.info('Client disconnected');
      this.emit('disconnected');
    } catch (error) {
      log.error('Error disconnecting:', error);
      throw error;
    }
  }

  /**
   * Attempt reconnection with exponential backoff
   */
  private async attemptReconnect(): Promise<void> {
    if (!this.config.autoRestart || this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.setStatus(LindaStatus.ERROR);
      log.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts += 1;
    const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    log.info(
      `Attempting reconnection (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}) in ${delay}ms`
    );

    this.setStatus(LindaStatus.RECONNECTING);

    setTimeout(async () => {
      try {
        await this.initialize();
      } catch (error) {
        log.error('Reconnection failed:', error);
        await this.attemptReconnect();
      }
    }, delay);
  }

  /**
   * Set status and log
   */
  private setStatus(newStatus: LindaStatus): void {
    if (this.status !== newStatus) {
      log.info(`Status: ${this.status} -> ${newStatus}`);
      this.status = newStatus;
      this.emit('status_changed', newStatus);
    }
  }

  /**
   * Get current status
   */
  public getStatus(): LindaStatus {
    return this.status;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.status === LindaStatus.READY && this.sessionActive;
  }

  /**
   * Get stats
   */
  public getStats(): {
    status: LindaStatus;
    isConnected: boolean;
    queuedMessages: number;
    reconnectAttempts: number;
  } {
    return {
      status: this.status,
      isConnected: this.isConnected(),
      queuedMessages: this.messageQueue.length,
      reconnectAttempts: this.reconnectAttempts,
    };
  }
}

// Export singleton instance
let lindaInstance: LindaClient | null = null;

export function getLindaClient(config?: Partial<LindaConfig>): LindaClient {
  if (!lindaInstance) {
    lindaInstance = new LindaClient(config);
  }
  return lindaInstance;
}

export function createLindaClient(config?: Partial<LindaConfig>): LindaClient {
  return new LindaClient(config);
}
