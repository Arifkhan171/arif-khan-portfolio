import { m } from "motion/react";
import { content } from "@/data/content";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";

export function Skills() {
  const { skills, navigation } = content;
  const { staggerItem } = useMotionPresets();
  const label = navigation.find((item) => item.id === "skills")?.label ?? "Skills";

  return (
    <Section id="skills" eyebrow="Toolkit" title={label}>
      <m.ul
        variants={stagger}
        {...revealOnScroll}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {skills.map((group, i) => (
          <m.li
            key={group.name}
            variants={staggerItem}
            // Same base classes as `Card` (keep in sync with `base` in Card.tsx; Card is not used
            // because it can only animate together with the hover lift). The first group is emphasized.
            className={cn(
              "rounded-lg border bg-surface p-6 shadow-soft",
              i === 0 ? "border-accent/40" : "border-border",
            )}
          >
            <h3 className="text-body font-semibold">{group.name}</h3>
            <ul aria-label={group.name} className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((name) => (
                <li key={name} className="max-w-full">
                  <Badge tone={i === 0 ? "accent" : "default"}>{name}</Badge>
                </li>
              ))}
            </ul>
          </m.li>
        ))}
      </m.ul>
    </Section>
  );
}
