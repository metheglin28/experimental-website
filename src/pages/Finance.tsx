import { useMemo, useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Scale, ArrowRight, Repeat } from 'lucide-react';
import clsx from 'clsx';
import {
  useFinanceStore,
  currentMonthKey,
  monthTotals,
  lastMonths,
  categoryBreakdown,
  formatCurrency,
  colorForCategory,
  FREQUENCY_LABEL,
  type Transaction,
  type RecurringItem,
} from '@/store/finance';
import { useSettingsStore } from '@/store/settings';
import { StatTile } from '@/components/ui/StatTile';
import { IncomeExpenseChart } from '@/components/finance/IncomeExpenseChart';
import { CategoryBreakdown } from '@/components/finance/CategoryBreakdown';
import { TransactionFormModal } from '@/components/finance/TransactionFormModal';
import { TransactionLedger } from '@/components/finance/TransactionLedger';
import { RecurringList } from '@/components/finance/RecurringList';
import { RecurringFormModal } from '@/components/finance/RecurringFormModal';
import { GoalsList } from '@/components/finance/GoalsList';
import { GoalFormModal } from '@/components/finance/GoalFormModal';
import { InsightsRow } from '@/components/finance/InsightsRow';
import { SWATCH_DOT } from '@/lib/colors';
import { formatFriendly, MONTH_LABELS } from '@/lib/date';

type Tab = 'overview' | 'ledger' | 'recurring' | 'goals';
const RANGE_OPTIONS = [3, 6, 12] as const;

function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return `${MONTH_LABELS[m - 1]} '${String(y).slice(2)}`;
}

export function Finance() {
  const transactions = useFinanceStore((s) => s.transactions);
  const recurring = useFinanceStore((s) => s.recurring);
  const currency = useSettingsStore((s) => s.currency);

  const [tab, setTab] = useState<Tab>('overview');
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>(6);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringItem | null>(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  const month = currentMonthKey();
  const { income, expense } = monthTotals(transactions, month);
  const net = income - expense;

  const chartData = useMemo(
    () =>
      lastMonths(range).map((m) => {
        const t = monthTotals(transactions, m);
        return { month: m, label: monthLabel(m), income: t.income, expense: t.expense };
      }),
    [transactions, range],
  );

  const breakdown = useMemo(() => categoryBreakdown(transactions, month, 'expense'), [transactions, month]);

  const upcomingRecurring = useMemo(
    () => [...recurring].filter((r) => r.active).sort((a, b) => (a.nextDue < b.nextDue ? -1 : 1)).slice(0, 3),
    [recurring],
  );

  function openEditTx(t: Transaction) {
    setEditingTx(t);
    setTxModalOpen(true);
  }

  function openEditRecurring(r: RecurringItem) {
    setEditingRecurring(r);
    setRecurringModalOpen(true);
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'ledger', label: 'All Transactions' },
    { id: 'recurring', label: 'Recurring' },
    { id: 'goals', label: 'Goals' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-ink-200 p-1 dark:border-ink-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                tab === t.id ? 'bg-honey-400/20 text-honey-800 dark:text-honey-200' : 'text-ink-400 hover:text-ink-600 dark:hover:text-ink-200',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <button
            onClick={() => {
              setEditingTx(null);
              setTxModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            Add transaction
          </button>
        )}
        {tab === 'recurring' && (
          <button
            onClick={() => {
              setEditingRecurring(null);
              setRecurringModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            Add recurring item
          </button>
        )}
        {tab === 'goals' && (
          <button onClick={() => setGoalModalOpen(true)} className="btn-primary">
            <Plus className="h-4 w-4" />
            New goal
          </button>
        )}
      </div>

      {tab === 'overview' && (
        <div className="flex flex-col gap-6">
          <InsightsRow />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatTile label="Income this month" value={formatCurrency(income, currency)} icon={TrendingUp} tone="positive" />
            <StatTile label="Expenses this month" value={formatCurrency(expense, currency)} icon={TrendingDown} tone="negative" />
            <StatTile label="Net" value={formatCurrency(net, currency)} icon={Scale} tone={net >= 0 ? 'positive' : 'negative'} />
          </div>

          <div className="card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Income vs. expenses</h3>
              <div className="flex gap-1 rounded-lg border border-ink-200 p-0.5 text-xs dark:border-ink-800">
                {RANGE_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={clsx(
                      'rounded-md px-2 py-1 font-medium transition',
                      range === r ? 'bg-honey-400/20 text-honey-800 dark:text-honey-200' : 'text-ink-400',
                    )}
                  >
                    {r}mo
                  </button>
                ))}
              </div>
            </div>
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
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Upcoming bills</h3>
                {recurring.length > 0 && (
                  <button onClick={() => setTab('recurring')} className="inline-flex items-center gap-1 text-xs text-honey-600 hover:underline dark:text-honey-400">
                    View all <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
              {upcomingRecurring.length === 0 ? (
                <p className="py-6 text-center text-sm text-ink-400">No recurring items tracked yet.</p>
              ) : (
                <div className="flex flex-col divide-y divide-ink-200/70 dark:divide-ink-800/70">
                  {upcomingRecurring.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 py-2.5">
                      <span className={clsx('h-2 w-2 shrink-0 rounded-full', SWATCH_DOT[colorForCategory(r.category)])} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink-700 dark:text-ink-200">{r.name}</p>
                        <p className="text-xs text-ink-400">{FREQUENCY_LABEL[r.frequency]}</p>
                      </div>
                      <span className="shrink-0 text-xs text-ink-400">{formatFriendly(r.nextDue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'ledger' && <TransactionLedger onEdit={openEditTx} />}

      {tab === 'recurring' && (
        <>
          {recurring.length === 0 ? (
            <RecurringList onEdit={openEditRecurring} />
          ) : (
            <>
              <p className="text-sm text-ink-500">
                <Repeat className="mr-1.5 inline h-3.5 w-3.5" />
                Mark an item paid to log it as a transaction and roll its due date forward automatically.
              </p>
              <RecurringList onEdit={openEditRecurring} />
            </>
          )}
        </>
      )}

      {tab === 'goals' && <GoalsList />}

      <TransactionFormModal
        open={txModalOpen}
        onClose={() => {
          setTxModalOpen(false);
          setEditingTx(null);
        }}
        transaction={editingTx}
      />
      <RecurringFormModal
        open={recurringModalOpen}
        onClose={() => {
          setRecurringModalOpen(false);
          setEditingRecurring(null);
        }}
        item={editingRecurring}
      />
      <GoalFormModal open={goalModalOpen} onClose={() => setGoalModalOpen(false)} />
    </div>
  );
}
