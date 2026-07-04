import { useState } from 'react';
import { Plus, Inbox, CalendarClock, CalendarCheck2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { useTasksStore } from '@/store/tasks';
import { SWATCH_COLORS, SWATCH_DOT } from '@/lib/colors';

export type ViewFilter = 'all' | 'today' | 'upcoming' | 'completed' | { projectId: string };

interface ProjectRailProps {
  active: ViewFilter;
  onChange: (view: ViewFilter) => void;
  counts: { all: number; today: number; upcoming: number; completed: number; byProject: Record<string, number> };
}

function isProjectView(v: ViewFilter): v is { projectId: string } {
  return typeof v === 'object';
}

export function ProjectRail({ active, onChange, counts }: ProjectRailProps) {
  const projects = useTasksStore((s) => s.projects);
  const addProject = useTasksStore((s) => s.addProject);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  function submitNewProject(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      addProject(name, SWATCH_COLORS[projects.length % SWATCH_COLORS.length]);
    }
    setName('');
    setAdding(false);
  }

  const smartViews: { key: Exclude<ViewFilter, object>; label: string; icon: typeof Inbox; count: number }[] = [
    { key: 'all', label: 'All tasks', icon: Inbox, count: counts.all },
    { key: 'today', label: 'Today', icon: CalendarClock, count: counts.today },
    { key: 'upcoming', label: 'Upcoming', icon: CalendarCheck2, count: counts.upcoming },
    { key: 'completed', label: 'Completed', icon: CheckCircle2, count: counts.completed },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        {smartViews.map((v) => {
          const isActive = active === v.key;
          const Icon = v.icon;
          return (
            <button
              key={v.key}
              onClick={() => onChange(v.key)}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition',
                isActive
                  ? 'bg-honey-400/20 font-medium text-honey-800 dark:text-honey-200'
                  : 'text-ink-500 hover:bg-ink-900/5 dark:text-ink-400 dark:hover:bg-white/5',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{v.label}</span>
              {v.count > 0 && <span className="text-xs text-ink-400">{v.count}</span>}
            </button>
          );
        })}
      </div>

      <div>
        <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">Projects</p>
        <div className="flex flex-col gap-1">
          {projects.map((p) => {
            const isActive = isProjectView(active) && active.projectId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChange({ projectId: p.id })}
                className={clsx(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition',
                  isActive
                    ? 'bg-honey-400/20 font-medium text-honey-800 dark:text-honey-200'
                    : 'text-ink-500 hover:bg-ink-900/5 dark:text-ink-400 dark:hover:bg-white/5',
                )}
              >
                <span className={clsx('h-2 w-2 shrink-0 rounded-full', SWATCH_DOT[p.color])} />
                <span className="flex-1 truncate">{p.name}</span>
                {counts.byProject[p.id] > 0 && <span className="text-xs text-ink-400">{counts.byProject[p.id]}</span>}
              </button>
            );
          })}

          {adding ? (
            <form onSubmit={submitNewProject} className="px-1 pt-1">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => !name.trim() && setAdding(false)}
                placeholder="Project name"
                className="input py-1.5 text-sm"
              />
            </form>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-ink-400 transition hover:bg-ink-900/5 dark:hover:bg-white/5"
            >
              <Plus className="h-4 w-4" />
              New project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
