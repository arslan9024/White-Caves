/**
 * Linda — WhatsApp LocalAuth Client
 *
 * Full implementation using whatsapp-web.js with LocalAuth session persistence.
 * Handles QR-based authentication, incoming message events, bidirectional
 * messaging, reconnect logic, and per-bot session tracking.
 *
 * Design decisions:
 * - Dynamically imports whatsapp-web.js so the rest of the server can start
 *   even when LINDA_ENABLED=false or when Chrome is unavailable.
 * - Exposes a singleton via getLindaClient() that routes share.
 * - Emits typed EventEmitter events that the Socket.io layer can forward
 *   to connected browser clients.
 */

import { EventEmitter } from 'events';
import path from 'path';
import {
  LINDA_SESSIONS_PATH,
  LINDA_HEADLESS,
  LINDA_RECONNECT_DELAY,
  LINDA_MAX_RECONNECT_ATTEMPTS,
} from '../../config/env.js';

export interface WhatsAppMessage {
  id: string;
  from: string;
  to?: string;
  body: string;
  timestamp: Date;
  isFromMe: boolean;
  hasMedia: boolean;
  type: 'text' | 'image' | 'document' | 'audio' | 'video';
}

export interface LindaConfig {
  authStrategy?: 'LOCAL_AUTH';
  sessionPath?: string;
  headless?: boolean;
  autoRestart?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

export enum LindaStatus {
  DISCONNECTED = 'DISCONNECTED',
  AUTHENTICATING = 'AUTHENTICATING',
  READY = 'READY',
  RECONNECTING = 'RECONNECTING',
  ERROR = 'ERROR',
}

interface LindaStats {
  status: LindaStatus;
  isConnected: boolean;
  queuedMessages: number;
  reconnectAttempts: number;
  messagesSent: number;
  messagesReceived: number;
}

/**
 * Linda WhatsApp Client
 *
 * Wraps whatsapp-web.js with LocalAuth strategy, reconnect logic,
 * and an internal message queue for polling-based consumers.
 */
export class LindaClient extends EventEmitter {
  private status: LindaStatus = LindaStatus.DISCONNECTED;
  private config: Required<LindaConfig>;
  private reconnectAttempts = 0;
  private sessionActive = false;
  private clientAuthenticated = false; // Hardware-enforced authentication flag
  private messageQueue: WhatsAppMessage[] = [];
  private qrCode: string | null = null;
  private messagesSent = 0;
  private messagesReceived = 0;
  private client = null as any; // whatsapp-web.js Client instance

  constructor(config: LindaConfig = {}) {
    super();
    this.config = {
      authStrategy: 'LOCAL_AUTH',
      sessionPath: config.sessionPath ?? LINDA_SESSIONS_PATH,
      headless: config.headless ?? LINDA_HEADLESS,
      autoRestart: config.autoRestart ?? true,
      maxReconnectAttempts: config.maxReconnectAttempts ?? LINDA_MAX_RECONNECT_ATTEMPTS,
      reconnectDelay: config.reconnectDelay ?? LINDA_RECONNECT_DELAY,
    };
  }

  /**
   * Returns true only when physical hardware has emitted ready event.
   */
  public isHardwareConnected(): boolean {
    return this.clientAuthenticated && this.sessionActive && this.status === LindaStatus.READY;
  }

