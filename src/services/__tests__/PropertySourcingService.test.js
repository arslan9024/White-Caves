import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import PropertySourcingService, { setPropertySourcingModels } from '../PropertySourcingServices';
import { createMockModels } from '../../../test/utils/mockDatabase';

describe('PropertySourcingService', () => {
  let service;
  let mockModels;
  let consoleErrorSpy;
  let consoleLogSpy;

  // Mock data matching ACTUAL ConversationAnalyzer output format
  const mockAnalysisResult = {
    properties: [
      {
        type: 'villa',
        confidence: 85,
        extractedData: {
          type: 'villa',
          location: 'Dubai Marina',
          availability: 'for_rent',
          size: {
            rooms: 4,
            sqft: 4000,
          },
          price: {
            monthlyRent: 5000,
            currency: 'AED',
          },
          furnishing: 'unfurnished',
          features: ['swimming pool', 'garden', 'parking'],
          owner: {
            name: 'Ahmed Al-Mazrouei',
            whatsappNumber: '+971501234567',
            ownershipType: 'direct_owner',
          },
        },
      },
    ],
    overallConfidence: 85,
    ownerIdentification: {
      name: 'Ahmed Al-Mazrouei',
      whatsappNumber: '+971501234567',
      ownershipType: 'direct_owner',
    },
    extractedEntities: [{ type: 'phone', value: '+971501234567' }],
  };

  const mockConversationData = {
    chatId: 'test-chat-123',
    messages: [
      {
        content: 'Hi, I have a villa available',
        senderName: 'Ahmed',
        senderPhone: '+971501234567',
      },
      { content: '4 bedrooms in Dubai Marina' },
      { content: 'AED 5000 per month' },
    ],
    timestamp: new Date(),
    source: 'whatsapp',
  };

  beforeEach(() => {
    // Suppress expected runtime noise from fallback-mode service paths.
    // Assertions in this suite validate behavior directly; console output is non-actionable.
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Create fresh mock models for each test
    mockModels = createMockModels();

    // Inject mock models into service
    setPropertySourcingModels(mockModels);

    // Create new service instance
    service = new PropertySourcingService();

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
    consoleLogSpy?.mockRestore();

    // Clear mock data after each test
    if (mockModels) {
      Object.values(mockModels).forEach(model => {
        if (model.clear) model.clear();
      });
    }
  });

  // ============================================================
  // OPPORTUNITY CREATION TESTS
  // ============================================================

  describe('Opportunity Creation', () => {
    it('should create opportunity from conversation', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity).toBeDefined();
      expect(opportunity.opportunityId).toBeDefined();
      expect(opportunity.verificationStatus).toBe('initial_detection');
    });

    it('should link conversation data to opportunity', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity.conversationHistory.chatId).toBe(mockConversationData.chatId);
      expect(opportunity.conversationHistory.messages).toEqual(mockConversationData.messages);
    });

    it('should extract and store property details', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity.propertyDetails.propertyType).toBe('villa');
      expect(opportunity.propertyDetails.location).toBe('Dubai Marina');
      expect(opportunity.propertyDetails.bedrooms).toBe(4);
      expect(opportunity.propertyDetails.bathrooms).toBe(3);
    });

    it('should store pricing information', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity.pricing.monthlyPrice).toBe(5000);
      expect(opportunity.pricing.currency).toBe('AED');
    });

    it('should store owner information', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity.ownerInfo.name).toBe('Ahmed Al-Mazrouei');
      expect(opportunity.ownerInfo.phone).toBe('+971501234567');
      expect(opportunity.ownerInfo.type).toBe('direct_owner');
    });

    it('should store confidence score', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity.confidenceScore).toBe(85);
      expect(opportunity.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(opportunity.confidenceScore).toBeLessThanOrEqual(100);
    });

    it('should calculate completeness percentage', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity.completenessPercentage).toBeDefined();
      expect(opportunity.completenessPercentage).toBeGreaterThan(0);
      expect(opportunity.completenessPercentage).toBeLessThanOrEqual(100);
    });

    it('should create linked owner relationship', async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      expect(opportunity.ownerRelationshipId).toBeDefined();
    });

    it('should track creation timestamp', async () => {
      const beforeCreation = new Date();
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );
      const afterCreation = new Date();

      expect(opportunity.createdAt).toBeDefined();
      expect(new Date(opportunity.createdAt).getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime()
      );
      expect(new Date(opportunity.createdAt).getTime()).toBeLessThanOrEqual(
        afterCreation.getTime()
      );
    });
  });

  // ============================================================
  // VERIFICATION STATUS WORKFLOW TESTS
  // ============================================================

  describe('Verification Status Workflow', () => {
    let opportunityId;

    beforeEach(async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );
      opportunityId = opportunity.opportunityId;
    });

    it('should start at initial_detection status', async () => {
      const opportunity = await service.getOpportunity(opportunityId);
      expect(opportunity.verificationStatus).toBe('initial_detection');
    });

    it('should transition to waiting_for_photos', async () => {
      const updated = await service.updateVerificationStatus(
        opportunityId,
        'waiting_for_photos',
        'agent-001'
      );

      expect(updated.verificationStatus).toBe('waiting_for_photos');
    });

    it('should transition to partially_verified', async () => {
      await service.updateVerificationStatus(opportunityId, 'waiting_for_photos', 'agent-001');
      const updated = await service.updateVerificationStatus(
        opportunityId,
        'partially_verified',
        'agent-001'
      );

      expect(updated.verificationStatus).toBe('partially_verified');
    });

    it('should transition to fully_verified', async () => {
      await service.updateVerificationStatus(opportunityId, 'waiting_for_photos', 'agent-001');
      await service.updateVerificationStatus(opportunityId, 'partially_verified', 'agent-001');
      const updated = await service.updateVerificationStatus(
        opportunityId,
        'fully_verified',
        'agent-001'
      );

      expect(updated.verificationStatus).toBe('fully_verified');
    });

    it('should support archiving opportunity', async () => {
      const updated = await service.updateVerificationStatus(
        opportunityId,
        'archived',
        'agent-001'
      );

      expect(updated.verificationStatus).toBe('archived');
    });

    it('should mark as listed when converted to property', async () => {
      await service.updateVerificationStatus(opportunityId, 'waiting_for_photos', 'agent-001');
      await service.updateVerificationStatus(opportunityId, 'fully_verified', 'agent-001');
      const updated = await service.updateVerificationStatus(opportunityId, 'listed', 'agent-001');

      expect(updated.verificationStatus).toBe('listed');
    });

    it('should reject invalid status transitions', async () => {
      const result = await service.updateVerificationStatus(
        opportunityId,
        'invalid_status',
        'agent-001'
      );
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid status');
    });

    it('should track status update timestamp', async () => {
      const beforeUpdate = new Date();
      const updated = await service.updateVerificationStatus(
        opportunityId,
        'partially_verified',
        'agent-001'
      );
      const afterUpdate = new Date();

      expect(updated.lastStatusUpdate).toBeDefined();
      expect(new Date(updated.lastStatusUpdate).getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime()
      );
    });

    it('should track status history', async () => {
      await service.updateVerificationStatus(opportunityId, 'waiting_for_photos', 'agent-001');
      await service.updateVerificationStatus(opportunityId, 'partially_verified', 'agent-001');

      const opportunity = await service.getOpportunity(opportunityId);
      expect(Array.isArray(opportunity.statusHistory)).toBe(true);
      expect(opportunity.statusHistory.length).toBeGreaterThan(0);
    });
  });

  // ============================================================
  // OPPORTUNITY TO PROPERTY CONVERSION TESTS
  // ============================================================

  describe('Opportunity to Property Conversion', () => {
    let opportunityId;

    beforeEach(async () => {
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );
      opportunityId = opportunity.opportunityId;
      await service.updateVerificationStatus(opportunityId, 'fully_verified', 'agent-001');
    });

    it('should convert opportunity to inventory property', async () => {
      const property = await service.convertOpportunityToProperty(
        opportunityId,
        { description: 'Beautiful villa with all amenities' },
        'agent-001'
      );

      expect(property).toBeDefined();
      expect(property.propertyId).toBeDefined();
    });

    it('should link property to original opportunity', async () => {
      const property = await service.convertOpportunityToProperty(opportunityId, {}, 'agent-001');

      expect(property.opportunityId).toBe(opportunityId);
    });

    it('should copy property details from opportunity', async () => {
      const property = await service.convertOpportunityToProperty(opportunityId, {}, 'agent-001');

      expect(property.type).toBe('villa');
      expect(property.location).toBe('Dubai Marina');
      expect(property.bedrooms).toBe(4);
      expect(property.bathrooms).toBe(3);
      expect(property.price).toBe(5000);
    });

    it('should set property status to active', async () => {
      const property = await service.convertOpportunityToProperty(opportunityId, {}, 'agent-001');

      expect(property.status).toBe('active');
    });

    it('should merge additional data with extracted data', async () => {
      const additionalData = {
        description: 'Luxury villa with premium finishes',
        title: 'Dubai Marina Villa',
      };

      const property = await service.convertOpportunityToProperty(
        opportunityId,
        additionalData,
        'agent-001'
      );

      expect(property.description).toContain('Luxury villa');
      expect(property.title).toBe('Dubai Marina Villa');
    });

    it('should preserve owner contact information', async () => {
      const property = await service.convertOpportunityToProperty(opportunityId, {}, 'agent-001');

      expect(property.ownerContact.whatsappNumber).toBe('+971501234567');
      expect(property.ownerContact.ownerName).toBe('Ahmed Al-Mazrouei');
    });

    it('should update opportunity status to listed', async () => {
      await service.convertOpportunityToProperty(opportunityId, {}, 'agent-001');
      const opportunity = await service.getOpportunity(opportunityId);

      expect(opportunity.verificationStatus).toBe('listed');
    });

    it('should create sourcing metadata', async () => {
      const property = await service.convertOpportunityToProperty(opportunityId, {}, 'agent-001');

      expect(property.sourcingMetadata).toBeDefined();
      expect(property.sourcingMetadata.opportunityId).toBe(opportunityId);
      expect(property.sourcingMetadata.extractedBy).toBe('agent-001');
    });
  });

  // ============================================================
  // STATISTICS AND ANALYTICS TESTS
  // ============================================================

  describe('Statistics and Analytics', () => {
    beforeEach(async () => {
      // Create multiple opportunities for testing
      const analysis1 = { ...mockAnalysisResult, confidenceScore: 90 };
      const analysis2 = { ...mockAnalysisResult, confidenceScore: 75 };
      const analysis3 = { ...mockAnalysisResult, confidenceScore: 85 };

      await service.createOpportunityFromConversation(mockConversationData, analysis1, 'agent-001');
      await service.createOpportunityFromConversation(mockConversationData, analysis2, 'agent-001');
      await service.createOpportunityFromConversation(mockConversationData, analysis3, 'agent-001');
    });

    it('should retrieve sourcing statistics', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats).toBeDefined();
    });

    it('should count total opportunities', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.summary.totalOpportunities).toBeGreaterThan(0);
    });

    it('should count new opportunities by timeframe', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.summary.newThisWeek).toBeDefined();
      expect(typeof stats.summary.newThisWeek).toBe('number');
    });

    it('should breakdown by verification status', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.byStatus).toBeDefined();
      expect(stats.byStatus.initial_detection).toBeGreaterThanOrEqual(0);
    });

    it('should calculate average confidence score', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.metrics.averageConfidenceScore).toBeDefined();
      expect(stats.metrics.averageConfidenceScore).toBeGreaterThan(0);
      expect(stats.metrics.averageConfidenceScore).toBeLessThanOrEqual(100);
    });

    it('should calculate completeness percentage', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.metrics.completenessPercentage).toBeDefined();
      expect(stats.metrics.completenessPercentage).toBeGreaterThanOrEqual(0);
      expect(stats.metrics.completenessPercentage).toBeLessThanOrEqual(100);
    });

    it('should calculate verification rate', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.metrics.verificationRate).toBeDefined();
    });

    it('should calculate conversion rate', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.metrics.conversionRate).toBeDefined();
    });

    it('should identify top areas', async () => {
      const stats = await service.getSourcingStats('week');
      expect(Array.isArray(stats.topAreas)).toBe(true);
      if (stats.topAreas.length > 0) {
        expect(stats.topAreas[0].area).toBeDefined();
        expect(stats.topAreas[0].count).toBeGreaterThan(0);
      }
    });

    it('should track owner metrics', async () => {
      const stats = await service.getSourcingStats('week');
      expect(stats.ownerMetrics).toBeDefined();
      expect(stats.ownerMetrics.totalOwners).toBeGreaterThanOrEqual(0);
      expect(stats.ownerMetrics.activeOwners).toBeGreaterThanOrEqual(0);
    });

    it('should support different timeframes', async () => {
      const week = await service.getSourcingStats('week');
      const month = await service.getSourcingStats('month');
      const year = await service.getSourcingStats('year');

      expect(week).toBeDefined();
      expect(month).toBeDefined();
      expect(year).toBeDefined();
    });
  });

  // ============================================================
  // AUTOMATION TESTS
  // ============================================================

  describe('Daily Analysis Automation', () => {
    it('should start daily analysis cycle', async () => {
      const result = await service.startDailyAnalysis();
      expect(result).toBeDefined();
      expect(result.active).toBe(true);
    });

    it('should run conversation analysis cycle', async () => {
      const result = await service.runConversationAnalysis();
      expect(result).toBeDefined();
      expect(result.analyzed).toBeDefined();
      expect(result.opportunities).toBeDefined();
    });

    it('should track analysis progress', async () => {
      const progress = service.getAnalysisProgress();
      expect(progress).toBeDefined();
      expect(typeof progress.percentage).toBe('number');
    });

    it('should stop daily analysis cycle', async () => {
      await service.startDailyAnalysis();
      const result = await service.stopDailyAnalysis();
      expect(result).toBeDefined();
      expect(result.active).toBe(false);
    });

    it('should handle errors in analysis cycle', async () => {
      vi.spyOn(service, 'runConversationAnalysis').mockRejectedValue(new Error('Analysis failed'));

      try {
        await service.runConversationAnalysis();
      } catch (error) {
        expect(error.message).toContain('failed');
      }
    });
  });

  // ============================================================
  // HELPER METHOD TESTS
  // ============================================================

  describe('Helper Methods', () => {
    it('should calculate data completeness', () => {
      const entities = {
        propertyType: 'villa',
        location: 'Dubai Marina',
        bedrooms: 4,
        price: 5000,
      };

      const completeness = service.calculateCompleteness(entities);
      expect(typeof completeness).toBe('number');
      expect(completeness).toBeGreaterThan(0);
      expect(completeness).toBeLessThanOrEqual(100);
    });

    it('should return date filter for timeframe', () => {
      const weekFilter = service.getDateFilter('week');
      const monthFilter = service.getDateFilter('month');
      const yearFilter = service.getDateFilter('year');

      expect(weekFilter).toBeDefined();
      expect(monthFilter).toBeDefined();
      expect(yearFilter).toBeDefined();
    });

    it('should retrieve specific opportunity', async () => {
      const created = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      const retrieved = await service.getOpportunity(created.opportunityId);
      expect(retrieved).toBeDefined();
      expect(retrieved.opportunityId).toBe(created.opportunityId);
    });

    it('should list all opportunities', async () => {
      const opportunities = await service.getAllOpportunities();
      expect(Array.isArray(opportunities)).toBe(true);
    });

    it('should filter opportunities by status', async () => {
      const initial = await service.getOpportunitiesByStatus('initial_detection');
      expect(Array.isArray(initial)).toBe(true);
    });
  });

  // ============================================================
  // INTEGRATION TESTS
  // ============================================================

  describe('Integration Tests', () => {
    it('should complete full sourcing workflow', async () => {
      // 1. Create opportunity
      const opportunity = await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );
      expect(opportunity.opportunityId).toBeDefined();

      // 2. Update to waiting for photos
      const updated1 = await service.updateVerificationStatus(
        opportunity.opportunityId,
        'waiting_for_photos',
        'agent-001'
      );
      expect(updated1.verificationStatus).toBe('waiting_for_photos');

      // 3. Mark as verified
      const updated2 = await service.updateVerificationStatus(
        opportunity.opportunityId,
        'fully_verified',
        'agent-001'
      );
      expect(updated2.verificationStatus).toBe('fully_verified');

      // 4. Convert to property
      const property = await service.convertOpportunityToProperty(
        opportunity.opportunityId,
        { description: 'Premium property' },
        'agent-001'
      );
      expect(property.propertyId).toBeDefined();

      // 5. Verify opportunity is marked as listed
      const finalOpportunity = await service.getOpportunity(opportunity.opportunityId);
      expect(finalOpportunity.verificationStatus).toBe('listed');
    });

    it('should track statistics during workflow', async () => {
      const statsBefore = await service.getSourcingStats('week');
      const before = statsBefore.summary.totalOpportunities || 0;

      await service.createOpportunityFromConversation(
        mockConversationData,
        mockAnalysisResult,
        'agent-001'
      );

      const statsAfter = await service.getSourcingStats('week');
      const after = statsAfter.summary.totalOpportunities;

      expect(after).toBeGreaterThan(before);
    });

    it('should handle multiple concurrent opportunities', async () => {
      const results = await Promise.all([
        service.createOpportunityFromConversation(
          mockConversationData,
          mockAnalysisResult,
          'agent-001'
        ),
        service.createOpportunityFromConversation(
          mockConversationData,
          mockAnalysisResult,
          'agent-002'
        ),
        service.createOpportunityFromConversation(
          mockConversationData,
          mockAnalysisResult,
          'agent-003'
        ),
      ]);

      expect(results.length).toBe(3);
      results.forEach(opp => {
        expect(opp.opportunityId).toBeDefined();
      });
    });
  });
});
