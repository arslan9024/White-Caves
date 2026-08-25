import { describe, it, expect } from 'vitest';
import * as styles from './MobileDashboardPage.style';

describe('MobileDashboardPage.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.PageRoot).toBeDefined();
    expect(styles.HeaderBar).toBeDefined();
    expect(styles.HeaderTop).toBeDefined();
    expect(styles.GreetingText).toBeDefined();
    expect(styles.DateText).toBeDefined();
    expect(styles.NotifBadge).toBeDefined();
    expect(styles.NotifDot).toBeDefined();
  });
});
