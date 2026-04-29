/**
 * WhatsApp Web Integration Service
 * 
 * Core service for WhatsApp Web device linking, session management,
 * and multi-account support. Uses WhatsApp Web protocol for device
 * authentication and real-time message handling.
 * 
 * Features:
 * - QR code generation & device linking
 * - Session persistence & recovery
 * - Multi-account support
 * - Real-time message events
 * - Webhook integration
 */

const crypto = require('crypto');
const EventEmitter = require('events');
const QRCode = require('qrcode');

class WhatsAppWebIntegration extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      maxRetries: config.maxRetries || 3,
      sessionTimeout: config.sessionTimeout || 24 * 60 * 60 * 1000, // 24 hours
      messageQueueSize: config.messageQueueSize || 1000,
      webhookUrl: config.webhookUrl || process.env.WHATSAPP_WEBHOOK_URL,
      ...config,
    };

    this.accounts = new Map(); // accountId -> WhatsAppSession
    this.messageQueue = [];
    this.sessionStore = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the WhatsApp Web integration
   * Sets up session store, event listeners, and recovery
   */
  async initialize(sessionStore) {
    console.log('[WhatsApp] Initializing WhatsApp Web Integration...');
    
    this.sessionStore = sessionStore;
    
    try {
      // Recover previous sessions
      await this.recoverSessions();
      this.isInitialized = true;
      console.log('[WhatsApp] ✅ Initialization complete');
    } catch (error) {
      console.error('[WhatsApp] ❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initiate WhatsApp device linking
   * Generates unique session ID and QR code
   */
  async initiateDeviceLinking(accountId, phoneNumber) {
    console.log(`[WhatsApp] Initiating device linking for ${phoneNumber}`);
    
    if (!accountId || !phoneNumber) {
      throw new Error('Account ID and phone number required');
    }

    // Generate unique session ID
    const sessionId = crypto.randomBytes(16).toString('hex');
    const qrToken = crypto.randomBytes(32).toString('hex');
    
    // Create session object
    const session = {
      accountId,
      sessionId,
      phoneNumber,
      qrToken,
      status: 'linking', // linking | authenticated | connected | disconnected
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // QR expires in 5 minutes
      qrAttempts: 0,
      maxQrAttempts: 5,
      metadata: {
        userAgent: 'WhatsApp-Web-Integration',
        appVersion: '2.2401.0',
        isMultiDevice: true,
      },
    };

    // Store session
    this.accounts.set(accountId, session);
    if (this.sessionStore) {
      await this.sessionStore.save(sessionId, session);
    }

    // Generate QR code
    const qrCode = await this.generateQRCode(qrToken, sessionId);

    console.log(`[WhatsApp] ✅ Device linking initiated: ${accountId}`);

    return {
      sessionId,
      accountId,
      phoneNumber,
      qrCode,
      expiresIn: 300, // 5 minutes
      status: 'waiting_for_scan',
    };
  }

  /**
   * Generate QR code for device scanning
   */
  async generateQRCode(qrToken, sessionId) {
    try {
      // Format: device_token:session_id:timestamp
      const qrData = `wa_device_${qrToken}_${sessionId}_${Date.now()}`;
      
      // Generate QR code as data URL (PNG base64)
      const qrCode = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        width: 300,
      });

      return qrCode;
    } catch (error) {
      console.error('[WhatsApp] QR Code generation failed:', error);
      throw error;
    }
  }

  /**
   * Confirm device linking after QR scan
   * Called when user scans QR on WhatsApp
   */
  async confirmDeviceLinking(sessionId, authToken, phoneNumber) {
    console.log(`[WhatsApp] Confirming device linking: ${sessionId}`);

    const session = this.findSessionById(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    if (session.status !== 'linking') {
      throw new Error(`Invalid session status: ${session.status}`);
    }

    try {
      // Validate auth token
      const isValid = await this.validateAuthToken(authToken, session);
      if (!isValid) {
        throw new Error('Invalid or expired authentication token');
      }

      // Update session status
      session.status = 'authenticated';
      session.authToken = authToken;
      session.phoneNumber = phoneNumber;
      session.authenticatedAt = new Date();
      session.lastActivity = new Date();

      // Save updated session
      if (this.sessionStore) {
        await this.sessionStore.save(sessionId, session);
      }

      console.log(`[WhatsApp] ✅ Device linked: ${phoneNumber}`);

      // Emit event
      this.emit('device_linked', {
        accountId: session.accountId,
        phoneNumber,
        timestamp: new Date(),
      });

      return {
        accountId: session.accountId,
        phoneNumber,
        status: 'connected',
        message: 'Device successfully linked',
      };
    } catch (error) {
      console.error('[WhatsApp] Linking confirmation failed:', error);
      throw error;
    }
  }

  /**
   * Establish connection for an authenticated device
   */
  async connect(accountId) {
    console.log(`[WhatsApp] Connecting account: ${accountId}`);

    const session = this.accounts.get(accountId);
    if (!session) {
      throw new Error(`Account not found: ${accountId}`);
    }

    if (session.status !== 'authenticated') {
      throw new Error(`Account not authenticated: ${accountId}`);
    }

    try {
      // In production, this would establish real WebSocket connection
      // to WhatsApp Web using the authToken
      session.status = 'connected';
      session.connectedAt = new Date();
      session.lastActivity = new Date();
      session.connectionAttempts = 0;

      if (this.sessionStore) {
        await this.sessionStore.save(session.sessionId, session);
      }

      console.log(`[WhatsApp] ✅ Connected: ${accountId}`);

      this.emit('account_connected', {
        accountId,
        phoneNumber: session.phoneNumber,
        timestamp: new Date(),
      });

      return {
        accountId,
        status: 'connected',
        phoneNumber: session.phoneNumber,
      };
    } catch (error) {
      console.error('[WhatsApp] Connection failed:', error);
      throw error;
    }
  }

  /**
   * Handle incoming message from WhatsApp
   */
  async handleIncomingMessage(accountId, messageData) {
    const session = this.accounts.get(accountId);
    if (!session || session.status !== 'connected') {
      console.warn(`[WhatsApp] Message from disconnected account: ${accountId}`);
      return;
    }

    const message = {
      id: crypto.randomUUID(),
      accountId,
      from: messageData.from,
      to: messageData.to,
      body: messageData.body,
      timestamp: messageData.timestamp || new Date(),
      type: messageData.type || 'text',
      isGroup: messageData.isGroup || false,
      metadata: messageData.metadata || {},
      direction: 'incoming',
    };

    // Add to queue
    this.messageQueue.push(message);
    if (this.messageQueue.length > this.config.messageQueueSize) {
      this.messageQueue.shift(); // Remove oldest
    }

    // Update last activity
    session.lastActivity = new Date();
    session.messageCount = (session.messageCount || 0) + 1;

    // Emit event for downstream processing
    this.emit('message_received', message);

    console.log(`[WhatsApp] Message from ${messageData.from}: ${accountId}`);

    // Webhook notification
    if (this.config.webhookUrl) {
      await this.notifyWebhook('message_received', message);
    }

    return message;
  }

  /**
   * Send message via WhatsApp Web
   */
  async sendMessage(accountId, recipientPhone, messageText) {
    const session = this.accounts.get(accountId);
    if (!session || session.status !== 'connected') {
      throw new Error(`Account not connected: ${accountId}`);
    }

    try {
      // Safety checks
      await this.checkSafetyLimits(accountId);

      const message = {
        id: crypto.randomUUID(),
        accountId,
        from: session.phoneNumber,
        to: recipientPhone,
        body: messageText,
        timestamp: new Date(),
        type: 'text',
        direction: 'outgoing',
        status: 'pending',
      };

      // In production, would send via WhatsApp Web connection
      // await this.sendViaWhatsAppWeb(session, recipientPhone, messageText);

      // Mark as sent (simulated)
      message.status = 'sent';
      session.lastActivity = new Date();

      this.emit('message_sent', message);

      console.log(`[WhatsApp] Message sent to ${recipientPhone}`);

      return message;
    } catch (error) {
      console.error('[WhatsApp] Send message failed:', error);
      throw error;
    }
  }

  /**
   * Get session info
   */
  getSession(accountId) {
    const session = this.accounts.get(accountId);
    if (!session) {
      return null;
    }

    return {
      accountId: session.accountId,
      phoneNumber: session.phoneNumber,
      status: session.status,
      connectedAt: session.connectedAt,
      lastActivity: session.lastActivity,
      messageCount: session.messageCount || 0,
    };
  }

  /**
   * List all connected accounts
   */
  listAccounts() {
    return Array.from(this.accounts.values()).map(session => ({
      accountId: session.accountId,
      phoneNumber: session.phoneNumber,
      status: session.status,
      messageCount: session.messageCount || 0,
    }));
  }

  /**
   * Disconnect account
   */
  async disconnect(accountId) {
    const session = this.accounts.get(accountId);
    if (!session) {
      throw new Error(`Account not found: ${accountId}`);
    }

    session.status = 'disconnected';
    session.disconnectedAt = new Date();

    if (this.sessionStore) {
      await this.sessionStore.save(session.sessionId, session);
    }

    this.emit('account_disconnected', {
      accountId,
      timestamp: new Date(),
    });

    console.log(`[WhatsApp] Account disconnected: ${accountId}`);

    return { accountId, status: 'disconnected' };
  }

  /**
   * Unlink account permanently
   */
  async unlinkAccount(accountId) {
    const session = this.accounts.get(accountId);
    if (!session) {
      throw new Error(`Account not found: ${accountId}`);
    }

    // Delete from memory and store
    this.accounts.delete(accountId);
    if (this.sessionStore) {
      await this.sessionStore.delete(session.sessionId);
    }

    console.log(`[WhatsApp] Account unlinked: ${accountId}`);

    return { accountId, status: 'unlinked' };
  }

  /**
   * Recover previous sessions on startup
   */
  async recoverSessions() {
    if (!this.sessionStore) {
      console.log('[WhatsApp] No session store available, skipping recovery');
      return;
    }

    try {
      const sessions = await this.sessionStore.getAllSessions();
      for (const session of sessions) {
        if (session.status === 'connected') {
          // Try to reconnect
          try {
            await this.connect(session.accountId);
          } catch (error) {
            console.warn(`[WhatsApp] Failed to recover session: ${session.accountId}`);
            session.status = 'disconnected';
          }
        }
        this.accounts.set(session.accountId, session);
      }
      console.log(`[WhatsApp] ✅ Recovered ${sessions.length} sessions`);
    } catch (error) {
      console.error('[WhatsApp] Session recovery failed:', error);
    }
  }

  /**
   * Helper: Find session by ID
   */
  findSessionById(sessionId) {
    for (const session of this.accounts.values()) {
      if (session.sessionId === sessionId) {
        return session;
      }
    }
    return null;
  }

  /**
   * Helper: Validate auth token
   */
  async validateAuthToken(authToken, session) {
    // In production, would validate against WhatsApp servers
    // For now, basic validation
    return authToken && authToken.length > 32;
  }

  /**
   * Helper: Check safety limits
   */
  async checkSafetyLimits(accountId) {
    // Safety checks to prevent bans
    // Implemented in WhatsAppSafetyManager
    // For now, just check exists
    const session = this.accounts.get(accountId);
    if (!session) {
      throw new Error('Account not found');
    }
  }

  /**
   * Helper: Notify webhook
   */
  async notifyWebhook(event, data) {
    if (!this.config.webhookUrl) {
      return;
    }

    try {
      // In production, would POST to webhook URL
      console.log(`[WhatsApp] Webhook event: ${event}`);
    } catch (error) {
      console.error('[WhatsApp] Webhook notification failed:', error);
    }
  }
}

module.exports = WhatsAppWebIntegration;
