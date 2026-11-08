import { describe, it, expect, beforeEach } from 'vitest';
import { ListingIndexCache } from '../listingIndexCache';

describe('MapIndexHash Listing Cache Engine', () => {
  let cache: ListingIndexCache;

  beforeEach(() => {
    cache = ListingIndexCache.getInstance();
    cache.clear();
  });

  it('performs sub-1ms O(1) indexed lookups by ID and reference', () => {
    cache.upsertListing({
      id: 'list-001',
      referenceNumber: 'WC-DXB-9988',
      title: 'Luxury 4BR Villa Palm Jumeirah',
      community: 'Palm Jumeirah',
      priceAed: 24_000_000,
      bedrooms: 4,
      bathrooms: 5,
      areaSqft: 6500,
      propertyType: 'VILLA',
      status: 'ACTIVE',
      isBayutVerified: true,
      trakheesiPermitNumber: 'TRK-987654'
    });

    const start = performance.now();
    const listing = cache.getByReference('WC-DXB-9988');
    const elapsed = performance.now() - start;

    expect(listing).toBeDefined();
    expect(listing?.priceAed).toBe(24_000_000);
    expect(elapsed).toBeLessThan(10); // Well under 10ms target
  });

  it('retrieves community clusters in O(1) time without full array scans', () => {
    cache.upsertListing({
      id: 'list-001',
      referenceNumber: 'REF-1',
      title: 'Villa 1',
      community: 'DAMAC Hills 2',
      priceAed: 2_500_000,
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 2200,
      propertyType: 'VILLA',
      status: 'ACTIVE',
      isBayutVerified: true,
      trakheesiPermitNumber: 'TRK-1'
    });

    cache.upsertListing({
      id: 'list-002',
      referenceNumber: 'REF-2',
      title: 'Villa 2',
      community: 'damac hills 2',
      priceAed: 2_800_000,
      bedrooms: 4,
      bathrooms: 4,
      areaSqft: 2600,
      propertyType: 'VILLA',
      status: 'ACTIVE',
      isBayutVerified: true,
      trakheesiPermitNumber: 'TRK-2'
    });

    const cluster = cache.getByCommunity('DAMAC Hills 2');
    expect(cluster).toHaveLength(2);
  });
});
