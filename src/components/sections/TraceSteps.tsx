import { m, type Variants } from "motion/react";
import { duration, easeOut, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";

// Draw-in (Spec 12): the line grows from the top, then nodes and texts fade in one after another.
const traceStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const stepGroup: Variants = { hidden: {}, visible: {} };
const drawLine: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: duration.draw, ease: easeOut } },
};
const fadeStep: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: easeOut } },
};

/**
 * Steps on one vertical line with small nodes. `animated` runs the draw-in with the parent's
 * variants (only for the first panel); otherwise, and with reduced motion, it renders final.
 * 0.678rem = half the text-small line height (center of the first line); 0.3656rem centers the 10 px node on it.
 */
export function TraceSteps({
  steps,
  animated = false,
  className,
}: {
  steps: readonly string[];
  animated?: boolean;
  className?: string;
}) {
  const { reduced } = useMotionPresets();
  const live = animated && !reduced;
  const v = (variants: Variants) => (live ? variants : undefined);
  return (
    <m.ol variants={v(traceStagger)} className={cn("relative", className)}>
      {steps.map((step, i) => (
        <m.li
          key={`${i}-${step}`}
          variants={v(stepGroup)}
          className="grid grid-cols-[0.625rem_minmax(0,1fr)] gap-x-3 pb-2.5 last:relative last:pb-0 last:after:absolute last:after:top-[0.678rem] last:after:bottom-0 last:after:left-0 last:after:w-2.5 last:after:bg-surface"
        >
          {i === 0 && (
            // Inside the first item (valid HTML); positioned against the <ol>, which spans all steps.
            <m.span
              aria-hidden="true"
              variants={v(drawLine)}
              className="absolute top-[0.678rem] bottom-0 left-[4.5px] w-px origin-top bg-accent"
            />
          )}
          <m.span
            aria-hidden="true"
            variants={v(fadeStep)}
            className="relative z-10 mt-[0.3656rem] size-2.5 rounded-full border-[1.5px] border-accent bg-surface"
          />
          <m.span variants={v(fadeStep)} className="text-small text-foreground">
            {step}
          </m.span>
        </m.li>
      ))}
    </m.ol>
  );
}
