import clsx from 'clsx';

interface RuneMarkProps {
  /** A single Elder Futhark character — ancient, public-domain, unrelated to any game's branding. */
  rune: string;
  className?: string;
}

/** A near-invisible decorative watermark. Purely typographic, no image assets. */
export function RuneMark({ rune, className }: RuneMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'pointer-events-none absolute select-none font-display leading-none text-honey-900/[0.05] dark:text-honey-100/[0.06]',
        className,
      )}
    >
      {rune}
    </span>
  );
}
