import { describe, it, expect } from 'vitest';
import { FEATURED_COMMUNITIES, CAROUSEL_TEXT } from './FeaturedCommunityCarousel.data';

describe('FeaturedCommunityCarousel.data', () => {
  it('exports valid community list and header text', () => {
    expect(FEATURED_COMMUNITIES.length).toBeGreaterThan(0);
    expect(FEATURED_COMMUNITIES[0].name).toBe('Palm Jumeirah');
    expect(CAROUSEL_TEXT.headerTitle).toBeDefined();
    expect(CAROUSEL_TEXT.badge).toContain('DLD');
  });
});
