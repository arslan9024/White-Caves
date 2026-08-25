import { describe, it, expect } from 'vitest';
import * as styles from './FormADigitalGenerator.style';

describe('FormADigitalGenerator.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.Root).toBeDefined();
    expect(styles.GenerateBtn).toBeDefined();
    expect(styles.Preview).toBeDefined();
  });
});
