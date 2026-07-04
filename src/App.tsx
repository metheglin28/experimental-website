import { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { randomLoadingTip } from '@/lib/loadingTips';

const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Tasks = lazy(() => import('@/pages/Tasks').then((m) => ({ default: m.Tasks })));
const Notes = lazy(() => import('@/pages/Notes').then((m) => ({ default: m.Notes })));
const Habits = lazy(() => import('@/pages/Habits').then((m) => ({ default: m.Habits })));
const Focus = lazy(() => import('@/pages/Focus').then((m) => ({ default: m.Focus })));
const Journal = lazy(() => import('@/pages/Journal').then((m) => ({ default: m.Journal })));
const Bookmarks = lazy(() => import('@/pages/Bookmarks').then((m) => ({ default: m.Bookmarks })));
const Finance = lazy(() => import('@/pages/Finance').then((m) => ({ default: m.Finance })));
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })));
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })));

function PageFallback() {
  const [tip] = useState(randomLoadingTip);
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-honey-300 border-t-honey-500" />
      <p className="text-xs italic text-ink-400">{tip}</p>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="notes" element={<Notes />} />
          <Route path="habits" element={<Habits />} />
          <Route path="focus" element={<Focus />} />
          <Route path="journal" element={<Journal />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="finance" element={<Finance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
