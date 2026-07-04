import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';
import { dayKey } from '@/lib/date';
import { SWATCH_COLORS, type SwatchColor } from '@/lib/colors';

export type Priority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  name: string;
  color: SwatchColor;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  done: boolean;
  createdAt: string;
  completedAt: string | null;
  dueDate: string | null;
  priority: Priority;
  projectId: string | null;
  order: number;
}

interface TasksState {
  tasks: Task[];
  projects: Project[];
  addTask: (input: Partial<Pick<Task, 'title' | 'dueDate' | 'priority' | 'projectId' | 'notes'>>) => string;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorder: (id: string, beforeId: string | null) => void;
  addProject: (name: string, color: SwatchColor) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const PROJECT_COLORS = SWATCH_COLORS;

const DEFAULT_PROJECTS: Project[] = [
  { id: 'inbox', name: 'Inbox', color: 'honey' },
];

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: DEFAULT_PROJECTS,

      addTask: (input) => {
        const id = createId();
        const tasks = get().tasks;
        const task: Task = {
          id,
          title: input.title?.trim() || 'Untitled task',
          notes: input.notes ?? '',
          done: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          dueDate: input.dueDate ?? null,
          priority: input.priority ?? 'medium',
          projectId: input.projectId ?? 'inbox',
          order: tasks.length ? Math.max(...tasks.map((t) => t.order)) + 1 : 0,
        };
        set({ tasks: [...tasks, task] });
        return id;
      },

      updateTask: (id, patch) =>
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }),

      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id
              ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null }
              : t,
          ),
        }),

      deleteTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),

      reorder: (id, beforeId) => {
        const tasks = [...get().tasks].sort((a, b) => a.order - b.order);
        const from = tasks.findIndex((t) => t.id === id);
        if (from === -1) return;
        const [moved] = tasks.splice(from, 1);
        const to = beforeId ? tasks.findIndex((t) => t.id === beforeId) : tasks.length;
        tasks.splice(to === -1 ? tasks.length : to, 0, moved);
        set({ tasks: tasks.map((t, i) => ({ ...t, order: i })) });
      },

      addProject: (name, color) => {
        const id = createId();
        set({ projects: [...get().projects, { id, name: name.trim() || 'Untitled', color }] });
        return id;
      },

      updateProject: (id, patch) =>
        set({ projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),

      deleteProject: (id) => {
        if (id === 'inbox') return;
        set({
          projects: get().projects.filter((p) => p.id !== id),
          tasks: get().tasks.map((t) => (t.projectId === id ? { ...t, projectId: 'inbox' } : t)),
        });
      },
    }),
    { name: 'meadhall:tasks' },
  ),
);

export function selectTodayTasks(tasks: Task[]): Task[] {
  const today = dayKey();
  return tasks.filter((t) => !t.done && t.dueDate && t.dueDate <= today);
}

export function selectUpcomingTasks(tasks: Task[]): Task[] {
  const today = dayKey();
  return tasks
    .filter((t) => !t.done && t.dueDate && t.dueDate > today)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));
}
