import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';
import { dayKey } from '@/lib/date';
import type { SwatchColor } from '@/lib/colors';

export type TxType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  note: string;
  day: string;
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

interface FinanceState {
  transactions: Transaction[];
  budgets: Record<string, number>;
  addTransaction: (input: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category: string, amount: number) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: {},

      addTransaction: (input) =>
        set({
          transactions: [
            { ...input, id: createId(), createdAt: new Date().toISOString() },
            ...get().transactions,
          ],
        }),

      deleteTransaction: (id) =>
        set({ transactions: get().transactions.filter((t) => t.id !== id) }),

      setBudget: (category, amount) =>
        set({ budgets: { ...get().budgets, [category]: amount } }),
    }),
    { name: 'meadhall:finance' },
  ),
);

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

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
