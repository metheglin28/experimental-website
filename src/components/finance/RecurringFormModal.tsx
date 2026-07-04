import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Modal } from '@/components/ui/Modal';
import { useFinanceStore, allCategories, type TxType, type Frequency, type RecurringItem } from '@/store/finance';
import { dayKey } from '@/lib/date';

const FREQUENCIES: Frequency[] = ['weekly', 'monthly', 'yearly'];

interface RecurringFormModalProps {
  open: boolean;
  onClose: () => void;
  item?: RecurringItem | null;
}

export function RecurringFormModal({ open, onClose, item }: RecurringFormModalProps) {
  const addRecurring = useFinanceStore((s) => s.addRecurring);
  const updateRecurring = useFinanceStore((s) => s.updateRecurring);
  const customCategories = useFinanceStore((s) => s.customCategories);

  const [name, setName] = useState('');
  const [type, setType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [nextDue, setNextDue] = useState(dayKey());

  const categories = allCategories(type, customCategories);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setName(item.name);
      setType(item.type);
      setAmount(String(item.amount));
      setCategory(item.category);
      setFrequency(item.frequency);
      setNextDue(item.nextDue);
    } else {
      setName('');
      setType('expense');
      setAmount('');
      setCategory(allCategories('expense', customCategories)[0].name);
      setFrequency('monthly');
      setNextDue(dayKey());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!name.trim() || !value || value <= 0) return;
    if (item) {
      updateRecurring(item.id, { name: name.trim(), type, amount: value, category, frequency, nextDue });
    } else {
      addRecurring({ name: name.trim(), type, amount: value, category, frequency, nextDue });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit recurring item' : 'New recurring item'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          autoFocus
          className="input"
          placeholder="e.g. Netflix, Rent, Paycheck…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
            Frequency
            <select className="input" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f} className="capitalize">
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <label className="flex flex-col gap-1 text-xs font-medium text-ink-500">
            Next due
            <input type="date" className="input" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
          </label>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {item ? 'Save changes' : 'Add recurring item'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
