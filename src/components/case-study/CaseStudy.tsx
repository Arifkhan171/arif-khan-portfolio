import { useEffect, useRef, type ReactNode } from "react";
import { m } from "motion/react";
import { content } from "@/data/content";
import { caseStudies } from "@/data/caseStudies";
import { useWindowLoaded } from "@/hooks/useWindowLoaded";
import type { Project } from "@/types/content";
import { duration, easeOut, fadeIn, revealOnScroll, useMotionPresets } from "@/lib/animations";
import { cn } from "@/lib/cn";
import { formatPeriod } from "@/lib/format";
import { projectMeta } from "@/lib/meta";
import { setPageMeta } from "@/lib/pageMeta";
import { projectCover, projectPath } from "@/lib/projects";
import { getNavType } from "@/lib/router";
import { Badge } from "@/components/ui/Badge";
import { cardBase, cardLink } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ArrowRightIcon, GitHubIcon, LockIcon, PlayIcon } from "@/components/ui/icons";
import { PipelineSteps } from "@/components/sections/PipelineSteps";
import { BackLink } from "./BackLink";
import { Screenshots } from "./Screenshots";
import { VideoFacade } from "./VideoFacade";

const sectionTitle = "text-h3";
/** Left column of the body on desktop (the sticky "How it works" card is on the right). */
const left = "lg:col-span-8 lg:col-start-1";
const headerLink =
  "inline-flex h-11 items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline";
const GLANCE_TAGS = 5;

type CaseStudyProps = { project: Project; next: Project | undefined };

