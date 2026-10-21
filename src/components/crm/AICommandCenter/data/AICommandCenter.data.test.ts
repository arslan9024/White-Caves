import { describe, it, expect } from 'vitest';
import {
  COMMAND_CENTER_TEXT,
  DEPARTMENTS_DATA,
  ASSISTANTS_DATA,
  MOCK_STAFFING_ASSIGNMENTS,
} from './AICommandCenter.data';

describe('AICommandCenter.data', () => {
  it('exports valid UI text strings and registry data arrays', () => {
    expect(COMMAND_CENTER_TEXT.header.title).toBeTruthy();
    expect(COMMAND_CENTER_TEXT.stats.supervisorsLabel).toBeTruthy();
    expect(DEPARTMENTS_DATA.length).toBeGreaterThan(0);
    expect(ASSISTANTS_DATA.length).toBeGreaterThan(0);
    expect(MOCK_STAFFING_ASSIGNMENTS.length).toBeGreaterThan(0);
    expect(MOCK_STAFFING_ASSIGNMENTS.every(assignment => assignment.isMock)).toBe(true);
  });
});
