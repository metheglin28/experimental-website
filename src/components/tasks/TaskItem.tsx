import { motion } from 'framer-motion';
import { Flag, Pencil, Trash2, CalendarDays } from 'lucide-react';
import clsx from 'clsx';
import { useTasksStore, type Task } from '@/store/tasks';
import { formatFriendly, isPast } from '@/lib/date';
import { SWATCH_DOT } from '@/lib/colors';

const PRIORITY_COLOR: Record<Task['priority'], string> = {
  low: 'text-ink-300 dark:text-ink-600',
  medium: 'text-honey-500',
  high: 'text-ember-500',
};

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const toggleTask = useTasksStore((s) => s.toggleTask);
  const deleteTask = useTasksStore((s) => s.deleteTask);
  const project = useTasksStore((s) => s.projects.find((p) => p.id === task.projectId));
  const overdue = task.dueDate && !task.done && isPast(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.18 }}
      className="group card flex items-start gap-3 px-4 py-3"
    >
      <button
        onClick={() => toggleTask(task.id)}
        aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
        className={clsx(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          task.done
            ? 'border-honey-500 bg-honey-500 text-white'
            : 'border-ink-300 hover:border-honey-500 dark:border-ink-600',
        )}
      >
        {task.done && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={clsx('truncate text-sm font-medium', task.done ? 'text-ink-400 line-through' : 'text-ink-800 dark:text-ink-100')}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-400">
          {task.priority !== 'low' && (
            <Flag className={clsx('h-3.5 w-3.5', PRIORITY_COLOR[task.priority])} fill="currentColor" />
          )}
          {task.dueDate && (
            <span className={clsx('inline-flex items-center gap-1', overdue && 'font-medium text-ember-600 dark:text-ember-400')}>
              <CalendarDays className="h-3.5 w-3.5" />
              {formatFriendly(task.dueDate)}
            </span>
          )}
          {project && (
            <span className="inline-flex items-center gap-1">
              <span className={clsx('h-1.5 w-1.5 rounded-full', SWATCH_DOT[project.color])} />
              {project.name}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={() => onEdit(task)} className="icon-btn" aria-label="Edit task">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => deleteTask(task.id)} className="icon-btn hover:!text-ember-600" aria-label="Delete task">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
