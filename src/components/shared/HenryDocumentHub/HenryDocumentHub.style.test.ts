import { describe, it, expect } from 'vitest';
import * as styles from './HenryDocumentHub.style';

describe('HenryDocumentHub.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.ModalOverlay).toBeDefined();
    expect(styles.WizardContainer).toBeDefined();
    expect(styles.WizardHeader).toBeDefined();
    expect(styles.StepProgressBar).toBeDefined();
  });
});
