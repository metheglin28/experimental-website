import { useMemo, useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Scale, Trash2 } from 'lucide-react';
import { useFinanceStore, currentMonthKey, monthTotals, lastMonths, categoryBreakdown, formatCurrency, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/store/finance';
import { useSettingsStore, CURRENCIES } from '@/store/settings';
import { StatTile } from '@/components/ui/StatTile';
import { IncomeExpenseChart } from '@/components/finance/IncomeExpenseChart';
import { CategoryBreakdown } from '@/components/finance/CategoryBreakdown';
import { TransactionFormModal } from '@/components/finance/TransactionFormModal';
import { SWATCH_DOT } from '@/lib/colors';
import { formatFriendly, MONTH_LABELS } from '@/lib/date';

function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return `${MONTH_LABELS[m - 1]} '${String(y).slice(2)}`;
}

export function Finance() {
  const transactions = useFinanceStore((s) => s.transactions);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const [modalOpen, setModalOpen] = useState(false);

  const month = currentMonthKey();
  const { income, expense } = monthTotals(transactions, month);
  const net = income - expense;

  const chartData = useMemo(
    () =>
      lastMonths(6).map((m) => {
        const t = monthTotals(transactions, m);
        return { month: m, label: monthLabel(m), income: t.income, expense: t.expense };
      }),
    [transactions],
  );

  const breakdown = useMemo(() => categoryBreakdown(transactions, month, 'expense'), [transactions, month]);

  const recent = useMemo(
    () => transactions.filter((t) => t.day.slice(0, 7) === month).sort((a, b) => (a.day < b.day ? 1 : -1)).slice(0, 12),
    [transactions, month],
  );

  const categoryColor = (name: string, type: 'income' | 'expense') =>
    (type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).find((c) => c.name === name)?.color ?? 'honey';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile label="Income this month" value={formatCurrency(income, currency)} icon={TrendingUp} tone="positive" />
          <StatTile label="Expenses this month" value={formatCurrency(expense, currency)} icon={TrendingDown} tone="negative" />
          <StatTile label="Net" value={formatCurrency(net, currency)} icon={Scale} tone={net >= 0 ? 'positive' : 'negative'} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as (typeof CURRENCIES)[number])}
          className="input w-auto py-1.5 text-xs"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add transaction
        </button>
      </div>

      <div className="card p-5">
        <h3 className="mb-2 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Income vs. expenses</h3>
        <IncomeExpenseChart data={chartData} currency={currency} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">
            Spending by category — {monthLabel(month)}
          </h3>
          <CategoryBreakdown data={breakdown} currency={currency} />
        </div>

        <div className="card p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Recent transactions</h3>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">Nothing logged this month yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-200/70 dark:divide-ink-800/70">
              {recent.map((t) => (
                <div key={t.id} className="group flex items-center gap-3 py-2.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${SWATCH_DOT[categoryColor(t.category, t.type)]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink-800 dark:text-ink-100">{t.category}</p>
                    <p className="truncate text-xs text-ink-400">{t.note || formatFriendly(t.day)}</p>
                  </div>
                  <span className={`shrink-0 text-sm font-medium ${t.type === 'income' ? 'text-moss-600 dark:text-moss-400' : 'text-ink-600 dark:text-ink-300'}`}>
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount, currency)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="icon-btn shrink-0 opacity-0 group-hover:opacity-100 hover:!text-ember-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TransactionFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
