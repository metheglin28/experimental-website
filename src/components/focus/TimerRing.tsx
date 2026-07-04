import type { Phase } from '@/store/focus';
import { formatClock } from '@/lib/date';
import clsx from 'clsx';

const PHASE_LABEL: Record<Phase, string> = {
  focus: 'Focus',
  'short-break': 'Short break',
  'long-break': 'Long break',
};

const PHASE_RING: Record<Phase, string> = {
  focus: 'stroke-honey-500',
  'short-break': 'stroke-moss-500',
  'long-break': 'stroke-sky-500',
};

interface TimerRingProps {
  phase: Phase;
  remaining: number;
  total: number;
}

export function TimerRing({ phase, remaining, total }: TimerRingProps) {
  const size = 260;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = total > 0 ? 1 - remaining / total : 0;

  return (
    <div className="relative mx-auto h-[260px] w-[260px]">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="fill-none stroke-ink-100 dark:stroke-ink-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className={clsx('fill-none transition-[stroke-dashoffset] duration-500 ease-linear', PHASE_RING[phase])}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{PHASE_LABEL[phase]}</span>
        <span className="font-display text-5xl font-semibold tabular-nums text-ink-900 dark:text-honey-50">
          {formatClock(remaining)}
        </span>
      </div>
    </div>
  );
}
