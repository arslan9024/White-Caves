import { describe, it, expect } from 'vitest';
import * as styles from './MobileCRMBottomNav.style';

describe('MobileCRMBottomNav.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.NavBar).toBeDefined();
    expect(styles.NavItem).toBeDefined();
    expect(styles.NavLabel).toBeDefined();
    expect(styles.ActiveDot).toBeDefined();
  });
});
