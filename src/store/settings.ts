import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Accent = 'honey' | 'ember' | 'moss';
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] as const;
export type Currency = (typeof CURRENCIES)[number];

interface SettingsState {
  themeMode: ThemeMode;
  accent: Accent;
  displayName: string;
  currency: Currency;
  setThemeMode: (mode: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
  setDisplayName: (name: string) => void;
  setCurrency: (currency: Currency) => void;
}

function applyThemeClass(mode: ThemeMode) {
  const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

function applyAccentAttr(accent: Accent) {
  document.documentElement.dataset.accent = accent;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      accent: 'honey',
      displayName: '',
      currency: 'USD',
      setThemeMode: (mode) => {
        set({ themeMode: mode });
        applyThemeClass(mode);
      },
      setAccent: (accent) => {
        set({ accent });
        applyAccentAttr(accent);
      },
      setDisplayName: (displayName) => set({ displayName }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'meadhall:settings',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        applyThemeClass(state.themeMode);
        applyAccentAttr(state.accent);
      },
    },
  ),
);

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useSettingsStore.getState().themeMode === 'system') {
      applyThemeClass('system');
    }
  });
}
