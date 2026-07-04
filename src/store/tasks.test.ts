import { describe, expect, it } from 'vitest';
import { selectTodayTasks, selectUpcomingTasks, type Task } from './tasks';
import { addDays, dayKey } from '@/lib/date';

function task(overrides: Partial<Task>): Task {
  return {
    id: overrides.id ?? Math.random().toString(36),
    title: 'Task',
    notes: '',
    done: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    dueDate: null,
    priority: 'medium',
    projectId: 'inbox',
    order: 0,
    ...overrides,
  };
}

describe('selectTodayTasks', () => {
  const today = dayKey();

  it('includes undone tasks due today or overdue', () => {
    const tasks = [
      task({ id: 'a', dueDate: today }),
      task({ id: 'b', dueDate: addDays(today, -3) }),
    ];
    expect(selectTodayTasks(tasks).map((t) => t.id).sort()).toEqual(['a', 'b']);
  });

  it('excludes done tasks and tasks without a due date', () => {
    const tasks = [
      task({ id: 'done', dueDate: today, done: true }),
      task({ id: 'no-date', dueDate: null }),
    ];
    expect(selectTodayTasks(tasks)).toHaveLength(0);
  });

  it('excludes tasks due in the future', () => {
    const tasks = [task({ id: 'future', dueDate: addDays(today, 2) })];
    expect(selectTodayTasks(tasks)).toHaveLength(0);
  });
});

describe('selectUpcomingTasks', () => {
  const today = dayKey();

  it('includes only future undone tasks, sorted soonest first', () => {
    const tasks = [
      task({ id: 'later', dueDate: addDays(today, 5) }),
      task({ id: 'soon', dueDate: addDays(today, 1) }),
      task({ id: 'today', dueDate: today }),
    ];
    expect(selectUpcomingTasks(tasks).map((t) => t.id)).toEqual(['soon', 'later']);
  });
});
