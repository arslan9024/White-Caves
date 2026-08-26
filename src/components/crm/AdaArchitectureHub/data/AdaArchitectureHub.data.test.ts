import { describe, it, expect } from 'vitest';
import { ADA_HUB_TEXT } from './AdaArchitectureHub.data';

describe('AdaArchitectureHub.data', () => {
  it('contains expected UI labels and translation tokens', () => {
    expect(ADA_HUB_TEXT.badge).toContain('ADA AI');
    expect(ADA_HUB_TEXT.title).toBe('Chief Architecture & Engineering Governance Hub');
    expect(ADA_HUB_TEXT.searchPlaceholder).toBeDefined();
    expect(ADA_HUB_TEXT.backBtn).toBe('← Back to Explorer');
    expect(ADA_HUB_TEXT.printBtn).toContain('Print');
  });
});
