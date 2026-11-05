import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** accent = teal tint, for a status ("Current"). */
  tone?: "default" | "accent";
};

/** Small tag, for tech names. */
export function Badge({ tone = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center rounded-sm px-2 text-[13px] leading-none font-medium",
        tone === "accent" ? "bg-accent-soft text-accent" : "bg-surface-muted text-foreground",
        className,
      )}
      {...props}
    />
  );
}
