export const STORAGE_PREFIX = 'meadhall:';

export function exportBackup(): string {
  const payload: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    const raw = localStorage.getItem(key);
    if (raw == null) continue;
    try {
      payload[key] = JSON.parse(raw);
    } catch {
      payload[key] = raw;
    }
  }
  return JSON.stringify(
    { app: 'meadhall', exportedAt: new Date().toISOString(), data: payload },
    null,
    2,
  );
}

export function downloadBackup(): void {
  const blob = new Blob([exportBackup()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meadhall-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function importBackup(json: string): { ok: true } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('data' in parsed) ||
    typeof (parsed as { data: unknown }).data !== 'object'
  ) {
    return { ok: false, error: 'That file is not a recognized Meadhall backup.' };
  }
  const data = (parsed as { data: Record<string, unknown> }).data;
  for (const [key, value] of Object.entries(data)) {
    if (!key.startsWith(STORAGE_PREFIX)) continue;
    localStorage.setItem(key, JSON.stringify(value));
  }
  return { ok: true };
}

export function wipeAllData(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) keys.push(key);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
