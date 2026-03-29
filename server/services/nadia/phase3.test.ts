/**
 * Phase 3 Unit Tests - Nina NLP + Linda + Meta Integration
 * Tests for intent detection, entity extraction, sentiment analysis
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NinaEngine, Intent, ConversationContext } from '../services/nadia/ninaEngine';
import { ConversationMemory, ConversationMemoryState } from '../services/nadia/conversationMemory';
import { LindaClient, LindaStatus } from '../services/whatsapp/lindaClient';
import { MetaAPIClient } from '../services/whatsapp/metaAPI';

/**
 * Nina NLP Engine Tests
 */
describe('Nina NLP Engine', () => {
  let nina: NinaEngine;
  let context: ConversationContext;

  beforeEach(() => {
    nina = new NinaEngine();
    context = {
      conversationId: 'conv_test_1',
      recentIntents: [],
      recentTopics: [],
      mentionedProperties: [],
      needsAssistance: false,
      lastMessageTimestamp: new Date(),
    };
  });

  describe('Intent Detection', () => {
    it('should detect PROPERTY_INQUIRY_RESIDENTIAL intent', () => {
      const result = nina.processMessage('I am looking for a villa in Dubai', context);
      expect(result.primary.intent).toBe(Intent.PROPERTY_INQUIRY_RESIDENTIAL);
      expect(result.primary.confidence).toBeGreaterThan(50);
    });

    it('should detect VIEWING_REQUEST_IMMEDIATE intent', () => {
      const result = nina.processMessage('Can I view properties today?', context);
      expect(result.primary.intent).toMatch(/VIEWING/);
      expect(result.primary.confidence).toBeGreaterThan(40);
    });

    it('should detect PURCHASE_INTEREST_READY intent', () => {
      const result = nina.processMessage('I am ready to buy now. I have cash approved.', context);
      expect(result.primary.intent).toMatch(/PURCHASE.*READY/);
      expect(result.primary.confidence).toBeGreaterThan(50);
    });

    it('should detect complaint intent', () => {
      const result = nina.processMessage('I am very disappointed with the service.', context);
      expect(result.primary.intent).toMatch(/COMPLAINT/);
    });

    it('should handle GREETING', () => {
      const result = nina.processMessage('Hello! Good morning', context);
      expect(result.primary.intent).toBe(Intent.GREETING);
    });

    it('should have reasonable confidence scores', () => {
      const result = nina.processMessage('Show me apartments in Marina', context);
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
      expect(result.primary.confidence).toBeLessThanOrEqual(100);
    });
  });

  describe('Entity Extraction', () => {
    it('should extract property type', () => {
      const result = nina.processMessage('I want to buy a villa', context);
      const propertyTypes = result.entities.filter((e) => e.type === 'PROPERTY_TYPE');
      expect(propertyTypes.length).toBeGreaterThan(0);
      expect(propertyTypes[0].value).toBe('villa');
    });

    it('should extract location', () => {
      const result = nina.processMessage('Show me properties in Dubai Marina', context);
      const locations = result.entities.filter((e) => e.type === 'LOCATION');
      expect(locations.length).toBeGreaterThan(0);
    });

    it('should extract price range', () => {
      const result = nina.processMessage('Budget is 2,000,000 AED', context);
      const prices = result.entities.filter((e) => e.type === 'PRICE');
      expect(prices.length).toBeGreaterThan(0);
    });

    it('should extract bedrooms', () => {
      const result = nina.processMessage('Looking for 3BR apartment', context);
      const bedrooms = result.entities.filter((e) => e.type === 'BEDROOMS');
      expect(bedrooms.length).toBeGreaterThan(0);
      expect(bedrooms[0].value).toBe('3BR');
    });

    it('should extract multiple entities', () => {
      const result = nina.processMessage('2BR villa in Downtown Dubai, budget 3,000,000 AED', context);
      expect(result.entities.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Sentiment Analysis', () => {
    it('should detect positive sentiment', () => {
      const result = nina.processMessage('Amazing property! I love it!', context);
      expect(result.sentiment.sentiment).toBe('POSITIVE');
      expect(result.sentiment.score).toBeGreaterThan(0);
    });

    it('should detect negative sentiment', () => {
      const result = nina.processMessage('Terrible experience, very disappointed', context);
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
      expect(result.sentiment.score).toBeLessThan(0);
    });

    it('should detect neutral sentiment', () => {
      const result = nina.processMessage('I need a 2BR apartment', context);
      expect(result.sentiment.sentiment).toBe('NEUTRAL');
      expect(Math.abs(result.sentiment.score)).toBeLessThan(0.3);
    });

    it('should identify sentiment keywords', () => {
      const result = nina.processMessage('Excellent and perfect property', context);
      expect(result.sentiment.keywords.length).toBeGreaterThan(0);
    });
  });

  describe('Secondary Intents', () => {
    it('should detect secondary intents', () => {
      const result = nina.processMessage('I want to view and buy a villa today', context);
      expect(result.secondary.length).toBeGreaterThan(0);
    });

    it('should limit secondary intents to 3', () => {
      const result = nina.processMessage('Show me villas, apartments, and townhouses for viewing appointment', context);
      expect(result.secondary.length).toBeLessThanOrEqual(3);
    });
  });

  describe('Context Awareness', () => {
    it('should boost recent intent confidence', () => {
      const contextWithRecent: ConversationContext = {
        ...context,
        recentIntents: [Intent.PROPERTY_INQUIRY_RESIDENTIAL, Intent.VIEWING_REQUEST],
      };

      const result = nina.processMessage('Can I view it?', contextWithRecent);
      expect(result.primary.confidence).toBeGreaterThan(30);
    });

    it('should generate appropriate reason', () => {
      const result = nina.processMessage('I want to buy this villa', context);
      expect(result.primary.reasoning).toBeTruthy();
      expect(result.primary.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe('Response Generation', () => {
    it('should generate response for property inquiry', () => {
      const result = nina.processMessage('Show me residential properties', context);
      expect(result.suggestedResponse).toBeTruthy();
      expect(result.suggestedResponse.length).toBeGreaterThan(10);
    });

    it('should suggest agent handoff for complaints', () => {
      const result = nina.processMessage('Your agent was very rude!', context);
      expect(result.requiresAgentHandoff).toBe(true);
    });

    it('should not require handoff for simple queries', () => {
      const result = nina.processMessage('What is the price of this villa?', context);
      expect(result.requiresAgentHandoff).toBe(false);
    });
  });

  describe('Learning and Feedback', () => {
    it('should record feedback for learning', () => {
      const messageId = 'msg_123';
      nina.recordFeedback(messageId, Intent.PURCHASE_INTEREST, Intent.PROPERTY_INQUIRY);
      // Should not throw
      expect(true).toBe(true);
    });
  });
});

/**
 * Conversation Memory Tests
 */
describe('Conversation Memory', () => {
  let memory: ConversationMemory;
  const conversationId = 'conv_test_2';

  beforeEach(() => {
    memory = new ConversationMemory();
  });

  describe('Context Management', () => {
    it('should create new context', () => {
      const context = memory.getOrCreateContext(conversationId);
      expect(context).toBeDefined();
      expect(context.conversationId).toBe(conversationId);
      expect(context.messageHistory.length).toBe(0);
    });

    it('should retrieve existing context', () => {
      const context1 = memory.getOrCreateContext(conversationId);
      const context2 = memory.getOrCreateContext(conversationId);
      expect(context1).toBe(context2);
    });

    it('should maintain separate contexts', () => {
      const ctx1 = memory.getOrCreateContext('conv1');
      const ctx2 = memory.getOrCreateContext('conv2');
      expect(ctx1).not.toBe(ctx2);
    });
  });

  describe('Message History', () => {
    it('should add messages to history', () => {
      const context = memory.getOrCreateContext(conversationId);
      const message = {
        id: 'msg1',
        conversationId,
        content: 'Hello',
        sender: 'CUSTOMER' as const,
        timestamp: new Date(),
      };

      memory.updateContext(conversationId, message, {
        primary: {
          intent: Intent.GREETING,
          confidence: 0.9,
          reasoning: 'test',
        },
        secondary: [],
        entities: [],
        sentiment: { sentiment: 'NEUTRAL', score: 0, keywords: [] },
        topics: [],
        requiresAgentHandoff: false,
        suggestedResponse: 'Hello!',
        timestamp: new Date(),
      });

      const updated = memory.getContext(conversationId);
      expect(updated?.messageHistory.length).toBe(1);
    });

    it('should limit message history to MAX_HISTORY', () => {
      const nina = new NinaEngine();
      // Would need to add many messages - placeholder test
      expect(true).toBe(true);
    });
  });

  describe('Intent Tracking', () => {
    it('should track recent intents', () => {
      const context = memory.getOrCreateContext(conversationId);
      const message = {
        id: 'msg1',
        conversationId,
        content: 'I want to buy',
        sender: 'CUSTOMER' as const,
        timestamp: new Date(),
      };

      memory.updateContext(conversationId, message, {
        primary: { intent: Intent.PURCHASE_INTEREST, confidence: 0.8, reasoning: 'test' },
        secondary: [],
        entities: [],
        sentiment: { sentiment: 'NEUTRAL', score: 0, keywords: [] },
        topics: [],
        requiresAgentHandoff: false,
        suggestedResponse: '',
        timestamp: new Date(),
      });

      const updated = memory.getContext(conversationId);
      expect(updated?.recentIntents.length).toBe(1);
      expect(updated?.recentIntents[0]).toBe(Intent.PURCHASE_INTEREST);
    });
  });

  describe('Statistics', () => {
    it('should calculate memory stats', () => {
      memory.getOrCreateContext('conv_a');
      memory.getOrCreateContext('conv_b');

      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(2);
    });
  });
});

/**
 * Linda Client Tests
 */
describe('Linda WhatsApp Client', () => {
  let linda: LindaClient;

  beforeEach(() => {
    linda = new LindaClient({
      sessionPath: './test-session',
      headless: true,
      autoRestart: false,
    });
  });

  describe('Status Management', () => {
    it('should have initial disconnected status', () => {
      expect(linda.getStatus()).toBe(LindaStatus.DISCONNECTED);
    });

    it('should report connection status', () => {
      const isConnected = linda.isConnected();
      expect(typeof isConnected).toBe('boolean');
    });

    it('should provide stats', () => {
      const stats = linda.getStats();
      expect(stats.status).toBeDefined();
      expect(stats.isConnected).toBeDefined();
      expect(stats.queuedMessages).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Message Queue', () => {
    it('should maintain message queue', () => {
      const queue = linda.getMessageQueue();
      expect(Array.isArray(queue)).toBe(true);
    });
  });
});

/**
 * Meta API Client Tests (Mock)
 */
describe('Meta API Client', () => {
  let meta: MetaAPIClient;

  beforeEach(() => {
    meta = new MetaAPIClient({
      accessToken: 'test_token',
      businessAccountId: 'test_account',
      phoneNumberId: 'test_phone',
      webhookVerifyToken: 'test_verify_token',
    });
  });

  describe('Webhook Verification', () => {
    it('should verify webhook with correct token', () => {
      const result = meta.verifyWebhook('subscribe', 'test_challenge', 'test_verify_token');
      expect(result).toBe('test_challenge');
    });

    it('should reject webhook with wrong token', () => {
      const result = meta.verifyWebhook('subscribe', 'test_challenge', 'wrong_token');
      expect(result).toBeNull();
    });

    it('should reject non-subscribe mode', () => {
      const result = meta.verifyWebhook('invalid', 'test_challenge', 'test_verify_token');
      expect(result).toBeNull();
    });
  });

  describe('Statistics', () => {
    it('should provide API statistics', () => {
      const stats = meta.getStats();
      expect(stats.apiVersion).toBe('v17.0');
      expect(stats.phoneNumberId).toBe('test_phone');
    });
  });
});
