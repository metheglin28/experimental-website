import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

interface BookmarksState {
  bookmarks: Bookmark[];
  addBookmark: (input: { url: string; title: string; notes?: string; tags?: string[] }) => void;
  updateBookmark: (id: string, patch: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: ({ url, title, notes = '', tags = [] }) => {
        let normalizedUrl = url.trim();
        if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) {
          normalizedUrl = `https://${normalizedUrl}`;
        }
        const bookmark: Bookmark = {
          id: createId(),
          url: normalizedUrl,
          title: title.trim() || normalizedUrl,
          notes,
          tags,
          favorite: false,
          createdAt: new Date().toISOString(),
        };
        set({ bookmarks: [bookmark, ...get().bookmarks] });
      },

      updateBookmark: (id, patch) =>
        set({ bookmarks: get().bookmarks.map((b) => (b.id === id ? { ...b, ...patch } : b)) }),

      deleteBookmark: (id) => set({ bookmarks: get().bookmarks.filter((b) => b.id !== id) }),

      toggleFavorite: (id) =>
        set({ bookmarks: get().bookmarks.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b)) }),
    }),
    { name: 'meadhall:bookmarks' },
  ),
);

export function faviconUrl(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
