import { describe, it, expect } from 'vitest';
import * as styles from './LeadSourceAttributionChart.style';

describe('LeadSourceAttributionChart.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Root).toBeDefined();
    expect(styles.Title).toBeDefined();
    expect(styles.Row).toBeDefined();
    expect(styles.SourceLabel).toBeDefined();
    expect(styles.Bar).toBeDefined();
    expect(styles.BarTrack).toBeDefined();
    expect(styles.Count).toBeDefined();
    expect(styles.Pct).toBeDefined();
  });
});
