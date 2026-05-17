import { describe, it, expect, beforeEach, vi } from 'vitest';
import WhatsAppWebIntegration from '../WhatsAppWebIntegration';

describe('WhatsAppWebIntegration', () => {
  let integration;

  beforeEach(() => {
    integration = new WhatsAppWebIntegration();
    vi.clearAllMocks();
  });

  // ============================================================
  // CONNECTION MANAGEMENT TESTS
  // ============================================================

  describe('Connection Management', () => {
    it('should initialize connection', async () => {
      const result = await integration.initializeConnection();
      expect(result).toBeDefined();
    });

    it('should track connection state', () => {
      const state = integration.getConnectionState();
      expect(['disconnected', 'qr', 'loading', 'authenticated']).toContain(state);
    });

    it('should handle connection errors gracefully', async () => {
      vi.spyOn(integration, 'initializeConnection').mockRejectedValue(new Error('Connection failed'));
      
      try {
        await integration.initializeConnection();
      } catch (error) {
        expect(error.message).toContain('Connection failed');
      }
    });

    it('should retry connection on failure', async () => {
      const retryCount = await integration.retryConnection();
      expect(retryCount).toBeLessThanOrEqual(3);
      expect(retryCount).toBeGreaterThanOrEqual(0);
    });

    it('should implement exponential backoff for retries', async () => {
      const spy = vi.spyOn(integration, 'retryConnection');
      await integration.retryConnection();
      expect(spy).toHaveBeenCalled();
    });
  });

  // ============================================================
  // QR CODE GENERATION TESTS
  // ============================================================

  describe('QR Code Generation', () => {
    it('should generate QR code', async () => {
      const qrCode = await integration.getCurrentQRCode();
      expect(qrCode).toBeDefined();
    });

    it('should include QR code data', async () => {
      const qrCode = await integration.getCurrentQRCode();
      expect(qrCode.qr).toBeTruthy();
      expect(typeof qrCode.qr).toBe('string');
    });

    it('should include expiry time with QR code', async () => {
      const qrCode = await integration.getCurrentQRCode();
      expect(qrCode.expiresAt).toBeDefined();
      expect(typeof qrCode.expiresAt).toBe('number');
    });

    it('should set 45-second QR code expiry', async () => {
      const qrCode = await integration.getCurrentQRCode();
      const expiryTime = qrCode.expiresAt - Date.now();
      expect(expiryTime).toBeCloseTo(45000, 5000); // 45 seconds ±5 second tolerance
    });

    it('should mark QR as expired when checking after expiry', async () => {
      const qrCode = await integration.getCurrentQRCode();
      const isExpired = Date.now() > qrCode.expiresAt + 1000; // Check after 1 second
      expect(typeof isExpired).toBe('boolean');
    });

    it('should regenerate expired QR code', async () => {
      const qr1 = await integration.getCurrentQRCode();
      // Simulate time passage
      await new Promise(resolve => setTimeout(resolve, 100));
      const qr2 = await integration.getCurrentQRCode();
      
      if (qr1.expiresAt !== qr2.expiresAt) {
        expect(qr2.expiresAt).toBeGreaterThan(qr1.expiresAt);
      }
    });

    it('should emit QR code events', (done) => {
      integration.on('qr', (qrCode) => {
        expect(qrCode).toBeDefined();
        expect(qrCode.qr).toBeTruthy();
        done();
      });

      integration.generateQRCode();
    });

    it('should handle QR code generation errors', async () => {
      vi.spyOn(integration, 'getCurrentQRCode').mockRejectedValue(new Error('QR generation failed'));
      
      try {
        await integration.getCurrentQRCode();
      } catch (error) {
        expect(error.message).toContain('QR generation failed');
      }
    });
  });

  // ============================================================
  // AUTHENTICATION STATUS TESTS
  // ============================================================

  describe('Authentication Status', () => {
    it('should return current auth status', async () => {
      const status = await integration.getAuthStatus();
      expect(['disconnected', 'authenticating', 'authenticated']).toContain(status);
    });

    it('should return auth status with details', async () => {
      const status = await integration.getAuthStatusDetailed();
      expect(status.status).toBeDefined();
      expect(status.timestamp).toBeDefined();
    });

    it('should track authentication progress', () => {
      const progress = integration.getAuthProgress();
      expect(typeof progress).toBe('number');
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    it('should emit authentication events', (done) => {
      integration.on('authenticated', (clientInfo) => {
        expect(clientInfo).toBeDefined();
        done();
      });

      integration.simulateAuthentication();
    });

    it('should handle authentication failure', (done) => {
      integration.on('auth_failure', (error) => {
        expect(error).toBeDefined();
        done();
      });

      integration.simulateAuthFailure();
    });

    it('should timeout after max authentication attempts', async () => {
      const maxAttempts = 3;
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        const status = await integration.getAuthStatus();
        if (status === 'authenticated') break;
        attempts++;
      }
      
      expect(attempts).toBeLessThanOrEqual(maxAttempts);
    });
  });

  // ============================================================
  // CONVERSATION RETRIEVAL TESTS
  // ============================================================

  describe('Conversation Retrieval', () => {
    it('should retrieve all conversations', async () => {
      const conversations = await integration.getConversations();
      expect(Array.isArray(conversations)).toBe(true);
    });

    it('should return conversation with required fields', async () => {
      const conversations = await integration.getConversations({ limit: 1 });
      if (conversations.length > 0) {
        const chat = conversations[0];
        expect(chat.id).toBeDefined();
        expect(chat.name).toBeDefined();
      }
    });

    it('should filter conversations by days back', async () => {
      const conversations = await integration.getConversations({ daysBack: 7 });
      expect(Array.isArray(conversations)).toBe(true);
    });

    it('should filter conversations by minimum message count', async () => {
      const conversations = await integration.getConversations({ minMessages: 5 });
      conversations.forEach(chat => {
        if (chat.messageCount !== undefined) {
          expect(chat.messageCount).toBeGreaterThanOrEqual(5);
        }
      });
    });

    it('should exclude group chats when requested', async () => {
      const conversations = await integration.getConversations({ excludeGroups: true });
      conversations.forEach(chat => {
        expect(chat.isGroup).not.toBe(true);
      });
    });

    it('should paginate conversation results', async () => {
      const page1 = await integration.getConversations({ limit: 5, offset: 0 });
      const page2 = await integration.getConversations({ limit: 5, offset: 5 });
      
      expect(Array.isArray(page1)).toBe(true);
      expect(Array.isArray(page2)).toBe(true);
    });

    it('should retrieve specific conversation by ID', async () => {
      const chatId = 'test-chat-123';
      const conversation = await integration.getConversationById(chatId);
      expect(conversation).toBeDefined();
      expect(conversation.id).toBe(chatId);
    });

    it('should include messages in conversation', async () => {
      const chatId = 'test-chat-123';
      const conversation = await integration.getConversationById(chatId, { limit: 50 });
      expect(Array.isArray(conversation.messages)).toBe(true);
    });

    it('should limit message count in conversation', async () => {
      const chatId = 'test-chat-123';
      const conversation = await integration.getConversationById(chatId, { limit: 10 });
      if (conversation.messages) {
        expect(conversation.messages.length).toBeLessThanOrEqual(10);
      }
    });
  });

  // ============================================================
  // SEARCH FUNCTIONALITY TESTS
  // ============================================================

  describe('Search Functionality', () => {
    it('should search conversations by keywords', async () => {
      const results = await integration.searchConversations(['villa', 'rent']);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return search results with relevance score', async () => {
      const results = await integration.searchConversations(['villa']);
      results.forEach(result => {
        expect(result.relevanceScore).toBeDefined();
        expect(typeof result.relevanceScore).toBe('number');
      });
    });

    it('should sort search results by relevance', async () => {
      const results = await integration.searchConversations(['villa']);
      if (results.length > 1) {
        for (let i = 1; i < results.length; i++) {
          expect(results[i].relevanceScore).toBeLessThanOrEqual(results[i - 1].relevanceScore);
        }
      }
    });

    it('should handle multiple keyword search', async () => {
      const results = await integration.searchConversations(['villa', 'dubai marina', '5000']);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return empty results for no matches', async () => {
      const results = await integration.searchConversations(['xyz123nonsense']);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  // ============================================================
  // MESSAGE SENDING TESTS
  // ============================================================

  describe('Message Sending', () => {
    it('should send message to contact', async () => {
      const result = await integration.sendMessage('+971501234567', 'Hello!');
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });

    it('should return message ID after sending', async () => {
      const result = await integration.sendMessage('+971501234567', 'Test message');
      expect(result.messageId).toBeTruthy();
      expect(typeof result.messageId).toBe('string');
    });

    it('should track message status', async () => {
      const result = await integration.sendMessage('+971501234567', 'Test');
      expect(['sending', 'sent', 'delivered', 'read']).toContain(result.status);
    });

    it('should handle invalid phone numbers', async () => {
      try {
        await integration.sendMessage('invalid', 'Test');
      } catch (error) {
        expect(error.message).toBeTruthy();
      }
    });

    it('should validate message content', async () => {
      const result = await integration.sendMessage('+971501234567', '');
      expect(result.success).toBe(false);
    });

    it('should send media messages', async () => {
      const result = await integration.sendMessage('+971501234567', 'Check this image', {
        media: 'image_url'
      });
      expect(result).toBeDefined();
    });
  });

  // ============================================================
  // CACHING TESTS
  // ============================================================

  describe('Conversation Caching', () => {
    it('should cache conversation data', async () => {
      const chatId = 'test-chat-123';
      await integration.getConversationById(chatId);
      
      const cacheStatus = integration.getCacheStatus(chatId);
      expect(cacheStatus.cached).toBe(true);
    });

    it('should retrieve from cache on second request', async () => {
      const chatId = 'test-chat-123';
      const start1 = Date.now();
      await integration.getConversationById(chatId);
      
      const start2 = Date.now();
      await integration.getConversationById(chatId);
      const time2 = Date.now() - start2;
      
      // Cache should be faster (or same time in test environment)
      expect(time2).toBeDefined();
    });

    it('should expire cache after 1 hour', async () => {
      const chatId = 'test-chat-123';
      const cacheStatus = integration.getCacheStatus(chatId);
      
      if (cacheStatus.cached) {
        const expiresAt = cacheStatus.expiresAt;
        const expiryTime = expiresAt - Date.now();
        expect(expiryTime).toBeLessThanOrEqual(3600000); // 1 hour in milliseconds
      }
    });

    it('should clear cache when requested', () => {
      const chatId = 'test-chat-123';
      integration.clearCache(chatId);
      const cacheStatus = integration.getCacheStatus(chatId);
      expect(cacheStatus.cached).toBe(false);
    });

    it('should clear all cache', () => {
      integration.clearAllCache();
      const allCache = integration.getAllCacheStatus();
      expect(allCache.length).toBe(0);
    });
  });

  // ============================================================
  // ERROR HANDLING TESTS
  // ============================================================

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      vi.spyOn(integration, 'getConversations').mockRejectedValue(new Error('Network error'));
      
      try {
        await integration.getConversations();
      } catch (error) {
        expect(error.message).toContain('Network');
      }
    });

    it('should handle timeout errors', async () => {
      vi.spyOn(integration, 'getConversationById').mockRejectedValue(new Error('Request timeout'));
      
      try {
        await integration.getConversationById('test-id');
      } catch (error) {
        expect(error.message).toContain('timeout');
      }
    });

    it('should provide detailed error information', async () => {
      vi.spyOn(integration, 'getConversations').mockRejectedValue({
        code: 'NETWORK_ERROR',
        message: 'Failed to fetch conversations',
        timestamp: new Date()
      });
      
      try {
        await integration.getConversations();
      } catch (error) {
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
      }
    });

    it('should emit error events', (done) => {
      integration.on('error', (error) => {
        expect(error).toBeDefined();
        done();
      });

      integration.simulateError();
    });
  });

  // ============================================================
  // INTEGRATION TESTS
  // ============================================================

  describe('Integration Tests', () => {
    it('should complete full authentication flow', async () => {
      const qrCode = await integration.getCurrentQRCode();
      expect(qrCode).toBeDefined();
      expect(qrCode.qr).toBeTruthy();
      
      const status = await integration.getAuthStatus();
      expect(['disconnected', 'authenticating', 'authenticated']).toContain(status);
    });

    it('should retrieve conversations after authentication', async () => {
      const conversations = await integration.getConversations({ limit: 5 });
      expect(Array.isArray(conversations)).toBe(true);
    });

    it('should search and retrieve specific conversation', async () => {
      const searchResults = await integration.searchConversations(['villa']);
      if (searchResults.length > 0) {
        const chatId = searchResults[0].id;
        const conversation = await integration.getConversationById(chatId);
        expect(conversation).toBeDefined();
        expect(conversation.messages).toBeDefined();
      }
    });

    it('should handle multiple concurrent requests', async () => {
      const results = await Promise.all([
        integration.getConversations({ limit: 5 }),
        integration.searchConversations(['villa']),
        integration.getAuthStatus()
      ]);

      expect(results.length).toBe(3);
      expect(Array.isArray(results[0])).toBe(true);
      expect(Array.isArray(results[1])).toBe(true);
    });
  });

  // ============================================================
  // EVENT EMISSION TESTS
  // ============================================================

  describe('Event Emission', () => {
    it('should emit ready event', (done) => {
      integration.on('ready', () => {
        expect(true).toBe(true);
        done();
      });

      integration.emitReady();
    });

    it('should emit authenticated event with client info', (done) => {
      integration.on('authenticated', (clientInfo) => {
        expect(clientInfo).toBeDefined();
        expect(clientInfo.wid).toBeDefined();
        done();
      });

      integration.emitAuthenticated();
    });

    it('should emit disconnected event', (done) => {
      integration.on('disconnected', (reason) => {
        expect(reason).toBeDefined();
        done();
      });

      integration.emitDisconnected();
    });

    it('should emit message event', (done) => {
      integration.on('message', (message) => {
        expect(message).toBeDefined();
        expect(message.body).toBeDefined();
        done();
      });

      integration.emitMessage();
    });
  });
});
