import type { ReactNode } from "react";
import { m } from "motion/react";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { formatPeriod } from "@/lib/format";
import type { Period } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { InlineSep } from "@/components/ui/InlineSep";

type EntryCardProps = {
  /** Generic label, e.g. "Work" or "Education". */
  kicker: string;
  title: string;
  /** Parts of the line under the title; each part stays on one line. */
  meta: readonly string[];
  period: Period;
  /** Extra mono text next to the period (the grade). */
  note?: string;
  tagsLabel: string;
  tags: readonly string[];
  /** Tags sit beside the text on large screens. */
  wide?: boolean;
  children?: ReactNode;
};

/** One job or one degree. Work and education share it so they look like one family. */
export function EntryCard({
  kicker,
  title,
  meta,
  period,
  note,
  tagsLabel,
  tags,
  wide = false,
  children,
}: EntryCardProps) {
  const { fadeUp } = useMotionPresets();
  return (
    <m.div variants={fadeUp} {...revealOnScroll} className="h-full">
      <Card
        as="article"
        className={cn(
          "h-full",
          wide && "lg:grid lg:grid-cols-[minmax(0,40rem)_minmax(0,1fr)] lg:gap-x-10",
        )}
      >
        <div>
          <p
            aria-hidden="true"
            className="font-mono text-caption tracking-[0.08em] text-accent uppercase"
          >
            {kicker}
          </p>
          <h3 className="mt-2 text-h3">
            <span className="sr-only">{kicker}: </span>
            {title}
          </h3>
          <p className="mt-1 text-small text-muted">
            {meta.map((part, i) => (
              <span key={part}>
                {i > 0 && <InlineSep />}
                <span className="whitespace-nowrap">{part}</span>
              </span>
            ))}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-small">
            {period.end === "present" && (
              <Badge tone="accent" className="gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse"
                />
                Current
              </Badge>
            )}
            <span className="font-mono text-caption whitespace-nowrap text-muted tabular-nums">
              {formatPeriod(period)}
            </span>
            {note && (
              <span className="font-mono text-caption font-medium whitespace-nowrap tabular-nums">
                {note}
              </span>
            )}
          </p>
          {children}
        </div>
        <div
          className={cn(
            "mt-5 border-t border-border pt-4",
            wide && "lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8",
          )}
        >
          <p aria-hidden="true" className="text-caption text-muted">
            {tagsLabel}
          </p>
          <ul aria-label={tagsLabel} className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag} className="max-w-full">
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </m.div>
  );
}
