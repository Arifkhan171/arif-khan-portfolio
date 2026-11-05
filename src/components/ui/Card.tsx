import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li";
};

/** Bordered surface. Cards rest with a border only; cards that link somewhere add `cardLink` on hover. */
export const cardBase = "rounded-lg border border-border bg-surface p-5 shadow-soft md:p-8";
/** Extra classes for a card that is (or contains) the main link. */
export const cardLink =
  "transition-[border-color,box-shadow] hover:border-border-hover hover:shadow-raised";

export function Card({ as: Tag = "div", className, ...props }: CardProps) {
  return <Tag className={cn(cardBase, className)} {...props} />;
}
