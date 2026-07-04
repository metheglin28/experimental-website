import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Modal } from '@/components/ui/Modal';
import { useFinanceStore, allCategories, type TxType, type Transaction } from '@/store/finance';
import { dayKey } from '@/lib/date';

const ADD_NEW = '__add_new__';

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  defaultType?: TxType;
}

export function TransactionFormModal({ open, onClose, transaction, defaultType }: TransactionFormModalProps) {
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const updateTransaction = useFinanceStore((s) => s.updateTransaction);
  const addCustomCategory = useFinanceStore((s) => s.addCustomCategory);
  const customCategories = useFinanceStore((s) => s.customCategories);

  const [type, setType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [day, setDay] = useState(dayKey());
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const categories = allCategories(type, customCategories);

  useEffect(() => {
    if (!open) return;
    setAddingCategory(false);
    setNewCategoryName('');
    if (transaction) {
      setType(transaction.type);
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setNote(transaction.note);
      setDay(transaction.day);
    } else {
      const t = defaultType ?? 'expense';
      setType(t);
      setAmount('');
      setCategory(allCategories(t, customCategories)[0].name);
      setNote('');
      setDay(dayKey());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transaction, defaultType]);

  function handleCategoryChange(value: string) {
    if (value === ADD_NEW) {
      setAddingCategory(true);
      return;
    }
    setCategory(value);
  }

  function commitNewCategory() {
    if (newCategoryName.trim()) {
      addCustomCategory(type, newCategoryName.trim());
      setCategory(newCategoryName.trim());
    }
    setAddingCategory(false);
    setNewCategoryName('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0 || !category) return;
    if (transaction) {
      updateTransaction(transaction.id, { type, amount: value, category, note, day });
    } else {
      addTransaction({ type, amount: value, category, note, day });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={transaction ? 'Edit transaction' : 'New transaction'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-1 rounded-xl border border-ink-200 p-1 dark:border-ink-800">
          {(['expense', 'income'] as TxType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setCategory(allCategories(t, customCategories)[0].name);
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
          {addingCategory ? (
            <div className="flex gap-2">
              <input
                autoFocus
                className="input"
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitNewCategory();
                  }
                }}
              />
              <button type="button" onClick={commitNewCategory} className="btn-secondary shrink-0 px-3">
                Add
              </button>
            </div>
          ) : (
            <select className="input" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value={ADD_NEW}>+ Add new category…</option>
            </select>
          )}
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
            {transaction ? 'Save changes' : 'Add transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
