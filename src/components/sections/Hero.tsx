import { m, type Variants } from "motion/react";
import { content } from "@/data/content";
import { formatPeriod } from "@/lib/format";
import { useMotionPresets } from "@/lib/animations";
import { getFeaturedProjects, projectPath } from "@/lib/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { InlineSep } from "@/components/ui/InlineSep";
import { ArrowRightIcon, DownloadIcon, MapPinIcon } from "@/components/ui/icons";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { PipelineSteps } from "@/components/sections/PipelineSteps";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";

// Containers only change timing (no position), so they are safe with reduced motion.
const heroStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

const { profile, projects, experience } = content;
const current = experience[0];
const heroProject = getFeaturedProjects(projects)[0];
const steps = heroProject?.architecture ?? [];

export function Hero() {
  const { staggerItem } = useMotionPresets();
  const { cv } = profile.links;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate -mt-header overflow-hidden pt-[calc(var(--spacing-header)+2.5rem)] pb-16 lg:pt-[calc(var(--spacing-header)+3rem)] lg:pb-24"
    >
      <HeroBackdrop />
      <Container>
        <m.div
          variants={heroStagger}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-x-12"
        >
          <div className="lg:col-start-1 lg:row-start-1">
            <m.div variants={staggerItem} className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Badge className="gap-2 border border-border bg-surface py-1 pr-3 pl-2.5">
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
                {profile.location}
              </p>
            </m.div>

            {/* Not animated: the name is the main content and a likely LCP element. */}
            <h1 id="hero-title" className="mt-6 text-display">
              {profile.name}
            </h1>
            <m.p variants={staggerItem} className="mt-3 text-h3 font-medium text-accent">
              {profile.title}
            </m.p>
            <m.p variants={staggerItem} className="mt-5 max-w-prose text-lead text-foreground">
              {profile.tagline}
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
            {profile.stats.map((stat) => (
              <m.li
                key={stat.label}
                variants={staggerItem}
                className="lg:border-l lg:border-border lg:px-6 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="block font-mono text-h2 font-medium tabular-nums">
                  {stat.value}
                </span>
                <span className="mt-1 block max-w-[22ch] text-small text-muted">{stat.label}</span>
              </m.li>
            ))}
          </m.ul>

          {heroProject && steps.length > 0 && (
            // Same base classes as `Card` (not used: it can only animate together with the hover lift).
            <m.article
              variants={staggerItem}
              aria-labelledby="hero-pipeline-title"
              className="relative mt-12 w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface p-6 shadow-soft before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-accent before:to-transparent before:opacity-60 lg:col-start-2 lg:row-start-1 lg:mt-0 lg:max-w-none"
            >
              <p
                aria-hidden="true"
                className="font-mono text-caption tracking-[0.08em] text-accent uppercase"
              >
                How it works
              </p>
              <h2 id="hero-pipeline-title" className="mt-2 text-body font-semibold">
                <span className="sr-only">How it works: </span>
                {heroProject.title}
              </h2>
              <p className="mt-0.5 text-small text-muted">{heroProject.subtitle}</p>

              <PipelineSteps steps={steps} className="mt-5" />

              <div className="mt-5 border-t border-border pt-1">
                <a
                  href={projectPath(heroProject.id)}
                  className="inline-flex h-11 items-center gap-1.5 text-small font-medium text-accent underline-offset-4 hover:underline"
                >
                  See the project
                  <ArrowRightIcon size={16} />
                </a>
              </div>
            </m.article>
          )}
        </m.div>
      </Container>
    </section>
  );
}
