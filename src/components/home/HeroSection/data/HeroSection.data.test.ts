import { describe, it, expect } from 'vitest';
import { POPULAR_COMMUNITIES, HERO_DEFAULT_CONTENT } from './HeroSection.data';

describe('HeroSection.data', () => {
  it('exports popular communities and hero default content', () => {
    expect(POPULAR_COMMUNITIES.length).toBeGreaterThan(0);
    expect(POPULAR_COMMUNITIES).toContain('Palm Jumeirah');
    expect(HERO_DEFAULT_CONTENT.badge).toContain('White Caves');
    expect(HERO_DEFAULT_CONTENT.titleHighlight).toBe('Villas & Penthouses');
  });
});
