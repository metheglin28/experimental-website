import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useIsDark } from '@/lib/useIsDark';
import { chartColor } from '@/lib/colors';
import { formatCurrency } from '@/store/finance';

interface IncomeExpenseChartProps {
  data: { month: string; label: string; income: number; expense: number }[];
  currency: string;
}

export function IncomeExpenseChart({ data, currency }: IncomeExpenseChartProps) {
  const dark = useIsDark();
  const incomeColor = chartColor('moss', dark);
  const expenseColor = chartColor('ember', dark);

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barGap={4}>
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#93826c' }} />
          <Tooltip
            cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs shadow-warm dark:border-ink-700 dark:bg-ink-900">
                  <p className="mb-1 font-medium text-ink-700 dark:text-ink-200">{label}</p>
                  {payload.map((p) => (
                    <p key={p.name} className="text-ink-500">
                      <span className="capitalize">{p.name}</span>: {formatCurrency(Number(p.value), currency)}
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs capitalize text-ink-500">{value}</span>}
          />
          <Bar dataKey="income" name="income" fill={incomeColor} radius={[4, 4, 0, 0]} maxBarSize={22} />
          <Bar dataKey="expense" name="expense" fill={expenseColor} radius={[4, 4, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
