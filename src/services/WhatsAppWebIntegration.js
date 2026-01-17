import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class WhatsAppWebIntegrationService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.conversationCache = new Map();
    this.cacheExpiry = 60 * 60 * 1000;
    this.currentQRCode = null;
    this.qrCodeExpiryTime = null;
    this.eventHandlers = {
      onReady: null,
      onMessage: null,
      onDisconnected: null,
      onQR: null,
      onAuthFailure: null
    };
    this.retryAttempts = 0;
    this.maxRetries = 3;
  }

  async initializeConnection() {
    try {
      if (this.client && this.isReady) {
        console.log('WhatsApp client already initialized and ready');
        return this.isReady;
      }

      this.client = new Client({
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          timeout: 30000
        },
        authStrategy: new LocalAuth()
      });

      this.client.on('qr', qr => {
        console.log('WhatsApp QR Code generated');
        this.currentQRCode = qr;
        this.qrCodeExpiryTime = Date.now() + 45000; // 45 seconds
        
        // Generate terminal display for debugging
        qrcode.generate(qr, { small: true });
        
        // Emit QR code to listeners (React components)
        if (this.eventHandlers.onQR) {
          this.eventHandlers.onQR({
            qrCode: qr,
            timestamp: new Date(),
            expiresAt: new Date(this.qrCodeExpiryTime)
          });
        }
      });

      this.client.on('ready', () => {
        console.log('WhatsApp client is ready!');
        this.isReady = true;
        if (this.eventHandlers.onReady) {
          this.eventHandlers.onReady();
        }
      });

      this.client.on('message', message => {
        if (this.eventHandlers.onMessage) {
          this.eventHandlers.onMessage(message);
        }
      });

      this.client.on('disconnected', reason => {
        console.log('WhatsApp client disconnected:', reason);
        this.isReady = false;
        if (this.eventHandlers.onDisconnected) {
          this.eventHandlers.onDisconnected(reason);
        }
      });

      await this.client.initialize();
      return this.isReady;
    } catch (error) {
      console.error('Failed to initialize WhatsApp connection:', error);
      throw new Error(`WhatsApp initialization failed: ${error.message}`);
    }
  }

  async getConversations(options = {}) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      const {
        daysBack = 30,
        minMessages = 1,
        excludeGroups = true,
        limit = 100
      } = options;

      const chats = await this.client.getChats();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);

      let filteredChats = chats.filter(chat => {
        if (excludeGroups && chat.isGroup) return false;
        if (chat.getUnreadCount() < minMessages && chat.archive) return false;
        return true;
      });

      filteredChats = filteredChats
        .sort((a, b) => {
          const aTime = a.lastMessage?.timestamp || 0;
          const bTime = b.lastMessage?.timestamp || 0;
          return bTime - aTime;
        })
        .slice(0, limit);

      return filteredChats.map(chat => ({
        chatId: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup,
        unreadCount: chat.getUnreadCount(),
        lastMessage: chat.lastMessage ? {
          text: chat.lastMessage.body,
          timestamp: chat.lastMessage.timestamp,
          from: chat.lastMessage.from
        } : null,
        contact: chat.contact ? {
          name: chat.contact.name,
          pushname: chat.contact.pushname,
          number: chat.contact.number
        } : null
      }));
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  }

  async getConversationById(chatId, limit = 100) {
    try {
      const cached = this.conversationCache.get(chatId);
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }

      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      const chat = await this.client.getChatById(chatId);
      const messages = await chat.fetchMessages({ limit });

      const conversationData = {
        chatId: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup,
        messages: messages.map(msg => ({
          id: msg.id._serialized,
          text: msg.body,
          timestamp: msg.timestamp,
          from: msg.from,
          isFromMe: msg.fromMe,
          hasMedia: msg.hasMedia,
          mediaType: msg.type
        })),
        contact: chat.contact ? {
          name: chat.contact.name,
          number: chat.contact.number,
          pushname: chat.contact.pushname
        } : null
      };

      this.conversationCache.set(chatId, {
        data: conversationData,
        timestamp: Date.now()
      });

      return conversationData;
    } catch (error) {
      console.error(`Failed to get conversation ${chatId}:`, error);
      throw error;
    }
  }

  async searchConversations(keywords, options = {}) {
    try {
      const {
        limit = 20,
        excludeGroups = true
      } = options;

      const conversations = await this.getConversations({
        limit: 200,
        excludeGroups
      });

      const regex = new RegExp(keywords, 'gi');
      const results = [];

      for (const conversation of conversations) {
        if (results.length >= limit) break;

        const chatData = await this.getConversationById(conversation.chatId);
        let matchCount = 0;

        const matches = chatData.messages.filter(msg => {
          if (regex.test(msg.text)) {
            matchCount++;
            return true;
          }
          return false;
        });

        if (matches.length > 0) {
          results.push({
            ...conversation,
            relevanceScore: (matchCount / chatData.messages.length) * 100,
            matchedMessages: matches.length
          });
        }
      }

      return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error('Search conversations failed:', error);
      throw error;
    }
  }

  async sendMessage(number, messageText, options = {}) {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      const formattedNumber = this.formatPhoneNumber(number);
      const chatId = `${formattedNumber}@c.us`;

      const sentMessage = await this.client.sendMessage(chatId, messageText);
      
      return {
        success: true,
        messageId: sentMessage.id._serialized,
        timestamp: sentMessage.timestamp,
        to: formattedNumber
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  formatPhoneNumber(number) {
    let cleaned = number.replace(/[\s\-\(\)]/g, '');

    if (cleaned.startsWith('0')) {
      cleaned = '971' + cleaned.substring(1);
    }

    if (!cleaned.match(/^\d{1,3}/)) {
      throw new Error('Invalid phone number format');
    }

    return cleaned;
  }

  getStatus() {
    return {
      isReady: this.isReady,
      isConnected: this.client ? !this.client._disconnected : false,
      clientId: this.client?.info?.wid?._serialized || null,
      cacheSize: this.conversationCache.size
    };
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.destroy();
        this.client = null;
        this.isReady = false;
        this.conversationCache.clear();
      }
    } catch (error) {
      console.error('Error disconnecting WhatsApp client:', error);
    }
  }

  on(event, handler) {
    if (this.eventHandlers.hasOwnProperty(event)) {
      this.eventHandlers[event] = handler;
    } else {
      throw new Error(`Unknown event: ${event}`);
    }
  }

  /**
   * Get current QR code for authentication
   * Returns null if code has expired
   */
  getCurrentQRCode() {
    if (!this.currentQRCode) {
      return null;
    }

    // Check if QR code has expired
    if (this.qrCodeExpiryTime && Date.now() > this.qrCodeExpiryTime) {
      this.currentQRCode = null;
      return null;
    }

    return {
      qrCode: this.currentQRCode,
      expiresAt: new Date(this.qrCodeExpiryTime),
      expiresIn: Math.round((this.qrCodeExpiryTime - Date.now()) / 1000) // seconds
    };
  }

  /**
   * Get authentication status
   */
  getAuthStatus() {
    return {
      isAuthenticated: this.isReady,
      isConnecting: this.client && !this.isReady,
      hasQRCode: this.currentQRCode !== null,
      qrExpiryTime: this.qrCodeExpiryTime
    };
  }

  /**
   * Retry connection on failure
   */
  async retryConnection() {
    if (this.retryAttempts >= this.maxRetries) {
      throw new Error('Maximum connection attempts reached');
    }

    this.retryAttempts++;
    console.log(`Retrying connection (attempt ${this.retryAttempts}/${this.maxRetries})`);

    // Clear current client
    if (this.client) {
      await this.disconnect();
    }

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 2000));

    return this.initializeConnection();
  }

  clearCache() {
    this.conversationCache.clear();
  }

  on(event, handler) {
    if (this.eventHandlers.hasOwnProperty(event)) {
      this.eventHandlers[event] = handler;
    } else {
      throw new Error(`Unknown event: ${event}`);
    }
  }
}

export default new WhatsAppWebIntegrationService();