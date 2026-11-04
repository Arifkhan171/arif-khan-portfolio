import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** accent = purple tint, for things to notice first. */
  tone?: "default" | "accent";
};

/** Small pill, for tech names. */
export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption",
        tone === "accent" ? "bg-accent-soft text-accent" : "bg-surface-muted text-foreground",
        className,
      )}
      {...props}
    />
  );
}
