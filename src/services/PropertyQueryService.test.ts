import { describe, it, expect, vi, beforeEach } from 'vitest';
import PropertyQueryService from './PropertyQueryService';

describe('PropertyQueryService', () => {
  let queryService: PropertyQueryService;

  beforeEach(() => {
    queryService = new PropertyQueryService();
  });

  describe('parseNaturalLanguageQuery', () => {
    it('extracts bedrooms and property type from natural language prompt', () => {
      const parsed = queryService.parseNaturalLanguageQuery('Looking for a 2BR villa in Arabian Ranches');
      expect(parsed.minRooms).toBe(2);
      expect(parsed.maxRooms).toBe(2);
      expect(parsed.propertyType).toBe('villa');
      expect(parsed.area).toBe('arabian ranches');
    });

    it('extracts studio property with 0-1 rooms', () => {
      const parsed = queryService.parseNaturalLanguageQuery('Find a modern studio in Downtown Dubai');
      expect(parsed.minRooms).toBe(0);
      expect(parsed.maxRooms).toBe(1);
      expect(parsed.area).toBe('downtown dubai');
    });

    it('extracts price ceiling and purpose from query text', () => {
      const parsed = queryService.parseNaturalLanguageQuery('3BR apartment under 2.5M in Palm Jumeirah for rent');
      expect(parsed.minRooms).toBe(3);
      expect(parsed.propertyType).toBe('apartment');
      expect(parsed.maxPrice).toBe(2500000);
      expect(parsed.purpose).toBe('rent');
      expect(parsed.area).toBe('palm jumeirah');
    });

    it('extracts luxury amenities tags and view type', () => {
      const parsed = queryService.parseNaturalLanguageQuery('luxury penthouse with pool and garden having sea view in Marina');
      expect(parsed.propertyType).toBe('penthouse');
      expect(parsed.tags).toContain('pool');
      expect(parsed.tags).toContain('garden');
      expect(parsed.viewType).toBe('sea');
      expect(parsed.area).toBe('marina');
    });

    it('formats numbers into readable millions and thousands currency strings', () => {
      expect(queryService.formatPrice(3500000)).toBe('AED 3.5M');
      expect(queryService.formatPrice(450000)).toBe('AED 450K');
      expect(queryService.formatPrice(800)).toBe('AED 800');
    });
  });
});
