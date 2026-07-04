import { useMemo, useState } from 'react';
import { Download, Pencil, Search, Trash2, Wallet } from 'lucide-react';
import clsx from 'clsx';
import { useFinanceStore, formatCurrency, colorForCategory, exportTransactionsCsv, monthKey, type Transaction, type TxType } from '@/store/finance';
import { useSettingsStore } from '@/store/settings';
import { SWATCH_DOT } from '@/lib/colors';
import { formatFriendly, MONTH_LABELS } from '@/lib/date';
import { EmptyState } from '@/components/ui/EmptyState';

interface TransactionLedgerProps {
  onEdit: (t: Transaction) => void;
}

function monthOptionLabel(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return `${MONTH_LABELS[m - 1]} ${y}`;
}

export function TransactionLedger({ onEdit }: TransactionLedgerProps) {
  const transactions = useFinanceStore((s) => s.transactions);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const currency = useSettingsStore((s) => s.currency);

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TxType | 'all'>('all');
  const [monthFilter, setMonthFilter] = useState<'all' | string>('all');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => monthKey(t.day)));
    return [...set].sort().reverse();
  }, [transactions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions
      .filter((t) => typeFilter === 'all' || t.type === typeFilter)
      .filter((t) => monthFilter === 'all' || monthKey(t.day) === monthFilter)
      .filter((t) => !q || t.category.toLowerCase().includes(q) || t.note.toLowerCase().includes(q))
      .sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : a.createdAt < b.createdAt ? 1 : -1));
  }, [transactions, query, typeFilter, monthFilter]);

  const total = filtered.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="input flex flex-1 items-center gap-2 py-1.5 sm:max-w-xs">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search category or note…"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TxType | 'all')} className="input w-auto py-1.5 text-sm">
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="input w-auto py-1.5 text-sm">
          <option value="all">All time</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {monthOptionLabel(m)}
            </option>
          ))}
        </select>
        <button
          onClick={() => exportTransactionsCsv(filtered)}
          className="btn-secondary ml-auto"
          disabled={filtered.length === 0}
          title="Export the filtered transactions as CSV"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Wallet} title="No transactions match" description="Try a different search, type, or month." />
      ) : (
        <>
          <div className="card flex flex-col divide-y divide-ink-200/70 p-2 dark:divide-ink-800/70">
            {filtered.map((t) => (
              <div key={t.id} className="group flex items-center gap-3 px-3 py-2.5">
                <span className={clsx('h-2 w-2 shrink-0 rounded-full', SWATCH_DOT[colorForCategory(t.category)])} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-800 dark:text-ink-100">{t.category}</p>
                  <p className="truncate text-xs text-ink-400">{t.note || '—'}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-400">{formatFriendly(t.day)}</span>
                <span className={clsx('w-24 shrink-0 text-right text-sm font-medium', t.type === 'income' ? 'text-moss-600 dark:text-moss-400' : 'text-ink-600 dark:text-ink-300')}>
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount, currency)}
                </span>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => onEdit(t)} className="icon-btn" aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => (confirmId === t.id ? deleteTransaction(t.id) : setConfirmId(t.id))}
                    onBlur={() => setConfirmId(null)}
                    className={clsx('icon-btn', confirmId === t.id && '!text-ember-600')}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-right text-xs text-ink-400">
            {filtered.length} transaction{filtered.length === 1 ? '' : 's'} · net{' '}
            <span className={clsx('font-medium', total >= 0 ? 'text-moss-600 dark:text-moss-400' : 'text-ember-600 dark:text-ember-400')}>
              {formatCurrency(total, currency)}
            </span>
          </p>
        </>
      )}
    </div>
  );
}
