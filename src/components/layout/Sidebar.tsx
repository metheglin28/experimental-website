import { NavLink } from 'react-router-dom';
import { Command } from 'lucide-react';
import clsx from 'clsx';
import { Logo } from './Logo';
import { NAV_ITEMS, SETTINGS_ITEM } from '@/lib/nav';

interface SidebarProps {
  onNavigate?: () => void;
  onOpenPalette: () => void;
}

function NavRow({ to, label, icon: Icon, onNavigate }: { to: string; label: string; icon: (typeof NAV_ITEMS)[number]['icon']; onNavigate?: () => void }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          isActive
            ? 'bg-gradient-to-r from-honey-400/20 to-honey-400/5 text-honey-800 dark:text-honey-200'
            : 'text-ink-500 hover:bg-ink-900/5 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-white/5 dark:hover:text-ink-100',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-honey-500" />
          )}
          <Icon className={clsx('h-[18px] w-[18px] shrink-0', isActive && 'text-honey-600 dark:text-honey-400')} strokeWidth={2} />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ onNavigate, onOpenPalette }: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <div className="px-1">
        <Logo />
      </div>

      <button
        onClick={onOpenPalette}
        className="flex items-center gap-2 rounded-xl border border-ink-200/80 bg-white/70 px-3 py-2 text-left text-sm text-ink-400 shadow-warm-sm transition hover:border-honey-300 dark:border-ink-800 dark:bg-ink-900/60 dark:text-ink-500"
      >
        <Command className="h-4 w-4" />
        <span className="flex-1">Quick actions</span>
        <kbd className="rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400">
          ⌘K
        </kbd>
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavRow key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-ink-200/70 pt-3 dark:border-ink-800/70">
        <NavRow {...SETTINGS_ITEM} onNavigate={onNavigate} />
      </div>
    </div>
  );
}
