import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useIsDark } from '@/lib/useIsDark';
import { chartColor } from '@/lib/colors';
import { formatFriendly } from '@/lib/date';
import { MOOD_EMOJI, MOOD_LABEL, type Mood } from '@/store/journal';

interface MoodChartProps {
  data: { day: string; mood: number | null }[];
}

export function MoodChart({ data }: MoodChartProps) {
  const dark = useIsDark();
  const color = chartColor('honey', dark);

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" hide />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v: number) => MOOD_EMOJI[v as Mood]}
            axisLine={false}
            tickLine={false}
            width={28}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length || payload[0].value == null) return null;
              const mood = payload[0].value as Mood;
              return (
                <div className="rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 text-xs shadow-warm dark:border-ink-700 dark:bg-ink-900">
                  <p className="font-medium text-ink-700 dark:text-ink-200">{formatFriendly(label as string)}</p>
                  <p className="text-ink-500">
                    {MOOD_EMOJI[mood]} {MOOD_LABEL[mood]}
                  </p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
