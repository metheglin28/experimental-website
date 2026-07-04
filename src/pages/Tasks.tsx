import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, ListTodo } from 'lucide-react';
import { useTasksStore, type Task } from '@/store/tasks';
import { ProjectRail, type ViewFilter } from '@/components/tasks/ProjectRail';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { dayKey } from '@/lib/date';
import { useCelebrateOnZero } from '@/lib/celebrate';

function isProjectView(v: ViewFilter): v is { projectId: string } {
  return typeof v === 'object';
}

export function Tasks() {
  const tasks = useTasksStore((s) => s.tasks);
  const [view, setView] = useState<ViewFilter>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const addTask = useTasksStore((s) => s.addTask);

  const today = dayKey();

  const counts = useMemo(() => {
    const byProject: Record<string, number> = {};
    let all = 0;
    let todayCount = 0;
    let upcoming = 0;
    let completed = 0;
    for (const t of tasks) {
      if (t.done) {
        completed++;
        continue;
      }
      all++;
      byProject[t.projectId ?? 'inbox'] = (byProject[t.projectId ?? 'inbox'] ?? 0) + 1;
      if (t.dueDate && t.dueDate <= today) todayCount++;
      else if (t.dueDate && t.dueDate > today) upcoming++;
    }
    return { all, today: todayCount, upcoming, completed, byProject };
  }, [tasks, today]);

  useCelebrateOnZero(counts.today);

  const visible = useMemo(() => {
    let list: Task[];
    if (view === 'completed') list = tasks.filter((t) => t.done);
    else if (view === 'today') list = tasks.filter((t) => !t.done && t.dueDate && t.dueDate <= today);
    else if (view === 'upcoming') list = tasks.filter((t) => !t.done && t.dueDate && t.dueDate > today);
    else if (isProjectView(view)) list = tasks.filter((t) => !t.done && t.projectId === view.projectId);
    else list = tasks.filter((t) => !t.done);

    return [...list].sort((a, b) =>
      view === 'completed'
        ? new Date(b.completedAt ?? 0).getTime() - new Date(a.completedAt ?? 0).getTime()
        : a.order - b.order,
    );
  }, [tasks, view, today]);

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle,
      projectId: isProjectView(view) ? view.projectId : 'inbox',
      dueDate: view === 'today' ? today : null,
    });
    setQuickTitle('');
  }

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <aside className="md:sticky md:top-20 md:self-start">
        <ProjectRail active={view} onChange={setView} counts={counts} />
      </aside>

      <div className="flex flex-col gap-4">
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <input
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick add a task and press Enter…"
            className="input"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="btn-secondary shrink-0"
            title="Add with details"
          >
            <Plus className="h-4 w-4" />
            Details
          </button>
        </form>

        {visible.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title={view === 'completed' ? 'Nothing completed yet' : 'All clear'}
            description={
              view === 'completed'
                ? 'Finished tasks will collect here.'
                : 'Add a task above, or take a well-earned break.'
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {visible.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={(t) => {
                    setEditing(t);
                    setModalOpen(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editing}
        defaultProjectId={isProjectView(view) ? view.projectId : null}
      />
    </div>
  );
}
