/**
 * MetaAPIClient Unit Tests
 * Tests: constructor validation, verifyWebhook, parseWebhookEvent,
 * getStats, createMetaAPIClient factory, error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios before importing the module
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
    })),
    isAxiosError: vi.fn(),
  };
  return { default: mockAxios };
});

import { MetaAPIClient, createMetaAPIClient, MetaAPIConfig } from './metaAPI';

// ============================================================================
// HELPERS
// ============================================================================

const validConfig: MetaAPIConfig = {
  accessToken: 'test-token-123',
  businessAccountId: 'biz-account-456',
  phoneNumberId: 'phone-789',
  webhookVerifyToken: 'verify-secret',
  apiVersion: 'v17.0',
  timeout: 30000,
};

// ============================================================================
// TESTS
// ============================================================================

describe('MetaAPIClient', () => {
  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------
  describe('constructor', () => {
    it('creates client with valid config', () => {
      const client = new MetaAPIClient(validConfig);
      expect(client).toBeInstanceOf(MetaAPIClient);
    });

    it('throws when accessToken is missing', () => {
      expect(() => new MetaAPIClient({
        ...validConfig,
        accessToken: '',
      })).toThrow('Meta API config incomplete');
    });

    it('throws when businessAccountId is missing', () => {
      expect(() => new MetaAPIClient({
        ...validConfig,
        businessAccountId: '',
      })).toThrow('Meta API config incomplete');
    });

    it('throws when phoneNumberId is missing', () => {
      expect(() => new MetaAPIClient({
        ...validConfig,
        phoneNumberId: '',
      })).toThrow('Meta API config incomplete');
    });

    it('uses default apiVersion if not specified', () => {
      const { apiVersion, ...configWithoutVersion } = validConfig;
      const client = new MetaAPIClient(configWithoutVersion as MetaAPIConfig);
      const stats = client.getStats();
      expect(stats.apiVersion).toBe('v17.0');
    });
  });

  // --------------------------------------------------------------------------
  // verifyWebhook
  // --------------------------------------------------------------------------
  describe('verifyWebhook', () => {
    let client: MetaAPIClient;

    beforeEach(() => {
      client = new MetaAPIClient(validConfig);
    });

    it('returns challenge on valid verification', () => {
      const result = client.verifyWebhook('subscribe', 'challenge-token-abc', 'verify-secret');
      expect(result).toBe('challenge-token-abc');
    });

    it('returns null on wrong mode', () => {
      const result = client.verifyWebhook('unsubscribe', 'challenge-token', 'verify-secret');
      expect(result).toBeNull();
    });

    it('returns null on wrong verify token', () => {
      const result = client.verifyWebhook('subscribe', 'challenge-token', 'wrong-token');
      expect(result).toBeNull();
    });

    it('returns null when both mode and token are wrong', () => {
      const result = client.verifyWebhook('bad', 'challenge', 'bad');
      expect(result).toBeNull();
    });

    it('returns challenge string as-is (preserves value)', () => {
      const longChallenge = 'a'.repeat(200);
      const result = client.verifyWebhook('subscribe', longChallenge, 'verify-secret');
      expect(result).toBe(longChallenge);
    });
  });

  // --------------------------------------------------------------------------
  // parseWebhookEvent
  // --------------------------------------------------------------------------
  describe('parseWebhookEvent', () => {
    let client: MetaAPIClient;

    beforeEach(() => {
      client = new MetaAPIClient(validConfig);
    });

    it('returns the body as WebhookEvent (pass-through)', () => {
      const body = {
        entry: [{
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '+971501234567',
                phone_number_id: 'phone-789',
              },
              messages: [{
                from: '971501234567',
                id: 'wamid.test123',
                timestamp: '1700000000',
                type: 'text',
                text: { body: 'Hello, looking for a villa' },
              }],
            },
          }],
        }],
      };

      const event = client.parseWebhookEvent(body);
      expect(event.entry).toHaveLength(1);
      expect(event.entry[0].changes[0].value.messages![0].text!.body).toBe('Hello, looking for a villa');
    });

    it('handles status updates', () => {
      const body = {
        entry: [{
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '+971501234567',
                phone_number_id: 'phone-789',
              },
              statuses: [{
                id: 'wamid.status123',
                status: 'delivered',
                timestamp: '1700000001',
                recipient_id: '971501234567',
              }],
            },
          }],
        }],
      };

      const event = client.parseWebhookEvent(body);
      expect(event.entry[0].changes[0].value.statuses![0].status).toBe('delivered');
    });
  });

  // --------------------------------------------------------------------------
  // getStats
  // --------------------------------------------------------------------------
  describe('getStats', () => {
    it('returns config values', () => {
      const client = new MetaAPIClient(validConfig);
      const stats = client.getStats();

      expect(stats.apiVersion).toBe('v17.0');
      expect(stats.businessAccountId).toBe('biz-account-456');
      expect(stats.phoneNumberId).toBe('phone-789');
    });

    it('reflects custom apiVersion', () => {
      const client = new MetaAPIClient({ ...validConfig, apiVersion: 'v18.0' });
      expect(client.getStats().apiVersion).toBe('v18.0');
    });
  });

  // --------------------------------------------------------------------------
  // createMetaAPIClient factory
  // --------------------------------------------------------------------------
  describe('createMetaAPIClient', () => {
    it('returns MetaAPIClient instance', () => {
      const client = createMetaAPIClient(validConfig);
      expect(client).toBeInstanceOf(MetaAPIClient);
    });

    it('throws on invalid config (delegates to constructor)', () => {
      expect(() => createMetaAPIClient({
        accessToken: '',
        businessAccountId: '',
        phoneNumberId: '',
      })).toThrow('Meta API config incomplete');
    });
  });
});
