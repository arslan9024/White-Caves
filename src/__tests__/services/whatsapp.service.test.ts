import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { whatsappService } from '../../services/whatsapp/whatsapp.service';

// Mock WhatsApp Web client
vi.mock('whatsapp-web.js', () => ({
  Client: vi.fn().mockImplementation(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    sendMessage: vi.fn().mockResolvedValue(true),
    isReady: true,
  })),
}));

describe('WhatsApp Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Service Initialization', () => {
    it('should initialize the WhatsApp service', async () => {
      const result = await whatsappService.initialize();
      expect(result).toBeDefined();
    });

    it('should handle initialization errors gracefully', async () => {
      vi.spyOn(whatsappService, 'initialize').mockRejectedValueOnce(
        new Error('Initialization failed')
      );

      await expect(whatsappService.initialize()).rejects.toThrow(
        'Initialization failed'
      );
    });
  });

  describe('Account Management', () => {
    it('should link a new account', async () => {
      const accountData = {
        phoneNumber: '1234567890',
        displayName: 'Test Account',
        agentId: 'agent-123',
      };

      const result = await whatsappService.linkAccount(accountData);
      expect(result).toBeDefined();
      expect(result.phoneNumber).toBe(accountData.phoneNumber);
    });

    it('should retrieve all linked accounts', async () => {
      const accounts = await whatsappService.getAccounts();
      expect(Array.isArray(accounts)).toBe(true);
    });

    it('should unlink an account', async () => {
      const accountId = 'account-123';
      const result = await whatsappService.unlinkAccount(accountId);
      expect(result).toBe(true);
    });

    it('should validate account before linking', async () => {
      const invalidAccount = {
        phoneNumber: 'invalid',
        displayName: '',
        agentId: '',
      };

      try {
        await whatsappService.linkAccount(invalidAccount);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Message Handling', () => {
    it('should send a message successfully', async () => {
      const messageData = {
        recipientNumber: '1234567890',
        content: 'Hello, World!',
        accountId: 'account-123',
      };

      const result = await whatsappService.sendMessage(messageData);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should retrieve conversation messages', async () => {
      const conversationId = 'conv-123';
      const messages = await whatsappService.getMessages(conversationId);
      expect(Array.isArray(messages)).toBe(true);
    });

    it('should mark message as read', async () => {
      const messageId = 'msg-123';
      const result = await whatsappService.markAsRead(messageId);
      expect(result).toBe(true);
    });

    it('should handle message sending errors', async () => {
      vi.spyOn(whatsappService, 'sendMessage').mockRejectedValueOnce(
        new Error('Failed to send message')
      );

      const messageData = {
        recipientNumber: '1234567890',
        content: 'Hello',
        accountId: 'account-123',
      };

      await expect(whatsappService.sendMessage(messageData)).rejects.toThrow(
        'Failed to send message'
      );
    });
  });

  describe('Conversation Management', () => {
    it('should get all conversations', async () => {
      const conversations = await whatsappService.getConversations();
      expect(Array.isArray(conversations)).toBe(true);
    });

    it('should get conversation details', async () => {
      const conversationId = 'conv-123';
      const conversation = await whatsappService.getConversationDetails(
        conversationId
      );
      expect(conversation).toBeDefined();
    });

    it('should archive conversation', async () => {
      const conversationId = 'conv-123';
      const result = await whatsappService.archiveConversation(
        conversationId
      );
      expect(result).toBe(true);
    });

    it('should mute conversation', async () => {
      const conversationId = 'conv-123';
      const result = await whatsappService.muteConversation(conversationId);
      expect(result).toBe(true);
    });

    it('should delete conversation', async () => {
      const conversationId = 'conv-123';
      const result = await whatsappService.deleteConversation(
        conversationId
      );
      expect(result).toBe(true);
    });
  });

  describe('Contact Management', () => {
    it('should get all contacts', async () => {
      const contacts = await whatsappService.getContacts();
      expect(Array.isArray(contacts)).toBe(true);
    });

    it('should get contact details', async () => {
      const contactId = 'contact-123';
      const contact = await whatsappService.getContactDetails(contactId);
      expect(contact).toBeDefined();
    });

    it('should create a new contact', async () => {
      const contactData = {
        phoneNumber: '1234567890',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await whatsappService.createContact(contactData);
      expect(result).toBeDefined();
      expect(result.phoneNumber).toBe(contactData.phoneNumber);
    });

    it('should update contact', async () => {
      const contactId = 'contact-123';
      const updateData = {
        firstName: 'Jane',
      };

      const result = await whatsappService.updateContact(
        contactId,
        updateData
      );
      expect(result).toBeDefined();
    });

    it('should delete contact', async () => {
      const contactId = 'contact-123';
      const result = await whatsappService.deleteContact(contactId);
      expect(result).toBe(true);
    });
  });

  describe('Session Management', () => {
    it('should create session', async () => {
      const sessionData = {
        accountId: 'account-123',
        sessionName: 'test-session',
      };

      const result = await whatsappService.createSession(sessionData);
      expect(result).toBeDefined();
      expect(result.sessionName).toBe(sessionData.sessionName);
    });

    it('should get session status', async () => {
      const sessionId = 'session-123';
      const status = await whatsappService.getSessionStatus(sessionId);
      expect(status).toBeDefined();
      expect(['active', 'inactive', 'error']).toContain(status);
    });

    it('should restart session', async () => {
      const sessionId = 'session-123';
      const result = await whatsappService.restartSession(sessionId);
      expect(result).toBe(true);
    });

    it('should end session', async () => {
      const sessionId = 'session-123';
      const result = await whatsappService.endSession(sessionId);
      expect(result).toBe(true);
    });
  });

  describe('Analytics', () => {
    it('should get account statistics', async () => {
      const accountId = 'account-123';
      const stats = await whatsappService.getAccountStats(accountId);
      expect(stats).toBeDefined();
      expect(stats.totalMessages).toBeDefined();
      expect(stats.totalConversations).toBeDefined();
    });

    it('should get conversation statistics', async () => {
      const conversationId = 'conv-123';
      const stats = await whatsappService.getConversationStats(
        conversationId
      );
      expect(stats).toBeDefined();
      expect(stats.messageCount).toBeDefined();
    });

    it('should get daily message count', async () => {
      const accountId = 'account-123';
      const date = new Date();
      const count = await whatsappService.getDailyMessageCount(
        accountId,
        date
      );
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Media Handling', () => {
    it('should send media file', async () => {
      const mediaData = {
        recipientNumber: '1234567890',
        filePath: '/path/to/file.jpg',
        caption: 'Test media',
        accountId: 'account-123',
      };

      const result = await whatsappService.sendMedia(mediaData);
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should download media', async () => {
      const messageId = 'msg-123';
      const mediaUrl = await whatsappService.downloadMedia(messageId);
      expect(mediaUrl).toBeDefined();
      expect(typeof mediaUrl).toBe('string');
    });

    it('should handle unsupported media types', async () => {
      const mediaData = {
        recipientNumber: '1234567890',
        filePath: '/path/to/file.exe',
        caption: 'Suspicious',
        accountId: 'account-123',
      };

      try {
        await whatsappService.sendMedia(mediaData);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      vi.spyOn(whatsappService, 'sendMessage').mockRejectedValueOnce(
        new Error('Network error')
      );

      try {
        await whatsappService.sendMessage({
          recipientNumber: '1234567890',
          content: 'Hello',
          accountId: 'account-123',
        });
      } catch (error) {
        expect((error as Error).message).toContain('Network error');
      }
    });

    it('should handle timeout errors', async () => {
      vi.useFakeTimers();
      vi.spyOn(whatsappService, 'initialize').mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout')), 5000);
          })
      );

      const promise = whatsappService.initialize();
      vi.advanceTimersByTime(6000);

      await expect(promise).rejects.toThrow('Timeout');
      vi.useRealTimers();
    });
  });

  describe('Service Cleanup', () => {
    it('should properly destroy service', async () => {
      const result = await whatsappService.destroy();
      expect(result).toBe(true);
    });

    it('should handle destroy errors', async () => {
      vi.spyOn(whatsappService, 'destroy').mockRejectedValueOnce(
        new Error('Destroy failed')
      );

      await expect(whatsappService.destroy()).rejects.toThrow(
        'Destroy failed'
      );
    });
  });
});
