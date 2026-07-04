import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatTileProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: 'neutral' | 'positive' | 'negative';
  hint?: string;
}

const TONE_CLASSES: Record<NonNullable<StatTileProps['tone']>, string> = {
  neutral: 'text-honey-600 dark:text-honey-400 bg-honey-400/15',
  positive: 'text-moss-600 dark:text-moss-400 bg-moss-400/15',
  negative: 'text-ember-600 dark:text-ember-400 bg-ember-400/15',
};

export function StatTile({ label, value, icon: Icon, tone = 'neutral', hint }: StatTileProps) {
  return (
    <div className="card flex items-center gap-3.5 p-4">
      <div className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', TONE_CLASSES[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-ink-400">{label}</p>
        <p className="truncate font-display text-lg font-semibold text-ink-900 dark:text-honey-50">{value}</p>
        {hint && <p className="text-[11px] text-ink-400">{hint}</p>}
      </div>
    </div>
  );
}
