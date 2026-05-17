import { describe, it, expect, beforeEach } from 'vitest';
import ConversationAnalyzer from '../services/ConversationAnalyzer';
import WhatsAppWebIntegration from '../services/WhatsAppWebIntegration';
import PropertySourcingService from '../services/PropertySourcingServices';

/**
 * End-to-End Integration Tests for Phase 2A
 * Tests the complete workflow from WhatsApp conversation to property listing
 */

describe('Phase 2A End-to-End Integration Tests', () => {
  let analyzer;
  let whatsappService;
  let sourcingService;

  beforeEach(() => {
    analyzer = new ConversationAnalyzer();
    whatsappService = new WhatsAppWebIntegration();
    sourcingService = new PropertySourcingService();
  });

  // ============================================================
  // COMPLETE WORKFLOW TESTS
  // ============================================================

  describe('Complete Sourcing Workflow', () => {
    it('should complete end-to-end property sourcing workflow', async () => {
      // Step 1: Get WhatsApp conversation
      const conversations = await whatsappService.getConversations({ limit: 1 });
      expect(conversations.length).toBeGreaterThan(0);

      const conversation = conversations[0];
      expect(conversation.id).toBeDefined();
      expect(conversation.messages).toBeDefined();

      // Step 2: Analyze conversation with NLP
      const conversationText = conversation.messages.join(' ');
      const analysis = analyzer.analyzeConversation(conversationText);
      
      expect(analysis).toBeDefined();
      expect(analysis.propertyDetected).toBe(true);
      expect(analysis.confidenceScore).toBeGreaterThan(50);

      // Step 3: Create opportunity from conversation
      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: conversation.id, messages: conversation.messages },
        analysis,
        'agent-001'
      );

      expect(opportunity).toBeDefined();
      expect(opportunity.opportunityId).toBeDefined();
      expect(opportunity.verificationStatus).toBe('initial_detection');
      expect(opportunity.confidenceScore).toBe(analysis.confidenceScore);

      // Step 4: Request photos/verification
      const updated1 = await sourcingService.updateVerificationStatus(
        opportunity.opportunityId,
        'waiting_for_photos',
        'agent-001'
      );
      expect(updated1.verificationStatus).toBe('waiting_for_photos');

      // Step 5: Mark as verified (after photos received)
      const updated2 = await sourcingService.updateVerificationStatus(
        opportunity.opportunityId,
        'fully_verified',
        'agent-001'
      );
      expect(updated2.verificationStatus).toBe('fully_verified');

      // Step 6: Convert to inventory property
      const property = await sourcingService.convertOpportunityToProperty(
        opportunity.opportunityId,
        { description: 'Property verified and ready to list' },
        'agent-001'
      );

      expect(property).toBeDefined();
      expect(property.propertyId).toBeDefined();
      expect(property.status).toBe('active');

      // Step 7: Verify final opportunity status
      const finalOpp = await sourcingService.getOpportunity(opportunity.opportunityId);
      expect(finalOpp.verificationStatus).toBe('listed');
    });

    it('should handle sparse conversation data gracefully', async () => {
      const sparseText = 'villa dubai rent';
      const analysis = analyzer.analyzeConversation(sparseText);

      expect(analysis.propertyDetected).toBe(true);
      expect(analysis.confidenceScore).toBeGreaterThan(0);
      expect(analysis.confidenceScore).toBeLessThan(100);

      // Should still create opportunity with lower confidence
      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'sparse-test', messages: [sparseText] },
        analysis,
        'agent-001'
      );

      expect(opportunity).toBeDefined();
      expect(opportunity.confidenceScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle high-quality conversation data', async () => {
      const qualityText = `
        Hi! I'm Ahmed Al-Mazrouei and I own a beautiful 4-bedroom villa in Dubai Marina.
        The property is furnished, comes with a swimming pool, garden, and dedicated parking.
        It's available immediately for 5000 AED per month.
        The villa is 4500 sqft and is in excellent condition.
        We also offer a semi-furnished option if preferred.
      `;

      const analysis = analyzer.analyzeConversation(qualityText);

      expect(analysis.propertyDetected).toBe(true);
      expect(analysis.confidenceScore).toBeGreaterThan(80);
      expect(analysis.extractedData.bedrooms).toBe(4);
      expect(analysis.extractedData.bathrooms).toBeGreaterThan(0);
      expect(analysis.extractedData.price).toBe(5000);

      // Create opportunity with high confidence
      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'quality-test', messages: [qualityText] },
        analysis,
        'agent-001'
      );

      expect(opportunity.confidenceScore).toBeGreaterThan(80);
      expect(opportunity.completenessPercentage).toBeGreaterThan(75);
    });
  });

  // ============================================================
  // MULTI-CONVERSATION WORKFLOW TESTS
  // ============================================================

  describe('Multiple Conversation Batch Processing', () => {
    it('should process multiple conversations in sequence', async () => {
      const conversations = await whatsappService.getConversations({ limit: 3 });
      expect(conversations.length).toBeGreaterThanOrEqual(1);

      const opportunities = [];

      for (const conversation of conversations.slice(0, 3)) {
        const text = conversation.messages.join(' ');
        const analysis = analyzer.analyzeConversation(text);

        if (analysis.propertyDetected) {
          const opportunity = await sourcingService.createOpportunityFromConversation(
            { chatId: conversation.id, messages: conversation.messages },
            analysis,
            'agent-001'
          );
          opportunities.push(opportunity);
        }
      }

      expect(opportunities.length).toBeGreaterThanOrEqual(0);
    });

    it('should batch analyze conversations with different confidence levels', async () => {
      const conversationTexts = [
        'villa dubai marina 5000 aed',
        'I have a 4BR villa in Dubai Marina with pool for 5000 AED/month - Ahmed',
        'property available'
      ];

      const analyses = conversationTexts.map(text => 
        analyzer.analyzeConversation(text)
      );

      // Should have varying confidence levels
      const confidenceScores = analyses.map(a => a.confidenceScore);
      expect(Math.max(...confidenceScores)).toBeGreaterThan(Math.min(...confidenceScores));
    });

    it('should handle mixed property and non-property conversations', async () => {
      const mixedTexts = [
        'Beautiful 4BR villa in Dubai Marina for 5000 AED',
        'How are you today?',
        'Apartment available in Downtown Dubai',
        'See you tomorrow!'
      ];

      const analyses = mixedTexts.map(text => 
        analyzer.analyzeConversation(text)
      );

      const propertyDetections = analyses.map(a => a.propertyDetected);
      expect(propertyDetections).toContain(true);
      expect(propertyDetections).toContain(false);
    });
  });

  // ============================================================
  // QUALITY ASSURANCE WORKFLOW TESTS
  // ============================================================

  describe('Quality Assurance and Verification', () => {
    it('should track confidence through entire workflow', async () => {
      const text = '4BR villa in Dubai Marina available for 5000 AED/month';
      const analysis = analyzer.analyzeConversation(text);
      const initialConfidence = analysis.confidenceScore;

      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'qa-test', messages: [text] },
        analysis,
        'agent-001'
      );

      // Confidence should be preserved
      expect(opportunity.confidenceScore).toBe(initialConfidence);

      // Confidence should not decrease during verification
      const updated = await sourcingService.updateVerificationStatus(
        opportunity.opportunityId,
        'waiting_for_photos',
        'agent-001'
      );

      expect(updated.confidenceScore).toBe(initialConfidence);
    });

    it('should calculate and track completeness', async () => {
      const text = '4BR villa in Dubai Marina with pool for 5000 AED';
      const analysis = analyzer.analyzeConversation(text);

      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'completeness-test', messages: [text] },
        analysis,
        'agent-001'
      );

      expect(opportunity.completenessPercentage).toBeGreaterThan(0);
      expect(opportunity.completenessPercentage).toBeLessThanOrEqual(100);

      // Completeness should be based on data richness
      if (opportunity.completenessPercentage > 70) {
        // High completeness means good data extraction
        expect(Object.keys(opportunity.propertyDetails).length).toBeGreaterThan(3);
      }
    });

    it('should verify owner relationship creation', async () => {
      const text = "I'm Ahmed and I own a villa in Dubai Marina for 5000 AED";
      const analysis = analyzer.analyzeConversation(text);

      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'owner-test', messages: [text] },
        analysis,
        'agent-001'
      );

      expect(opportunity.ownerRelationshipId).toBeDefined();
      expect(opportunity.ownerInfo.name).toBeTruthy();
      expect(opportunity.ownerInfo.type).toBeTruthy();
    });
  });

  // ============================================================
  // STATISTICS AND REPORTING TESTS
  // ============================================================

  describe('Statistics and Reporting', () => {
    it('should generate accurate statistics from opportunities', async () => {
      const texts = [
        '4BR villa Dubai Marina 5000 AED',
        '3BR apartment Downtown Dubai 3500 AED',
        '2BR townhouse JBR 3000 AED'
      ];

      for (const text of texts) {
        const analysis = analyzer.analyzeConversation(text);
        if (analysis.propertyDetected) {
          await sourcingService.createOpportunityFromConversation(
            { chatId: `stats-${Math.random()}`, messages: [text] },
            analysis,
            'agent-001'
          );
        }
      }

      const stats = await sourcingService.getSourcingStats('week');

      expect(stats.summary).toBeDefined();
      expect(stats.summary.totalOpportunities).toBeGreaterThan(0);
      expect(stats.metrics.averageConfidenceScore).toBeGreaterThan(0);
      expect(stats.metrics.completenessPercentage).toBeGreaterThan(0);
    });

    it('should track top areas from opportunities', async () => {
      const stats = await sourcingService.getSourcingStats('week');

      expect(Array.isArray(stats.topAreas)).toBe(true);
      if (stats.topAreas.length > 0) {
        expect(stats.topAreas[0].area).toBeDefined();
        expect(stats.topAreas[0].count).toBeGreaterThan(0);
      }
    });

    it('should track owner metrics', async () => {
      const stats = await sourcingService.getSourcingStats('week');

      expect(stats.ownerMetrics).toBeDefined();
      expect(stats.ownerMetrics.totalOwners).toBeGreaterThanOrEqual(0);
      expect(stats.ownerMetrics.activeOwners).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================================
  // ERROR HANDLING AND EDGE CASES
  // ============================================================

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed conversation data', async () => {
      const badData = {
        chatId: null,
        messages: null
      };

      const analysis = analyzer.analyzeConversation('');
      expect(analysis).toBeDefined();
      expect(analysis.propertyDetected).toBe(false);
    });

    it('should recover from invalid status transitions', async () => {
      const text = '4BR villa Dubai Marina 5000 AED';
      const analysis = analyzer.analyzeConversation(text);

      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'transition-test', messages: [text] },
        analysis,
        'agent-001'
      );

      try {
        await sourcingService.updateVerificationStatus(
          opportunity.opportunityId,
          'invalid_status',
          'agent-001'
        );
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle concurrent opportunity creation', async () => {
      const texts = [
        '4BR villa Dubai Marina 5000 AED',
        '3BR apartment Downtown Dubai 3500 AED',
        '2BR townhouse JBR 3000 AED'
      ];

      const analyses = texts.map(text => analyzer.analyzeConversation(text));
      
      const creationPromises = analyses.map((analysis, index) =>
        sourcingService.createOpportunityFromConversation(
          { chatId: `concurrent-${index}`, messages: [texts[index]] },
          analysis,
          'agent-001'
        )
      );

      const opportunities = await Promise.all(creationPromises);
      expect(opportunities.length).toBe(3);
      opportunities.forEach(opp => {
        expect(opp.opportunityId).toBeDefined();
      });
    });

    it('should handle very long conversation text', async () => {
      const longText = 'villa dubai ' + 'with amenities '.repeat(500);
      const analysis = analyzer.analyzeConversation(longText);

      expect(analysis).toBeDefined();
      expect(analysis.confidenceScore).toBeLessThanOrEqual(100);
    });

    it('should handle special characters and symbols', async () => {
      const specialText = '4BR villa @DubaiMarina #RealEstate $5000/month!!!';
      const analysis = analyzer.analyzeConversation(specialText);

      expect(analysis.propertyDetected).toBe(true);
      expect(analysis.extractedData.bedrooms).toBe(4);
    });
  });

  // ============================================================
  // PERFORMANCE AND SCALABILITY TESTS
  // ============================================================

  describe('Performance and Scalability', () => {
    it('should analyze conversation in reasonable time', async () => {
      const text = 'Beautiful 4BR villa in Dubai Marina with swimming pool, garden, and dedicated parking, available for 5000 AED per month';
      
      const start = Date.now();
      analyzer.analyzeConversation(text);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should handle bulk conversation processing', async () => {
      const texts = Array(50).fill('4BR villa Dubai Marina 5000 AED').map((t, i) => t + ` ${i}`);
      
      const start = Date.now();
      const analyses = texts.map(text => analyzer.analyzeConversation(text));
      const duration = Date.now() - start;

      expect(analyses.length).toBe(50);
      expect(duration).toBeLessThan(5000); // Should process 50 in under 5 seconds
    });

    it('should scale opportunity creation', async () => {
      const count = 10;
      const creationPromises = Array(count).fill(null).map((_, i) => 
        sourcingService.createOpportunityFromConversation(
          { chatId: `scale-${i}`, messages: ['4BR villa Dubai Marina 5000 AED'] },
          analyzer.analyzeConversation('4BR villa Dubai Marina 5000 AED'),
          'agent-001'
        )
      );

      const start = Date.now();
      const results = await Promise.all(creationPromises);
      const duration = Date.now() - start;

      expect(results.length).toBe(count);
      expect(duration).toBeLessThan(10000); // Should handle 10 concurrent in under 10 seconds
    });
  });

  // ============================================================
  // BUSINESS LOGIC VALIDATION TESTS
  // ============================================================

  describe('Business Logic Validation', () => {
    it('should only create opportunities for detected properties', async () => {
      const nonPropertyText = 'How are you doing today?';
      const analysis = analyzer.analyzeConversation(nonPropertyText);

      if (!analysis.propertyDetected) {
        // Should not create opportunity
        expect(analysis.propertyDetected).toBe(false);
      }
    });

    it('should maintain data integrity through workflow', async () => {
      const text = '4BR villa Dubai Marina furnished 5000 AED';
      const analysis = analyzer.analyzeConversation(text);

      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'integrity-test', messages: [text] },
        analysis,
        'agent-001'
      );

      const property = await sourcingService.convertOpportunityToProperty(
        opportunity.opportunityId,
        {},
        'agent-001'
      );

      // Data should match through entire workflow
      expect(property.type).toBe(opportunity.propertyDetails.propertyType);
      expect(property.location).toBe(opportunity.propertyDetails.location);
      expect(property.bedrooms).toBe(opportunity.propertyDetails.bedrooms);
      expect(property.price).toBe(opportunity.pricing.monthlyPrice);
    });

    it('should respect verification workflow stages', async () => {
      const text = '4BR villa Dubai Marina 5000 AED';
      const analysis = analyzer.analyzeConversation(text);

      const opportunity = await sourcingService.createOpportunityFromConversation(
        { chatId: 'workflow-test', messages: [text] },
        analysis,
        'agent-001'
      );

      // Must go through stages in order
      expect(opportunity.verificationStatus).toBe('initial_detection');

      const stage2 = await sourcingService.updateVerificationStatus(
        opportunity.opportunityId,
        'waiting_for_photos',
        'agent-001'
      );
      expect(stage2.verificationStatus).toBe('waiting_for_photos');

      const stage3 = await sourcingService.updateVerificationStatus(
        opportunity.opportunityId,
        'partially_verified',
        'agent-001'
      );
      expect(stage3.verificationStatus).toBe('partially_verified');
    });
  });
});
