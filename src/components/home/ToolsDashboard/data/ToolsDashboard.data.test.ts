import { describe, it, expect } from 'vitest';
import { TOOLS_TEXT, DEFAULT_TOOL_VALUES } from './ToolsDashboard.data';

describe('ToolsDashboard.data', () => {
  it('exports tools text and default calculation values', () => {
    expect(TOOLS_TEXT.headerTitle).toContain('Dubai Real Estate Tools');
    expect(DEFAULT_TOOL_VALUES.propertyPrice).toBe(2500000);
    expect(DEFAULT_TOOL_VALUES.downPaymentPercent).toBe(20);
    expect(DEFAULT_TOOL_VALUES.interestRate).toBe(4.25);
  });
});
