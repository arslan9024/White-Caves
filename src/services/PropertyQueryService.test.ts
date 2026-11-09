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

    it('extracts price ceiling and floor from currency expressions', () => {
      const parsed = queryService.parseNaturalLanguageQuery('3BR apartment between 1.5M and 2.5M in Palm Jumeirah');
      expect(parsed.minRooms).toBe(3);
      expect(parsed.propertyType).toBe('apartment');
      expect(parsed.minPrice).toBe(1500000);
      expect(parsed.maxPrice).toBe(2500000);
      expect(parsed.area).toBe('palm jumeirah');
    });

    it('extracts luxury features and amenities', () => {
      const parsed = queryService.parseNaturalLanguageQuery('luxury penthouse with private pool and sea view in Marina');
      expect(parsed.propertyType).toBe('penthouse');
      expect(parsed.features).toContain('pool');
      expect(parsed.features).toContain('sea view');
      expect(parsed.area).toBe('marina');
    });
  });
});
