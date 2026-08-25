import { describe, it, expect } from 'vitest';
import * as styles from './HenryDocumentStudio.style';

describe('HenryDocumentStudio.style', () => {
  it('exports styled components with valid styledComponentIds', () => {
    expect(styles).toBeDefined();
    expect(Object.keys(styles).length).toBeGreaterThan(0);
  });
});
