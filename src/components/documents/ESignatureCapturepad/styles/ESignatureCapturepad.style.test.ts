import { describe, it, expect } from 'vitest';
import * as styles from './ESignatureCapturepad.style';

describe('ESignatureCapturepad.style', () => {
  it('exports styled components with valid structure', () => {
    expect(styles).toBeDefined();
    expect(styles.Root).toBeDefined();
    expect(styles.Canvas).toBeDefined();
    expect(styles.SaveBtn).toBeDefined();
  });
});
