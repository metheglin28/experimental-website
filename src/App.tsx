import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/pages/Dashboard';
import { Tasks } from '@/pages/Tasks';
import { Notes } from '@/pages/Notes';
import { Habits } from '@/pages/Habits';
import { Focus } from '@/pages/Focus';
import { Journal } from '@/pages/Journal';
import { Bookmarks } from '@/pages/Bookmarks';
import { Finance } from '@/pages/Finance';
import { Settings } from '@/pages/Settings';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
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
  );
}

export default App;
