import { describe, it, expect } from 'vitest';
import * as styles from './TitleDeedVerificationPortal.style';

describe('TitleDeedVerificationPortal.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.Root).toBeDefined();
    expect(styles.SearchBtn).toBeDefined();
    expect(styles.Result).toBeDefined();
  });
});
