import { m, type Variants } from "motion/react";
import { useMotionPresets } from "@/lib/animations";

const stepsStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
};

/** Numbered, connected steps. Takes its animation state from the parent's variants. */
export function PipelineSteps({
  steps,
  className,
}: {
  steps: readonly string[];
  className?: string;
}) {
  const { staggerItem } = useMotionPresets();
  return (
    <m.ol variants={stepsStagger} className={className}>
      {steps.map((step, i) => (
        <m.li
          key={`${i}-${step}`}
          variants={staggerItem}
          className="relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 pb-3 before:absolute before:top-8 before:bottom-1 before:left-[calc(0.875rem-0.5px)] before:w-px before:bg-border last:pb-0 last:before:hidden"
        >
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-full bg-accent-soft font-mono text-caption tabular-nums text-accent"
          >
            {i + 1}
          </span>
          <span className="pt-1 text-small">{step}</span>
        </m.li>
      ))}
    </m.ol>
  );
}
