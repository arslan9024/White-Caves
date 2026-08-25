import { describe, it, expect } from 'vitest';
import * as styles from './HeroSection.style';

describe('HeroSection.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.HeroWrapper).toBeDefined();
    expect(styles.HeroContent).toBeDefined();
    expect(styles.BadgeTag).toBeDefined();
    expect(styles.HeroTitle).toBeDefined();
  });
});
