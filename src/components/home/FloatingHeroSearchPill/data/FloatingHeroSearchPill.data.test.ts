import { describe, it, expect } from 'vitest';
import { SEARCH_TABS, PROPERTY_TYPES, PRICE_RANGES, SEARCH_PILL_TEXT } from './FloatingHeroSearchPill.data';

describe('FloatingHeroSearchPill.data', () => {
  it('exports search tabs, property types, and price ranges', () => {
    expect(SEARCH_TABS.length).toBeGreaterThan(0);
    expect(PROPERTY_TYPES.length).toBeGreaterThan(0);
    expect(PRICE_RANGES.length).toBeGreaterThan(0);
    expect(SEARCH_PILL_TEXT.locationPlaceholder).toContain('Palm Jumeirah');
  });
});
