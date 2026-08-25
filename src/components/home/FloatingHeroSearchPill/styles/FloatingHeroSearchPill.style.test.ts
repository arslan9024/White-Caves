import { describe, it, expect } from 'vitest';
import * as styles from './FloatingHeroSearchPill.style';

describe('FloatingHeroSearchPill.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.Container).toBeDefined();
    expect(styles.SearchGrid).toBeDefined();
    expect(styles.TabBtn).toBeDefined();
  });
});
