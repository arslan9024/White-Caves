import { describe, it, expect } from 'vitest';
import * as styles from './TopNavbar.style';

describe('TopNavbar.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.NavHeaderContainer).toBeDefined();
    expect(styles.OverhangingLogoWrapper).toBeDefined();
    expect(styles.OverhangingLogoBadge).toBeDefined();
    expect(styles.ThemeToggleButton).toBeDefined();
  });
});
