# Meadhall

A private, local-first personal command center — tasks, notes, habits, a
focus timer, a journal, bookmarks, and a finance ledger, all in one warm
place. Built as a single-page app with a bold amber/honey design system,
dark mode, an accent picker, and a Cmd+K command palette.

Everything you enter is stored only in your browser's `localStorage`.
Nothing is sent to any server — there's no backend at all. Export a JSON
backup any time from **Settings**.

## Features

- **Dashboard** — a daily overview: greeting, quote of the day, today's
  tasks, habit check-ins, upcoming items, and recent notes.
- **Tasks** — projects, priorities, due dates, quick-add, and smart views
  (Today / Upcoming / Completed).
- **Notes** — folders, tags, full-text search, and a Markdown editor with
  live preview.
- **Habits** — daily check-ins, current/best streaks, and a GitHub-style
  contribution heatmap per habit.
- **Focus** — a Pomodoro-style ring timer with configurable focus/break
  lengths, auto-cycling long breaks, and a 7-day history chart.
- **Journal** — one entry per day with an emoji mood picker, a month
  calendar colored by mood, and a 30-day mood trend chart.
- **Bookmarks** — a tagged link library with favorites and favicon
  previews.
- **Finance** — income/expense tracking, monthly stat tiles, an
  income-vs-expense trend chart, and per-category budgets with progress
  bars.
- **Settings** — theme (light/dark/system), accent color, currency, and
  full data export/import/reset.
- **Command palette** (`⌘K` / `Ctrl+K`) — jump to any page or run an
  action without touching the mouse.

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

Chart colors were checked with a CVD (color-vision-deficiency) palette
validator for both light and dark surfaces before shipping.

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
