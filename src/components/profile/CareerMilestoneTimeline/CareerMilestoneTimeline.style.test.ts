import { describe, it, expect } from 'vitest';
import * as styles from './CareerMilestoneTimeline.style';

describe('CareerMilestoneTimeline.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.TimelineWrapper).toBeDefined();
    expect(styles.TimelineLine).toBeDefined();
    expect(styles.MilestoneNode).toBeDefined();
  });
});
