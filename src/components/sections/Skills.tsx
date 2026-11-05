import { m } from "motion/react";
import { content } from "@/data/content";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { Badge } from "@/components/ui/Badge";
import { cardBase } from "@/components/ui/Card";
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
        {skills.map((group) => (
          <m.li
            key={group.name}
            variants={staggerItem}
            // `Card` is a plain element and cannot be an `m.li`, so it shares the classes instead.
            className={cardBase}
          >
            <h3 className="text-body font-semibold">{group.name}</h3>
            <ul aria-label={group.name} className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((name) => (
                <li key={name} className="max-w-full">
                  <Badge>{name}</Badge>
                </li>
              ))}
            </ul>
          </m.li>
        ))}
      </m.ul>
    </Section>
  );
}
