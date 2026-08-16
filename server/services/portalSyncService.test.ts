import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    property: {
      findMany: vi.fn(),
    },
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-99' }),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import {
  generatePropertyFinderXml,
  generateBayutXml,
  pushListingStatusUpdate,
} from './portalSyncService.js';

describe('Portal Sync Service — Wave 39 (W39-001, W39-004)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generatePropertyFinderXml', () => {
    it('generates valid PropertyFinder v3 XML feed for available properties', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([
        {
          id: 'prop-101',
          title: 'Downtown Luxury Suite',
          description: 'Spacious 2 bedroom apartment',
          price: 2500000,
          rentalPrice: null,
          type: 'apartment',
          bedrooms: 2,
          bathrooms: 2,
          location: 'Downtown Dubai',
          reraPermitNumber: 'PERMIT-12345',
          status: 'available',
        },
      ]);

      const xml = await generatePropertyFinderXml();

      expect(xml).toContain('<?xml version="1.0"');
      expect(xml).toContain('<reference_number>prop-101</reference_number>');
      expect(xml).toContain('<title_en>Downtown Luxury Suite</title_en>');
      expect(xml).toContain('<permit_number>PERMIT-12345</permit_number>');
    });
  });

  describe('generateBayutXml', () => {
    it('generates valid Bayut XML feed for available properties', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([
        {
          id: 'prop-202',
          title: 'Dubai Marina Penthouse',
          description: 'Panormic sea views',
          price: 4500000,
          rentalPrice: null,
          type: 'apartment',
          bedrooms: 4,
          bathrooms: 5,
          location: 'Dubai Marina',
          reraPermitNumber: 'PERMIT-67890',
          status: 'available',
        },
      ]);

      const xml = await generateBayutXml();

      expect(xml).toContain('<Properties');
      expect(xml).toContain('<Property_Ref_No>prop-202</Property_Ref_No>');
      expect(xml).toContain('<Property_Title>Dubai Marina Penthouse</Property_Title>');
    });
  });

  describe('pushListingStatusUpdate', () => {
    it('logs real-time portal status update activity record', async () => {
      const res = await pushListingStatusUpdate('prop-101', 'off_market');

      expect(res.propertyId).toBe('prop-101');
      expect(res.newStatus).toBe('off_market');
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'property',
            action: 'portal_syndication_synced',
          }),
        })
      );
    });
  });
});
