import { useReducedMotion, type HTMLMotionProps, type Variants } from "motion/react";

/** Durations in seconds. Nothing in the site is longer than `slow`. */
export const duration = { fast: 0.15, base: 0.3, slow: 0.5 } as const;
/** The one ease-out curve. Same as `--ease-out` in src/styles/index.css. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Simple fade-in on mount. Spread onto an `m.*` element. */
export const fadeIn: Pick<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: duration.slow, ease: easeOut },
};

/** Fade in while moving up 12 px. Use as `variants` (states: hidden, visible). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: easeOut } },
};

/** Parent of a list or grid: children appear one after another. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** Child of `stagger`. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easeOut } },
};

/** Animate once when scrolled into view. Use with `fadeUp` or `stagger` variants. */
export const revealOnScroll: Pick<
  HTMLMotionProps<"div">,
  "initial" | "whileInView" | "viewport"
> = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.2 },
};

/** Lift 3 px on hover. */
export const hoverLift: Pick<HTMLMotionProps<"div">, "whileHover" | "whileTap" | "transition"> = {
  whileHover: { y: -3 },
  whileTap: { y: 0 },
  transition: { duration: duration.fast, ease: easeOut },
};

// Opacity-only versions. Motion's `reducedMotion="user"` only delays transforms (they snap at the end),
// so with reduced motion we must not animate position at all.
const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: easeOut } },
};
const noLift: Pick<HTMLMotionProps<"div">, "whileHover" | "whileTap" | "transition"> = {};

/**
 * Presets for components. Use these instead of importing `fadeUp`, `staggerItem` and `hoverLift`
 * directly: with "reduce motion" on, nothing moves (opacity fades only).
 */
export function useMotionPresets() {
  const reduced = useReducedMotion();
  return {
    reduced: Boolean(reduced),
    fadeUp: reduced ? fadeOnly : fadeUp,
    staggerItem: reduced ? fadeOnly : staggerItem,
    hoverLift: reduced ? noLift : hoverLift,
  };
}
