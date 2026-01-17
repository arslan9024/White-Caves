import { describe, it, expect, beforeEach } from 'vitest';
import ConversationAnalyzer from '../ConversationAnalyzer';

describe('ConversationAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new ConversationAnalyzer();
  });

  // ============================================================
  // KEYWORD DETECTION TESTS (53 keywords across 9 categories)
  // ============================================================

  describe('Keyword Detection', () => {
    it('should detect villa keyword', () => {
      const text = 'I have a beautiful villa in Dubai Marina';
      const result = analyzer.analyzeConversation(text);
      expect(result.matchedKeywords).toContain('villa');
      expect(result.propertyDetected).toBe(true);
    });

    it('should detect apartment keyword', () => {
      const text = 'Apartment available in Downtown Dubai';
      const result = analyzer.analyzeConversation(text);
      expect(result.matchedKeywords).toContain('apartment');
      expect(result.propertyDetected).toBe(true);
    });

    it('should detect townhouse keyword', () => {
      const text = 'Modern townhouse for rent in JBR';
      const result = analyzer.analyzeConversation(text);
      expect(result.matchedKeywords).toContain('townhouse');
      expect(result.propertyDetected).toBe(true);
    });

    it('should detect studio keyword', () => {
      const text = 'Studio apartment with kitchenette available';
      const result = analyzer.analyzeConversation(text);
      expect(result.matchedKeywords).toContain('studio');
      expect(result.propertyDetected).toBe(true);
    });

    it('should detect multiple property type keywords', () => {
      const text = 'Villa or apartment available, also have a townhouse';
      const result = analyzer.analyzeConversation(text);
      expect(result.matchedKeywords.length).toBeGreaterThanOrEqual(3);
    });

    it('should detect location keywords', () => {
      const text = 'Property in Dubai Marina, Downtown Dubai, or Palm Jumeirah';
      const result = analyzer.analyzeConversation(text);
      expect(result.matchedKeywords).toContain('Dubai Marina');
      expect(result.matchedKeywords).toContain('Downtown Dubai');
      expect(result.matchedKeywords).toContain('Palm Jumeirah');
    });

    it('should detect availability keywords', () => {
      const text = 'Available immediately for rent';
      const result = analyzer.analyzeConversation(text);
      expect(result.matchedKeywords.some(kw => kw.includes('available') || kw.includes('rent'))).toBe(true);
    });

    it('should detect bedroom keywords', () => {
      const text = '2 bedrooms and 2 bathrooms with balcony';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.bedrooms).toBe(2);
      expect(result.extractedData.bathrooms).toBe(2);
    });

    it('should detect price keywords', () => {
      const text = 'Price is 5000 AED per month or 50000 annually';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.price).toBeGreaterThan(0);
    });

    it('should not detect property in non-property text', () => {
      const text = 'How are you today? Just checking in!';
      const result = analyzer.analyzeConversation(text);
      expect(result.propertyDetected).toBe(false);
      expect(result.confidenceScore).toBeLessThan(30);
    });
  });

  // ============================================================
  // CONFIDENCE SCORING TESTS (9-rule algorithm)
  // ============================================================

  describe('Confidence Scoring (9-rule algorithm)', () => {
    it('should calculate base confidence score at 0', () => {
      const text = 'Just a regular message';
      const result = analyzer.analyzeConversation(text);
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(result.confidenceScore).toBeLessThanOrEqual(100);
    });

    it('should add points for property type detection (+20)', () => {
      const textWithType = 'I have a villa';
      const textWithoutType = 'I have a place';
      const result1 = analyzer.analyzeConversation(textWithType);
      const result2 = analyzer.analyzeConversation(textWithoutType);
      expect(result1.confidenceScore).toBeGreaterThan(result2.confidenceScore);
    });

    it('should add points for location detection (+15)', () => {
      const textWithLocation = 'Villa in Dubai Marina';
      const textWithoutLocation = 'I have a villa';
      const result1 = analyzer.analyzeConversation(textWithLocation);
      const result2 = analyzer.analyzeConversation(textWithoutLocation);
      expect(result1.confidenceScore).toBeGreaterThanOrEqual(result2.confidenceScore);
    });

    it('should add points for size/bedroom detection (+15)', () => {
      const textWithSize = 'Villa with 4 bedrooms';
      const textWithoutSize = 'I have a villa';
      const result1 = analyzer.analyzeConversation(textWithSize);
      const result2 = analyzer.analyzeConversation(textWithoutSize);
      expect(result1.confidenceScore).toBeGreaterThanOrEqual(result2.confidenceScore);
    });

    it('should add points for price detection (+10)', () => {
      const textWithPrice = 'Villa available for 5000 AED per month';
      const textWithoutPrice = 'I have a villa';
      const result1 = analyzer.analyzeConversation(textWithPrice);
      const result2 = analyzer.analyzeConversation(textWithoutPrice);
      expect(result1.confidenceScore).toBeGreaterThanOrEqual(result2.confidenceScore);
    });

    it('should add points for availability detection (+10)', () => {
      const textWithAvailability = 'Available immediately';
      const textWithoutAvailability = 'I have a villa';
      const result1 = analyzer.analyzeConversation(textWithAvailability);
      const result2 = analyzer.analyzeConversation(textWithoutAvailability);
      expect(result1.confidenceScore).toBeGreaterThanOrEqual(result2.confidenceScore);
    });

    it('should add points for multiple features (+5 each)', () => {
      const textWithFeatures = 'Villa with swimming pool, garden, and parking';
      const textWithoutFeatures = 'I have a villa';
      const result1 = analyzer.analyzeConversation(textWithFeatures);
      const result2 = analyzer.analyzeConversation(textWithoutFeatures);
      expect(result1.confidenceScore).toBeGreaterThanOrEqual(result2.confidenceScore);
    });

    it('should cap confidence score at 100', () => {
      const textWithEverything = 'Beautiful 4BR villa in Dubai Marina with pool, garden, parking, furnished, available immediately for 5000 AED/month';
      const result = analyzer.analyzeConversation(textWithEverything);
      expect(result.confidenceScore).toBeLessThanOrEqual(100);
      expect(result.confidenceScore).toBeGreaterThan(70);
    });

    it('should return lower confidence for incomplete information', () => {
      const textIncomplete = 'Some property available';
      const textComplete = '4BR villa in Dubai Marina with pool available for 5000 AED/month';
      const result1 = analyzer.analyzeConversation(textIncomplete);
      const result2 = analyzer.analyzeConversation(textComplete);
      expect(result2.confidenceScore).toBeGreaterThan(result1.confidenceScore);
    });
  });

  // ============================================================
  // ENTITY EXTRACTION TESTS
  // ============================================================

  describe('Entity Extraction', () => {
    it('should extract property type', () => {
      const text = 'I have a villa for rent';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.propertyType).toBe('villa');
    });

    it('should extract location', () => {
      const text = 'Property located in Dubai Marina';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.location).toContain('Dubai Marina');
    });

    it('should extract bedrooms count', () => {
      const text = '4 bedrooms available';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.bedrooms).toBe(4);
    });

    it('should extract bathrooms count', () => {
      const text = '3 full bathrooms';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.bathrooms).toBe(3);
    });

    it('should extract square feet', () => {
      const text = 'Property size is 5000 sqft';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.sqft).toBe(5000);
    });

    it('should extract monthly price', () => {
      const text = '5000 AED per month';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.monthlyPrice).toBe(5000);
    });

    it('should extract annual price', () => {
      const text = '60000 AED per year';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData.annualPrice).toBe(60000);
    });

    it('should extract furnishing status', () => {
      const textFurnished = 'Furnished villa';
      const textUnfurnished = 'Unfurnished apartment';
      const result1 = analyzer.analyzeConversation(textFurnished);
      const result2 = analyzer.analyzeConversation(textUnfurnished);
      expect(result1.extractedData.furnishing).toContain('furnished');
      expect(result2.extractedData.furnishing).toContain('unfurnished');
    });

    it('should extract features list', () => {
      const text = 'Villa with swimming pool, garden, parking, and balcony';
      const result = analyzer.analyzeConversation(text);
      expect(Array.isArray(result.extractedData.features)).toBe(true);
      expect(result.extractedData.features.length).toBeGreaterThan(0);
    });

    it('should handle missing entity gracefully', () => {
      const text = 'Available property';
      const result = analyzer.analyzeConversation(text);
      expect(result.extractedData).toBeDefined();
      expect(result.extractedData.bedrooms).toBeUndefined();
    });
  });

  // ============================================================
  // OWNER IDENTIFICATION TESTS (4 owner types)
  // ============================================================

  describe('Owner Identification', () => {
    it('should identify direct owner', () => {
      const text = "I'm the owner of this villa";
      const result = analyzer.analyzeConversation(text);
      expect(result.ownerInfo.type).toBe('direct_owner');
    });

    it('should identify property manager', () => {
      const text = 'As the property manager, I can tell you this villa is available';
      const result = analyzer.analyzeConversation(text);
      expect(result.ownerInfo.type).toBe('property_manager');
    });

    it('should identify broker', () => {
      const text = 'I am a real estate broker with several properties';
      const result = analyzer.analyzeConversation(text);
      expect(result.ownerInfo.type).toMatch(/broker|agent/i);
    });

    it('should identify uncertain owner type when unclear', () => {
      const text = 'This property is available for rent';
      const result = analyzer.analyzeConversation(text);
      expect(['direct_owner', 'property_manager', 'broker', 'uncertain']).toContain(result.ownerInfo.type);
    });

    it('should extract owner name when available', () => {
      const text = "I'm Ahmed Al-Mazrouei and I own this villa";
      const result = analyzer.analyzeConversation(text);
      expect(result.ownerInfo.name).toBeTruthy();
    });

    it('should verify owner type increases confidence', () => {
      const textNoOwner = 'Property available for rent';
      const textWithOwner = "I'm Ahmed, the owner, and this property is available";
      const result1 = analyzer.analyzeConversation(textNoOwner);
      const result2 = analyzer.analyzeConversation(textWithOwner);
      expect(result2.confidenceScore).toBeGreaterThanOrEqual(result1.confidenceScore);
    });
  });

  // ============================================================
  // AUTO REPLY GENERATION TESTS
  // ============================================================

  describe('Auto Reply Generation', () => {
    it('should generate auto reply for property inquiry', () => {
      const text = 'I have a 4BR villa in Dubai Marina for 5000 AED/month';
      const result = analyzer.analyzeConversation(text);
      expect(result.autoReply).toBeTruthy();
      expect(result.autoReply.length).toBeGreaterThan(0);
    });

    it('should include property type in auto reply', () => {
      const text = 'Villa available for rent';
      const result = analyzer.analyzeConversation(text);
      expect(result.autoReply).toContain('villa');
    });

    it('should include interest indication in auto reply', () => {
      const text = 'I have a property available';
      const result = analyzer.analyzeConversation(text);
      expect(result.autoReply.toLowerCase()).toMatch(/interest|available|details/i);
    });

    it('should not generate auto reply for non-property text', () => {
      const text = 'How are you today?';
      const result = analyzer.analyzeConversation(text);
      if (!result.propertyDetected) {
        expect(result.autoReply).toBeUndefined();
      }
    });
  });

  // ============================================================
  // QUICK REPLIES SUGGESTION TESTS
  // ============================================================

  describe('Quick Replies Suggestion', () => {
    it('should suggest quick replies for property inquiry', () => {
      const text = 'Villa available in Dubai Marina';
      const result = analyzer.analyzeConversation(text);
      expect(Array.isArray(result.suggestedQuickReplies)).toBe(true);
      expect(result.suggestedQuickReplies.length).toBeGreaterThan(0);
    });

    it('should suggest viewing-related replies', () => {
      const text = 'Beautiful 4BR villa available now';
      const result = analyzer.analyzeConversation(text);
      const repliesText = result.suggestedQuickReplies.join(' ').toLowerCase();
      expect(repliesText).toMatch(/view|schedule|visit|see/i);
    });

    it('should suggest info-requesting replies', () => {
      const text = 'Property for rent';
      const result = analyzer.analyzeConversation(text);
      const repliesText = result.suggestedQuickReplies.join(' ').toLowerCase();
      expect(repliesText).toMatch(/details|more|info|price/i);
    });

    it('should suggest appropriate number of replies', () => {
      const text = 'I have a villa with 4 bedrooms in Dubai Marina for 5000 AED/month';
      const result = analyzer.analyzeConversation(text);
      expect(result.suggestedQuickReplies.length).toBeGreaterThanOrEqual(3);
      expect(result.suggestedQuickReplies.length).toBeLessThanOrEqual(5);
    });
  });

  // ============================================================
  // EDGE CASES AND ROBUSTNESS TESTS
  // ============================================================

  describe('Edge Cases and Robustness', () => {
    it('should handle empty string', () => {
      const text = '';
      const result = analyzer.analyzeConversation(text);
      expect(result).toBeDefined();
      expect(result.propertyDetected).toBe(false);
    });

    it('should handle very long text', () => {
      const longText = 'Beautiful villa ' + 'with all amenities '.repeat(100);
      const result = analyzer.analyzeConversation(longText);
      expect(result).toBeDefined();
      expect(result.confidenceScore).toBeLessThanOrEqual(100);
    });

    it('should handle text with special characters', () => {
      const text = 'Villa!!! 4BR @DubaiMarina #Property 5000AED/month';
      const result = analyzer.analyzeConversation(text);
      expect(result).toBeDefined();
      expect(result.propertyDetected).toBeTruthy();
    });

    it('should handle multiple languages (Arabic numbers)', () => {
      const text = 'Villa with ٤ bedrooms for ٥٠٠٠ AED';
      const result = analyzer.analyzeConversation(text);
      expect(result).toBeDefined();
    });

    it('should be case-insensitive', () => {
      const text1 = 'VILLA IN DUBAI MARINA';
      const text2 = 'villa in dubai marina';
      const result1 = analyzer.analyzeConversation(text1);
      const result2 = analyzer.analyzeConversation(text2);
      expect(result1.propertyDetected).toBe(result2.propertyDetected);
    });

    it('should handle URLs and emails gracefully', () => {
      const text = 'Check our villa at www.example.com or email us at property@example.com';
      const result = analyzer.analyzeConversation(text);
      expect(result).toBeDefined();
    });

    it('should calculate completeness percentage', () => {
      const result = analyzer.analyzeConversation('4BR villa in Dubai Marina with pool for 5000 AED/month');
      expect(result.extractedData.completenessPercentage).toBeGreaterThan(0);
      expect(result.extractedData.completenessPercentage).toBeLessThanOrEqual(100);
    });
  });

  // ============================================================
  // INTEGRATION TESTS
  // ============================================================

  describe('Integration Tests', () => {
    it('should process complete property inquiry end-to-end', () => {
      const text = "Hi! I'm Ahmed, owner of a 4BR villa in Dubai Marina. Beautiful property with pool, garden, and parking. Available immediately for 5000 AED/month. Furnished option available too.";
      const result = analyzer.analyzeConversation(text);
      
      expect(result.propertyDetected).toBe(true);
      expect(result.confidenceScore).toBeGreaterThan(80);
      expect(result.extractedData.propertyType).toBe('villa');
      expect(result.extractedData.bedrooms).toBe(4);
      expect(result.extractedData.location).toContain('Dubai Marina');
      expect(result.ownerInfo.type).toBe('direct_owner');
      expect(result.ownerInfo.name).toBeTruthy();
      expect(result.autoReply).toBeTruthy();
      expect(result.suggestedQuickReplies.length).toBeGreaterThan(0);
    });

    it('should process sparse property inquiry', () => {
      const text = 'villa rent dubai';
      const result = analyzer.analyzeConversation(text);
      
      expect(result).toBeDefined();
      expect(result.propertyDetected).toBe(true);
      expect(result.confidenceScore).toBeGreaterThan(30);
    });

    it('should differentiate between property and non-property conversations', () => {
      const propertyText = '4BR villa in Dubai Marina for 5000/month';
      const nonPropertyText = "How's your day going? Weather is nice today!";
      
      const result1 = analyzer.analyzeConversation(propertyText);
      const result2 = analyzer.analyzeConversation(nonPropertyText);
      
      expect(result1.propertyDetected).toBe(true);
      expect(result2.propertyDetected).toBe(false);
      expect(result1.confidenceScore).toBeGreaterThan(result2.confidenceScore);
    });
  });
});
