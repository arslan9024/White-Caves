import { describe, it, expect } from 'vitest';
import * as styles from './OfflineSyncStatusIndicator.style';

describe('OfflineSyncStatusIndicator.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Pill).toBeDefined();
    expect(styles.SpinIcon).toBeDefined();
  });
});
