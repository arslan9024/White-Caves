import { describe, it, expect, vi, beforeEach } from 'vitest';
import NinaMaryIntelligence from './NinaMaryIntelligence';

describe('NinaMaryIntelligence', () => {
  let intelligence: NinaMaryIntelligence;

  beforeEach(() => {
    intelligence = new NinaMaryIntelligence();
  });

  it('correctly identifies property inquiries vs general chat intents', () => {
    expect(intelligence.isPropertyInquiry('property_inquiry')).toBe(true);
    expect(intelligence.isPropertyInquiry('viewing_request')).toBe(true);
    expect(intelligence.isPropertyInquiry('price_inquiry')).toBe(true);
    expect(intelligence.isPropertyInquiry('property_details')).toBe(true);
    expect(intelligence.isPropertyInquiry('availability_check')).toBe(true);
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
      count: 1,
      properties: [
        {
          id: 'prop_101',
          description: 'Luxury 2BR Villa in Arabian Ranches',
          area: 'Arabian Ranches',
          type: 'villa',
          features: ['pool', 'garden'],
          images: ['https://example.com/villa.jpg'],
        },
      ],
      query_filters: { propertyType: 'villa', maxPrice: 2500000 },
    };

    vi.spyOn(intelligence.propertyQueryService, 'searchPropertiesNaturalLanguage')
      .mockResolvedValueOnce(mockSearchResult as any);

    const firstCall = await intelligence.generateEnhancedResponse(
      '2BR villa in Arabian Ranches under 2.5M',
      'property_inquiry',
      {}
    );

    expect(firstCall.type).toBe('property_list');
    expect(firstCall.properties).toHaveLength(1);
    expect(firstCall.properties[0].id).toBe('prop_101');
    expect(firstCall.actionButtons).toBeDefined();

    // Second call should resolve from cache without hitting search service again
    const secondCall = await intelligence.generateEnhancedResponse(
      '2BR villa in Arabian Ranches under 2.5M',
      'property_inquiry',
      {}
    );
    expect(secondCall).toEqual(firstCall);
  });

  it('formats helpful guidance when no property matches criteria', async () => {
    const mockEmptyResult = {
      success: true,
      count: 0,
      properties: [],
      query_filters: { minRooms: 3, maxRooms: 4, area: 'Palm Jumeirah', maxPrice: 5000000 },
    };

    vi.spyOn(intelligence.propertyQueryService, 'searchPropertiesNaturalLanguage')
      .mockResolvedValueOnce(mockEmptyResult as any);

    const res = await intelligence.generateEnhancedResponse(
      'Penthouse for 100K in Palm Jumeirah',
      'property_inquiry',
      {}
    );

    expect(res.type).toBe('no_match_suggestions');
    expect(res.text).toContain("couldn't find properties matching exactly");
    expect(res.text).toContain('Palm Jumeirah');
  });
});
