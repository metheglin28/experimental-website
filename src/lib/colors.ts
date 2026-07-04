export type SwatchColor = 'honey' | 'ember' | 'moss' | 'sky' | 'violet' | 'rose';

export const SWATCH_COLORS: SwatchColor[] = ['honey', 'ember', 'moss', 'sky', 'violet', 'rose'];

/**
 * Full literal class strings per swatch — Tailwind's static scanner can't see
 * dynamically templated class names like `bg-${color}-400`, so every variant
 * used anywhere in the app has to be spelled out here.
 *
 * The "honey" entries use hardcoded hex (arbitrary-value classes) instead of
 * the honey-* theme tokens on purpose: selecting a non-honey accent remaps
 * those tokens app-wide (see index.css), which would otherwise make any
 * habit/project/goal tagged "Honey" silently change color along with the
 * accent instead of staying honey-colored like the other five swatches
 * (whose tokens are never remapped).
 */
export const SWATCH_DOT: Record<SwatchColor, string> = {
  honey: 'bg-[#f6ab33]',
  ember: 'bg-ember-400',
  moss: 'bg-moss-400',
  sky: 'bg-sky-400',
  violet: 'bg-violet-400',
  rose: 'bg-rose-400',
};

export const SWATCH_CHIP: Record<SwatchColor, string> = {
  honey: 'bg-[#fef1d3] text-[#8f4310] dark:bg-[#753810]/40 dark:text-[#f9c96d]',
  ember: 'bg-ember-100 text-ember-700 dark:bg-ember-900/40 dark:text-ember-300',
  moss: 'bg-moss-100 text-moss-700 dark:bg-moss-900/40 dark:text-moss-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

export const SWATCH_TEXT: Record<SwatchColor, string> = {
  honey: 'text-[#d67209] dark:text-[#f6ab33]',
  ember: 'text-ember-600 dark:text-ember-400',
  moss: 'text-moss-600 dark:text-moss-400',
  sky: 'text-sky-600 dark:text-sky-400',
  violet: 'text-violet-600 dark:text-violet-400',
  rose: 'text-rose-600 dark:text-rose-400',
};

export const SWATCH_RING: Record<SwatchColor, string> = {
  honey: 'ring-[#f6ab33]',
  ember: 'ring-ember-400',
  moss: 'ring-moss-400',
  sky: 'ring-sky-400',
  violet: 'ring-violet-400',
  rose: 'ring-rose-400',
};

/**
 * Categorical chart colors for use with Recharts (needs real hex values, not
 * Tailwind classes). Validated with the dataviz palette checker per mode —
 * light uses the 500 step, dark uses 600 for honey/sky to stay in the
 * narrower dark lightness band (L 0.48-0.67) while clearing CVD separation.
 */
export const CHART_HEX_LIGHT: Record<SwatchColor, string> = {
  honey: '#f2900e',
  ember: '#e2532f',
  moss: '#6f9d43',
  sky: '#0ea5e9',
  violet: '#8b5cf6',
  rose: '#f43f5e',
};

export const CHART_HEX_DARK: Record<SwatchColor, string> = {
  honey: '#d67209',
  ember: '#e2532f',
  moss: '#6f9d43',
  sky: '#0284c7',
  violet: '#8b5cf6',
  rose: '#f43f5e',
};

export function chartColor(color: SwatchColor, dark: boolean): string {
  return (dark ? CHART_HEX_DARK : CHART_HEX_LIGHT)[color];
}
