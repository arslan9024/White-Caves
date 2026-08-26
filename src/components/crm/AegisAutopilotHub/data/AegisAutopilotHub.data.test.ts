import { describe, it, expect } from 'vitest';
import { AEGIS_HUB_TEXT } from './AegisAutopilotHub.data';

describe('AegisAutopilotHub.data', () => {
  it('contains expected UI labels and translation tokens', () => {
    expect(AEGIS_HUB_TEXT.badge).toContain('AEGIS AI');
    expect(AEGIS_HUB_TEXT.title).toBe('AEGIS Autonomous Engineering & Autopilot Hub');
    expect(AEGIS_HUB_TEXT.searchPlaceholder).toBeDefined();
    expect(AEGIS_HUB_TEXT.backBtn).toBe('← Back to Explorer');
    expect(AEGIS_HUB_TEXT.printBtn).toContain('Print');
  });
});
