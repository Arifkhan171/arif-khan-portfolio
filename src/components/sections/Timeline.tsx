import { m } from "motion/react";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { TimelineItem } from "@/types/content";
import { Card } from "@/components/ui/Card";

type TimelineProps = {
  items: readonly TimelineItem[];
  /** Generic label, e.g. "Timeline". */
  title: string;
};

/** Vertical year-by-year list. The newest (last) item is highlighted. */
export function Timeline({ items, title }: TimelineProps) {
  const { fadeUp, staggerItem } = useMotionPresets();
  return (
    <m.div variants={fadeUp} {...revealOnScroll} className="h-full">
      <Card className="h-full">
        <h3 className="font-mono text-caption tracking-[0.08em] text-accent uppercase">{title}</h3>
        <m.ol variants={stagger} className="mt-5">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <m.li
                key={item.year}
                variants={staggerItem}
                // The line is this item's ::before: from 3 px under its dot to 3 px above the next dot.
                className="relative grid grid-cols-[2.75rem_0.75rem_minmax(0,1fr)] gap-x-3 pb-5 before:absolute before:top-[21px] before:-bottom-[3px] before:left-[calc(3.875rem-0.5px)] before:w-px before:bg-border last:pb-0 last:before:hidden"
              >
                <span
                  className={cn(
                    "font-mono text-small font-medium tabular-nums",
                    last ? "text-accent" : "text-muted",
                  )}
                >
                  {item.year}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-3 rounded-full border-2",
                    last ? "border-accent bg-accent" : "border-border bg-surface",
                  )}
                />
                <span>
                  <span className="block text-small font-medium">{item.title}</span>
                  <span className="block text-small text-muted">{item.description}</span>
                </span>
              </m.li>
            );
          })}
        </m.ol>
      </Card>
    </m.div>
  );
}
