import { describe, it, expect } from 'vitest';
import * as styles from './ToolsDashboard.style';

describe('ToolsDashboard.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.DashboardContainer).toBeDefined();
    expect(styles.ThreeColumnGrid).toBeDefined();
    expect(styles.ToolCard).toBeDefined();
  });
});
