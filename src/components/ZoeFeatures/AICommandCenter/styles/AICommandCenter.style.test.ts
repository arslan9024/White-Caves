import { describe, it, expect } from 'vitest';
import * as styles from './AICommandCenter.style';

describe('AICommandCenter.style', () => {
  it('exports core styled components with valid IDs', () => {
    expect(styles.CommandCenterContainer).toBeDefined();
    expect(styles.HeaderBanner).toBeDefined();
    expect(styles.LiveBadge).toBeDefined();
    expect(styles.CommandCenterContainer.styledComponentId).toBeDefined();
    expect(styles.HeaderBanner.styledComponentId).toBeDefined();
    expect(styles.LiveBadge.styledComponentId).toBeDefined();
  });
});
