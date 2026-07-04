import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Modal } from '@/components/ui/Modal';
import { useFinanceStore, EXPENSE_CATEGORIES, INCOME_CATEGORIES, type TxType } from '@/store/finance';
import { dayKey } from '@/lib/date';

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function TransactionFormModal({ open, onClose }: TransactionFormModalProps) {
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const [type, setType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [note, setNote] = useState('');
  const [day, setDay] = useState(dayKey());

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  useEffect(() => {
    if (open) {
      setType('expense');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0].name);
      setNote('');
      setDay(dayKey());
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    addTransaction({ type, amount: value, category, note, day });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New transaction">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-1 rounded-xl border border-ink-200 p-1 dark:border-ink-800">
          {(['expense', 'income'] as TxType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setCategory((t === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0].name);
              }}
              className={clsx(
                'flex-1 rounded-lg py-1.5 text-sm font-medium capitalize transition',
                type === t ? 'bg-honey-400/20 text-honey-800 dark:text-honey-200' : 'text-ink-400',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
            Amount
            <input
              autoFocus
              type="number"
              min="0"
              step="0.01"
              className="input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
            Date
            <input type="date" className="input" value={day} onChange={(e) => setDay(e.target.value)} />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
          Category
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <input
          className="input"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add transaction
          </button>
        </div>
      </form>
    </Modal>
  );
}
