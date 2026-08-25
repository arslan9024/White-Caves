import { describe, it, expect } from 'vitest';
import { AURORA_HUB_TEXT } from './AuroraSoftwareHub.data';

describe('AuroraSoftwareHub.data', () => {
  it('contains expected UI labels and translation tokens', () => {
    expect(AURORA_HUB_TEXT.badge).toContain('AURORA AI');
    expect(AURORA_HUB_TEXT.title).toBe('Software Engineering & Architecture Hub');
    expect(AURORA_HUB_TEXT.searchPlaceholder).toBeDefined();
    expect(AURORA_HUB_TEXT.backBtn).toBe('← Back to Specifications');
    expect(AURORA_HUB_TEXT.printBtn).toContain('Print');
  });
});
