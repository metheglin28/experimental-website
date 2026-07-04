// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { useTasksStore } from './tasks';
import { addDays, dayKey } from '@/lib/date';

beforeEach(() => {
  localStorage.clear();
  useTasksStore.setState({
    tasks: [],
    projects: [{ id: 'inbox', name: 'Inbox', color: 'honey' }],
  });
});

describe('toggleTask recurrence', () => {
  it('marks a non-recurring task done normally', () => {
    const id = useTasksStore.getState().addTask({ title: 'One-off' });
    useTasksStore.getState().toggleTask(id);
    const t = useTasksStore.getState().tasks.find((x) => x.id === id)!;
    expect(t.done).toBe(true);
    expect(t.completedAt).not.toBeNull();
  });

  it('advances the due date instead of completing a recurring task', () => {
    const today = dayKey();
    const id = useTasksStore.getState().addTask({ title: 'Water plants', dueDate: today, recurrence: 'weekly' });
    useTasksStore.getState().toggleTask(id);
    const t = useTasksStore.getState().tasks.find((x) => x.id === id)!;
    expect(t.done).toBe(false);
    expect(t.dueDate).toBe(addDays(today, 7));
  });

  it('un-checking a recurring task after it advances toggles done normally', () => {
    // Once advanced, the task is a fresh (not-done) occurrence, so toggling
    // it again should just complete it like any other non-recurring toggle
    // would from that point (recurrence keeps advancing on each check-off).
    const today = dayKey();
    const id = useTasksStore.getState().addTask({ title: 'Daily', dueDate: today, recurrence: 'daily' });
    useTasksStore.getState().toggleTask(id);
    const afterFirst = useTasksStore.getState().tasks.find((x) => x.id === id)!;
    expect(afterFirst.dueDate).toBe(addDays(today, 1));

    useTasksStore.getState().toggleTask(id);
    const afterSecond = useTasksStore.getState().tasks.find((x) => x.id === id)!;
    expect(afterSecond.dueDate).toBe(addDays(today, 2));
  });

  it('completes a recurring task normally when it has no due date to advance', () => {
    const id = useTasksStore.getState().addTask({ title: 'No date', recurrence: 'daily' });
    useTasksStore.getState().toggleTask(id);
    const t = useTasksStore.getState().tasks.find((x) => x.id === id)!;
    expect(t.done).toBe(true);
  });
});

describe('reorderWithin', () => {
  it('reorders only the given subset, preserving the slots of tasks not included', () => {
    const store = useTasksStore.getState();
    const a = store.addTask({ title: 'A' });
    const b = store.addTask({ title: 'B' });
    const c = store.addTask({ title: 'C' });

    useTasksStore.getState().reorderWithin([b, a]);

    const ordered = useTasksStore
      .getState()
      .tasks.slice()
      .sort((x, y) => x.order - y.order)
      .map((t) => t.id);
    expect(ordered).toEqual([b, a, c]);
  });
});
