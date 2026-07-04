import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dayKey, addDays } from '@/lib/date';

export type Mood = 1 | 2 | 3 | 4 | 5;

export interface JournalEntry {
  day: string;
  mood: Mood | null;
  content: string;
  updatedAt: string;
}

interface JournalState {
  entries: Record<string, JournalEntry>;
  upsertEntry: (day: string, patch: Partial<Pick<JournalEntry, 'mood' | 'content'>>) => void;
  deleteEntry: (day: string) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: {},

      upsertEntry: (day, patch) => {
        const existing = get().entries[day];
        set({
          entries: {
            ...get().entries,
            [day]: {
              day,
              mood: existing?.mood ?? null,
              content: existing?.content ?? '',
              ...patch,
              updatedAt: new Date().toISOString(),
            },
          },
        });
      },

      deleteEntry: (day) => {
        const { [day]: _removed, ...rest } = get().entries;
        set({ entries: rest });
      },
    }),
    { name: 'meadhall:journal' },
  ),
);

export const MOOD_EMOJI: Record<Mood, string> = {
  1: '😞',
  2: '🙁',
  3: '😐',
  4: '🙂',
  5: '😄',
};

export const MOOD_LABEL: Record<Mood, string> = {
  1: 'Awful',
  2: 'Rough',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

export function moodTrend(entries: Record<string, JournalEntry>, days = 30): { day: string; mood: number | null }[] {
  const today = dayKey();
  const out: { day: string; mood: number | null }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = addDays(today, -i);
    out.push({ day: key, mood: entries[key]?.mood ?? null });
  }
  return out;
}
