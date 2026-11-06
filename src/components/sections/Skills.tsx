import { m } from "motion/react";
import { content } from "@/data/content";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";

export function Skills() {
  const { skills, navigation } = content;
  const { staggerItem } = useMotionPresets();
  const label = navigation.find((item) => item.id === "skills")?.label ?? "Skills";

  return (
    <Section id="skills" eyebrow="Toolkit" title={label}>
      <m.ul variants={stagger} {...revealOnScroll}>
        {skills.map((group) => (
          <m.li
            key={group.name}
            variants={staggerItem}
            className="grid gap-2.5 border-t border-border py-5 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[13.75rem_minmax(0,1fr)] md:gap-x-6"
          >
            <h3 className="text-small font-semibold md:pt-[3px]">{group.name}</h3>
            <ul aria-label={group.name} className="flex flex-wrap gap-1.5">
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