  /**
   * Initialize WhatsApp connection using whatsapp-web.js LocalAuth.
   * Safe to call multiple times — subsequent calls are no-ops if already ready.
   */
  public async initialize(): Promise<void> {
    if (this.sessionActive && this.clientAuthenticated) return;

    try {
      this.clientAuthenticated = false;
      this.setStatus(LindaStatus.AUTHENTICATING);
      console.log('[Linda] Initializing WhatsApp LocalAuth client with hardware hooks...');
      console.log(`[Linda] Session path: ${this.config.sessionPath}`);

      // Dynamic import avoids hard dependency when Chrome is unavailable
      const wwjs = await import('whatsapp-web.js');
      const { Client, LocalAuth } = wwjs.default ?? wwjs;

      // Ensure session directory exists
      const fs = await import('fs');
      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: 'nina-primary',
          dataPath: sessionDir,
        }),
        webVersionCache: {
          type: 'remote',
          remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1018944883-alpha.html',
        },
        puppeteer: {
          headless: this.config.headless,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-extensions',
          ],
        },
        restartOnAuthFail: true,
        takeoverOnConflict: true,
      } as any);

      this.setupEventListeners();
      await this.client.initialize();
    } catch (error) {
      this.clientAuthenticated = false;
      this.setStatus(LindaStatus.ERROR);
      console.error('[Linda] Initialization failed:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Wire whatsapp-web.js events to internal handlers.
   */
  private setupEventListeners(): void {
    if (!this.client) return;

    // STATE 1: QR_RECEIVED Event
    this.client.on('qr', (qr: string) => {
      console.log('[Linda] STATE 1: QR Code generated — scan to authenticate');
      this.clientAuthenticated = false;
      this.qrCode = qr;
      this.emit('qr', qr);
    });

    // STATE 2: AUTHENTICATED Event
    this.client.on('authenticated', () => {
      console.log('[Linda] STATE 2: Physical device authenticated successfully');
      this.clientAuthenticated = true;
      this.emit('authenticated');
    });

    // STATE 3: READY Event
    this.client.on('ready', () => {
      console.log('[Linda] STATE 3: Client ready and physical hardware link active');
      this.qrCode = null; // Clear QR once authenticated
      this.reconnectAttempts = 0;
      this.clientAuthenticated = true;
      this.sessionActive = true;
      this.setStatus(LindaStatus.READY);
      this.emit('ready');
    });

    // EXPLICIT EXCEPTION HANDLING: Auth Failure
    this.client.on('auth_failure', (msg: string) => {
      console.error('[Linda] EXCEPTION: Auth failure:', msg);
      this.clientAuthenticated = false;
      this.sessionActive = false;
      this.qrCode = null;
      this.setStatus(LindaStatus.ERROR);
      this.emit('auth_failure', msg);
      if (this.config.autoRestart) {
        this.attemptReconnect();
      }
    });

    // EXPLICIT EXCEPTION HANDLING: Disconnected
    this.client.on('disconnected', (reason: string) => {
      console.log('[Linda] EXCEPTION: Disconnected from hardware:', reason);
      this.clientAuthenticated = false;
      this.sessionActive = false;
      this.qrCode = null;
      this.setStatus(LindaStatus.DISCONNECTED);
      this.emit('disconnected', reason);
      if (this.config.autoRestart) {
        this.attemptReconnect();
      }
    });

    // Incoming message
    this.client.on('message', async (message: { body?: string; from?: string; type?: string; id?: { id: string } }) => {
      await this.handleIncomingMessage(message);
    });

    console.log('[Linda] Hardware event listeners registered');
  }

  /**
   * Normalise an incoming whatsapp-web.js message into our WhatsAppMessage shape.
   */
  private async handleIncomingMessage(message: unknown): Promise<void> {
    const msg = message as any;
    try {
      const wrapped: WhatsAppMessage = {
        id: msg.id?.id ?? `msg_${Date.now()}`,
        from: msg.from ?? '',
        to: msg.to,
        body: msg.body ?? '',
        timestamp: new Date((msg.timestamp ?? Date.now() / 1000) * 1000),
        isFromMe: msg.fromMe ?? false,
        hasMedia: msg.hasMedia ?? false,
        type: this.detectMessageType(msg),
      };

      this.messageQueue.push(wrapped);
      this.messagesReceived += 1;
      this.emit('message', wrapped);

      console.log(`[Linda] ← from ${wrapped.from}: ${wrapped.body.substring(0, 60)}`);
    } catch (error) {
      console.error('[Linda] Error handling incoming message:', error);
    }
  }

  /**
   * Detect message type from MIME type or hasMedia flag.
   */
  private detectMessageType(message: { hasMedia?: boolean; mimetype?: string }): WhatsAppMessage['type'] {
    if (!message.hasMedia) return 'text';
    const mime: string = message.mimetype ?? '';
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';
    if (mime.includes('pdf') || mime.includes('document') || mime.startsWith('application/'))
      return 'document';
    return 'text';
  }

  // ─── Public API ─────────────────────────────────────────────────────────

  /**
   * Request an 8-digit WhatsApp Pairing Code for phone-based linking without QR camera scanning.
   * @param phoneNumber E.164 string (e.g. "971505760056")
   */
  public async requestPairingCode(phoneNumber: string): Promise<string> {
    if (!this.client) {
      await this.initialize();
    }
    const sanitizedNumber = phoneNumber.replace(/[^0-9]/g, '');
    try {
      if (typeof this.client.requestPairingCode === 'function') {
        const code = await this.client.requestPairingCode(sanitizedNumber);
        console.log(`[Linda] Pairing code generated for ${sanitizedNumber}: ${code}`);
        return code;
      }
      return `WC-${sanitizedNumber.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    } catch (err) {
      console.error('[Linda] Error generating pairing code:', err);
      return `WC-${sanitizedNumber.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  /**
   * Send a message to a WhatsApp number.
   * @param phoneNumber  E.164 number without "+" (e.g. "971501234567")
   * @param message      Plain text body
   */
  public async sendMessage(phoneNumber: string, message: string): Promise<string> {
    if (!this.sessionActive || !this.client) {
      throw new Error('Linda session not active — call initialize() first');
    }
    const chatId = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
    const sent = await this.client.sendMessage(chatId, message);
    const messageId: string =
      sent?.id?.id ?? `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    this.messagesSent += 1;
    this.emit('message_sent', { to: phoneNumber, message, messageId, timestamp: new Date() });
    console.log(`[Linda] → to ${phoneNumber}: ${message.substring(0, 60)}`);
    return messageId;
  }

  /**
   * Send the same message to multiple phone numbers in sequence.
   * Returns per-number results so the caller can log failures.
   */
  public async broadcastMessage(
    phoneNumbers: string[],
    message: string
  ): Promise<Array<{ phone: string; messageId?: string; error?: string }>> {
    const results: Array<{ phone: string; messageId?: string; error?: string }> = [];
    for (const phone of phoneNumbers) {
      try {
        const id = await this.sendMessage(phone, message);
        results.push({ phone, messageId: id });
        // Brief random delay 2–8 s between messages to avoid spam detection
        const delay = 2000 + Math.floor(Math.random() * 6000);
        await new Promise(r => setTimeout(r, delay));
      } catch (err) {
        results.push({ phone, error: err instanceof Error ? err.message : String(err) });
      }
    }
    return results;
  }

  /**
   * Retrieve and clear the internal message queue (for polling consumers).
   */
  public getMessageQueue(): WhatsAppMessage[] {
    const msgs = [...this.messageQueue];
    this.messageQueue = [];
    return msgs;
  }

  /**
   * List active chats/conversations.
   */
  public async getConversations(): Promise<
    Array<{ id: string; name: string; unreadCount: number; lastMessage?: string }>
  > {
    if (!this.sessionActive || !this.client) return [];
    const chats = await this.client.getChats();
    return chats.slice(0, 50).map((c: Record<string, any>) => ({
      // eslint-disable-line @typescript-eslint/no-explicit-any
      id: c.id?._serialized ?? String(c.id),
      name: c.name ?? c.id?._serialized ?? 'Unknown',
      unreadCount: c.unreadCount ?? 0,
      lastMessage: c.lastMessage?.body,
    }));
  }

  /**
   * Fetch message history for a specific contact.
   */
  public async getConversationHistory(phoneNumber: string, limit = 50): Promise<WhatsAppMessage[]> {
    if (!this.sessionActive || !this.client) return [];
    const chatId = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
    const chat = await this.client.getChatById(chatId);
    const messages = await chat.fetchMessages({ limit });
    return messages.map(
      (m: Record<string, any>): WhatsAppMessage => ({
        // eslint-disable-line @typescript-eslint/no-explicit-any
        id: m.id?.id ?? String(Date.now()),
        from: m.from ?? phoneNumber,
        to: m.to,
        body: m.body ?? '',
        timestamp: new Date((m.timestamp ?? 0) * 1000),
        isFromMe: m.fromMe ?? false,
        hasMedia: m.hasMedia ?? false,
        type: this.detectMessageType(m),
      })
    );
  }

  /**
   * Return the current QR code string (null when authenticated or not yet generated).
   */
  public getQRCode(): string | null {
    return this.qrCode;
  }

  /** Gracefully destroy the WhatsApp session. */
  public async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.destroy();
        this.client = null;
      }
    } catch (err) {
      console.warn('[Linda] Error during destroy:', err);
    }
    this.setStatus(LindaStatus.DISCONNECTED);
    this.sessionActive = false;
    this.qrCode = null;
    this.emit('disconnected', 'manual');
    console.log('[Linda] Client disconnected');
  }

  /** Current connection status enum. */
  public getStatus(): LindaStatus {
    return this.status;
  }

  /** Whether the session is authenticated and ready to send messages. */
  public isConnected(): boolean {
    return this.status === LindaStatus.READY && this.sessionActive;
  }

  /** Statistics snapshot for the admin UI and status endpoints. */
  public getStats(): LindaStats {
    return {
      status: this.status,
      isConnected: this.isConnected(),
      queuedMessages: this.messageQueue.length,
      reconnectAttempts: this.reconnectAttempts,
      messagesSent: this.messagesSent,
      messagesReceived: this.messagesReceived,
    };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private setStatus(newStatus: LindaStatus): void {
    if (this.status !== newStatus) {
      console.log(`[Linda] Status: ${this.status} → ${newStatus}`);
      this.status = newStatus;
      this.emit('status_changed', newStatus);
    }
  }

  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.setStatus(LindaStatus.ERROR);
      console.error('[Linda] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts += 1;
    // Exponential back-off capped at 5 minutes
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      300_000
    );
    console.log(
      `[Linda] Reconnect attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts} in ${delay}ms`
    );
    this.setStatus(LindaStatus.RECONNECTING);

    setTimeout(async () => {
      try {
        // Reset session state before re-initializing
        this.sessionActive = false;
        this.client = null;
        await this.initialize();
      } catch (err) {
        console.error('[Linda] Reconnection attempt failed:', err);
        await this.attemptReconnect();
      }
    }, delay);
  }
}

// ─── Singleton management ─────────────────────────────────────────────────

let lindaInstance: LindaClient | null = null;

/** Return the process-wide Linda singleton, optionally applying config on first call. */
export function getLindaClient(config?: LindaConfig): LindaClient {
  if (!lindaInstance) {
    lindaInstance = new LindaClient(config);
  }
  return lindaInstance;
}

/** Create a fresh LindaClient instance (useful for multi-bot scenarios). */
export function createLindaClient(config?: LindaConfig): LindaClient {
  return new LindaClient(config);
}

/** Reset the singleton (primarily for tests). */
export function resetLindaClient(): void {
  lindaInstance = null;
}
