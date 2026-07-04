export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mead-gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-honey-300)" />
          <stop offset="1" stopColor="var(--color-honey-600)" />
        </linearGradient>
      </defs>
      <path
        d="M24 2 43 13 43 35 24 46 5 35 5 13Z"
        fill="url(#mead-gradient)"
      />
      <path
        d="M24 12 34 18 34 30 24 36 14 30 14 18Z"
        fill="var(--color-ink-950)"
        fillOpacity="0.18"
      />
      <path d="M24 12 34 18 34 30 24 36 14 30 14 18Z" stroke="var(--color-honey-100)" strokeOpacity="0.6" strokeWidth="1" />
    </svg>
  );
}

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 overflow-hidden">
      <LogoMark className="h-8 w-8 shrink-0 drop-shadow-sm" />
      {!collapsed && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-honey-50">
            Meadhall
          </span>
          <span className="text-[11px] font-medium tracking-wide text-ink-400">your private hall</span>
        </div>
      )}
    </div>
  );
}
