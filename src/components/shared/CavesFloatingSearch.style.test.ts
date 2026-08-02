import { describe, it, expect } from 'vitest';
import * as styles from './CavesFloatingSearch.style';

describe('CavesFloatingSearch.style definitions', () => {
  it('exports valid styled components', () => {
    expect(styles.FloatingPillWrapper).toBeDefined();
    expect(styles.FloatingPillButton).toBeDefined();
  });
});
