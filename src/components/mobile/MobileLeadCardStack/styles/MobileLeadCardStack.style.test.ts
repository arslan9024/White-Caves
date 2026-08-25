import { describe, it, expect } from 'vitest';
import * as styles from './MobileLeadCardStack.style';

describe('MobileLeadCardStack.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.StackWrapper).toBeDefined();
    expect(styles.Card).toBeDefined();
    expect(styles.StageBadge).toBeDefined();
    expect(styles.LeadName).toBeDefined();
    expect(styles.Meta).toBeDefined();
    expect(styles.ActionRow).toBeDefined();
  });
});
