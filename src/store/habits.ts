import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';
import { addDays, dayKey } from '@/lib/date';
import type { SwatchColor } from '@/lib/colors';

export interface Habit {
  id: string;
  name: string;
  color: SwatchColor;
  createdAt: string;
  checkins: Record<string, boolean>;
}

interface HabitsState {
  habits: Habit[];
  addHabit: (name: string, color: SwatchColor) => string;
  deleteHabit: (id: string) => void;
  renameHabit: (id: string, name: string) => void;
  toggleCheckin: (id: string, day?: string) => void;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],

      addHabit: (name, color) => {
        const id = createId();
        const habit: Habit = {
          id,
          name: name.trim() || 'New habit',
          color,
          createdAt: new Date().toISOString(),
          checkins: {},
        };
        set({ habits: [...get().habits, habit] });
        return id;
      },

      deleteHabit: (id) => set({ habits: get().habits.filter((h) => h.id !== id) }),

      renameHabit: (id, name) =>
        set({ habits: get().habits.map((h) => (h.id === id ? { ...h, name } : h)) }),

      toggleCheckin: (id, day = dayKey()) =>
        set({
          habits: get().habits.map((h) =>
            h.id === id
              ? { ...h, checkins: { ...h.checkins, [day]: !h.checkins[day] } }
              : h,
          ),
        }),
    }),
    { name: 'meadhall:habits' },
  ),
);

/** Current streak: consecutive checked-in days ending today, or ending
 * yesterday if today hasn't been checked yet (so the streak doesn't look
 * broken mid-day). */
export function computeStreak(checkins: Record<string, boolean>): number {
  let cursor = dayKey();
  if (!checkins[cursor]) {
    cursor = addDays(cursor, -1);
    if (!checkins[cursor]) return 0;
  }
  let streak = 0;
  while (checkins[cursor]) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function computeBestStreak(checkins: Record<string, boolean>): number {
  const days = Object.keys(checkins).filter((d) => checkins[d]).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of days) {
    if (prev && addDays(prev, 1) === day) run++;
    else run = 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/** Sun-Sat aligned grid of the last `weeks` weeks, ending on the current week's Saturday. */
export function weeksGrid(checkins: Record<string, boolean>, weeks = 18): { day: string; done: boolean }[][] {
  const today = dayKey();
  const [y, m, d] = today.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  const weekEnd = addDays(today, 6 - dow);
  let cursor = addDays(weekEnd, -(weeks * 7 - 1));

  const grid: { day: string; done: boolean }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: { day: string; done: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({ day: cursor, done: !!checkins[cursor] });
      cursor = addDays(cursor, 1);
    }
    grid.push(week);
  }
  return grid;
}
