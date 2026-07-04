import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sun, Moon, Laptop, Download } from 'lucide-react';
import { NAV_ITEMS, SETTINGS_ITEM } from '@/lib/nav';
import { useSettingsStore } from '@/store/settings';
import { downloadBackup } from '@/lib/backup';

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  keywords?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = [...NAV_ITEMS, SETTINGS_ITEM].map((item) => ({
      id: `nav-${item.to}`,
      label: `Go to ${item.label}`,
      hint: item.hint,
      group: 'Navigate',
      icon: item.icon,
      run: () => navigate(item.to),
    }));

    const actionCommands: Command[] = [
      {
        id: 'theme-light',
        label: 'Switch to light theme',
        group: 'Appearance',
        icon: Sun,
        run: () => setThemeMode('light'),
      },
      {
        id: 'theme-dark',
        label: 'Switch to dark theme',
        group: 'Appearance',
        icon: Moon,
        run: () => setThemeMode('dark'),
      },
      {
        id: 'theme-system',
        label: 'Match system theme',
        group: 'Appearance',
        icon: Laptop,
        run: () => setThemeMode('system'),
      },
      {
        id: 'export',
        label: 'Export a backup of all your data',
        group: 'Data',
        icon: Download,
        run: () => downloadBackup(),
      },
    ];

    return [...navCommands, ...actionCommands];
  }, [navigate, setThemeMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ''} ${c.keywords ?? ''}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function execute(cmd: Command | undefined) {
    if (!cmd) return;
    cmd.run();
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      execute(filtered[activeIndex]);
    }
  }

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-950/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed left-1/2 top-24 z-[61] w-[92vw] max-w-lg -translate-x-1/2"
          >
            <div className="card overflow-hidden !bg-white dark:!bg-ink-900">
              <div className="flex items-center gap-2 border-b border-ink-200/70 px-4 py-3 dark:border-ink-800/70">
                <Search className="h-4 w-4 text-ink-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages or run a command…"
                  className="flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-ink-100"
                />
                <kbd className="rounded border border-ink-200 px-1.5 py-0.5 text-[10px] text-ink-400 dark:border-ink-700">
                  esc
                </kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-ink-400">No matches.</p>
                )}
                {filtered.map((cmd, i) => {
                  const showGroup = cmd.group !== lastGroup;
                  lastGroup = cmd.group;
                  const Icon = cmd.icon;
                  return (
                    <div key={cmd.id}>
                      {showGroup && (
                        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                          {cmd.group}
                        </p>
                      )}
                      <button
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => execute(cmd)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                          i === activeIndex
                            ? 'bg-honey-400/20 text-honey-800 dark:text-honey-200'
                            : 'text-ink-600 dark:text-ink-300'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-ink-400" />
                        <span className="flex-1 truncate">{cmd.label}</span>
                        {cmd.hint && <span className="text-xs text-ink-400">{cmd.hint}</span>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
