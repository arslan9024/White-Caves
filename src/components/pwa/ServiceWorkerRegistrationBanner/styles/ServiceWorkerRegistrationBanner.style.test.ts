import { describe, it, expect } from 'vitest';
import * as styles from './ServiceWorkerRegistrationBanner.style';

describe('ServiceWorkerRegistrationBanner.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.BannerWrapper).toBeDefined();
    expect(styles.StatusDot).toBeDefined();
    expect(styles.StatusText).toBeDefined();
    expect(styles.BadgeRow).toBeDefined();
    expect(styles.Badge).toBeDefined();
    expect(styles.ActionButton).toBeDefined();
  });
});
