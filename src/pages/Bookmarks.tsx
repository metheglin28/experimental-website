import { useMemo, useState } from 'react';
import { Plus, Search, Bookmark as BookmarkIcon, Star } from 'lucide-react';
import clsx from 'clsx';
import { useBookmarksStore, type Bookmark } from '@/store/bookmarks';
import { BookmarkCard } from '@/components/bookmarks/BookmarkCard';
import { BookmarkFormModal } from '@/components/bookmarks/BookmarkFormModal';
import { EmptyState } from '@/components/ui/EmptyState';

export function Bookmarks() {
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bookmark | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [bookmarks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookmarks.filter((b) => {
      if (favoritesOnly && !b.favorite) return false;
      if (activeTag && !b.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.notes.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [bookmarks, query, activeTag, favoritesOnly]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="input flex flex-1 items-center gap-2 py-1.5 sm:max-w-xs">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the library…"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <button
          onClick={() => setFavoritesOnly((v) => !v)}
          className={clsx('btn-secondary', favoritesOnly && '!bg-honey-400/25 !text-honey-800 dark:!text-honey-200')}
        >
          <Star className="h-4 w-4" fill={favoritesOnly ? 'currentColor' : 'none'} />
          Favorites
        </button>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary ml-auto"
        >
          <Plus className="h-4 w-4" />
          Add bookmark
        </button>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTag(null)}
            className={clsx('chip', !activeTag && '!bg-honey-400/25 !text-honey-800 dark:!text-honey-200')}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={clsx('chip', activeTag === t && '!bg-honey-400/25 !text-honey-800 dark:!text-honey-200')}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookmarkIcon}
          title="The shelves are empty"
          description="Save links you want to find again — articles, tools, inspiration."
          action={
            <button onClick={() => setModalOpen(true)} className="btn-primary mt-1">
              <Plus className="h-4 w-4" /> Add bookmark
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b) => (
            <BookmarkCard
              key={b.id}
              bookmark={b}
              onEdit={(bk) => {
                setEditing(bk);
                setModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <BookmarkFormModal open={modalOpen} onClose={() => setModalOpen(false)} bookmark={editing} />
    </div>
  );
}
