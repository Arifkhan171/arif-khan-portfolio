import { AnimatePresence, m } from "motion/react";
import { useTheme } from "@/hooks/useTheme";
import { duration, easeOut, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/** Round sun/moon button. Shows the current theme's icon. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const { reduced } = useMotionPresets();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={theme}
          className="inline-flex"
          initial={{ opacity: 0, rotate: reduced ? 0 : -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: reduced ? 0 : 90 }}
          transition={{ duration: duration.fast, ease: easeOut }}
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </m.span>
      </AnimatePresence>
    </button>
  );
}
