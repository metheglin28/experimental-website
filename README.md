# Meadhall

A private, local-first personal command center — tasks, notes, habits, a
focus timer, a journal, bookmarks, and a finance ledger, all in one warm
place. Built as a single-page app with a bold amber/honey design system,
dark mode, an accent picker, and a Cmd+K command palette.

Everything you enter is stored only in your browser's `localStorage`.
Nothing is sent to any server — there's no backend at all. Export a JSON
backup any time from **Settings**.

## Features

- **Dashboard** — a daily overview: greeting, a daily Latin word and its
  translation, today's tasks, habit check-ins, upcoming items, and recent
  notes.
- **Tasks** — projects, priorities, due dates, quick-add, smart views
  (Today / Upcoming / Completed), drag-and-drop reordering, daily/weekly/
  monthly repeating tasks, and a badge linking to any note that references
  the task.
- **Notes** — folders, tags, full-text search, a Markdown editor with live
  preview, and an optional link to a task.
- **Habits** — daily check-ins, current/best streaks, and a GitHub-style
  contribution heatmap per habit.
- **Focus** — a Pomodoro-style ring timer with configurable focus/break
  lengths, auto-cycling long breaks, and a 7-day history chart.
- **Journal** — one entry per day with an emoji mood picker, that day's
  habit check-ins (toggle them right from the entry), a month calendar
  colored by mood, and a 30-day mood trend chart.
- **Bookmarks** — a tagged link library with favorites and favicon
  previews.
- **Finance** — a full personal ledger across four tabs:
  - *Overview*: spending insights (month-over-month change, top category,
    average daily spend), stat tiles, an income-vs-expense trend chart
    (3/6/12-month toggle), category budgets with progress bars, and an
    upcoming-bills preview.
  - *All Transactions*: a searchable, filterable ledger (by type, category,
    or month) with inline edit/delete and CSV export.
  - *Recurring*: subscriptions and bills with weekly/monthly/yearly
    frequency, due-date badges, and a one-click "mark paid" that logs the
    transaction and rolls the due date forward.
  - *Goals*: savings goals with progress bars and a contribution flow —
    hitting a goal triggers the same confetti celebration as a habit
    streak.
  - Custom categories can be added inline from any transaction/recurring
    form; each gets a stable, deterministic color.
- **Settings** — theme (light/dark/system), accent color (Honey / Ember /
  Moss / Frost), currency, browser notifications (focus-session alerts and
  a once-a-day tasks-due-today nudge, while the app is open), and full data
  export/import/reset.
- **Command palette** (`⌘K` / `Ctrl+K`) — jump to any page, run an action,
  or search across tasks, notes, journal entries, and bookmarks by content.
- A few Nordic/RPG winks, since "Meadhall" already leans that way: original
  loading-screen tips while a page chunk loads, and a "Skill increased!"
  banner when a habit streak or savings goal hits a milestone.

## Tech stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) for styling (CSS-first theme,
  `@utility` components, runtime accent theming via CSS variables)
- [Zustand](https://github.com/pmndrs/zustand) with `persist` for
  state + `localStorage`
- [React Router](https://reactrouter.com) (hash-based, so it works on any
  static host with no server config)
- [Recharts](https://recharts.org) for charts, [Framer Motion](https://www.framer.com/motion/)
  for animation, [Lucide](https://lucide.dev) for icons
- [react-markdown](https://github.com/remarkjs/react-markdown) +
  `remark-gfm` for the notes editor
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app) for an installable,
  offline-capable app (manifest + precaching service worker)
- [Vitest](https://vitest.dev) for unit tests on the pure date/streak/finance
  utility functions

Chart colors were checked with a CVD (color-vision-deficiency) palette
validator for both light and dark surfaces before shipping.

Meadhall is installable — look for the install icon in your browser's
address bar, or "Add to Home Screen" on mobile. Once installed it works
fully offline, since everything already lives in `localStorage`.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build a production bundle to dist/
npm run preview   # preview the production build locally
```

Routes are code-split per page, so the initial load only pulls in what the
Dashboard needs.

## Deploying

The build output in `dist/` is a fully static site — upload it to any
static host (GitHub Pages, Netlify, Vercel, S3, etc.). Because routing is
hash-based (`/#/tasks` rather than `/tasks`), no server-side rewrite rules
are required.

## Data & privacy

Every module persists to `localStorage` under keys prefixed `meadhall:`.
There is no analytics, no network calls except loading web fonts and,
optionally, favicon images for bookmarks you add yourself. Use
**Settings → Export backup** to download a full JSON snapshot, and
**Import backup** to restore it (in this browser or another).
