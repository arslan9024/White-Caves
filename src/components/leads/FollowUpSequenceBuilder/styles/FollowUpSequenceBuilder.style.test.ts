import { describe, it, expect } from 'vitest';
import * as styles from './FollowUpSequenceBuilder.style';

describe('FollowUpSequenceBuilder.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Root).toBeDefined();
    expect(styles.Title).toBeDefined();
    expect(styles.StepList).toBeDefined();
    expect(styles.Step).toBeDefined();
    expect(styles.DayBadge).toBeDefined();
    expect(styles.ChannelDot).toBeDefined();
    expect(styles.StepText).toBeDefined();
    expect(styles.RemoveBtn).toBeDefined();
    expect(styles.AddBtn).toBeDefined();
  });
});
