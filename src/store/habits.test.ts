import { describe, expect, it } from 'vitest';
import { computeBestStreak, computeStreak, weeksGrid } from './habits';
import { addDays, dayKey } from '@/lib/date';

describe('computeStreak', () => {
  it('is zero with no checkins', () => {
    expect(computeStreak({})).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const today = dayKey();
    const checkins = {
      [today]: true,
      [addDays(today, -1)]: true,
      [addDays(today, -2)]: true,
    };
    expect(computeStreak(checkins)).toBe(3);
  });

  it('still counts the streak if today has not been checked in yet', () => {
    const today = dayKey();
    const checkins = {
      [addDays(today, -1)]: true,
      [addDays(today, -2)]: true,
    };
    expect(computeStreak(checkins)).toBe(2);
  });

  it('is zero once the streak is broken before yesterday', () => {
    const today = dayKey();
    const checkins = { [addDays(today, -2)]: true };
    expect(computeStreak(checkins)).toBe(0);
  });
});

describe('computeBestStreak', () => {
  it('finds the longest run of consecutive checked-in days', () => {
    const checkins = {
      '2026-01-01': true,
      '2026-01-02': true,
      '2026-01-03': true,
      '2026-01-05': true,
      '2026-01-06': true,
    };
    expect(computeBestStreak(checkins)).toBe(3);
  });

  it('is zero with no checkins', () => {
    expect(computeBestStreak({})).toBe(0);
  });
});

describe('weeksGrid', () => {
  it('produces the requested number of full 7-day weeks', () => {
    const grid = weeksGrid({}, 4);
    expect(grid).toHaveLength(4);
    grid.forEach((week) => expect(week).toHaveLength(7));
  });

  it('marks done days from the checkins map', () => {
    const today = dayKey();
    const grid = weeksGrid({ [today]: true }, 1);
    const todayCell = grid.flat().find((cell) => cell.day === today);
    expect(todayCell?.done).toBe(true);
  });
});
