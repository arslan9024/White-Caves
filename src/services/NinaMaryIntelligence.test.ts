import { describe, it, expect, vi, beforeEach } from 'vitest';
import NinaMaryIntelligence from './NinaMaryIntelligence';

describe('NinaMaryIntelligence', () => {
  let intelligence: NinaMaryIntelligence;

  beforeEach(() => {
    intelligence = new NinaMaryIntelligence();
  });

  it('correctly identifies property inquiries vs general chat intents', () => {
    expect(intelligence.isPropertyInquiry('property_search')).toBe(true);
    expect(intelligence.isPropertyInquiry('find_villa')).toBe(true);
    expect(intelligence.isPropertyInquiry('greeting')).toBe(false);
    expect(intelligence.isPropertyInquiry('general_question')).toBe(false);
  });

  it('delegates general inquiries directly to fallback responses', async () => {
    const res = await intelligence.generateEnhancedResponse('Hello there', 'greeting', {});
    expect(res).toBeDefined();
    expect(res.type).toBe('text');
  });

  it('queries property inventory and formats matching responses with caching', async () => {
    const mockSearchResult = {
      success: true,
      properties: [
        {
          id: 'prop_101',
          title: 'Luxury 2BR Villa',
          type: 'villa',
          location: 'Arabian Ranches',
          price: 2400000,
          bedrooms: 2,
        },
      ],
      query_filters: { propertyType: 'villa', maxPrice: 2500000 },
    };

    vi.spyOn(intelligence.propertyQueryService, 'searchPropertiesNaturalLanguage')
      .mockResolvedValueOnce(mockSearchResult as any);

    const firstCall = await intelligence.generateEnhancedResponse(
      '2BR villa in Arabian Ranches under 2.5M',
      'property_search',
      {}
    );

    expect(firstCall.type).toBe('property_match');
    expect(firstCall.properties).toHaveLength(1);

    // Second call should resolve from cache without hitting search service again
    const secondCall = await intelligence.generateEnhancedResponse(
      '2BR villa in Arabian Ranches under 2.5M',
      'property_search',
      {}
    );
    expect(secondCall).toEqual(firstCall);
  });

  it('formats helpful guidance when no property matches criteria', async () => {
    const mockEmptyResult = {
      success: true,
      properties: [],
      query_filters: { propertyType: 'penthouse', maxPrice: 100000 },
    };

    vi.spyOn(intelligence.propertyQueryService, 'searchPropertiesNaturalLanguage')
      .mockResolvedValueOnce(mockEmptyResult as any);

    const res = await intelligence.generateEnhancedResponse(
      'Penthouse for 100K',
      'property_search',
      {}
    );

    expect(res.type).toBe('no_match');
    expect(res.text).toContain("didn't find any properties");
  });
});
