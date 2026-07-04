import { describe, expect, it } from 'vitest';
import {
  averageDailySpend,
  categoryBreakdown,
  colorForCategory,
  formatCurrency,
  lastMonths,
  monthKey,
  monthlyEquivalent,
  monthOverMonthChange,
  monthTotals,
  type RecurringItem,
  type Transaction,
} from './finance';

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: overrides.id ?? Math.random().toString(36),
    type: 'expense',
    amount: 10,
    category: 'Food',
    note: '',
    day: '2026-07-01',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('monthKey', () => {
  it('extracts the YYYY-MM prefix from a day key', () => {
    expect(monthKey('2026-07-04')).toBe('2026-07');
  });
});

describe('monthTotals', () => {
  it('sums income and expense separately for a given month', () => {
    const transactions = [
      tx({ type: 'income', amount: 100, day: '2026-07-01' }),
      tx({ type: 'expense', amount: 30, day: '2026-07-15' }),
      tx({ type: 'expense', amount: 999, day: '2026-06-01' }), // different month
    ];
    expect(monthTotals(transactions, '2026-07')).toEqual({ income: 100, expense: 30 });
  });
});

describe('categoryBreakdown', () => {
  it('groups and totals by category for a given type and month', () => {
    const transactions = [
      tx({ category: 'Food', amount: 20, day: '2026-07-01' }),
      tx({ category: 'Food', amount: 15, day: '2026-07-05' }),
      tx({ category: 'Housing', amount: 500, day: '2026-07-05' }),
    ];
    const breakdown = categoryBreakdown(transactions, '2026-07', 'expense');
    expect(breakdown).toEqual([
      { category: 'Housing', total: 500 },
      { category: 'Food', total: 35 },
    ]);
  });
});

describe('monthlyEquivalent', () => {
  const base: Omit<RecurringItem, 'frequency' | 'amount'> = {
    id: '1',
    name: 'Test',
    type: 'expense',
    category: 'Bills',
    nextDue: '2026-07-01',
    active: true,
    createdAt: new Date().toISOString(),
  };

  it('leaves monthly amounts unchanged', () => {
    expect(monthlyEquivalent({ ...base, frequency: 'monthly', amount: 50 })).toBe(50);
  });

  it('converts weekly to a monthly average', () => {
    expect(monthlyEquivalent({ ...base, frequency: 'weekly', amount: 10 })).toBeCloseTo((10 * 52) / 12);
  });

  it('converts yearly to a monthly average', () => {
    expect(monthlyEquivalent({ ...base, frequency: 'yearly', amount: 120 })).toBe(10);
  });
});

describe('monthOverMonthChange', () => {
  it('returns null when the previous month had no activity', () => {
    const transactions = [tx({ day: '2026-07-01', amount: 10 })];
    expect(monthOverMonthChange(transactions, '2026-07', 'expense')).toBeNull();
  });

  it('computes percentage change against the previous month', () => {
    const transactions = [
      tx({ day: '2026-06-01', amount: 100 }),
      tx({ day: '2026-07-01', amount: 150 }),
    ];
    expect(monthOverMonthChange(transactions, '2026-07', 'expense')).toBe(50);
  });

  it('rolls over the year boundary', () => {
    const transactions = [
      tx({ day: '2025-12-01', amount: 100 }),
      tx({ day: '2026-01-01', amount: 50 }),
    ];
    expect(monthOverMonthChange(transactions, '2026-01', 'expense')).toBe(-50);
  });
});

describe('averageDailySpend', () => {
  it('divides total expense by days elapsed for a non-current month', () => {
    const transactions = [tx({ day: '2026-01-30', amount: 300 })];
    expect(averageDailySpend(transactions, '2026-01')).toBe(10);
  });
});

describe('lastMonths', () => {
  it('returns the requested count ending with the current month', () => {
    const months = lastMonths(3);
    expect(months).toHaveLength(3);
    expect(months[2]).toBe(monthKey(new Date().toISOString().slice(0, 10)));
  });
});

describe('colorForCategory', () => {
  it('returns the fixed color for a known category', () => {
    expect(colorForCategory('Food')).toBe('honey');
  });

  it('is deterministic for an unknown/custom category', () => {
    expect(colorForCategory('My Custom Category')).toBe(colorForCategory('My Custom Category'));
  });
});

describe('formatCurrency', () => {
  it('formats an amount with no decimal places', () => {
    expect(formatCurrency(1234, 'USD')).toBe('$1,234');
  });
});
