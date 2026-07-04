import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore, EXPENSE_CATEGORIES, formatCurrency } from '@/store/finance';
import { SWATCH_DOT } from '@/lib/colors';

interface CategoryBreakdownProps {
  data: { category: string; total: number }[];
  currency: string;
}

export function CategoryBreakdown({ data, currency }: CategoryBreakdownProps) {
  const budgets = useFinanceStore((s) => s.budgets);
  const setBudget = useFinanceStore((s) => s.setBudget);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-ink-400">No expenses logged this month yet.</p>;
  }

  function commit(category: string) {
    const value = Number(draft);
    if (value >= 0) setBudget(category, value);
    setEditing(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map(({ category, total }) => {
        const color = EXPENSE_CATEGORIES.find((c) => c.name === category)?.color ?? 'honey';
        const budget = budgets[category];
        const pct = budget ? Math.min(100, Math.round((total / budget) * 100)) : null;
        const over = budget != null && total > budget;
        return (
          <div key={category} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-ink-700 dark:text-ink-200">
                <span className={clsx('h-2 w-2 rounded-full', SWATCH_DOT[color])} />
                {category}
              </span>
              <span className="flex items-center gap-1.5 text-ink-500">
                {formatCurrency(total, currency)}
                {editing === category ? (
                  <input
                    autoFocus
                    type="number"
                    min="0"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => commit(category)}
                    onKeyDown={(e) => e.key === 'Enter' && commit(category)}
                    className="w-16 rounded border border-ink-200 bg-white px-1 py-0.5 text-xs dark:border-ink-700 dark:bg-ink-900"
                  />
                ) : (
                  <button
                    onClick={() => {
                      setEditing(category);
                      setDraft(budget ? String(budget) : '');
                    }}
                    className="text-ink-300 hover:text-honey-600"
                    title="Set monthly budget"
                  >
                    {budget != null ? (
                      <span className={clsx('text-[11px]', over && 'font-medium text-ember-600 dark:text-ember-400')}>
                        / {formatCurrency(budget, currency)}
                      </span>
                    ) : (
                      <Pencil className="h-3 w-3" />
                    )}
                  </button>
                )}
                {editing === category && (
                  <button onMouseDown={(e) => e.preventDefault()} onClick={() => commit(category)}>
                    <Check className="h-3.5 w-3.5 text-moss-500" />
                  </button>
                )}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
              <div
                className={clsx('h-full rounded-full', over ? 'bg-ember-500' : SWATCH_DOT[color])}
                style={{ width: pct != null ? `${pct}%` : '100%', opacity: pct == null ? 0.35 : 1 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
