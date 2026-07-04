import { useState } from 'react';
import { Check, Pencil, Trash2, Repeat } from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore, formatCurrency, colorForCategory, FREQUENCY_LABEL, type RecurringItem } from '@/store/finance';
import { useSettingsStore } from '@/store/settings';
import { SWATCH_DOT } from '@/lib/colors';
import { formatFriendly, isPast, dayKey, addDays } from '@/lib/date';
import { EmptyState } from '@/components/ui/EmptyState';

interface RecurringListProps {
  onEdit: (item: RecurringItem) => void;
}

export function RecurringList({ onEdit }: RecurringListProps) {
  const recurring = useFinanceStore((s) => s.recurring);
  const markRecurringPaid = useFinanceStore((s) => s.markRecurringPaid);
  const deleteRecurring = useFinanceStore((s) => s.deleteRecurring);
  const currency = useSettingsStore((s) => s.currency);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (recurring.length === 0) {
    return <EmptyState icon={Repeat} title="No recurring items" description="Track subscriptions, rent, or your paycheck so nothing sneaks up on you." />;
  }

  const sorted = [...recurring].sort((a, b) => (a.nextDue < b.nextDue ? -1 : 1));
  const today = dayKey();

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((item) => {
        const overdue = isPast(item.nextDue) && item.nextDue !== today;
        const dueSoon = !overdue && item.nextDue <= today;
        const dueWithinWeek = !overdue && !dueSoon && item.nextDue <= addDays(today, 7);
        return (
          <div key={item.id} className="card flex items-center gap-3 p-4">
            <span className={clsx('h-2.5 w-2.5 shrink-0 rounded-full', SWATCH_DOT[colorForCategory(item.category)])} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{item.name}</p>
              <p className="text-xs text-ink-400">
                {item.category} · {FREQUENCY_LABEL[item.frequency]}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className={clsx('text-sm font-medium', item.type === 'income' ? 'text-moss-600 dark:text-moss-400' : 'text-ink-700 dark:text-ink-200')}>
                {item.type === 'income' ? '+' : '-'}
                {formatCurrency(item.amount, currency)}
              </span>
              <span
                className={clsx(
                  'text-[11px]',
                  overdue || dueSoon
                    ? 'font-medium text-ember-600 dark:text-ember-400'
                    : dueWithinWeek
                      ? 'font-medium text-honey-600 dark:text-honey-400'
                      : 'text-ink-400',
                )}
              >
                {overdue ? 'Overdue · ' : dueSoon ? 'Due today · ' : ''}
                {formatFriendly(item.nextDue)}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => markRecurringPaid(item.id)}
                className="icon-btn hover:!bg-moss-500/15 hover:!text-moss-600"
                title="Mark paid & log transaction"
              >
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => onEdit(item)} className="icon-btn" title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => (confirmId === item.id ? deleteRecurring(item.id) : setConfirmId(item.id))}
                onBlur={() => setConfirmId(null)}
                className={clsx('icon-btn', confirmId === item.id && '!text-ember-600')}
                title={confirmId === item.id ? 'Click again to confirm' : 'Delete'}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
