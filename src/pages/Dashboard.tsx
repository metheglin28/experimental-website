import { Link } from 'react-router-dom';
import { CheckSquare, Flame, Timer, Wallet, ArrowRight, NotebookPen, Languages } from 'lucide-react';
import { useTasksStore, selectTodayTasks, selectUpcomingTasks } from '@/store/tasks';
import { useHabitsStore, computeStreak } from '@/store/habits';
import { useFocusStore } from '@/store/focus';
import { useFinanceStore, currentMonthKey, monthTotals, formatCurrency } from '@/store/finance';
import { useNotesStore } from '@/store/notes';
import { useSettingsStore } from '@/store/settings';
import { StatTile } from '@/components/ui/StatTile';
import { SWATCH_DOT } from '@/lib/colors';
import { greeting, formatLong, formatFriendly, dayKey, formatTimeAgo } from '@/lib/date';
import { latinWordOfTheDay } from '@/lib/latinWord';
import { useCelebrateOnZero } from '@/lib/celebrate';
import { CornerBee } from '@/components/ui/CornerBee';

export function Dashboard() {
  const tasks = useTasksStore((s) => s.tasks);
  const toggleTask = useTasksStore((s) => s.toggleTask);
  const habits = useHabitsStore((s) => s.habits);
  const toggleCheckin = useHabitsStore((s) => s.toggleCheckin);
  const focusSessions = useFocusStore((s) => s.sessions);
  const transactions = useFinanceStore((s) => s.transactions);
  const notes = useNotesStore((s) => s.notes);
  const displayName = useSettingsStore((s) => s.displayName);
  const currency = useSettingsStore((s) => s.currency);

  const today = dayKey();
  const todayTasks = selectTodayTasks(tasks);
  const upcoming = selectUpcomingTasks(tasks).slice(0, 5);
  const todayFocusMinutes = focusSessions
    .filter((s) => s.day === today && s.phase === 'focus')
    .reduce((a, b) => a + b.minutes, 0);
  const habitsDoneToday = habits.filter((h) => h.checkins[today]).length;
  const net = monthTotals(transactions, currentMonthKey()).income - monthTotals(transactions, currentMonthKey()).expense;
  const recentNotes = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
  const latinWord = latinWordOfTheDay();

  useCelebrateOnZero(todayTasks.length);

  return (
    <div className="flex flex-col gap-6">
      <div className="card relative overflow-hidden p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-honey-600 dark:text-honey-400">{formatLong(today)}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink-900 sm:text-3xl dark:text-honey-50">
              {greeting()}
              {displayName ? `, ${displayName}` : ''}.
            </h2>
          </div>
          <div className="flex max-w-sm items-center gap-2.5 rounded-xl bg-honey-400/10 px-3.5 py-2.5 text-sm text-ink-600 dark:text-ink-300">
            <Languages className="h-4 w-4 shrink-0 text-honey-500" />
            <p>
              <span className="font-display font-semibold text-ink-800 dark:text-honey-100">{latinWord.word}</span>{' '}
              <span className="text-ink-400">— {latinWord.translation}</span>
            </p>
          </div>
        </div>
        <CornerBee size={25} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Due today" value={String(todayTasks.length)} icon={CheckSquare} />
        <StatTile
          label="Habits today"
          value={`${habitsDoneToday}/${habits.length}`}
          icon={Flame}
          tone={habits.length > 0 && habitsDoneToday === habits.length ? 'positive' : 'neutral'}
        />
        <StatTile label="Focused today" value={`${todayFocusMinutes}m`} icon={Timer} />
        <StatTile label="Net this month" value={formatCurrency(net, currency)} icon={Wallet} tone={net >= 0 ? 'positive' : 'negative'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col gap-3 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Today's tasks</h3>
            <Link to="/tasks" className="inline-flex items-center gap-1 text-xs text-honey-600 hover:underline dark:text-honey-400">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">Nothing due today. Enjoy the calm.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-200/70 dark:divide-ink-800/70">
              {todayTasks.map((t) => (
                <label key={t.id} className="flex cursor-pointer items-center gap-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                    className="h-4 w-4 shrink-0 rounded border-ink-300 accent-honey-500"
                  />
                  <span className="flex-1 truncate text-sm text-ink-800 dark:text-ink-100">{t.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="card flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Habits</h3>
            <Link to="/habits" className="inline-flex items-center gap-1 text-xs text-honey-600 hover:underline dark:text-honey-400">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {habits.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">No habits yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {habits.map((h) => {
                const done = !!h.checkins[today];
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleCheckin(h.id)}
                    className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition hover:bg-ink-900/5 dark:hover:bg-white/5"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        done ? `${SWATCH_DOT[h.color]} border-transparent` : 'border-ink-300 dark:border-ink-600'
                      }`}
                    >
                      {done && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
                          <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="flex-1 truncate text-sm text-ink-700 dark:text-ink-200">{h.name}</span>
                    <span className="inline-flex items-center gap-0.5 text-xs text-ink-400">
                      <Flame className="h-3 w-3" />
                      {computeStreak(h.checkins)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-3 p-5">
          <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Upcoming</h3>
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">Nothing on the horizon.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-200/70 dark:divide-ink-800/70">
              {upcoming.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="truncate text-sm text-ink-700 dark:text-ink-200">{t.title}</span>
                  <span className="shrink-0 text-xs text-ink-400">{formatFriendly(t.dueDate!)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-700 dark:text-ink-200">Recent notes</h3>
            <Link to="/notes" className="inline-flex items-center gap-1 text-xs text-honey-600 hover:underline dark:text-honey-400">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentNotes.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-400">No notes yet — jot something down.</p>
          ) : (
            <div className="flex flex-col divide-y divide-ink-200/70 dark:divide-ink-800/70">
              {recentNotes.map((n) => (
                <Link key={n.id} to="/notes" className="flex items-center gap-3 py-2.5 hover:text-honey-600">
                  <NotebookPen className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                  <span className="flex-1 truncate text-sm text-ink-700 dark:text-ink-200">{n.title || 'Untitled note'}</span>
                  <span className="shrink-0 text-xs text-ink-400">{formatTimeAgo(n.updatedAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
