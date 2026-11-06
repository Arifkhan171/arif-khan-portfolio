import { m, type Variants } from "motion/react";
import { content } from "@/data/content";
import { formatPeriod, keepHyphensTogether } from "@/lib/format";
import { useMotionPresets } from "@/lib/animations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InlineSep } from "@/components/ui/InlineSep";
import { DownloadIcon, MapPinIcon } from "@/components/ui/icons";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { SystemTrace } from "@/components/sections/SystemTrace";
import type { Project } from "@/types/content";

// Containers only change timing (no position), so they are safe with reduced motion.
const heroStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const { profile, projects, experience } = content;
const current = experience[0];
const projectById = new Map<string, Project>(projects.map((p) => [p.id, p]));
const heroProjects = profile.heroProjects.flatMap((id) => projectById.get(id) ?? []);

/** "0.75 → 0.85": the start value is smaller, so the stat fits its column; read as "0.75 to 0.85". */
function StatValue({ value }: { value: string }) {
  const [from, to] = value.split(" → ");
  if (to === undefined) return value;
  return (
    <>
      <span className="text-[0.5em] tracking-normal text-muted">
        {from}
        <span aria-hidden="true"> → </span>
        <span className="sr-only"> to </span>
      </span>
      {to}
    </>
  );
}

export function Hero() {
  const { staggerItem } = useMotionPresets();
  const { cv } = profile.links;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mt-header overflow-hidden pt-[calc(var(--spacing-header)+2.5rem)] lg:pt-[calc(var(--spacing-header)+3rem)]"
    >
      <Container>
        <m.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-x-12"
        >
          <div className="lg:col-start-1 lg:row-start-1">
            <m.div variants={staggerItem} className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Badge className="gap-2 border border-border bg-surface pr-3 pl-2.5">
                <span
                  aria-hidden="true"
                  className="flex size-3 items-center justify-center rounded-full bg-accent-soft"
                >
                  <span className="size-2 rounded-full bg-accent motion-safe:animate-pulse" />
                </span>
                {profile.availability}
              </Badge>
              <p className="inline-flex items-center gap-1.5 text-caption text-muted">
                <MapPinIcon size={14} />
                <span>
                  {profile.location}
                  <InlineSep />
                  <span className="whitespace-nowrap">{profile.timezone}</span>
                </span>
              </p>
            </m.div>

            {/* Not animated: the name is the main content and a likely LCP element. */}
            <h1 id="hero-title" className="mt-6 text-display">
              {profile.name}
            </h1>
            <m.p
              variants={staggerItem}
              className="mt-3 text-[1.125rem] leading-[1.4] font-medium text-foreground md:text-xl"
            >
              {profile.title}
            </m.p>
            <m.p variants={staggerItem} className="mt-5 max-w-prose text-lead text-foreground">
              {keepHyphensTogether(profile.tagline)}
            </m.p>

            {current && (
              <m.p variants={staggerItem} className="mt-6 text-small text-muted">
                <span className="font-medium text-foreground">Currently:</span>{" "}
                <span className="whitespace-nowrap">{current.role}</span>
                <InlineSep />
                <span className="whitespace-nowrap">{current.organization}</span>
                <InlineSep />
                <span className="font-mono text-caption whitespace-nowrap tabular-nums">
                  {formatPeriod(current.period)}
                </span>
              </m.p>
            )}

            <m.div
              variants={staggerItem}
              className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3"
            >
              <div className="flex w-full flex-col gap-3 min-[22.5rem]:w-auto min-[22.5rem]:flex-row">
                <Button href="#projects" className="w-full min-[22.5rem]:w-auto">
                  View projects
                </Button>
                <Button
                  variant="secondary"
                  href={cv.href}
                  download={cv.fileName}
                  className="w-full min-[22.5rem]:w-auto"
                >
                  <DownloadIcon size={16} />
                  Download CV
                </Button>
              </div>
              <span aria-hidden="true" className="hidden h-6 border-l border-border sm:block" />
              <SocialLinks className="-mx-3 sm:mx-0" />
            </m.div>
          </div>

          <m.ul
            aria-label="Key numbers"
            variants={heroStagger}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-6 lg:col-span-2 lg:row-start-2 lg:grid-cols-4 lg:gap-0"
          >
            {profile.stats.map((stat) => {
              const project = stat.projectId ? projectById.get(stat.projectId) : undefined;
              return (
                <m.li
                  key={stat.label}
                  variants={staggerItem}
                  className="lg:border-l lg:border-border lg:px-6 lg:first:border-l-0 lg:first:pl-0"
                >
                  {project && (
                    <>
                      <span
                        aria-hidden="true"
                        className="block font-mono text-caption tracking-[0.08em] text-muted uppercase"
                      >
                        {project.shortTitle ?? project.title}
                      </span>
                      <span className="sr-only">{project.title}: </span>
                    </>
                  )}
                  <span className="mt-1.5 block font-mono text-h2 font-medium tracking-[-0.02em] whitespace-nowrap tabular-nums">
                    <StatValue value={stat.value} />
                  </span>
                  <span className="mt-1 block text-small text-muted">{stat.label}</span>
                </m.li>
              );
            })}
          </m.ul>

          {heroProjects.length > 0 && (
            <m.div
              variants={staggerItem}
              className="mt-12 w-full max-w-xl rounded-lg border border-border bg-surface shadow-trace lg:col-start-2 lg:row-start-1 lg:mt-0 lg:max-w-none"
            >
              <SystemTrace projects={heroProjects} />
            </m.div>
          )}
        </m.div>
      </Container>
    </section>
  );
}
