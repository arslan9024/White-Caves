import { describe, it, expect, beforeEach } from 'vitest';
import { tierZeroCache, TierZeroMemoryCache } from './tierZeroCache';

describe('TierZeroMemoryCache (DOM-07 Sub-10ms Fast Cache Spec)', () => {
  beforeEach(() => {
    tierZeroCache.clear();
  });

  it('stores and retrieves data with sub-10ms O(1) performance', () => {
    const testData = { id: 'prop-101', title: 'Signature Villa Palm Jumeirah', priceAED: 45000000 };
    tierZeroCache.set('prop-101', testData, 10000);

    const t0 = performance.now();
    const retrieved = tierZeroCache.get<typeof testData>('prop-101');
    const elapsedMs = performance.now() - t0;

    expect(retrieved).toEqual(testData);
    expect(elapsedMs).toBeLessThan(10); // Guarantee < 10ms execution
  });

  it('handles TTL expiration seamlessly', async () => {
    tierZeroCache.set('temp-key', 'expires-fast', 20); // 20ms
    expect(tierZeroCache.has('temp-key')).toBe(true);

    await new Promise(resolve => setTimeout(resolve, 35));

    expect(tierZeroCache.get('temp-key')).toBeNull();
    expect(tierZeroCache.has('temp-key')).toBe(false);
  });

  it('builds O(1) hash indices for instant lookups', () => {
    const properties = [
      { id: 'p1', code: 'PROP-001', location: 'Dubai Marina' },
      { id: 'p2', code: 'PROP-002', location: 'Downtown Dubai' },
      { id: 'p3', code: 'PROP-003', location: 'Palm Jumeirah' },
    ];

    tierZeroCache.buildIndex('props_by_code', properties, 'code');

    const found = tierZeroCache.lookupIndex<typeof properties[0]>('props_by_code', 'PROP-002');
    expect(found).not.toBeNull();
    expect(found?.location).toBe('Downtown Dubai');

    // Case-insensitive check
    const foundLower = tierZeroCache.lookupIndex<typeof properties[0]>('props_by_code', 'prop-003');
    expect(foundLower?.location).toBe('Palm Jumeirah');
  });

  it('tracks live hit/miss telemetry statistics accurately', () => {
    tierZeroCache.set('item-1', 'value-1');

    tierZeroCache.get('item-1'); // hit
    tierZeroCache.get('item-1'); // hit
    tierZeroCache.get('missing-item'); // miss

    const stats = tierZeroCache.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.hitRatio).toBeCloseTo(66.67, 1);
  });
});
