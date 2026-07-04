const pad = (n: number) => String(n).padStart(2, '0');

/** Local-time YYYY-MM-DD key, used as the canonical "day" identifier everywhere. */
export function dayKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return dayKey(dt);
}

export function addMonths(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1 + delta, d);
  return dayKey(dt);
}

export function addYears(key: string, delta: number): string {
  return addMonths(key, delta * 12);
}

export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const da = new Date(ay, am - 1, ad).getTime();
  const db = new Date(by, bm - 1, bd).getTime();
  return Math.round((db - da) / 86_400_000);
}

export function isToday(key: string): boolean {
  return key === dayKey();
}

export function isPast(key: string): boolean {
  return daysBetween(key, dayKey()) > 0;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatFriendly(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const diff = daysBetween(dayKey(), key);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}${date.getFullYear() !== new Date().getFullYear() ? `, ${date.getFullYear()}` : ''}`;
}

export function formatWeekday(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return WEEKDAY_LABELS[new Date(y, m - 1, d).getDay()];
}

export function formatLong(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAY_LABELS[date.getDay()]}, ${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${y}`;
}

export function monthLabel(year: number, month: number): string {
  return `${MONTH_LABELS[month]} ${year}`;
}

export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${pad(m)}:${pad(s)}`;
}

export function formatTimeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export { MONTH_LABELS, WEEKDAY_LABELS };
