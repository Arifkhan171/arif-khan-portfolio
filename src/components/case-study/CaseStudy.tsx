import { useEffect, useRef, type ReactNode } from "react";
import { m } from "motion/react";
import { content } from "@/data/content";
import type { Project } from "@/types/content";
import { duration, easeOut, fadeIn, revealOnScroll, useMotionPresets } from "@/lib/animations";
import { formatPeriod } from "@/lib/format";
import { projectPath } from "@/lib/projects";
import { getNavType } from "@/lib/router";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { InlineSep } from "@/components/ui/InlineSep";
import { ArrowRightIcon, GitHubIcon, LockIcon } from "@/components/ui/icons";
import { PipelineSteps } from "@/components/sections/PipelineSteps";
import { BackLink } from "./BackLink";
import { VideoFacade } from "./VideoFacade";

const sectionTitle = "text-h3";

type CaseStudyProps = { project: Project; next: Project | undefined };

export function CaseStudy({ project, next }: CaseStudyProps) {
  const { fadeUp } = useMotionPresets();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const steps = project.architecture ?? [];

  useEffect(() => {
    document.title = `${project.title} — ${content.profile.name}`;
    // Opened by a click or Back/Forward: start at the new content. A direct load keeps the browser default.
    if (getNavType() !== "load") headingRef.current?.focus({ preventScroll: true });
  }, [project.title]);

  const reveal = (children: ReactNode, className?: string) => (
    <m.section variants={fadeUp} {...revealOnScroll} className={className}>
      {children}
    </m.section>
  );

  return (
    <m.article
      aria-labelledby="case-title"
      {...fadeIn}
      transition={{ duration: duration.base, ease: easeOut }}
    >
      <Container className="pt-6 pb-section lg:pt-8">
        <BackLink projectId={project.id}>Back to projects</BackLink>

        <header className="mt-4 max-w-3xl">
          <p className="font-mono text-caption tracking-[0.08em] text-accent uppercase">
            Case study
          </p>
          <h1
            id="case-title"
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 text-h1 focus:outline-none"
          >
            {project.title}
          </h1>
          <p className="mt-3 text-lead text-muted">{project.subtitle}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-small text-muted">
            {project.role && project.period && (
              <p>
                <span>{project.role}</span>
                <InlineSep />
                <span className="font-mono text-caption whitespace-nowrap tabular-nums">
                  {formatPeriod(project.period)}
                </span>
              </p>
            )}
            {project.repo.visibility === "public" ? (
              <a
                href={project.repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
              >
                <GitHubIcon size={16} />
                Code on GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <p className="flex basis-full items-start gap-1.5 text-caption">
                <LockIcon size={14} className="mt-0.5 shrink-0" />
                {project.repo.note}
              </p>
            )}
          </div>

          <ul aria-label="Tech stack" className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((name) => (
              <li key={name}>
                <Badge>{name}</Badge>
              </li>
            ))}
          </ul>
        </header>

        {project.video && (
          <div className="mt-8">
            <VideoFacade video={project.video} poster={project.images[0]} />
          </div>
        )}

        {project.metrics.length > 0 &&
          reveal(
            <>
              <h2 className={sectionTitle}>Results</h2>
              <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-6 min-[22.5rem]:grid-cols-2 sm:grid-cols-3">
                {project.metrics.map((metric) => (
                  <li key={metric.label} className="border-t border-border pt-4">
                    <span className="block font-mono text-h3 font-medium whitespace-nowrap tabular-nums">
                      {metric.value}
                    </span>
                    <span className="mt-1 block text-small text-muted">{metric.label}</span>
                  </li>
                ))}
              </ul>
            </>,
            "mt-16",
          )}

        <div className="mt-16 grid gap-x-12 gap-y-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="space-y-16">
            {project.problem &&
              reveal(
                <>
                  <h2 className={sectionTitle}>The problem</h2>
                  <p className="mt-4 max-w-[56ch]">{project.problem}</p>
                </>,
              )}
            {project.highlights.length > 0 &&
              reveal(
                <>
                  <h2 className={sectionTitle}>What I built</h2>
                  <ul className="mt-4 max-w-[56ch] list-disc space-y-2 pl-5 marker:text-accent">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </>,
              )}
          </div>

          {steps.length > 0 && (
            <m.section
              {...revealOnScroll}
              aria-labelledby="how-title"
              className="self-start rounded-lg border border-border bg-surface p-6 shadow-soft"
            >
              <h2 id="how-title" className={sectionTitle}>
                How it works
              </h2>
              <PipelineSteps steps={steps} className="mt-5" />
            </m.section>
          )}
        </div>

        {project.images.length > 0 && (
          <section aria-labelledby="shots-title" className="mt-16">
            <h2 id="shots-title" className={sectionTitle}>
              Screenshots
            </h2>
            <div className="mt-5 space-y-10">
              {project.images.map((image) => (
                <m.figure key={image.src} variants={fadeUp} {...revealOnScroll}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-lg border border-border bg-surface-muted"
                  />
                  <figcaption className="mt-3 text-small text-muted">{image.caption}</figcaption>
                </m.figure>
              ))}
            </div>
          </section>
        )}

        <nav aria-label="More projects" className="mt-16 border-t border-border pt-8">
          {next && (
            <a
              href={projectPath(next.id)}
              className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface p-6 shadow-soft transition-shadow hover:shadow-raised"
            >
              <span>
                <span className="block font-mono text-caption tracking-[0.08em] text-accent uppercase">
                  Next project
                </span>
                <span className="mt-2 block text-h3">{next.title}</span>
                <span className="mt-1 block text-small text-muted">{next.subtitle}</span>
              </span>
              <ArrowRightIcon
                size={20}
                className="shrink-0 text-accent transition-transform motion-safe:group-hover:translate-x-1"
              />
            </a>
          )}
          <BackLink projectId={project.id} className="mt-4">
            Back to all projects
          </BackLink>
        </nav>
      </Container>
    </m.article>
  );
}
