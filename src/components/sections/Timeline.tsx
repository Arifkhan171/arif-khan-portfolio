import { m } from "motion/react";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { TimelineItem } from "@/types/content";

type TimelineProps = {
  items: readonly TimelineItem[];
  /** Generic label, e.g. "Path". */
  title: string;
  className?: string;
};

/**
 * Year-by-year path: a vertical list on phones and tablets, one horizontal row of points from
 * 1280 px. Only the last point (today) is filled with the accent.
 */
export function Timeline({ items, title, className }: TimelineProps) {
  const { staggerItem } = useMotionPresets();
  return (
    <div className={className}>
      <h3 className="font-mono text-caption tracking-[0.08em] text-muted uppercase">{title}</h3>
      <m.ol
        variants={stagger}
        {...revealOnScroll}
        className="mt-5 xl:grid xl:auto-cols-fr xl:grid-flow-col"
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <m.li
              key={item.year}
              variants={staggerItem}
              // The line is this item's ::before, 3 px away from its own dot and from the next one.
              // Phone: vertical, under the dot. Desktop: horizontal, through the dot center.
              className="relative grid grid-cols-[2.75rem_0.75rem_minmax(0,1fr)] gap-x-3 pb-5 before:absolute before:top-[21px] before:-bottom-[3px] before:left-[calc(3.875rem-0.5px)] before:w-px before:bg-border last:pb-0 last:before:hidden xl:block xl:pr-3 xl:pb-0 xl:before:top-[30.5px] xl:before:right-[3px] xl:before:bottom-auto xl:before:left-[15px] xl:before:h-px xl:before:w-auto"
            >
              <span
                className={cn(
                  "font-mono text-small font-medium tabular-nums xl:block xl:text-caption",
                  last ? "text-foreground" : "text-muted",
                )}
              >
                {item.year}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-3 rounded-full border-2 xl:mt-2 xl:block",
                  last ? "border-accent bg-accent" : "border-border bg-surface",
                )}
              />
              <span className="xl:mt-3 xl:block">
                <span className="block text-small font-medium text-balance">{item.title}</span>
                <span className="block text-small text-pretty text-muted">{item.description}</span>
              </span>
            </m.li>
          );
        })}
      </m.ol>
    </div>
  );
}
