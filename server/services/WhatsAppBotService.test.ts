/**
 * WhatsApp Bot Service — Tests
 * Tests constructor env-validation, initialise, and message methods.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock logger before importing service
vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
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
    it('throws when credentials are missing in production', async () => {
      delete process.env.WHATSAPP_BOT_TOKEN;
      delete process.env.WHATSAPP_PHONE_NUMBER_ID;
      process.env.NODE_ENV = 'production';

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
    it('resolves without error', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(service.sendMessage('+971501234567', 'Hello')).resolves.toBeUndefined();
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
    it('sends template without parameters', async () => {
      process.env.WHATSAPP_BOT_TOKEN = 'tok';
      process.env.WHATSAPP_PHONE_NUMBER_ID = 'pid';
      process.env.NODE_ENV = 'development';

      const service = await importFresh();
      await expect(
        service.sendTemplateMessage('+971501234567', 'welcome_template')
      ).resolves.toBeUndefined();
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
      ).resolves.toBeUndefined();
    });
  });
});
