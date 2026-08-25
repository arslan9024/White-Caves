import { describe, it, expect } from 'vitest';
import * as styles from './MobileKpiTileRow.style';

describe('MobileKpiTileRow.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.ScrollRow).toBeDefined();
    expect(styles.Tile).toBeDefined();
    expect(styles.TileIcon).toBeDefined();
    expect(styles.TileValue).toBeDefined();
    expect(styles.TileLabel).toBeDefined();
    expect(styles.DeltaBadge).toBeDefined();
  });
});
