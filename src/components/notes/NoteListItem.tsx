import clsx from 'clsx';
import { Pin } from 'lucide-react';
import type { Note } from '@/store/notes';
import { formatTimeAgo } from '@/lib/date';

interface NoteListItemProps {
  note: Note;
  active: boolean;
  onClick: () => void;
}

export function NoteListItem({ note, active, onClick }: NoteListItemProps) {
  const snippet = note.content.replace(/[#*_`>-]/g, '').trim().slice(0, 90);
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full flex-col gap-1 rounded-xl border px-3 py-2.5 text-left transition',
        active
          ? 'border-honey-300 bg-honey-400/15'
          : 'border-transparent hover:bg-ink-900/5 dark:hover:bg-white/5',
      )}
    >
      <div className="flex items-center gap-1.5">
        {note.pinned && <Pin className="h-3 w-3 shrink-0 text-honey-500" fill="currentColor" />}
        <span className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">
          {note.title || 'Untitled note'}
        </span>
      </div>
      <p className="truncate text-xs text-ink-400">{snippet || 'No content yet'}</p>
      <span className="text-[11px] text-ink-300">{formatTimeAgo(note.updatedAt)}</span>
    </button>
  );
}
