import { describe, it, expect } from 'vitest';
import * as styles from './DocumentVersionHistory.style';

describe('DocumentVersionHistory.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.Root).toBeDefined();
    expect(styles.Sidebar).toBeDefined();
    expect(styles.Content).toBeDefined();
  });
});
