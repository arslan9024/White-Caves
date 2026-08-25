import { describe, it, expect } from 'vitest';
import * as styles from './BulkLeadActionToolbar.style';

describe('BulkLeadActionToolbar.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.ToolbarRoot).toBeDefined();
    expect(styles.Count).toBeDefined();
    expect(styles.ActionBtn).toBeDefined();
    expect(styles.Divider).toBeDefined();
  });
});
