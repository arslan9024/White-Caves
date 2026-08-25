import { describe, it, expect } from 'vitest';
import * as styles from './LeadImportCsvWizard.style';

describe('LeadImportCsvWizard.style', () => {
  it('exports all necessary styled components', () => {
    expect(styles.Root).toBeDefined();
    expect(styles.StepIndicator).toBeDefined();
    expect(styles.StepDot).toBeDefined();
    expect(styles.Title).toBeDefined();
    expect(styles.DropZone).toBeDefined();
    expect(styles.MapRow).toBeDefined();
    expect(styles.MapLabel).toBeDefined();
    expect(styles.Arrow).toBeDefined();
    expect(styles.MapSelect).toBeDefined();
    expect(styles.ImportBtn).toBeDefined();
    expect(styles.SuccessBanner).toBeDefined();
  });
});
