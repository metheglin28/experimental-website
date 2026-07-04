// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { exportBackup, importBackup, wipeAllData } from './backup';

beforeEach(() => {
  localStorage.clear();
});

describe('exportBackup', () => {
  it('bundles only meadhall-prefixed keys', () => {
    localStorage.setItem('meadhall:tasks', JSON.stringify({ state: { tasks: [{ id: '1' }] } }));
    localStorage.setItem('unrelated-key', 'should not appear');

    const backup = JSON.parse(exportBackup());
    expect(backup.app).toBe('meadhall');
    expect(backup.data['meadhall:tasks']).toEqual({ state: { tasks: [{ id: '1' }] } });
    expect(backup.data['unrelated-key']).toBeUndefined();
  });
});

describe('importBackup', () => {
  it('rejects invalid JSON', () => {
    const result = importBackup('not json');
    expect(result.ok).toBe(false);
  });

  it('rejects a JSON payload missing a data field', () => {
    const result = importBackup(JSON.stringify({ app: 'meadhall' }));
    expect(result.ok).toBe(false);
  });

  it('restores meadhall-prefixed keys into localStorage', () => {
    const payload = {
      app: 'meadhall',
      exportedAt: new Date().toISOString(),
      data: { 'meadhall:habits': { state: { habits: [] } } },
    };
    const result = importBackup(JSON.stringify(payload));
    expect(result.ok).toBe(true);
    expect(JSON.parse(localStorage.getItem('meadhall:habits')!)).toEqual({ state: { habits: [] } });
  });

  it('round-trips a real export', () => {
    localStorage.setItem('meadhall:notes', JSON.stringify({ state: { notes: [{ id: 'n1', title: 'Hello' }] } }));
    const exported = exportBackup();
    localStorage.clear();
    const result = importBackup(exported);
    expect(result.ok).toBe(true);
    expect(JSON.parse(localStorage.getItem('meadhall:notes')!).state.notes[0].title).toBe('Hello');
  });
});

describe('wipeAllData', () => {
  it('removes only meadhall-prefixed keys', () => {
    localStorage.setItem('meadhall:tasks', '{}');
    localStorage.setItem('other-app:settings', '{}');
    wipeAllData();
    expect(localStorage.getItem('meadhall:tasks')).toBeNull();
    expect(localStorage.getItem('other-app:settings')).toBe('{}');
  });
});
