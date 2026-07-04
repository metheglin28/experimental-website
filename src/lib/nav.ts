import {
  LayoutDashboard,
  CheckSquare,
  NotebookPen,
  Flame,
  Timer,
  BookHeart,
  Bookmark,
  PiggyBank,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  hint: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, hint: 'Overview of your day' },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare, hint: 'Quests & to-dos' },
  { to: '/notes', label: 'Notes', icon: NotebookPen, hint: 'Scrolls & ideas' },
  { to: '/habits', label: 'Habits', icon: Flame, hint: 'Daily rituals & streaks' },
  { to: '/focus', label: 'Focus', icon: Timer, hint: 'Hearth timer' },
  { to: '/journal', label: 'Journal', icon: BookHeart, hint: 'Moods & reflections' },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark, hint: 'The library' },
  { to: '/finance', label: 'Finance', icon: PiggyBank, hint: 'The ledger' },
];

export const SETTINGS_ITEM: NavItem = {
  to: '/settings',
  label: 'Settings',
  icon: Settings,
  hint: 'Preferences & backups',
};
