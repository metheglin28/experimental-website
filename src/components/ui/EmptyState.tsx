import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-200 px-6 py-14 text-center dark:border-ink-800">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-honey-400/15 text-honey-600 dark:text-honey-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-base font-semibold text-ink-800 dark:text-ink-100">{title}</h3>
      {description && <p className="max-w-xs text-sm text-ink-500">{description}</p>}
      {action}
    </div>
  );
}
