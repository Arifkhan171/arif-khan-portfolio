import type { HTMLAttributes } from "react";
import { m } from "motion/react";
import { useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  /** Lifts slightly on hover. */
  interactive?: boolean;
  as?: "div" | "article" | "li";
};

const base = "rounded-lg border border-border bg-surface p-6 shadow-soft";
const interactiveClasses = "transition-shadow hover:shadow-raised";

const motionTags = { div: m.div, article: m.article, li: m.li } as const;

export function Card({ as = "div", interactive = false, className, ...props }: CardProps) {
  const { hoverLift } = useMotionPresets();
  if (interactive) {
    const MotionTag = motionTags[as];
    // Motion's own props (drag etc.) are not accepted by CardProps, so the spread is safe.
    return (
      <MotionTag
        className={cn(base, interactiveClasses, className)}
        {...hoverLift}
        {...(props as object)}
      />
    );
  }
  const Tag = as;
  return <Tag className={cn(base, className)} {...props} />;
}
