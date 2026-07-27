import { describe, it, expect } from 'vitest';
import {
  generatePropertyFinderXml,
  validateTrakheesiPermit,
  SyndicationProperty,
} from '../propertyFinderService';
import { generateBayutJsonFeed, optimizeCloudinaryUrl } from '../bayutService';

describe('Portal Syndication Services', () => {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const mockProperty: SyndicationProperty = {
    id: 'prop-1',
    reference: 'WC-101',
    title: 'Luxury Villa in Palm Jumeirah',
    titleAr: 'فيلة فاخرة في نخلة جميرا',
    description: 'Stunning beachfront villa with private pool.',
    propertyType: 'VILLA',
    offeringType: 'SALE',
    price: 15000000,
    currency: 'AED',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqFt: 7500,
    location: {
      city: 'Dubai',
      community: 'Palm Jumeirah',
      subCommunity: 'Frond M',
    },
    permit: {
      permitNumber: 'TRK-987654',
      issueDate: '2025-01-01',
      expiryDate: futureDate.toISOString().split('T')[0],
      status: 'ACTIVE',
      listingType: 'SALE',
    },
    images: ['https://res.cloudinary.com/whitecaves/image/upload/v1234/villa1.jpg'],
    features: ['Private Pool', 'Beach Access'],
    updatedAt: new Date().toISOString(),
  };

  describe('Trakheesi Permit Validation', () => {
    it('approves active and non-expired permits', () => {
      const res = validateTrakheesiPermit(mockProperty.permit);
      expect(res.isValid).toBe(true);
    });

    it('rejects missing permits', () => {
      const res = validateTrakheesiPermit(undefined);
      expect(res.isValid).toBe(false);
      expect(res.reason).toContain('Missing');
    });

    it('rejects expired permits', () => {
      const expiredPermit = { ...mockProperty.permit!, expiryDate: '2020-01-01' };
      const res = validateTrakheesiPermit(expiredPermit);
      expect(res.isValid).toBe(false);
      expect(res.reason).toContain('expired');
    });
  });

  describe('PropertyFinder XML Generator', () => {
    it('generates valid XML feed for eligible properties', () => {
      const result = generatePropertyFinderXml([mockProperty]);
      expect(result.eligibleListings).toBe(1);
      expect(result.blockedListings.length).toBe(0);
      expect(result.xml).toContain('<reference_number>WC-101</reference_number>');
      expect(result.xml).toContain('TRK-987654');
    });

    it('filters out properties with expired permits', () => {
      const invalidProp = {
        ...mockProperty,
        id: 'prop-2',
        permit: { ...mockProperty.permit!, expiryDate: '2019-01-01' },
      };
      const result = generatePropertyFinderXml([mockProperty, invalidProp]);
      expect(result.eligibleListings).toBe(1);
      expect(result.blockedListings.length).toBe(1);
      expect(result.blockedListings[0].id).toBe('prop-2');
    });
  });

  describe('Bayut JSON Generator & Cloudinary Optimizer', () => {
    it('applies image transformation parameters to Cloudinary URLs', () => {
      const url = 'https://res.cloudinary.com/whitecaves/image/upload/v1234/villa1.jpg';
      const opt = optimizeCloudinaryUrl(url, 1200, 800);
      expect(opt).toContain('/upload/f_auto,q_auto,c_limit,w_1200,h_800/');
    });

    it('generates structured JSON feed and sync log', () => {
      const { feed, syncLog } = generateBayutJsonFeed([mockProperty]);
      expect(syncLog.syncedCount).toBe(1);
      expect(syncLog.failedCount).toBe(0);
      expect(feed).toHaveProperty('agency', 'White Caves Real Estate LLC');
    });
  });
});
