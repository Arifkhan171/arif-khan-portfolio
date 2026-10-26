import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "header" | "footer" | "nav";
};

/** Centered content column: max width 72rem, side padding 16 px on phones. */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-content px-gutter", className)} {...props} />;
}
