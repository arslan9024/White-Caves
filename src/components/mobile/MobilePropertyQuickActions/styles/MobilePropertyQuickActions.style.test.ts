import { describe, it, expect } from 'vitest';
import * as styles from './MobilePropertyQuickActions.style';

describe('MobilePropertyQuickActions.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Overlay).toBeDefined();
    expect(styles.Sheet).toBeDefined();
    expect(styles.SheetHandle).toBeDefined();
    expect(styles.SheetTitle).toBeDefined();
    expect(styles.ActionsGrid).toBeDefined();
    expect(styles.ActionTile).toBeDefined();
  });
});
