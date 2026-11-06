import { m } from "motion/react";
import { content } from "@/data/content";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { formatPeriod, keepArrowsTogether } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { InlineSep } from "@/components/ui/InlineSep";
import { Section } from "@/components/ui/Section";

export function Experience() {
  const { experience, navigation } = content;
  const { fadeUp } = useMotionPresets();
  const label = navigation.find((item) => item.id === "experience")?.label ?? "Experience";

  return (
    <Section id="experience" eyebrow="Work" title={label}>
      <div className="grid gap-6">
        {experience.map((job) => (
          <m.div
            key={`${job.organization}-${job.period.start}`}
            variants={fadeUp}
            {...revealOnScroll}
          >
            <Card as="article">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
                <div>
                  <h3 className="text-h3">{job.role}</h3>
                  <p className="mt-1 text-small text-muted">
                    {[job.organization, job.location, job.employmentType].map((part, i) => (
                      <span key={part}>
                        {i > 0 && <InlineSep />}
                        <span className="whitespace-nowrap">{part}</span>
                      </span>
                    ))}
                  </p>
                </div>
                <p className="flex shrink-0 items-center gap-3 md:h-[1.8rem]">
                  {job.period.end === "present" && (
                    <Badge tone="accent" className="gap-1.5">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse"
                      />
                      Current
                    </Badge>
                  )}
                  <span className="font-mono text-caption whitespace-nowrap text-muted tabular-nums">
                    {formatPeriod(job.period)}
                  </span>
                </p>
              </div>
              <ul className="mt-6 list-disc space-y-2.5 pl-5 text-small marker:text-muted">
                {job.highlights.map((text) => (
                  <li key={text}>{keepArrowsTogether(text)}</li>
                ))}
              </ul>
              <ul
                aria-label="Tech used"
                className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-5"
              >
                {job.tech.map((tag) => (
                  <li key={tag} className="max-w-full">
                    <Badge>{tag}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </m.div>
        ))}
      </div>
    </Section>
  );
}
