import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';
import { dayKey, addDays } from '@/lib/date';

export type Phase = 'focus' | 'short-break' | 'long-break';

export interface FocusSession {
  id: string;
  phase: Phase;
  minutes: number;
  completedAt: string;
  day: string;
}

interface FocusState {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
  sessions: FocusSession[];
  setDurations: (patch: Partial<Pick<FocusState, 'focusMinutes' | 'shortBreakMinutes' | 'longBreakMinutes' | 'sessionsUntilLongBreak'>>) => void;
  logSession: (phase: Phase, minutes: number) => void;
  clearHistory: () => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      focusMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      sessionsUntilLongBreak: 4,
      sessions: [],

      setDurations: (patch) => set(patch),

      logSession: (phase, minutes) =>
        set({
          sessions: [
            ...get().sessions,
            { id: createId(), phase, minutes, completedAt: new Date().toISOString(), day: dayKey() },
          ],
        }),

      clearHistory: () => set({ sessions: [] }),
    }),
    { name: 'meadhall:focus' },
  ),
);

export function focusMinutesByDay(sessions: FocusSession[], days = 7): { day: string; minutes: number }[] {
  const today = dayKey();
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) keys.push(addDays(today, -i));
  const totals = new Map(keys.map((k) => [k, 0]));
  for (const s of sessions) {
    if (s.phase === 'focus' && totals.has(s.day)) {
      totals.set(s.day, (totals.get(s.day) ?? 0) + s.minutes);
    }
  }
  return keys.map((day) => ({ day, minutes: totals.get(day) ?? 0 }));
}
