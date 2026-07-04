import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { WelcomeOverlay } from './WelcomeOverlay';
import { CommandPalette } from '../palette/CommandPalette';
import { CelebrationBanner } from '../ui/CelebrationBanner';
import { NAV_ITEMS, SETTINGS_ITEM } from '@/lib/nav';
import { useSettingsStore } from '@/store/settings';
import { useTasksStore, selectTodayTasks } from '@/store/tasks';
import { dayKey } from '@/lib/date';
import { notify } from '@/lib/notify';

export function AppShell() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const hasOnboarded = useSettingsStore((s) => s.hasOnboarded);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const lastTaskReminderDay = useSettingsStore((s) => s.lastTaskReminderDay);
  const setLastTaskReminderDay = useSettingsStore((s) => s.setLastTaskReminderDay);
  const tasks = useTasksStore((s) => s.tasks);
  const notifiedDayRef = useRef<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!notificationsEnabled) return;
    const today = dayKey();
    if (lastTaskReminderDay === today || notifiedDayRef.current === today) return;
    const dueToday = selectTodayTasks(tasks);
    if (dueToday.length === 0) return;
    notifiedDayRef.current = today;
    notify(`${dueToday.length} task${dueToday.length === 1 ? '' : 's'} due today`, {
      body: dueToday
        .slice(0, 3)
        .map((t) => t.title)
        .join(', '),
    });
    setLastTaskReminderDay(today);
    // Only re-check once per calendar day, not on every task-list edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsEnabled, lastTaskReminderDay]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const current = [...NAV_ITEMS, SETTINGS_ITEM].find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to),
  );

  return (
    <div className="min-h-svh md:flex">
      {!hasOnboarded && <WelcomeOverlay />}

      {/* Desktop sidebar */}
      <aside className="hidden w-[264px] shrink-0 border-r border-ink-200/70 md:block dark:border-ink-800/70">
        <div className="sticky top-0 h-svh">
          <Sidebar onOpenPalette={() => setPaletteOpen(true)} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[80vw] max-w-[280px] bg-honey-50 shadow-warm-lg md:hidden dark:bg-ink-950"
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} onOpenPalette={() => setPaletteOpen(true)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-svh flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-200/70 bg-honey-50/80 px-4 py-3 backdrop-blur-md md:px-8 dark:border-ink-800/70 dark:bg-ink-950/80">
          <button
            className="icon-btn md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-2">
            <h1 className="font-display text-lg font-medium text-ink-900 dark:text-honey-50">
              {current?.label ?? 'Meadhall'}
            </h1>
            {current && current !== SETTINGS_ITEM && (
              <span className="hidden text-sm text-ink-400 sm:inline">— {current.hint}</span>
            )}
          </div>
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-ink-200/80 px-2.5 py-1.5 text-xs text-ink-400 sm:flex dark:border-ink-800"
          >
            <kbd className="font-semibold">⌘K</kbd>
          </button>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <CelebrationBanner />
    </div>
  );
}
