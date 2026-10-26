import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Small pill, for tech names. */
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-caption text-foreground",
        className,
      )}
      {...props}
    />
  );
}
