import { describe, it, expect } from 'vitest';
import * as styles from './PullToRefreshWrapper.style';

describe('PullToRefreshWrapper.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.WrapperContainer).toBeDefined();
    expect(styles.PullIndicator).toBeDefined();
    expect(styles.SpinningIcon).toBeDefined();
    expect(styles.ContentShift).toBeDefined();
  });
});
