import { describe, it, expect } from 'vitest';
import * as styles from './PropertyCard.style';

describe('PropertyCard.style', () => {
  it('exports styled component declarations', () => {
    expect(styles).toBeDefined();
    expect(Object.keys(styles).length).toBeGreaterThan(0);
  });
});
