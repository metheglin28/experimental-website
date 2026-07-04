import { describe, expect, it } from 'vitest';
import { latinWordOfTheDay } from './latinWord';

describe('latinWordOfTheDay', () => {
  it('is deterministic for a given date', () => {
    const date = new Date(2026, 6, 4);
    expect(latinWordOfTheDay(date)).toEqual(latinWordOfTheDay(new Date(2026, 6, 4)));
  });

  it('rotates to a different word on a different day', () => {
    const a = latinWordOfTheDay(new Date(2026, 0, 1));
    const b = latinWordOfTheDay(new Date(2026, 0, 2));
    expect(a).not.toEqual(b);
  });

  it('wraps around after a year, landing on the same word', () => {
    const a = latinWordOfTheDay(new Date(2026, 0, 1));
    const b = latinWordOfTheDay(new Date(2027, 0, 1));
    expect(a).toEqual(b);
  });

  it('always returns a word with a translation', () => {
    const { word, translation } = latinWordOfTheDay(new Date(2026, 6, 4));
    expect(word.length).toBeGreaterThan(0);
    expect(translation.length).toBeGreaterThan(0);
  });
});
