import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Eye, Pencil, Pin, PinOff, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useNotesStore, type Note } from '@/store/notes';
import { formatTimeAgo } from '@/lib/date';

interface NoteEditorProps {
  note: Note;
  onBack: () => void;
  onDelete: () => void;
}

export function NoteEditor({ note, onBack, onDelete }: NoteEditorProps) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const togglePin = useNotesStore((s) => s.togglePin);
  const folders = useNotesStore((s) => s.folders);

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsInput, setTagsInput] = useState(note.tags.join(', '));
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.join(', '));
    setMode('write');
  }, [note.id]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        updateNote(note.id, { title, content });
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  function commitTags() {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    updateNote(note.id, { tags });
  }

  return (
    <div className="card flex h-full min-h-[60vh] flex-col p-0">
      <div className="flex items-center gap-2 border-b border-ink-200/70 px-4 py-3 dark:border-ink-800/70">
        <button onClick={onBack} className="icon-btn md:hidden">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled note"
          className="flex-1 bg-transparent font-display text-lg font-semibold text-ink-900 outline-none placeholder:text-ink-300 dark:text-honey-50"
        />
        <button onClick={() => togglePin(note.id)} className="icon-btn" title={note.pinned ? 'Unpin' : 'Pin'}>
          {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </button>
        <button onClick={onDelete} className="icon-btn hover:!text-ember-600" title="Delete note">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-ink-200/70 px-4 py-2 dark:border-ink-800/70">
        <select
          value={note.folderId}
          onChange={(e) => updateNote(note.id, { folderId: e.target.value })}
          className="rounded-lg border-none bg-transparent text-xs font-medium text-ink-500 outline-none"
        >
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <div className="flex overflow-hidden rounded-lg border border-ink-200 text-xs dark:border-ink-700">
          <button
            onClick={() => setMode('write')}
            className={clsx('flex items-center gap-1 px-2.5 py-1', mode === 'write' ? 'bg-honey-400/20 text-honey-800 dark:text-honey-200' : 'text-ink-400')}
          >
            <Pencil className="h-3 w-3" /> Write
          </button>
          <button
            onClick={() => setMode('preview')}
            className={clsx('flex items-center gap-1 px-2.5 py-1', mode === 'preview' ? 'bg-honey-400/20 text-honey-800 dark:text-honey-200' : 'text-ink-400')}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {mode === 'write' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write in Markdown… **bold**, _italic_, - lists, `code`"
            className="h-full min-h-[40vh] w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-ink-800 outline-none placeholder:text-ink-300 dark:text-ink-200"
          />
        ) : (
          <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-display prose-a:text-honey-600">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            ) : (
              <p className="text-ink-400">Nothing to preview yet.</p>
            )}
          </article>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-ink-200/70 px-4 py-2 dark:border-ink-800/70">
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onBlur={commitTags}
          placeholder="tags, comma, separated"
          className="flex-1 bg-transparent text-xs text-ink-500 outline-none placeholder:text-ink-300"
        />
        <span className="shrink-0 text-[11px] text-ink-400">Edited {formatTimeAgo(note.updatedAt)}</span>
      </div>
    </div>
  );
}
