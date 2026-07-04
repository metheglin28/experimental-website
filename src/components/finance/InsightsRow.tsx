import { ArrowDown, ArrowUp, Minus, Tag, Gauge, Repeat } from 'lucide-react';
import clsx from 'clsx';
import {
  useFinanceStore,
  currentMonthKey,
  categoryBreakdown,
  averageDailySpend,
  monthOverMonthChange,
  monthlyEquivalent,
  formatCurrency,
} from '@/store/finance';
import { useSettingsStore } from '@/store/settings';

export function InsightsRow() {
  const transactions = useFinanceStore((s) => s.transactions);
  const recurring = useFinanceStore((s) => s.recurring);
  const currency = useSettingsStore((s) => s.currency);
  const month = currentMonthKey();

  const change = monthOverMonthChange(transactions, month, 'expense');
  const topCategory = categoryBreakdown(transactions, month, 'expense')[0];
  const avgDaily = averageDailySpend(transactions, month);
  const monthlyRecurring = recurring
    .filter((r) => r.active && r.type === 'expense')
    .reduce((sum, r) => sum + monthlyEquivalent(r), 0);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="card flex items-center gap-3.5 p-4">
        <div
          className={clsx(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            change == null ? 'bg-ink-100 text-ink-400 dark:bg-ink-800' : change > 0 ? 'bg-ember-400/15 text-ember-600 dark:text-ember-400' : 'bg-moss-400/15 text-moss-600 dark:text-moss-400',
          )}
        >
          {change == null ? <Minus className="h-5 w-5" /> : change > 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-400">Spending vs last month</p>
          <p className="truncate font-display text-lg font-semibold text-ink-900 dark:text-honey-50">
            {change == null ? 'No data yet' : `${change > 0 ? '+' : ''}${change.toFixed(0)}%`}
          </p>
        </div>
      </div>

      <div className="card flex items-center gap-3.5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-honey-400/15 text-honey-600 dark:text-honey-400">
          <Tag className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-400">Top category this month</p>
          <p className="truncate font-display text-lg font-semibold text-ink-900 dark:text-honey-50">
            {topCategory ? `${topCategory.category} · ${formatCurrency(topCategory.total, currency)}` : 'No spending yet'}
          </p>
        </div>
      </div>

      <div className="card flex items-center gap-3.5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/15 text-sky-600 dark:text-sky-400">
          <Gauge className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-400">Average daily spend</p>
          <p className="truncate font-display text-lg font-semibold text-ink-900 dark:text-honey-50">{formatCurrency(avgDaily, currency)}</p>
        </div>
      </div>

      {recurring.length > 0 && (
        <div className="card flex items-center gap-3.5 p-4 sm:col-span-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/15 text-violet-600 dark:text-violet-400">
            <Repeat className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-400">Recurring monthly burn</p>
            <p className="truncate font-display text-lg font-semibold text-ink-900 dark:text-honey-50">
              {formatCurrency(monthlyRecurring, currency)}
              <span className="ml-1.5 text-xs font-normal text-ink-400">across {recurring.filter((r) => r.active).length} items</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
