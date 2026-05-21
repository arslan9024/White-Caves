/**
 * WhatsApp Bot Service — Tests
 * Tests constructor env-validation, initialise, and message methods.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const { mockMetaSendMessage, mockMetaSendTemplate } = vi.hoisted(() => ({
  mockMetaSendMessage: vi.fn(async () => 'wa-msg-1'),
  mockMetaSendTemplate: vi.fn(async () => 'wa-template-1'),
}));

// Mock logger before importing service
vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('./whatsapp/metaAPI.js', () => ({
  MetaAPIClient: class {
    sendMessage = mockMetaSendMessage;
    sendTemplate = mockMetaSendTemplate;
    getStats() {
      return {
        apiVersion: 'v17.0',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'mock-phone-id',
        businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
      };
    }
  },
}));

// =====================================================================
// HELPER: fresh-import the module so constructor re-runs with new env
// =====================================================================
async function importFresh() {
  vi.resetModules();
  const mod = await import('./WhatsAppBotService');
  return mod.default;
}

// =====================================================================
// TEST SUITE
// =====================================================================

describe('WhatsAppBotService', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    mockMetaSendMessage.mockResolvedValue('wa-msg-1');
    mockMetaSendTemplate.mockResolvedValue('wa-template-1');
  });

  afterEach(() => {
    // Restore env after every test
    process.env = { ...ORIGINAL_ENV };
  });

  // ─── Constructor — dev mode (no credentials) ─────────────────────
  describe('Constructor — development', () => {
    beforeEach(() => {
      delete process.env.WHATSAPP_BOT_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      process.env.NODE_ENV = 'development';
    });

    it('does NOT throw when credentials are missing in dev', async () => {
      const service = await importFresh();
      expect(service).toBeDefined();
    });
  });

  // ─── Constructor — production mode (no credentials) ───────────────
  describe('Constructor — production', () => {
    it('does NOT throw when credentials are missing in production by default', async () => {
      delete process.env.WHATSAPP_BOT_TOKEN;
      delete process.env.WHATSAPP_ACCESS_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      process.env.NODE_ENV = 'production';
      delete process.env.WHATSAPP_STRICT_REQUIRED;

      const service = await importFresh();
      expect(service).toBeDefined();
      expect(service.getStats()).toMatchObject({
        configured: false,
        clientReady: false,
      });
    });

    it('throws when strict runtime enforcement is enabled', async () => {
      delete process.env.WHATSAPP_BOT_TOKEN;
      delete process.env.WHATSAPP_ACCESS_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      process.env.NODE_ENV = 'production';
      process.env.WHATSAPP_STRICT_REQUIRED = 'true';

      await expect(importFresh()).rejects.toThrow('CRITICAL');
    });
  });

  // ─── Constructor — with credentials ───────────────────────────────
  describe('Constructor — with credentials', () => {
    beforeEach(() => {
      process.env.WHATSAPP_BOT_TOKEN = 'test-token-123';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'phone-123';
      process.env.NODE_ENV = 'development';
    });

    it('creates service when token and phoneNumberId are set', async () => {
      const service = await importFresh();
      expect(service).toBeDefined();
    });

    it('exposes initial stats and client metadata', async () => {
      const service = await importFresh();
      expect(service.getStats()).toMatchObject({
        configured: true,
        clientReady: true,
        totalSendRequests: 0,
        successfulSends: 0,
        failedSends: 0,
        client: {
          phoneNumberId: 'phone-123',
        },
      });
    });
  });

  // ─── initialize ───────────────────────────────────────────────────
  describe('initialize', () => {
    it('throws when credentials are missing', async () => {
      delete process.env.WHATSAPP_BOT_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(service.initialize()).rejects.toThrow('credentials not configured');
    });

    it('resolves when credentials are present', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(service.initialize()).resolves.toBeUndefined();
    });
  });

  // ─── sendMessage ──────────────────────────────────────────────────
  describe('sendMessage', () => {
    it('returns undefined and tracks skipped sends when credentials are missing', async () => {
      delete process.env.WHATSAPP_BOT_TOKEN;
      delete process.env.WHATSAPP_ACCESS_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', 'Hello')).resolves.toBeUndefined();
      expect(mockMetaSendMessage).not.toHaveBeenCalled();
      expect(service.getStats()).toMatchObject({
        configured: false,
        clientReady: false,
        totalSendRequests: 1,
        messageSendRequests: 1,
        skippedNoCredentials: 1,
        successfulSends: 0,
        failedSends: 0,
      });
    });

    it('resolves without error', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', 'Hello')).resolves.toBe('wa-msg-1');
    });

    it('retries transient failures and eventually succeeds', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      mockMetaSendMessage
        .mockRejectedValueOnce(new Error('network timeout'))
        .mockRejectedValueOnce(new Error('429 rate limit'))
        .mockResolvedValueOnce('wa-msg-recovered');

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', 'Hello')).resolves.toBe('wa-msg-recovered');
      expect(mockMetaSendMessage).toHaveBeenCalledTimes(3);
      expect(service.getStats()).toMatchObject({
        totalSendRequests: 1,
        messageSendRequests: 1,
        successfulSends: 1,
        failedSends: 0,
        retryableFailureEvents: 2,
        retriesScheduled: 2,
      });
    });

    it('throws after max retries when transient failures persist', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      mockMetaSendMessage.mockRejectedValue(new Error('network down'));

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', 'Hello')).rejects.toThrow(/network down/i);
      expect(mockMetaSendMessage).toHaveBeenCalledTimes(3);
    });

    it('does not retry non-retryable 400 style errors', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      mockMetaSendMessage.mockRejectedValue(new Error('Meta API Error [400]: invalid recipient'));

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', 'Hello')).rejects.toThrow(/400/i);
      expect(mockMetaSendMessage).toHaveBeenCalledTimes(1);
      expect(service.getStats()).toMatchObject({
        failedSends: 1,
        nonRetryableFailureEvents: 1,
        retriesScheduled: 0,
        lastFailureMessage: 'Meta API Error [400]: invalid recipient',
      });
    });

    it('honors WHATSAPP_MAX_SEND_RETRIES override', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.WHATSAPP_MAX_SEND_RETRIES = '1';
      process.env.NODE_ENV = 'test';

      mockMetaSendMessage.mockRejectedValue(new Error('network timeout'));

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', 'Hello')).rejects.toThrow(
        /network timeout/i
      );
      expect(mockMetaSendMessage).toHaveBeenCalledTimes(1);
    });

    it('rejects empty phone number early', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      const service = await importFresh();
      await expect(service.sendMessage('', 'Hello')).rejects.toThrow(/phoneNumber is required/i);
      expect(mockMetaSendMessage).not.toHaveBeenCalled();
      expect(service.getStats()).toMatchObject({
        totalSendRequests: 1,
        failedSends: 1,
        validationFailures: 1,
        lastFailureMessage: 'phoneNumber is required',
      });
    });

    it('rejects empty message body early', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', '   ')).rejects.toThrow(
        /message body is required/i
      );
      expect(mockMetaSendMessage).not.toHaveBeenCalled();
      expect(service.getStats()).toMatchObject({
        totalSendRequests: 1,
        failedSends: 1,
        validationFailures: 1,
        lastFailureMessage: 'message body is required',
      });
    });
  });

  // ─── handleIncomingMessage ────────────────────────────────────────
  describe('handleIncomingMessage', () => {
    it('handles a valid incoming message payload', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(
        service.handleIncomingMessage({
          from: '+971501234567',
          body: 'Test message',
          timestamp: Date.now(),
        })
      ).resolves.toBeUndefined();
    });

    it('handles an empty payload gracefully', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(service.handleIncomingMessage({})).resolves.toBeUndefined();
    });
  });

  // ─── processMessage ───────────────────────────────────────────────
  describe('processMessage', () => {
    it('processes a message without error', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(
        service.processMessage('I am interested in a 2BR in Downtown', '+971501234567')
      ).resolves.toBeUndefined();
    });
  });

  // ─── sendTemplateMessage ──────────────────────────────────────────
  describe('sendTemplateMessage', () => {
    it('returns undefined and tracks skipped template sends when credentials are missing', async () => {
      delete process.env.WHATSAPP_BOT_TOKEN;
      delete process.env.WHATSAPP_ACCESS_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(
        service.sendTemplateMessage('+971501234567', 'welcome_template')
      ).resolves.toBeUndefined();
      expect(mockMetaSendTemplate).not.toHaveBeenCalled();
      expect(service.getStats()).toMatchObject({
        configured: false,
        clientReady: false,
        totalSendRequests: 1,
        templateSendRequests: 1,
        skippedNoCredentials: 1,
        successfulSends: 0,
        failedSends: 0,
      });
    });

    it('sends template without parameters', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(service.sendTemplateMessage('+971501234567', 'welcome_template')).resolves.toBe(
        'wa-template-1'
      );
    });

    it('sends template with parameters', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(
        service.sendTemplateMessage('+971501234567', 'listing_update', [
          { type: 'text', text: 'Palm Jumeirah 3BR' },
        ])
      ).resolves.toBe('wa-template-1');
    });

    it('retries template sends and recovers on subsequent attempt', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      mockMetaSendTemplate
        .mockRejectedValueOnce(new Error('503 upstream unavailable'))
        .mockResolvedValueOnce('wa-template-recovered');

      const service = await importFresh();
      await expect(
        service.sendTemplateMessage('+971501234567', 'listing_update', [
          { type: 'text', text: 'Palm Jumeirah 3BR' },
        ])
      ).resolves.toBe('wa-template-recovered');

      expect(mockMetaSendTemplate).toHaveBeenCalledTimes(2);
    });

    it('does not retry non-retryable template errors', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      mockMetaSendTemplate.mockRejectedValue(new Error('Meta API Error [403]: forbidden template'));

      const service = await importFresh();
      await expect(
        service.sendTemplateMessage('+971501234567', 'rent_due_notice', [
          { type: 'text', text: 'AED 5000' },
        ])
      ).rejects.toThrow(/403/i);
      expect(mockMetaSendTemplate).toHaveBeenCalledTimes(1);
      expect(service.getStats()).toMatchObject({
        totalSendRequests: 1,
        templateSendRequests: 1,
        failedSends: 1,
        nonRetryableFailureEvents: 1,
        lastFailureMessage: 'Meta API Error [403]: forbidden template',
      });
    });

    it('rejects empty phone number for template message', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      const service = await importFresh();
      await expect(service.sendTemplateMessage('   ', 'rent_due_notice')).rejects.toThrow(
        /phoneNumber is required/i
      );
      expect(mockMetaSendTemplate).not.toHaveBeenCalled();
      expect(service.getStats()).toMatchObject({
        totalSendRequests: 1,
        templateSendRequests: 1,
        failedSends: 1,
        validationFailures: 1,
        lastFailureMessage: 'phoneNumber is required',
      });
    });

    it('rejects empty template name early', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'test';

      const service = await importFresh();
      await expect(service.sendTemplateMessage('+971501234567', '   ')).rejects.toThrow(
        /templateName is required/i
      );
      expect(mockMetaSendTemplate).not.toHaveBeenCalled();
    });
  });
});
