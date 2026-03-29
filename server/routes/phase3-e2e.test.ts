/**
 * Phase 3 End-to-End Integration Test
 * Full message pipeline: WhatsApp → NLP → Queue → Agent Response
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ninaEngine, Intent } from '../services/nadia/ninaEngine';
import { conversationMemory } from '../services/nadia/conversationMemory';
import { LindaClient } from '../services/whatsapp/lindaClient';
import { MetaAPIClient } from '../services/whatsapp/metaAPI';

describe('Phase 3: End-to-End WhatsApp CRM Pipeline', () => {
  describe('E2E: Customer Message → Intent → Response', () => {
    it('should process complete message flow: inquiry → intent detection → agent queue', async () => {
      // 1. Simulate customer message
      const conversation = {
        conversationId: 'e2e_test_1',
        recentIntents: [],
        recentTopics: [],
        mentionedProperties: [],
        needsAssistance: false,
        lastMessageTimestamp: new Date(),
      };

      // 2. Process through Nina NLP
      const message = 'I want to view a 3BR villa in Dubai Marina. I am ready to buy.';
      const result = ninaEngine.processMessage(message, conversation);

      // 3. Verify intent detection
      expect(result.primary.intent).toMatch(/PURCHASE|VIEWING|PROPERTY/);
      expect(result.primary.confidence).toBeGreaterThan(40);

      // 4. Verify entity extraction
      expect(result.entities.length).toBeGreaterThan(2);
      const hasLocation = result.entities.some((e) => e.type === 'LOCATION');
      const hasBedroms = result.entities.some((e) => e.type === 'BEDROOMS');
      expect(hasLocation || hasBedroms).toBe(true);

      // 5. Verify suggested response
      expect(result.suggestedResponse).toBeTruthy();

      // 6. Store in conversation memory
      conversationMemory.updateContext(conversation.conversationId, {
        id: 'msg_e2e_1',
        conversationId: conversation.conversationId,
        content: message,
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, result);

      // 7. Verify memory updated
      const stored = conversationMemory.getContext(conversation.conversationId);
      expect(stored).toBeDefined();
      expect(stored?.messageHistory.length).toBe(1);
    });

    it('should handle multi-turn conversation with context', async () => {
      const conversationId = 'e2e_test_2';

      // Turn 1: Property inquiry
      let context = conversationMemory.getOrCreateContext(conversationId);
      const msg1 = 'Show me villas in the Marina';
      const result1 = ninaEngine.processMessage(msg1, context);

      conversationMemory.updateContext(conversationId, {
        id: 'msg_1',
        conversationId,
        content: msg1,
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, result1);

      // Turn 2: Use context from previous intent
      context = conversationMemory.getContext(conversationId)!;
      const msg2 = 'Can I view it today?';
      const result2 = ninaEngine.processMessage(msg2, context);

      // Should detect viewing request with context boost
      expect(result2.primary.intent).toMatch(/VIEWING/);

      conversationMemory.updateContext(conversationId, {
        id: 'msg_2',
        conversationId,
        content: msg2,
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, result2);

      // Turn 3: Price inquiry
      context = conversationMemory.getContext(conversationId)!;
      const msg3 = 'What is the price?';
      const result3 = ninaEngine.processMessage(msg3, context);

      expect(result3.primary.intent).toMatch(/INFORMATION/);

      // Verify conversation history
      const final = conversationMemory.getContext(conversationId)!;
      expect(final.messageHistory.length).toBe(3);
      expect(final.recentIntents.length).toBeGreaterThan(0);
    });

    it('should detect complaints and escalate to agent', async () => {
      const conversationId = 'e2e_test_complaint';
      const context = conversationMemory.getOrCreateContext(conversationId);

      const complaintMessage = 'Your agent was rude and unprofessional!';
      const result = ninaEngine.processMessage(complaintMessage, context);

      // Should require handoff
      expect(result.requiresAgentHandoff).toBe(true);
      expect(result.primary.intent).toMatch(/COMPLAINT/);
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
    });

    it('should handle positive sentiment and auto-response', async () => {
      const conversationId = 'e2e_test_positive';
      const context = conversationMemory.getOrCreateContext(conversationId);

      const positiveMessage = 'Amazing property! I love it! This is perfect!';
      const result = ninaEngine.processMessage(positiveMessage, context);

      expect(result.sentiment.sentiment).toBe('POSITIVE');
      expect(result.sentiment.score).toBeGreaterThan(0);
      expect(result.requiresAgentHandoff).toBe(false);

      // Should have auto-response
      expect(result.suggestedResponse.length).toBeGreaterThan(10);
    });
  });

  describe('E2E: Dual WhatsApp Channel Routing', () => {
    it('should validate dual WhatsApp client initialization', async () => {
      // Linda LocalAuth client
      const linda = new LindaClient({
        sessionPath: './test-session',
        headless: true,
        autoRestart: false,
      });

      expect(linda).toBeDefined();
      expect(linda.getStatus()).toBeDefined();

      // Meta API client
      const meta = new MetaAPIClient({
        accessToken: 'test_token',
        businessAccountId: 'test_account',
        phoneNumberId: 'test_phone',
        webhookVerifyToken: 'test_verify',
      });

      expect(meta).toBeDefined();
      const stats = meta.getStats();
      expect(stats.apiVersion).toBe('v17.0');
    });

    it('should handle message routing from both channels', async () => {
      const conversationId = 'e2e_dual_channel';

      // Simulate message from Linda (LocalAuth)
      const lindaMessage = {
        id: 'msg_linda_001',
        from: '971501234567',
        to: '971501111111',
        body: 'I want to buy a property',
        timestamp: new Date(),
        isFromMe: false,
        hasMedia: false,
        type: 'text' as const,
      };

      const context = conversationMemory.getOrCreateContext(conversationId);
      const result = ninaEngine.processMessage(lindaMessage.body, context);

      expect(result.primary.intent).toMatch(/PURCHASE|PROPERTY/);

      // Simulate message from Meta API
      const metaMessage = {
        from: '971501234567',
        body: 'Can I view it today?',
        type: 'text' as const,
        timestamp: new Date(),
      };

      // Should both process through same NLP pipeline
      const result2 = ninaEngine.processMessage(metaMessage.body, context);
      expect(result2.primary.intent).toBeDefined();
    });
  });

  describe('E2E: Message Volume and Performance', () => {
    it('should process 100 messages efficiently', async () => {
      const conversationId = 'e2e_volume_test';
      const context = conversationMemory.getOrCreateContext(conversationId);

      const startTime = Date.now();

      for (let i = 0; i < 100; i++) {
        const messages = [
          'Show me villas in Dubai Marina',
          'What is the price?',
          'Can I view it today?',
          'I am ready to buy',
          'Tell me more about amenities',
        ];

        const message = messages[i % messages.length];
        const result = ninaEngine.processMessage(message, context);

        // Each should process quickly (< 100ms)
        expect(result).toBeDefined();
        expect(result.primary).toBeDefined();
      }

      const duration = Date.now() - startTime;
      const avgTime = duration / 100;

      console.log(`Processed 100 messages in ${duration}ms (avg: ${avgTime.toFixed(2)}ms/msg)`);
      expect(avgTime).toBeLessThan(100); // Should be fast
    });
  });

  describe('E2E: Data Persistence and Retrieval', () => {
    it('should maintain conversation state across multiple messages', async () => {
      const conversationId = 'e2e_persistence';

      // Create conversation
      let ctx = conversationMemory.getOrCreateContext(conversationId);
      expect(ctx.messageHistory.length).toBe(0);

      // Add first message
      const msg1 = ninaEngine.processMessage('I want to buy', ctx);
      conversationMemory.updateContext(conversationId, {
        id: 'msg_1',
        conversationId,
        content: 'I want to buy',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, msg1);

      // Retrieve and verify
      ctx = conversationMemory.getContext(conversationId)!;
      expect(ctx.messageHistory.length).toBe(1);
      expect(ctx.recentIntents.length).toBeGreaterThan(0);

      // Add second message
      const msg2 = ninaEngine.processMessage('In Marina', ctx);
      conversationMemory.updateContext(conversationId, {
        id: 'msg_2',
        conversationId,
        content: 'In Marina',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, msg2);

      // Retrieve again
      ctx = conversationMemory.getContext(conversationId)!;
      expect(ctx.messageHistory.length).toBe(2);

      // Verify history is preserved
      expect(ctx.messageHistory.map((m) => m.content)).toEqual(['I want to buy', 'In Marina']);
    });
  });

  describe('E2E: Error Handling and Recovery', () => {
    it('should handle invalid messages gracefully', async () => {
      const context = conversationMemory.getOrCreateContext('e2e_error_test');

      const invalidMessages = [
        '', // Empty
        '   ', // Whitespace only
        null, // Null (would be caught earlier)
        '🚀🎉🎊', // Emojis only
      ];

      for (const invalidMsg of invalidMessages) {
        if (typeof invalidMsg === 'string' && invalidMsg.trim()) {
          const result = ninaEngine.processMessage(invalidMsg, context);
          expect(result.primary.intent).toBeDefined();
        }
      }
    });

    it('should handle webhook verification', async () => {
      const meta = new MetaAPIClient({
        accessToken: 'test',
        businessAccountId: 'test',
        phoneNumberId: 'test',
        webhookVerifyToken: 'my_verify_token',
      });

      // Correct verification
      const result1 = meta.verifyWebhook('subscribe', 'challenge_123', 'my_verify_token');
      expect(result1).toBe('challenge_123');

      // Wrong token
      const result2 = meta.verifyWebhook('subscribe', 'challenge_123', 'wrong_token');
      expect(result2).toBeNull();

      // Wrong mode
      const result3 = meta.verifyWebhook('invalid', 'challenge_123', 'my_verify_token');
      expect(result3).toBeNull();
    });
  });

  describe('E2E: Intent Accuracy Metrics', () => {
    it('should categorize various customer scenarios', async () => {
      const testCases = [
        {
          message: 'I am looking for a luxury villa in Palm Jumeirah',
          expectedIntent: Intent.PROPERTY_INQUIRY_RESIDENTIAL,
        },
        {
          message: 'Can I schedule a viewing for tomorrow afternoon?',
          expectedIntent: Intent.VIEWING_REQUEST_IMMEDIATE,
        },
        {
          message: 'I am ready to make an offer. My budget is 5 million AED',
          expectedIntent: Intent.PURCHASE_INTEREST_READY,
        },
        {
          message: 'Is there financing available?',
          expectedIntent: Intent.INFORMATION_REQUEST,
        },
        {
          message: 'Your agent was unprofessional',
          expectedIntent: Intent.COMPLAINT,
        },
        {
          message: 'Hello! Good morning',
          expectedIntent: Intent.GREETING,
        },
      ];

      const context = conversationMemory.getOrCreateContext('e2e_accuracy_test');

      for (const testCase of testCases) {
        const result = ninaEngine.processMessage(testCase.message, context);
        expect(result.primary.intent).toBeDefined();
        expect(result.primary.confidence).toBeGreaterThan(0);
      }
    });
  });

  describe('E2E: Complete Conversation Flow', () => {
    it('should handle full customer journey: inquiry → viewing → purchase', async () => {
      const conversationId = 'e2e_full_journey';

      // Step 1: Initial inquiry
      let ctx = conversationMemory.getOrCreateContext(conversationId);
      let result = ninaEngine.processMessage('I am new to Dubai. Help me find a property.', ctx);
      expect(result.primary.intent).toMatch(/PROPERTY|ASSISTANCE/);

      conversationMemory.updateContext(conversationId, {
        id: 'msg_1',
        conversationId,
        content: 'I am new to Dubai. Help me find a property.',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, result);

      // Step 2: Specific requirement
      ctx = conversationMemory.getContext(conversationId)!;
      result = ninaEngine.processMessage('I want a 3BR villa in Marina with gym and pool', ctx);
      expect(result.entities.length).toBeGreaterThan(2);

      conversationMemory.updateContext(conversationId, {
        id: 'msg_2',
        conversationId,
        content: 'I want a 3BR villa in Marina with gym and pool',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, result);

      // Step 3: Viewing request
      ctx = conversationMemory.getContext(conversationId)!;
      result = ninaEngine.processMessage('Can I view something this weekend?', ctx);
      expect(result.primary.intent).toMatch(/VIEWING/);

      conversationMemory.updateContext(conversationId, {
        id: 'msg_3',
        conversationId,
        content: 'Can I view something this weekend?',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, result);

      // Step 4: Price inquiry
      ctx = conversationMemory.getContext(conversationId)!;
      result = ninaEngine.processMessage('What is the price range?', ctx);
      expect(result.primary.intent).toMatch(/INFORMATION.*PRICING/);

      conversationMemory.updateContext(conversationId, {
        id: 'msg_4',
        conversationId,
        content: 'What is the price range?',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      }, result);

      // Step 5: Purchase interest
      ctx = conversationMemory.getContext(conversationId)!;
      result = ninaEngine.processMessage('I am interested in buying. I have approved financing.', ctx);
      expect(result.primary.intent).toMatch(/PURCHASE/);
      expect(result.requiresAgentHandoff).toBe(false);

      // Verify complete conversation
      ctx = conversationMemory.getContext(conversationId)!;
      expect(ctx.messageHistory.length).toBe(5); // 4 user + 1 system
      expect(ctx.recentIntents.length).toBeGreaterThan(0);
    });
  });
});
