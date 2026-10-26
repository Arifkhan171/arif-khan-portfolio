import type { HTMLMotionProps } from "motion/react";

/** Simple fade-in on mount. Spreads onto a `motion.*` element. */
export const fadeIn: Pick<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};
