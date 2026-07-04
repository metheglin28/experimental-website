import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';

export interface Folder {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  folders: Folder[];
  addNote: (folderId?: string) => string;
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'content' | 'folderId' | 'tags'>>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  addFolder: (name: string) => string;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
}

const DEFAULT_FOLDERS: Folder[] = [{ id: 'general', name: 'General' }];

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      folders: DEFAULT_FOLDERS,

      addNote: (folderId = 'general') => {
        const id = createId();
        const now = new Date().toISOString();
        const note: Note = {
          id,
          title: '',
          content: '',
          folderId,
          tags: [],
          pinned: false,
          createdAt: now,
          updatedAt: now,
        };
        set({ notes: [note, ...get().notes] });
        return id;
      },

      updateNote: (id, patch) =>
        set({
          notes: get().notes.map((n) =>
            n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n,
          ),
        }),

      deleteNote: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),

      togglePin: (id) =>
        set({ notes: get().notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)) }),

      addFolder: (name) => {
        const id = createId();
        set({ folders: [...get().folders, { id, name: name.trim() || 'Untitled folder' }] });
        return id;
      },

      renameFolder: (id, name) =>
        set({ folders: get().folders.map((f) => (f.id === id ? { ...f, name } : f)) }),

      deleteFolder: (id) => {
        if (id === 'general') return;
        set({
          folders: get().folders.filter((f) => f.id !== id),
          notes: get().notes.map((n) => (n.folderId === id ? { ...n, folderId: 'general' } : n)),
        });
      },
    }),
    { name: 'meadhall:notes' },
  ),
);
