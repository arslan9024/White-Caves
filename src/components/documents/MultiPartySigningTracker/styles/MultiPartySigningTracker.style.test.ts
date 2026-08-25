import { describe, it, expect } from 'vitest';
import * as styles from './MultiPartySigningTracker.style';

describe('MultiPartySigningTracker.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.Root).toBeDefined();
    expect(styles.SignerRow).toBeDefined();
    expect(styles.StatusChip).toBeDefined();
  });
});
