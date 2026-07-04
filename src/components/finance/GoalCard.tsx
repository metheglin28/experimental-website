import { useState } from 'react';
import { PartyPopper, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore, formatCurrency, type SavingsGoal } from '@/store/finance';
import { useSettingsStore } from '@/store/settings';
import { SWATCH_DOT } from '@/lib/colors';
import { celebrate } from '@/lib/celebrate';

export function GoalCard({ goal }: { goal: SavingsGoal }) {
  const contributeToGoal = useFinanceStore((s) => s.contributeToGoal);
  const deleteGoal = useFinanceStore((s) => s.deleteGoal);
  const currency = useSettingsStore((s) => s.currency);
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pct = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
  const complete = goal.savedAmount >= goal.targetAmount;

  function submitContribution(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value) return;
    const justCompleted = contributeToGoal(goal.id, value);
    if (justCompleted) celebrate();
    setAmount('');
    setAdding(false);
  }

  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={clsx('h-2.5 w-2.5 shrink-0 rounded-full', SWATCH_DOT[goal.color])} />
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-honey-50">{goal.name}</h3>
          {complete && <PartyPopper className="h-4 w-4 text-honey-500" />}
        </div>
        <button
          onClick={() => (confirmDelete ? deleteGoal(goal.id) : setConfirmDelete(true))}
          onBlur={() => setConfirmDelete(false)}
          className={clsx('icon-btn', confirmDelete && '!text-ember-600')}
          title={confirmDelete ? 'Click again to confirm' : 'Delete goal'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-ink-800 dark:text-ink-100">{formatCurrency(goal.savedAmount, currency)}</span>
          <span className="text-ink-400">of {formatCurrency(goal.targetAmount, currency)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
          <div
            className={clsx('h-full rounded-full transition-all', complete ? 'bg-moss-500' : SWATCH_DOT[goal.color])}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-ink-400">{pct}%</p>
      </div>

      {adding ? (
        <form onSubmit={submitContribution} className="flex gap-2">
          <input
            autoFocus
            type="number"
            step="0.01"
            className="input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => !amount && setAdding(false)}
          />
          <button type="submit" className="btn-primary shrink-0 px-3">
            Add
          </button>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-secondary justify-center">
          <Plus className="h-4 w-4" />
          Add funds
        </button>
      )}
    </div>
  );
}
