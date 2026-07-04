import clsx from 'clsx';
import { weeksGrid } from '@/store/habits';
import { formatLong, dayKey } from '@/lib/date';
import type { SwatchColor } from '@/lib/colors';

const DONE_BG: Record<SwatchColor, string> = {
  honey: 'bg-honey-500',
  ember: 'bg-ember-500',
  moss: 'bg-moss-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
};

interface HabitHeatmapProps {
  checkins: Record<string, boolean>;
  color: SwatchColor;
  weeks?: number;
  onToggle?: (day: string) => void;
}

export function HabitHeatmap({ checkins, color, weeks = 18, onToggle }: HabitHeatmapProps) {
  const grid = weeksGrid(checkins, weeks);
  const today = dayKey();

  return (
    <div className="flex gap-[3px] overflow-x-auto py-1">
      {grid.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map(({ day, done }) => {
            const future = day > today;
            return (
              <button
                key={day}
                type="button"
                disabled={future}
                onClick={() => onToggle?.(day)}
                title={`${formatLong(day)} — ${done ? 'done' : 'not done'}`}
                className={clsx(
                  'h-2.5 w-2.5 rounded-[3px] transition-transform',
                  future
                    ? 'invisible'
                    : done
                      ? `${DONE_BG[color]} hover:scale-125`
                      : 'bg-ink-100 hover:scale-125 dark:bg-ink-800',
                  onToggle && !future && 'cursor-pointer',
                )}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
