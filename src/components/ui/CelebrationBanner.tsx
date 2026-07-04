import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCelebrationStore } from '@/store/celebration';

export function CelebrationBanner() {
  const message = useCelebrationStore((s) => s.message);
  const clear = useCelebrationStore((s) => s.clear);

  useEffect(() => {
    if (!message) return;
    const handle = setTimeout(clear, 2200);
    return () => clearTimeout(handle);
  }, [message, clear]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex justify-center">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 rounded-full border border-honey-300/70 bg-gradient-to-b from-honey-100 to-honey-200 px-5 py-2 shadow-warm-lg dark:border-honey-700/50 dark:from-ink-900 dark:to-ink-800"
          >
            <Sparkles className="h-4 w-4 text-honey-600 dark:text-honey-400" />
            <span className="font-display text-sm font-semibold tracking-wide text-honey-900 dark:text-honey-100">
              {message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
