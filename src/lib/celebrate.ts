import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useCelebrationStore } from '@/store/celebration';

const BRAND_COLORS = ['#f2900e', '#f6ab33', '#6f9d43', '#e2532f'];

export function celebrate(): void {
  const end = Date.now() + 400;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.8 },
      colors: BRAND_COLORS,
      scalar: 0.9,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.8 },
      colors: BRAND_COLORS,
      scalar: 0.9,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/** Fires the confetti and a brief banner — for rarer, more deserving
 * moments (milestones, completions) than the routine daily-clear. */
export function celebrateWithMessage(message: string): void {
  celebrate();
  useCelebrationStore.getState().show(message);
}

export const STREAK_MILESTONES = [7, 14, 30, 50, 100, 200, 365];

/** Fires the side-cannon celebration the moment a count drops to zero
 * (e.g. the day's task list just got cleared) — never on first mount. */
export function useCelebrateOnZero(count: number): void {
  const prev = useRef<number | null>(null);
  useEffect(() => {
    if (prev.current != null && prev.current > 0 && count === 0) {
      celebrate();
    }
    prev.current = count;
  }, [count]);
}
