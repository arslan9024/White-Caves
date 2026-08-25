import { describe, it, expect } from 'vitest';
import * as styles from './PwaInstallPromptModal.style';

describe('PwaInstallPromptModal.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.ModalOverlay).toBeDefined();
    expect(styles.ModalCard).toBeDefined();
    expect(styles.Handle).toBeDefined();
    expect(styles.AppIcon).toBeDefined();
    expect(styles.Title).toBeDefined();
  });
});
