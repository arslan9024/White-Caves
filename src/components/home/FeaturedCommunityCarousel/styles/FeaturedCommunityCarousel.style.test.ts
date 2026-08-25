import { describe, it, expect } from 'vitest';
import * as styles from './FeaturedCommunityCarousel.style';

describe('FeaturedCommunityCarousel.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.CarouselWrapper).toBeDefined();
    expect(styles.CommunityGrid).toBeDefined();
  });
});
