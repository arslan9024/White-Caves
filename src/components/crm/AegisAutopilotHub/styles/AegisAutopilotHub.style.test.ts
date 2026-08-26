import { describe, it, expect } from 'vitest';
import * as styles from './AegisAutopilotHub.style';

describe('AegisAutopilotHub.style', () => {
  it('exports all necessary styled component wrappers', () => {
    expect(styles.Container).toBeDefined();
    expect(styles.HeaderBanner).toBeDefined();
    expect(styles.Badge).toBeDefined();
    expect(styles.Title).toBeDefined();
    expect(styles.Subtitle).toBeDefined();
    expect(styles.SearchInput).toBeDefined();
    expect(styles.CategoryPill).toBeDefined();
    expect(styles.DocsGrid).toBeDefined();
    expect(styles.DocCard).toBeDefined();
    expect(styles.ViewerOverlay).toBeDefined();
  });
});
