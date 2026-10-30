import { describe, it, expect } from 'vitest';
import { parseTime, isCurrentTimeWithinWorkingHours } from './WorkingHours';

describe('WorkingHours', () => {
  it('parses valid HH:MM into minutes', () => {
    expect(parseTime('09:00')).toBe(540);
    expect(parseTime('20:00')).toBe(1200);
  });

  it('determines if given time is within 09:00 to 20:00 window', () => {
    // 12:00 UTC is 16:00 in Asia/Dubai (+4), which is within working hours
    const midDay = new Date('2026-10-30T12:00:00Z');
    expect(isCurrentTimeWithinWorkingHours('09:00', '20:00', 'Asia/Dubai', midDay)).toBe(true);

    // 20:00 UTC is 00:00 (midnight) in Asia/Dubai (+4), which is outside working hours
    const midnight = new Date('2026-10-30T20:00:00Z');
    expect(isCurrentTimeWithinWorkingHours('09:00', '20:00', 'Asia/Dubai', midnight)).toBe(false);
  });
});

