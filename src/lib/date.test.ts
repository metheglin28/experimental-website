import { describe, expect, it } from 'vitest';
import { addDays, addMonths, addYears, dayKey, daysBetween, formatFriendly, formatWeekday, greeting, isPast, isToday } from './date';

describe('dayKey', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(dayKey(new Date(2026, 6, 4))).toBe('2026-07-04');
  });

  it('pads single-digit months and days', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('addDays / addMonths / addYears', () => {
  it('adds and subtracts days across month boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('adds months, clamping via JS Date overflow rules', () => {
    expect(addMonths('2026-01-15', 1)).toBe('2026-02-15');
    expect(addMonths('2026-01-15', -1)).toBe('2025-12-15');
  });

  it('adds years', () => {
    expect(addYears('2026-07-04', 1)).toBe('2027-07-04');
  });
});

describe('daysBetween', () => {
  it('is positive when b is after a', () => {
    expect(daysBetween('2026-07-01', '2026-07-04')).toBe(3);
  });

  it('is negative when b is before a', () => {
    expect(daysBetween('2026-07-04', '2026-07-01')).toBe(-3);
  });

  it('is zero for the same day', () => {
    expect(daysBetween('2026-07-04', '2026-07-04')).toBe(0);
  });
});

describe('isToday / isPast', () => {
  it('recognizes today', () => {
    expect(isToday(dayKey())).toBe(true);
  });

  it('recognizes a past day', () => {
    expect(isPast(addDays(dayKey(), -1))).toBe(true);
    expect(isPast(addDays(dayKey(), 1))).toBe(false);
  });
});

describe('formatFriendly', () => {
  it('labels today, tomorrow, and yesterday relative to now', () => {
    const today = dayKey();
    expect(formatFriendly(today)).toBe('Today');
    expect(formatFriendly(addDays(today, 1))).toBe('Tomorrow');
    expect(formatFriendly(addDays(today, -1))).toBe('Yesterday');
  });
});

describe('formatWeekday', () => {
  it('returns the correct weekday label', () => {
    // 2026-07-04 is a Saturday.
    expect(formatWeekday('2026-07-04')).toBe('Sat');
  });
});

describe('greeting', () => {
  it('varies by hour of day', () => {
    expect(greeting(new Date(2026, 6, 4, 8))).toBe('Good morning');
    expect(greeting(new Date(2026, 6, 4, 14))).toBe('Good afternoon');
    expect(greeting(new Date(2026, 6, 4, 19))).toBe('Good evening');
    expect(greeting(new Date(2026, 6, 4, 23))).toBe('Good night');
    expect(greeting(new Date(2026, 6, 4, 2))).toBe('Burning the midnight oil');
  });
});
