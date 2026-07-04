import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useBookmarksStore, type Bookmark } from '@/store/bookmarks';

interface BookmarkFormModalProps {
  open: boolean;
  onClose: () => void;
  bookmark?: Bookmark | null;
}

export function BookmarkFormModal({ open, onClose, bookmark }: BookmarkFormModalProps) {
  const addBookmark = useBookmarksStore((s) => s.addBookmark);
  const updateBookmark = useBookmarksStore((s) => s.updateBookmark);

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (!open) return;
    setUrl(bookmark?.url ?? '');
    setTitle(bookmark?.title ?? '');
    setNotes(bookmark?.notes ?? '');
    setTagsInput(bookmark?.tags.join(', ') ?? '');
  }, [open, bookmark]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (bookmark) {
      updateBookmark(bookmark.id, { url, title: title.trim() || url, notes, tags });
    } else {
      addBookmark({ url, title, notes, tags });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={bookmark ? 'Edit bookmark' : 'New bookmark'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          autoFocus
          className="input"
          placeholder="https://…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input min-h-[60px] resize-none"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <input
          className="input"
          placeholder="tags, comma, separated"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {bookmark ? 'Save changes' : 'Add bookmark'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
