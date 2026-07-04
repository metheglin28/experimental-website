import { useState } from 'react';
import { Star, Pencil, Trash2, Globe } from 'lucide-react';
import clsx from 'clsx';
import { useBookmarksStore, faviconUrl, hostnameOf, type Bookmark } from '@/store/bookmarks';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (b: Bookmark) => void;
}

export function BookmarkCard({ bookmark, onEdit }: BookmarkCardProps) {
  const toggleFavorite = useBookmarksStore((s) => s.toggleFavorite);
  const deleteBookmark = useBookmarksStore((s) => s.deleteBookmark);
  const [iconFailed, setIconFailed] = useState(false);
  const icon = faviconUrl(bookmark.url);

  return (
    <div className="card group flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 dark:bg-ink-800"
        >
          {icon && !iconFailed ? (
            <img src={icon} alt="" className="h-5 w-5" onError={() => setIconFailed(true)} />
          ) : (
            <Globe className="h-4 w-4 text-ink-400" />
          )}
        </a>
        <div className="min-w-0 flex-1">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noreferrer noopener"
            className="block truncate text-sm font-medium text-ink-800 hover:text-honey-600 dark:text-ink-100"
          >
            {bookmark.title}
          </a>
          <p className="truncate text-xs text-ink-400">{hostnameOf(bookmark.url)}</p>
        </div>
        <button
          onClick={() => toggleFavorite(bookmark.id)}
          className={clsx('icon-btn shrink-0', bookmark.favorite && '!text-honey-500')}
        >
          <Star className="h-4 w-4" fill={bookmark.favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {bookmark.notes && <p className="line-clamp-2 text-xs text-ink-500">{bookmark.notes}</p>}

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={() => onEdit(bookmark)} className="icon-btn" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => deleteBookmark(bookmark.id)} className="icon-btn hover:!text-ember-600" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
