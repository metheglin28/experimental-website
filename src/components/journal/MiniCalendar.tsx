import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { dayKey, monthLabel } from '@/lib/date';
import type { JournalEntry, Mood } from '@/store/journal';
import { MOOD_EMOJI } from '@/store/journal';

const MOOD_DOT: Record<Mood, string> = {
  1: 'bg-ember-500',
  2: 'bg-honey-300',
  3: 'bg-honey-400',
  4: 'bg-moss-400',
  5: 'bg-moss-500',
};

interface MiniCalendarProps {
  entries: Record<string, JournalEntry>;
  selected: string;
  onSelect: (day: string) => void;
}

export function MiniCalendar({ entries, selected, onSelect }: MiniCalendarProps) {
  const [y, m] = selected.split('-').map(Number);
  const [viewYear, setViewYear] = useState(y);
  const [viewMonth, setViewMonth] = useState(m - 1);

  const first = new Date(viewYear, viewMonth, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = dayKey();

  const cells: (number | null)[] = [...Array(startDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function goto(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function keyFor(dom: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dom).padStart(2, '0')}`;
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={() => goto(-1)} className="icon-btn">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{monthLabel(viewYear, viewMonth)}</span>
        <button onClick={() => goto(1)} className="icon-btn">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-ink-400">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((dom, i) => {
          if (dom == null) return <div key={i} />;
          const key = keyFor(dom);
          const entry = entries[key];
          const isSelected = key === selected;
          const isToday = key === today;
          return (
            <button
              key={i}
              onClick={() => onSelect(key)}
              className={clsx(
                'relative flex aspect-square items-center justify-center rounded-lg text-xs transition',
                isSelected
                  ? 'bg-honey-500 font-semibold text-white'
                  : isToday
                    ? 'font-semibold text-honey-600 ring-1 ring-honey-400 dark:text-honey-400'
                    : 'text-ink-600 hover:bg-ink-900/5 dark:text-ink-300 dark:hover:bg-white/5',
              )}
            >
              {entry?.mood ? (
                <span className="text-sm leading-none" title={MOOD_EMOJI[entry.mood]}>
                  {MOOD_EMOJI[entry.mood]}
                </span>
              ) : (
                dom
              )}
              {entry?.mood && !isSelected && (
                <span className={clsx('absolute bottom-0.5 h-1 w-1 rounded-full', MOOD_DOT[entry.mood])} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
