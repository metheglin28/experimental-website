import { useState } from 'react';
import clsx from 'clsx';
import { Modal } from '@/components/ui/Modal';
import { useFinanceStore } from '@/store/finance';
import { SWATCH_COLORS, SWATCH_DOT, type SwatchColor } from '@/lib/colors';

interface GoalFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function GoalFormModal({ open, onClose }: GoalFormModalProps) {
  const addGoal = useFinanceStore((s) => s.addGoal);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [color, setColor] = useState<SwatchColor>('honey');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(target);
    if (!name.trim() || !value || value <= 0) return;
    addGoal(name, value, color);
    setName('');
    setTarget('');
    setColor('honey');
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New savings goal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          autoFocus
          className="input"
          placeholder="e.g. Emergency fund, Trip to Japan…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
          Target amount
          <input
            type="number"
            min="0"
            step="0.01"
            className="input"
            placeholder="0.00"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </label>
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
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create goal
          </button>
        </div>
      </form>
    </Modal>
  );
}
