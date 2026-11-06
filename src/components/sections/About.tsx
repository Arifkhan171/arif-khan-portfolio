import { m } from "motion/react";
import { content } from "@/data/content";
import { formatPeriod } from "@/lib/format";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { InlineSep } from "@/components/ui/InlineSep";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/sections/Timeline";

/** Photo, short story, key facts and the year-by-year path. */
export function About() {
  const { profile, education, timeline, navigation } = content;
  const { fadeUp } = useMotionPresets();
  const label = navigation.find((item) => item.id === "about")?.label ?? "About";
  const degree = education[0];
  const { photo } = profile;

  return (
    <Section id="about" eyebrow="Background" title={label}>
      <div className="grid gap-y-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-16">
        <m.div
          variants={fadeUp}
          {...revealOnScroll}
          className="grid gap-6 min-[375px]:grid-cols-[10rem_minmax(0,1fr)] min-[375px]:items-start lg:block"
        >
          {/* The file has black corners baked in: always a circle (never a square frame). */}
          <div className="size-40 overflow-hidden rounded-full border border-border bg-surface-muted lg:size-60">
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>
          <dl className="grid gap-4 font-mono text-[13px] leading-[1.5] lg:mt-8">
            <div>
              <dt className="text-muted">Based in</dt>
              <dd className="mt-0.5">
                {profile.location}
                <InlineSep />
                <span className="whitespace-nowrap">{profile.timezone}</span>
              </dd>
            </div>
            {degree && (
              <div>
                <dt className="text-muted">Education</dt>
                <dd className="mt-0.5">
                  <span className="block">{degree.degree}</span>
                  <span className="block">{degree.institution}</span>
                  <span className="block whitespace-nowrap tabular-nums">
                    {formatPeriod(degree.period)}
                  </span>
                  <span className="block whitespace-nowrap tabular-nums">{degree.grade}</span>
                </dd>
              </div>
            )}
          </dl>
        </m.div>

        <div>
          <m.div variants={fadeUp} {...revealOnScroll} className="max-w-prose space-y-5 text-lead">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </m.div>
          {timeline.length > 0 && <Timeline items={timeline} title="Path" className="mt-12" />}
        </div>
      </div>
    </Section>
  );
}
