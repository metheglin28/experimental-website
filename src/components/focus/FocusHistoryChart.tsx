import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useIsDark } from '@/lib/useIsDark';
import { chartColor } from '@/lib/colors';
import { formatWeekday } from '@/lib/date';

interface FocusHistoryChartProps {
  data: { day: string; minutes: number }[];
}

export function FocusHistoryChart({ data }: FocusHistoryChartProps) {
  const dark = useIsDark();
  const color = chartColor('honey', dark);

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }} barCategoryGap="28%">
          <XAxis
            dataKey="day"
            tickFormatter={(d: string) => formatWeekday(d)}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: dark ? '#93826c' : '#93826c' }}
          />
          <Tooltip
            cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs shadow-warm dark:border-ink-700 dark:bg-ink-900">
                  <p className="font-medium text-ink-700 dark:text-ink-200">{formatWeekday(label as string)}</p>
                  <p className="text-ink-500">{payload[0].value} min focused</p>
                </div>
              );
            }}
          />
          <Bar dataKey="minutes" fill={color} radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
