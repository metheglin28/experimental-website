import { useState } from 'react';
import { motion } from 'framer-motion';
import { Command, ArrowRight } from 'lucide-react';
import { LogoMark } from './Logo';
import { CornerBee } from '@/components/ui/CornerBee';
import { useSettingsStore } from '@/store/settings';

export function WelcomeOverlay() {
  const setDisplayName = useSettingsStore((s) => s.setDisplayName);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);
  const [name, setName] = useState('');

  function finish(e?: React.FormEvent) {
    e?.preventDefault();
    if (name.trim()) setDisplayName(name.trim());
    completeOnboarding();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-honey-50 px-4 dark:bg-ink-950">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card relative w-full max-w-md overflow-hidden p-8 text-center"
      >
        <CornerBee size={48} />
        <div className="flex justify-center">
          <LogoMark className="h-14 w-14" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink-900 dark:text-honey-50">
          Welcome to Meadhall
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Your own private hall for tasks, notes, habits, focus, journaling, bookmarks and
          finances. Everything you write stays on this device — nothing is ever sent anywhere.
        </p>

        <form onSubmit={finish} className="mt-6 flex flex-col gap-3">
          <input
            autoFocus
            className="input text-center"
            placeholder="What should we call you?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn-primary justify-center">
            Enter the hall
            <ArrowRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => finish()} className="text-xs text-ink-400 hover:text-ink-600 dark:hover:text-ink-200">
            Skip for now
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 rounded-lg bg-honey-400/10 px-3 py-2 text-xs text-ink-500">
          <Command className="h-3.5 w-3.5 text-honey-500" />
          Press <kbd className="rounded border border-ink-200 px-1 font-semibold dark:border-ink-700">⌘K</kbd> anytime for quick actions
        </div>
      </motion.div>
    </div>
  );
}
