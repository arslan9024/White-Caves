import { describe, it, expect } from 'vitest';
import * as styles from './LeadScoreBadge.style';

describe('LeadScoreBadge.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.BadgeRoot).toBeDefined();
    expect(styles.ScoreTier).toBeDefined();
    expect(styles.ScoreNum).toBeDefined();
    expect(styles.ScoreLabel).toBeDefined();
  });
});
