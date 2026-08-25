import { describe, it, expect } from 'vitest';
import { ANIMATED_HEADLINE_DATA } from './AnimatedHeadlineGradient.data';

describe('AnimatedHeadlineGradient.data', () => {
  it('exports valid default title string', () => {
    expect(ANIMATED_HEADLINE_DATA).toBeDefined();
    expect(ANIMATED_HEADLINE_DATA.defaultTitle).toContain('Dubai Luxury Real Estate');
  });
});