export function CaseStudy({ project, next }: CaseStudyProps) {
  const { fadeUp } = useMotionPresets();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const steps = project.architecture ?? [];
  const details = caseStudies[project.id];
  const decisions = details?.decisions ?? [];
  const improvements = details?.improvements ?? [];
  const cover = projectCover(project);
  const glance: [string, string][] = [];
  if (project.role) glance.push(["Role", project.role]);
  if (project.period) glance.push(["Period", formatPeriod(project.period)]);
  if (project.tech.length > 0)
    glance.push(["Stack", project.tech.slice(0, GLANCE_TAGS).join(", ")]);
  if (details?.status) glance.push(["Status", details.status]);
  // Screenshots start downloading after the window "load" event, so they do not slow the first screen.
  const pageLoaded = useWindowLoaded();

  useEffect(() => {
    setPageMeta(projectMeta(content, project));
    // Opened by a click or Back/Forward: start at the new content. A direct load keeps the browser default.
    if (getNavType() !== "load") headingRef.current?.focus({ preventScroll: true });
  }, [project]);

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

        <header className="mt-4 grid gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-caption tracking-[0.08em] text-muted uppercase">
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
            <div className="mt-3 flex flex-wrap items-center gap-x-5 text-small">
              {project.video && (
                <a href="#demo" className={headerLink}>
                  <PlayIcon size={16} />
                  Watch demo
                </a>
              )}
              {project.repo.visibility === "public" ? (
                <a
                  href={project.repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={headerLink}
                >
                  <GitHubIcon size={16} />
                  Code on GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <p className="flex items-start gap-1.5 py-3 text-caption text-muted">
                  <LockIcon size={14} className="mt-0.5 shrink-0" />
                  {project.repo.note}
                </p>
              )}
            </div>
          </div>

          {glance.length > 0 && (
            <section
              aria-labelledby="glance-title"
              className="border-y border-border py-4 lg:col-span-4 lg:rounded-lg lg:border lg:bg-surface lg:p-6"
            >
              <h2
                id="glance-title"
                className="font-mono text-caption tracking-[0.08em] text-muted uppercase"
              >
                At a glance
              </h2>
              <dl className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-small">
                {glance.map(([term, value]) => (
                  <div key={term} className="contents">
                    <dt className="text-muted">{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </header>

        {project.video && (
          <div id="demo" className="mt-10 scroll-mt-[5.5rem]">
            <VideoFacade video={project.video} poster={cover} />
          </div>
        )}

        {project.metrics.length > 0 &&
          reveal(
            <>
              <h2 className={sectionTitle}>Results</h2>
              {details?.resultsNote && (
                <p className="mt-2 max-w-[60ch] text-small text-muted">{details.resultsNote}</p>
              )}
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-8">
                {project.metrics.map((metric) => {
                  const definition = details?.definitions?.[metric.label];
                  return (
                    <li
                      key={metric.label}
                      className="grow basis-full border-t border-border pt-4 sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
                    >
                      <span className="block font-mono text-h3 font-medium whitespace-nowrap tabular-nums">
                        {metric.value}
                      </span>
                      <span className="mt-1 block text-small font-medium">{metric.label}</span>
                      {definition && (
                        <span className="mt-1 block max-w-[46ch] text-small text-muted">
                          {definition}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>,
            "mt-16",
          )}

        {/* All sections are direct children of one grid, so "How it works" can sit after "What I built" on phones. */}
        <div className="mt-16 grid gap-y-16 lg:grid-cols-12 lg:gap-x-12">
          {project.problem &&
            reveal(
              <>
                <h2 className={sectionTitle}>The problem</h2>
                <p className="mt-4 max-w-[60ch]">{project.problem}</p>
              </>,
              left,
            )}
          {project.highlights.length > 0 &&
            reveal(
              <>
                <h2 className={sectionTitle}>What I built</h2>
                <ul className="mt-4 max-w-[60ch] list-disc space-y-2 pl-5 marker:text-muted">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <ul aria-label="Tech stack" className="mt-6 flex flex-wrap gap-1.5">
                  {project.tech.map((name) => (
                    <li key={name}>
                      <Badge>{name}</Badge>
                    </li>
                  ))}
                </ul>
              </>,
              left,
            )}

          {steps.length > 0 && (
            // Desktop: right column beside all left sections, sticky under the navbar until the body ends.
            <m.section
              {...revealOnScroll}
              aria-labelledby="how-title"
              className={cn(
                cardBase,
                "self-start lg:sticky lg:top-[5.5rem] lg:col-span-4 lg:col-start-9 lg:row-span-4 lg:row-start-1",
              )}
            >
              <h2 id="how-title" className={sectionTitle}>
                How it works
              </h2>
              <PipelineSteps steps={steps} className="mt-5" />
            </m.section>
          )}

          {decisions.length > 0 &&
            reveal(
              <>
                <h2 className={sectionTitle}>Key decisions</h2>
                <ol className="mt-5 space-y-6">
                  {decisions.map((decision, i) => (
                    <li
                      key={decision.title}
                      className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3"
                    >
                      <span
                        aria-hidden="true"
                        className="pt-0.5 font-mono text-small text-muted tabular-nums"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-body font-semibold">{decision.title}</h3>
                        <p className="mt-1 max-w-[60ch] text-muted">{decision.why}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>,
              left,
            )}
          {improvements.length > 0 &&
            reveal(
              <>
                <h2 className={sectionTitle}>What I&apos;d improve</h2>
                <ul className="mt-4 max-w-[60ch] list-disc space-y-2 pl-5 marker:text-muted">
                  {improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>,
              left,
            )}
        </div>

        {project.images.length > 0 && (
          <section aria-labelledby="shots-title" className="mt-16">
            <h2 id="shots-title" className={sectionTitle}>
              Screenshots
            </h2>
            <Screenshots images={project.images} load={pageLoaded} />
          </section>
        )}

        <nav aria-label="More projects" className="mt-16 border-t border-border pt-8">
          {next && (
            <a
              href={projectPath(next.id)}
              className={cn(cardBase, cardLink, "group flex items-center justify-between gap-4")}
            >
              <span>
                <span className="block font-mono text-caption tracking-[0.08em] text-muted uppercase">
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
