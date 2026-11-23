import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Neutral browser window around a project image: 1 px border, a 28 px top bar with three grey dots,
 * no URL text. The child (an <img>, or the video facade) fills the area under the bar.
 * For a frame that links or opens something, put it inside a `group` and pass
 * `group-hover:border-border-hover` as `className` (the image scale is the child's job).
 */
export function BrowserFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-image border border-border bg-surface-muted transition-[border-color] duration-200",
        className,
      )}
    >
      <div aria-hidden="true" className="flex h-7 items-center gap-1.5 border-b border-border px-3">
        <span className="size-2 rounded-full bg-border-hover" />
        <span className="size-2 rounded-full bg-border-hover" />
        <span className="size-2 rounded-full bg-border-hover" />
      </div>
      <div className="relative overflow-hidden">{children}</div>
    </div>
  );
}
