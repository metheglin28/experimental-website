import { useState } from 'react';
import { Flame, Trophy, Trash2, Check } from 'lucide-react';
import clsx from 'clsx';
import { useHabitsStore, computeStreak, computeBestStreak, type Habit } from '@/store/habits';
import { HabitHeatmap } from './HabitHeatmap';
import { SWATCH_DOT, SWATCH_TEXT } from '@/lib/colors';
import { dayKey } from '@/lib/date';

export function HabitCard({ habit }: { habit: Habit }) {
  const toggleCheckin = useHabitsStore((s) => s.toggleCheckin);
  const deleteHabit = useHabitsStore((s) => s.deleteHabit);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const streak = computeStreak(habit.checkins);
  const best = computeBestStreak(habit.checkins);
  const doneToday = !!habit.checkins[dayKey()];

  return (
    <div className="card flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={clsx('h-2.5 w-2.5 shrink-0 rounded-full', SWATCH_DOT[habit.color])} />
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-honey-50">{habit.name}</h3>
        </div>
        <button
          onClick={() => (confirmDelete ? deleteHabit(habit.id) : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          className={clsx('icon-btn', confirmDelete && '!text-ember-600')}
          title={confirmDelete ? 'Click again to confirm' : 'Delete habit'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-ink-600 dark:text-ink-300">
          <Flame className={clsx('h-4 w-4', streak > 0 ? SWATCH_TEXT[habit.color] : 'text-ink-300')} />
          <span className="font-semibold">{streak}</span> day streak
        </span>
        <span className="inline-flex items-center gap-1.5 text-ink-400">
          <Trophy className="h-4 w-4" />
          best {best}
        </span>
      </div>

      <HabitHeatmap checkins={habit.checkins} color={habit.color} onToggle={(day) => toggleCheckin(habit.id, day)} />

      <button
        onClick={() => toggleCheckin(habit.id)}
        className={clsx(
          'btn justify-center',
          doneToday ? 'bg-honey-500/15 text-honey-700 dark:text-honey-300' : 'btn-primary',
        )}
      >
        <Check className="h-4 w-4" />
        {doneToday ? 'Done for today' : 'Mark today done'}
      </button>
    </div>
  );
}
