import { useMemo, useState } from 'react';
import { Plus, Search, NotebookPen, FolderPlus } from 'lucide-react';
import clsx from 'clsx';
import { useNotesStore } from '@/store/notes';
import { NoteListItem } from '@/components/notes/NoteListItem';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { EmptyState } from '@/components/ui/EmptyState';

export function Notes() {
  const notes = useNotesStore((s) => s.notes);
  const folders = useNotesStore((s) => s.folders);
  const addNote = useNotesStore((s) => s.addNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const addFolder = useNotesStore((s) => s.addFolder);

  const [activeFolder, setActiveFolder] = useState<string | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addingFolder, setAddingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => activeFolder === 'all' || n.folderId === activeFolder)
      .filter(
        (n) =>
          !q ||
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, activeFolder, query]);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  function handleNewNote() {
    const id = addNote(activeFolder === 'all' ? 'general' : activeFolder);
    setSelectedId(id);
  }

  function handleDelete() {
    if (!selected) return;
    deleteNote(selected.id);
    setSelectedId(null);
  }

  function submitFolder(e: React.FormEvent) {
    e.preventDefault();
    if (folderName.trim()) addFolder(folderName);
    setFolderName('');
    setAddingFolder(false);
  }

  return (
    <div className="flex gap-6">
      <aside className="hidden w-44 shrink-0 flex-col gap-1 md:flex">
        <button
          onClick={() => setActiveFolder('all')}
          className={clsx(
            'rounded-lg px-2.5 py-2 text-left text-sm transition',
            activeFolder === 'all'
              ? 'bg-honey-400/20 font-medium text-honey-800 dark:text-honey-200'
              : 'text-ink-500 hover:bg-ink-900/5 dark:text-ink-400 dark:hover:bg-white/5',
          )}
        >
          All notes
        </button>
        {folders.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={clsx(
              'truncate rounded-lg px-2.5 py-2 text-left text-sm transition',
              activeFolder === f.id
                ? 'bg-honey-400/20 font-medium text-honey-800 dark:text-honey-200'
                : 'text-ink-500 hover:bg-ink-900/5 dark:text-ink-400 dark:hover:bg-white/5',
            )}
          >
            {f.name}
          </button>
        ))}
        {addingFolder ? (
          <form onSubmit={submitFolder} className="px-1 pt-1">
            <input
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onBlur={() => !folderName.trim() && setAddingFolder(false)}
              placeholder="Folder name"
              className="input py-1.5 text-sm"
            />
          </form>
        ) : (
          <button
            onClick={() => setAddingFolder(true)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-ink-400 transition hover:bg-ink-900/5 dark:hover:bg-white/5"
          >
            <FolderPlus className="h-4 w-4" />
            New folder
          </button>
        )}
      </aside>

      <div className={clsx('flex w-full flex-col gap-3 md:w-80 md:shrink-0', selected && 'hidden md:flex')}>
        <div className="flex gap-2">
          <div className="input flex flex-1 items-center gap-2 py-1.5">
            <Search className="h-4 w-4 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <button onClick={handleNewNote} className="btn-primary shrink-0 px-3">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={NotebookPen} title="No scrolls here yet" description="Start a new one and it'll show up in this list." />
        ) : (
          <div className="flex flex-col gap-1 overflow-y-auto">
            {filtered.map((n) => (
              <NoteListItem key={n.id} note={n} active={n.id === selectedId} onClick={() => setSelectedId(n.id)} />
            ))}
          </div>
        )}
      </div>

      <div className={clsx('w-full flex-1', !selected && 'hidden md:block')}>
        {selected ? (
          <NoteEditor note={selected} onBack={() => setSelectedId(null)} onDelete={handleDelete} />
        ) : (
          <div className="hidden h-full md:flex">
            <EmptyState icon={NotebookPen} title="Select a note" description="Choose a note from the list, or create a new scroll." />
          </div>
        )}
      </div>
    </div>
  );
}
