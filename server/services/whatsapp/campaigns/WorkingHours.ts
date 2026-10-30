/**
 * Working hours window: daily allowed window for Linda outbound messaging.
 * Defaults to 09:00 - 20:00 (Asia/Dubai).
 */

export interface WorkingHoursConfig {
  startMinute: number;
  endMinute: number;
  timezone: string;
  isWithinHours: boolean;
}

const DEFAULTS = Object.freeze({ start: '09:00', end: '20:00', timezone: 'Asia/Dubai' });
const DAY_MINUTES = 24 * 60;

export function parseTime(value: string | undefined, allowEndOfDay = false): number | null {
  const match = /^(\d{1,2})(?::([0-5]\d))?$/.exec(String(value ?? '').trim());
  if (!match) return null;
  const minutes = Number(match[1]) * 60 + Number(match[2] || 0);
  const max = allowEndOfDay ? DAY_MINUTES : DAY_MINUTES - 1;
  return minutes <= max ? minutes : null;
}

export function isCurrentTimeWithinWorkingHours(
  startStr = DEFAULTS.start,
  endStr = DEFAULTS.end,
  timeZone = DEFAULTS.timezone,
  date = new Date(),
): boolean {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
    const currentMinute = hour * 60 + minute;

    const startMinute = parseTime(startStr) ?? 9 * 60;
    const endMinute = parseTime(endStr, true) ?? 20 * 60;

    if (startMinute <= endMinute) {
      return currentMinute >= startMinute && currentMinute < endMinute;
    } else {
      // Window crosses midnight
      return currentMinute >= startMinute || currentMinute < endMinute;
    }
  } catch {
    return true; // Fallback to allow if timezone parse fails
  }
}
