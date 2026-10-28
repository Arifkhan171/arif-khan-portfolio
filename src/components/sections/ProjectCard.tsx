import { m } from "motion/react";
import type { Project } from "@/types/content";
import { formatPeriod } from "@/lib/format";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { projectAnchorId, projectPath, youtubeWatchUrl } from "@/lib/projects";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InlineSep } from "@/components/ui/InlineSep";
import { GitHubIcon, LockIcon, PlayIcon } from "@/components/ui/icons";

type ProjectCardProps = {
  project: Project;
  /** lead = wide card (image beside text on desktop), grid = image on top. */
  variant: "lead" | "grid";
};

const MAX_METRICS = 3;
const TECH_LIMIT = { lead: 8, grid: 6 } as const;

export function ProjectCard({ project, variant }: ProjectCardProps) {
  const { fadeUp } = useMotionPresets();
  const lead = variant === "lead";
  const titleId = `${project.id}-title`;
  const cover = project.images[0];
  const metrics = project.metrics.slice(0, MAX_METRICS);

  // Never show "+1 more": that badge would be as wide as the name it hides.
  const limit = TECH_LIMIT[variant];
  const shown = project.tech.length > limit + 1 ? project.tech.slice(0, limit) : project.tech;
  const hidden = project.tech.slice(shown.length);

  return (
    <m.div variants={fadeUp} {...revealOnScroll} className="h-full">
      <Card
        as="article"
        id={projectAnchorId(project.id)}
        aria-labelledby={titleId}
        className={cn(
          "flex h-full flex-col",
          lead && "lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-center lg:gap-x-8",
        )}
      >
        {cover && (
          <a
            href={projectPath(project.id)}
            tabIndex={-1}
            aria-hidden="true"
            className="block rounded-md lg:col-start-1 lg:row-start-1"
          >
            <img
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              loading="lazy"
              decoding="async"
              className="aspect-[2/1] w-full rounded-md border border-border bg-surface-muted object-cover object-top transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-raised"
            />
          </a>
        )}

        <div className={cn("mt-5", lead && "lg:col-start-2 lg:row-start-1 lg:mt-0")}>
          <h3 id={titleId} className="text-h3">
            {project.title}
          </h3>
          <p className="mt-1 text-small text-muted">{project.subtitle}</p>
          {project.role && project.period && (
            <p className="mt-2 text-small text-muted">
              <span>{project.role}</span>
              <InlineSep />
              <span className="font-mono text-caption whitespace-nowrap tabular-nums">
                {formatPeriod(project.period)}
              </span>
            </p>
          )}
          <p className={cn("mt-4 max-w-prose text-small text-foreground", lead && "lg:text-body")}>
            {project.summary}
          </p>

          {metrics.length > 0 && (
            <ul
              aria-label="Key results"
              className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-4"
            >
              {metrics.map((metric) => (
                <li key={metric.label} className="min-w-max flex-1 basis-[5.5rem]">
                  <span className="block font-mono text-h3 font-medium whitespace-nowrap tabular-nums">
                    {metric.value}
                  </span>
                  <span className="mt-1 block contain-inline-size text-caption text-muted">
                    {metric.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={cn("mt-5 flex flex-1 flex-col", lead && "lg:col-span-2")}>
          <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
            {shown.map((name) => (
              <li key={name}>
                <Badge>{name}</Badge>
              </li>
            ))}
            {hidden.length > 0 && (
              <li>
                <Badge
                  className="border border-border bg-transparent text-muted"
                  title={`and ${hidden.length} more: ${hidden.join(", ")}`}
                >
                  <span aria-hidden="true">+{hidden.length} more</span>
                  <span className="sr-only">
                    and {hidden.length} more: {hidden.join(", ")}
                  </span>
                </Badge>
              </li>
            )}
          </ul>

          <div className="mt-auto pt-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4">
              <Button href={projectPath(project.id)}>
                Read case study
                <span className="sr-only">: {project.title}</span>
              </Button>
              {project.video && (
                <Button variant="secondary" href={youtubeWatchUrl(project.video.youtubeId)}>
                  <PlayIcon size={16} />
                  Watch demo
                  <span className="sr-only"> of {project.title} (opens in a new tab)</span>
                </Button>
              )}
              {project.repo.visibility === "public" ? (
                <Button variant="ghost" href={project.repo.url}>
                  <GitHubIcon size={16} />
                  Code
                  <span className="sr-only">
                    {" "}
                    for {project.title} on GitHub (opens in a new tab)
                  </span>
                </Button>
              ) : (
                <p className="flex items-start gap-1.5 text-caption text-muted">
                  <LockIcon size={14} className="mt-0.5 shrink-0" />
                  {project.repo.note}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </m.div>
  );
}
