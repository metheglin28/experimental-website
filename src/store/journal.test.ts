import { describe, expect, it } from 'vitest';
import { moodTrend, type JournalEntry } from './journal';
import { addDays, dayKey } from '@/lib/date';

function entry(day: string, mood: JournalEntry['mood']): JournalEntry {
  return { day, mood, content: '', updatedAt: new Date().toISOString() };
}

describe('moodTrend', () => {
  it('returns the requested number of days ending today', () => {
    const trend = moodTrend({}, 7);
    expect(trend).toHaveLength(7);
    expect(trend[6].day).toBe(dayKey());
  });

  it('fills in mood for days with an entry and null otherwise', () => {
    const today = dayKey();
    const entries = { [today]: entry(today, 4) };
    const trend = moodTrend(entries, 3);
    expect(trend[2]).toEqual({ day: today, mood: 4 });
    expect(trend[0].mood).toBeNull();
  });

  it('walks backward day by day from today', () => {
    const trend = moodTrend({}, 3);
    const today = dayKey();
    expect(trend.map((t) => t.day)).toEqual([addDays(today, -2), addDays(today, -1), today]);
  });
});
