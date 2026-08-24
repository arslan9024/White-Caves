import { describe, it, expect } from 'vitest';
import { LEADERBOARD_TEXT, LEVEL_LABELS, LEVEL_COLORS } from './EmployeeLeaderboardPanel.data';

describe('EmployeeLeaderboardPanel.data', () => {
  it('exports valid UI labels and level colors', () => {
    expect(LEADERBOARD_TEXT.headerTitle).toBeTruthy();
    expect(LEVEL_LABELS[5]).toBe('MANAGING DIRECTOR');
    expect(LEVEL_COLORS[4]).toBe('#EF4444');
  });
});
