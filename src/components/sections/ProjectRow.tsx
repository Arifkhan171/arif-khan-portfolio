import { m } from "motion/react";
import type { Project } from "@/types/content";
import { formatPeriod } from "@/lib/format";
import { revealOnScroll, useMotionPresets } from "@/lib/animations";
import { projectAnchorId, projectCover, projectPath, youtubeWatchUrl } from "@/lib/projects";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Button } from "@/components/ui/Button";
import { InlineSep } from "@/components/ui/InlineSep";
import { GitHubIcon, LockIcon, PlayIcon } from "@/components/ui/icons";

const MAX_METRICS = 3;
const MAX_TAGS = 5;

type ProjectRowProps = {
  project: Project;
  /** Desktop: image on the right instead of the left (every second row). */
  flip: boolean;
};

/** One featured project: framed cover + text side by side from 1024 px, stacked below. */
export function ProjectRow({ project, flip }: ProjectRowProps) {
  const { fadeUp } = useMotionPresets();
  const titleId = `${project.id}-title`;
  const cover = projectCover(project);
  const metrics = project.metrics.slice(0, MAX_METRICS);
  const shown = project.tech.slice(0, MAX_TAGS);
  const hidden = project.tech.slice(MAX_TAGS);

  return (
    <m.article
      id={projectAnchorId(project.id)}
      aria-labelledby={titleId}
      variants={fadeUp}
      {...revealOnScroll}
      className="grid gap-y-6 lg:grid-cols-12 lg:items-center lg:gap-x-12"
    >
      {cover && (
        // Duplicate of "Read case study" for mouse users: hidden from keyboard and screen readers.
        <a
          href={projectPath(project.id)}
          tabIndex={-1}
          aria-hidden="true"
          className={cn("group block lg:col-span-7 lg:row-start-1", flip && "lg:col-start-6")}
        >
          <BrowserFrame className="group-hover:border-border-hover">
            <img
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              loading="lazy"
              decoding="async"
              className="h-auto w-full transition-transform duration-200 ease-out motion-safe:group-hover:scale-[1.02]"
            />
          </BrowserFrame>
        </a>
      )}

      <div className={cn("lg:col-span-5 lg:row-start-1", flip && "lg:col-start-1")}>
        <h3 id={titleId} className="text-[1.625rem] leading-tight font-semibold tracking-[-0.02em]">
          {project.title}
        </h3>
        <p className="mt-1 text-body text-muted">{project.subtitle}</p>
        {project.role && project.period && (
          <p className="mt-2 text-small text-muted">
            <span>{project.role}</span>
            <InlineSep />
            <span className="font-mono text-caption whitespace-nowrap tabular-nums">
              {formatPeriod(project.period)}
            </span>
          </p>
        )}
        <p className="mt-4 text-small text-foreground lg:text-body">{project.summary}</p>

        {metrics.length > 0 && (
          <ul aria-label="Key results" className="mt-5 flex gap-x-6 border-t border-border pt-4">
            {metrics.map((metric) => (
              <li key={metric.label} className="min-w-0 flex-1">
                <span className="block font-mono text-h3 font-medium whitespace-nowrap tabular-nums">
                  {metric.value}
                </span>
                <span className="mt-1 block text-caption text-muted">{metric.label}</span>
              </li>
            ))}
          </ul>
        )}

        <ul aria-label="Tech stack" className="mt-5 flex flex-wrap gap-1.5">
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
                <span aria-hidden="true">+{hidden.length}</span>
                <span className="sr-only">
                  and {hidden.length} more: {hidden.join(", ")}
                </span>
              </Badge>
            </li>
          )}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
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
              <span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span>
            </Button>
          ) : (
            <p className="flex basis-full items-start gap-1.5 text-caption text-muted">
              <LockIcon size={14} className="mt-0.5 shrink-0" />
              {project.repo.note}
            </p>
          )}
        </div>
      </div>
    </m.article>
  );
}
