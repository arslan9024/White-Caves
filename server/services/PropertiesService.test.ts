/**
 * Properties Service — Tests
 * Tests all 8 service methods for correct return structure and contract.
 * Service currently returns stub data — tests validate contract shapes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock database (prisma) before importing service
vi.mock('../database', () => ({
  prisma: {},
}));

import { PropertiesService } from './PropertiesService';

describe('PropertiesService', () => {
  let service: PropertiesService;

  beforeEach(() => {
    service = new PropertiesService();
  });

  // ─── getAllProperties ─────────────────────────────────────────────
  describe('getAllProperties', () => {
    it('returns an array', async () => {
      const result = await service.getAllProperties();
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array when no data', async () => {
      const result = await service.getAllProperties();
      expect(result).toEqual([]);
    });

    it('accepts optional filters', async () => {
      const result = await service.getAllProperties({
        status: 'active',
        type: 'villa',
        priceRange: [500000, 2000000],
      });
      expect(Array.isArray(result)).toBe(true);
    });

    it('accepts empty filters', async () => {
      const result = await service.getAllProperties({});
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ─── getPropertyById ──────────────────────────────────────────────
  describe('getPropertyById', () => {
    it('returns null for any id (stub)', async () => {
      const result = await service.getPropertyById('prop-123');
      expect(result).toBeNull();
    });

    it('accepts string id', async () => {
      const result = await service.getPropertyById('some-uuid-value');
      expect(result).toBeNull();
    });
  });

  // ─── createProperty ───────────────────────────────────────────────
  describe('createProperty', () => {
    it('returns null for new property (stub)', async () => {
      const result = await service.createProperty({
        title: 'Luxury Villa',
        type: 'villa',
        location: 'Dubai Hills',
        price: 5000000,
      });
      expect(result).toBeNull();
    });

    it('accepts full property input', async () => {
      const result = await service.createProperty({
        title: 'Modern Apartment',
        type: 'apartment',
        location: 'Downtown Dubai',
        price: 1200000,
        status: 'available',
        description: 'A beautiful 2BR apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: ['img1.jpg', 'img2.jpg'],
      });
      expect(result).toBeNull();
    });
  });

  // ─── updateProperty ───────────────────────────────────────────────
  describe('updateProperty', () => {
    it('returns null (stub)', async () => {
      const result = await service.updateProperty('prop-123', {
        title: 'Updated Title',
      });
      expect(result).toBeNull();
    });

    it('accepts partial update data', async () => {
      const result = await service.updateProperty('prop-456', {
        price: 1500000,
        status: 'sold',
      });
      expect(result).toBeNull();
    });
  });

  // ─── deleteProperty ───────────────────────────────────────────────
  describe('deleteProperty', () => {
    it('returns true (stub)', async () => {
      const result = await service.deleteProperty('prop-123');
      expect(result).toBe(true);
    });
  });

  // ─── getPropertyStatistics ────────────────────────────────────────
  describe('getPropertyStatistics', () => {
    it('returns an object with total, byType, byStatus', async () => {
      const result = await service.getPropertyStatistics();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('byType');
      expect(result).toHaveProperty('byStatus');
    });

    it('total is 0 (stub)', async () => {
      const result = await service.getPropertyStatistics();
      expect(result.total).toBe(0);
    });

    it('byType and byStatus are objects', async () => {
      const result = await service.getPropertyStatistics();
      expect(typeof result.byType).toBe('object');
      expect(typeof result.byStatus).toBe('object');
    });
  });

  // ─── searchProperties ─────────────────────────────────────────────
  describe('searchProperties', () => {
    it('returns an array', async () => {
      const result = await service.searchProperties('villa');
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array (stub)', async () => {
      const result = await service.searchProperties('downtown');
      expect(result).toEqual([]);
    });

    it('accepts search query with filters', async () => {
      const result = await service.searchProperties('luxury', {
        type: 'villa',
        minPrice: 1000000,
        maxPrice: 5000000,
        status: 'available',
        location: 'Dubai',
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ─── getFeaturedProperties ────────────────────────────────────────
  describe('getFeaturedProperties', () => {
    it('returns an array', async () => {
      const result = await service.getFeaturedProperties();
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array (stub)', async () => {
      const result = await service.getFeaturedProperties();
      expect(result).toEqual([]);
    });
  });
});

// ─── Default Export ─────────────────────────────────────────────────
describe('PropertiesService — default export', () => {
  it('exports a singleton instance', async () => {
    const mod = await import('./PropertiesService');
    expect(mod.default).toBeDefined();
    expect(mod.default).toBeInstanceOf(PropertiesService);
  });
});
