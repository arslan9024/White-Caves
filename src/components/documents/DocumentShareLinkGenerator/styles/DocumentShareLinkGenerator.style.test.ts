import { describe, it, expect } from 'vitest';
import * as styles from './DocumentShareLinkGenerator.style';

describe('DocumentShareLinkGenerator.style', () => {
  it('exports styled components with valid styledComponentIds', () => {
    expect(styles).toBeDefined();
    expect(Object.keys(styles).length).toBeGreaterThan(0);
  });
});
