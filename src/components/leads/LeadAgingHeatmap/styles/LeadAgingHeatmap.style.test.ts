import { describe, it, expect } from 'vitest';
import * as styles from './LeadAgingHeatmap.style';

describe('LeadAgingHeatmap.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Root).toBeDefined();
    expect(styles.Title).toBeDefined();
    expect(styles.Grid).toBeDefined();
    expect(styles.Cell).toBeDefined();
    expect(styles.CellName).toBeDefined();
    expect(styles.CellDays).toBeDefined();
    expect(styles.CellLabel).toBeDefined();
    expect(styles.Legend).toBeDefined();
    expect(styles.LegendItem).toBeDefined();
  });
});
