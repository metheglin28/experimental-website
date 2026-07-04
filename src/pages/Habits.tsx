import { useState } from 'react';
import { Flame, Plus } from 'lucide-react';
import { useHabitsStore } from '@/store/habits';
import { HabitCard } from '@/components/habits/HabitCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { SWATCH_COLORS, SWATCH_DOT, type SwatchColor } from '@/lib/colors';
import clsx from 'clsx';

export function Habits() {
  const habits = useHabitsStore((s) => s.habits);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState<SwatchColor>('honey');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit(name, color);
    setName('');
    setColor('honey');
    setModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">
          {habits.length} ritual{habits.length === 1 ? '' : 's'} in progress
        </p>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          New habit
        </button>
      </div>

      {habits.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No habits yet"
          description="Start a daily ritual — even small ones compound into streaks."
          action={
            <button onClick={() => setModalOpen(true)} className="btn-primary mt-1">
              <Plus className="h-4 w-4" /> New habit
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {habits.map((h) => (
            <HabitCard key={h.id} habit={h} />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New habit">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            autoFocus
            className="input"
            placeholder="e.g. Drink water, Read 10 pages…"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex items-center gap-2">
            {SWATCH_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={clsx(
                  'h-7 w-7 rounded-full ring-offset-2 ring-offset-white transition dark:ring-offset-ink-900',
                  SWATCH_DOT[c],
                  color === c && 'ring-2 ring-ink-900 dark:ring-honey-50',
                )}
                aria-label={c}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create habit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
