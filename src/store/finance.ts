import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';
import { dayKey, addDays, addMonths, addYears } from '@/lib/date';
import { SWATCH_COLORS, type SwatchColor } from '@/lib/colors';

export type TxType = 'income' | 'expense';
export type Frequency = 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  note: string;
  day: string;
  createdAt: string;
}

export interface RecurringItem {
  id: string;
  name: string;
  type: TxType;
  amount: number;
  category: string;
  frequency: Frequency;
  nextDue: string;
  active: boolean;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  color: SwatchColor;
  createdAt: string;
}

export const EXPENSE_CATEGORIES: { name: string; color: SwatchColor }[] = [
  { name: 'Food', color: 'honey' },
  { name: 'Housing', color: 'ember' },
  { name: 'Transport', color: 'moss' },
  { name: 'Shopping', color: 'sky' },
  { name: 'Entertainment', color: 'violet' },
  { name: 'Health', color: 'rose' },
  { name: 'Bills', color: 'honey' },
  { name: 'Other', color: 'ember' },
];

export const INCOME_CATEGORIES: { name: string; color: SwatchColor }[] = [
  { name: 'Salary', color: 'moss' },
  { name: 'Freelance', color: 'honey' },
  { name: 'Gift', color: 'violet' },
  { name: 'Investment', color: 'sky' },
  { name: 'Other', color: 'ember' },
];

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

interface FinanceState {
  transactions: Transaction[];
  budgets: Record<string, number>;
  customCategories: { income: string[]; expense: string[] };
  recurring: RecurringItem[];
  goals: SavingsGoal[];

  addTransaction: (input: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category: string, amount: number) => void;
  addCustomCategory: (type: TxType, name: string) => void;

  addRecurring: (input: Omit<RecurringItem, 'id' | 'createdAt' | 'active'>) => void;
  updateRecurring: (id: string, patch: Partial<RecurringItem>) => void;
  deleteRecurring: (id: string) => void;
  markRecurringPaid: (id: string) => void;

  addGoal: (name: string, targetAmount: number, color: SwatchColor) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => boolean;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: {},
      customCategories: { income: [], expense: [] },
      recurring: [],
      goals: [],

      addTransaction: (input) =>
        set({
          transactions: [
            { ...input, id: createId(), createdAt: new Date().toISOString() },
            ...get().transactions,
          ],
        }),

      updateTransaction: (id, patch) =>
        set({ transactions: get().transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)) }),

      deleteTransaction: (id) =>
        set({ transactions: get().transactions.filter((t) => t.id !== id) }),

      setBudget: (category, amount) =>
        set({ budgets: { ...get().budgets, [category]: amount } }),

      addCustomCategory: (type, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const fixed = (type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((c) => c.name);
        const existing = get().customCategories[type];
        if (fixed.includes(trimmed) || existing.includes(trimmed)) return;
        set({ customCategories: { ...get().customCategories, [type]: [...existing, trimmed] } });
      },

      addRecurring: (input) => {
        const id = createId();
        set({
          recurring: [
            ...get().recurring,
            { ...input, id, active: true, createdAt: new Date().toISOString() },
          ],
        });
      },

      updateRecurring: (id, patch) =>
        set({ recurring: get().recurring.map((r) => (r.id === id ? { ...r, ...patch } : r)) }),

      deleteRecurring: (id) => set({ recurring: get().recurring.filter((r) => r.id !== id) }),

      markRecurringPaid: (id) => {
        const item = get().recurring.find((r) => r.id === id);
        if (!item) return;
        get().addTransaction({
          type: item.type,
          amount: item.amount,
          category: item.category,
          note: item.name,
          day: dayKey(),
        });
        const advance = item.frequency === 'weekly' ? addDays : item.frequency === 'monthly' ? addMonths : addYears;
        const step = item.frequency === 'weekly' ? 7 : 1;
        set({
          recurring: get().recurring.map((r) => (r.id === id ? { ...r, nextDue: advance(r.nextDue, step) } : r)),
        });
      },

      addGoal: (name, targetAmount, color) => {
        const id = createId();
        set({
          goals: [
            ...get().goals,
            { id, name: name.trim() || 'Untitled goal', targetAmount, savedAmount: 0, color, createdAt: new Date().toISOString() },
          ],
        });
      },

      deleteGoal: (id) => set({ goals: get().goals.filter((g) => g.id !== id) }),

      contributeToGoal: (id, amount) => {
        const goal = get().goals.find((g) => g.id === id);
        if (!goal) return false;
        const wasComplete = goal.savedAmount >= goal.targetAmount;
        const savedAmount = Math.max(0, goal.savedAmount + amount);
        set({ goals: get().goals.map((g) => (g.id === id ? { ...g, savedAmount } : g)) });
        return !wasComplete && savedAmount >= goal.targetAmount;
      },
    }),
    { name: 'meadhall:finance' },
  ),
);

export function allCategories(type: TxType, custom: { income: string[]; expense: string[] }): { name: string; color: SwatchColor }[] {
  const fixed = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const extra = custom[type].map((name) => ({ name, color: colorForCategory(name) }));
  return [...fixed, ...extra];
}

/** Deterministic color for a category name that isn't in the fixed lists,
 * so custom categories still get a stable, distinct swatch. */
export function colorForCategory(name: string): SwatchColor {
  const fixedMatch = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find((c) => c.name === name);
  if (fixedMatch) return fixedMatch.color;
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return SWATCH_COLORS[hash % SWATCH_COLORS.length];
}

export function monthKey(day: string): string {
  return day.slice(0, 7);
}

export function currentMonthKey(): string {
  return monthKey(dayKey());
}

export function monthTotals(transactions: Transaction[], month: string): { income: number; expense: number } {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (monthKey(t.day) !== month) continue;
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense };
}

export function lastMonths(count: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return out;
}

export function categoryBreakdown(transactions: Transaction[], month: string, type: TxType): { category: string; total: number }[] {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== type || monthKey(t.day) !== month) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return [...totals.entries()].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
}

/** Normalizes a recurring item's cost to a monthly figure for burn-rate totals. */
export function monthlyEquivalent(item: RecurringItem): number {
  if (item.frequency === 'weekly') return item.amount * (52 / 12);
  if (item.frequency === 'yearly') return item.amount / 12;
  return item.amount;
}

export function averageDailySpend(transactions: Transaction[], month: string): number {
  const { expense } = monthTotals(transactions, month);
  const today = dayKey();
  const elapsedDays = monthKey(today) === month ? Number(today.slice(8, 10)) : 30;
  return expense / Math.max(1, elapsedDays);
}

export function monthOverMonthChange(transactions: Transaction[], month: string, type: TxType): number | null {
  const [y, m] = month.split('-').map(Number);
  const prevMonth = `${m === 1 ? y - 1 : y}-${String(m === 1 ? 12 : m - 1).padStart(2, '0')}`;
  const current = monthTotals(transactions, month)[type];
  const previous = monthTotals(transactions, prevMonth)[type];
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function exportTransactionsCsv(transactions: Transaction[]): void {
  const header = ['Date', 'Type', 'Category', 'Amount', 'Note'];
  const escape = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const rows = [...transactions]
    .sort((a, b) => (a.day < b.day ? -1 : 1))
    .map((t) => [t.day, t.type, t.category, t.amount.toFixed(2), t.note].map((v) => escape(String(v))).join(','));
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meadhall-transactions-${dayKey()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
