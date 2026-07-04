import { create } from 'zustand';

interface CelebrationState {
  message: string | null;
  show: (message: string) => void;
  clear: () => void;
}

export const useCelebrationStore = create<CelebrationState>()((set) => ({
  message: null,
  show: (message) => set({ message }),
  clear: () => set({ message: null }),
}));
