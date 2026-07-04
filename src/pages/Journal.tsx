import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useJournalStore, moodTrend, MOOD_EMOJI, MOOD_LABEL, type Mood } from '@/store/journal';
import { useHabitsStore } from '@/store/habits';
import { MiniCalendar } from '@/components/journal/MiniCalendar';
import { MoodChart } from '@/components/journal/MoodChart';
import { dayKey, formatLong } from '@/lib/date';
import { SWATCH_DOT } from '@/lib/colors';

const MOODS: Mood[] = [1, 2, 3, 4, 5];

export function Journal() {
  const entries = useJournalStore((s) => s.entries);
  const upsertEntry = useJournalStore((s) => s.upsertEntry);

  const [selected, setSelected] = useState(dayKey());
  const [content, setContent] = useState(entries[selected]?.content ?? '');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const day = searchParams.get('day');
    if (!day) return;
    setSelected(day);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('day');
        return next;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setContent(entries[selected]?.content ?? '');
    // Deliberately re-run only when switching days, not on every edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (content !== (entries[selected]?.content ?? '')) {
        upsertEntry(selected, { content });
      }
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const entry = entries[selected];
  const trend = moodTrend(entries, 30);
  const habits = useHabitsStore((s) => s.habits);
  const toggleCheckin = useHabitsStore((s) => s.toggleCheckin);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-6">
        <MiniCalendar entries={entries} selected={selected} onSelect={setSelected} />
        <div className="card p-4">
          <h3 className="mb-2 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Mood, last 30 days</h3>
          <MoodChart data={trend} />
        </div>
      </div>

      <div className="card flex flex-col gap-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Entry for</p>
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-honey-50">{formatLong(selected)}</h2>
        </div>

        <div className="flex items-center gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => upsertEntry(selected, { mood: entry?.mood === m ? null : m })}
              title={MOOD_LABEL[m]}
              className={clsx(
                'flex h-11 w-11 items-center justify-center rounded-full text-xl transition',
                entry?.mood === m
                  ? 'bg-honey-400/25 ring-2 ring-honey-500'
                  : 'bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700',
              )}
            >
              {MOOD_EMOJI[m]}
            </button>
          ))}
        </div>

        {habits.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Habits that day</p>
            <div className="flex flex-wrap gap-1.5">
              {habits.map((h) => {
                const done = !!h.checkins[selected];
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleCheckin(h.id, selected)}
                    className={clsx(
                      'chip inline-flex items-center gap-1.5',
                      done && '!bg-honey-400/25 !text-honey-800 dark:!text-honey-200',
                    )}
                  >
                    <span className={clsx('h-1.5 w-1.5 rounded-full', SWATCH_DOT[h.color])} />
                    {h.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What happened today? What are you grateful for? Write freely…"
          className="min-h-[300px] flex-1 resize-none rounded-xl border border-ink-200 bg-white/60 p-4 text-sm leading-relaxed text-ink-800 outline-none focus:border-honey-400 focus:ring-4 focus:ring-honey-400/15 dark:border-ink-700 dark:bg-ink-900/40 dark:text-ink-200"
        />
      </div>
    </div>
  );
}
