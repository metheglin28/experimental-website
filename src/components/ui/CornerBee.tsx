/**
 * A small original honey bee glyph for the top two corners of a
 * "window" (page-hero cards, the welcome screen, modals) — bees tie
 * straight into the mead/honey theme already in the palette. Built as
 * plain geometric shapes (circles, bezier lens-shaped wings, an
 * evenodd-cut striped abdomen), not traced from any icon set.
 */
function BeeGlyph({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="-10 -10 140 120"
      width={size}
      height={(size * 120) / 140}
      className={`pointer-events-none absolute top-1.5 text-honey-900/[0.18] dark:text-honey-100/[0.2] ${className ?? ''}`}
    >
      {/* wings — hollow lens shapes with one inner vein line */}
      <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M 66 40 C 80 18 104 16 116 34 C 104 50 82 52 66 46 Z" />
        <path d="M 71 39 C 84 26 100 25 108 34" strokeWidth="1.6" />
        <path d="M 54 40 C 40 18 16 16 4 34 C 16 50 38 52 54 46 Z" />
        <path d="M 49 39 C 36 26 20 25 12 34" strokeWidth="1.6" />
      </g>

      {/* antennae */}
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M 54 12 C 48 2 42 -2 37 -4" />
        <path d="M 66 12 C 72 2 78 -2 83 -4" />
      </g>
      <circle cx="36" cy="-5" r="3.2" fill="currentColor" />
      <circle cx="84" cy="-5" r="3.2" fill="currentColor" />

      {/* head + thorax */}
      <circle cx="60" cy="16" r="11" fill="currentColor" />
      <ellipse cx="60" cy="40" rx="16" ry="14" fill="currentColor" />

      {/* striped abdomen, gaps cut with evenodd */}
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M 42 56
           C 42 48 78 48 78 56
           C 78 74 68 100 60 103
           C 52 100 42 74 42 56
           Z
           M 44 66 L 76 66 L 76 74 L 44 74 Z
           M 46.5 80 L 73.5 80 L 73.5 88 L 46.5 88 Z"
      />
    </svg>
  );
}

export function CornerBee({ size = 40 }: { size?: number }) {
  return (
    <>
      <BeeGlyph size={size} className="left-1.5 -rotate-45" />
      <BeeGlyph size={size} className="right-1.5 rotate-45" />
    </>
  );
}
