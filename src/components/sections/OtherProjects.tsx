import { m } from "motion/react";
import { content } from "@/data/content";
import { formatPeriod } from "@/lib/format";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { getProjectsByTier, projectAnchorId } from "@/lib/projects";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { InlineSep } from "@/components/ui/InlineSep";
import { ArrowRightIcon, GitHubIcon, LockIcon } from "@/components/ui/icons";

const MAX_METRICS = 2;

/** "More projects" cards and the collapsed list of learning repositories, below the featured cards. */
export function OtherProjects() {
  const { staggerItem } = useMotionPresets();
  const others = getProjectsByTier(content.projects, "other");
  const learning = getProjectsByTier(content.projects, "learning");

  return (
    <>
      {others.length > 0 && (
        <div className="mt-16">
          <h3 className="text-h3">More projects</h3>
          <m.ul variants={stagger} {...revealOnScroll} className="mt-6 grid gap-6 md:grid-cols-2">
            {others.map((project) => {
              const titleId = `${project.id}-title`;
              return (
                <m.li key={project.id} variants={staggerItem}>
                  <Card
                    as="article"
                    id={projectAnchorId(project.id)}
                    aria-labelledby={titleId}
                    className="flex h-full flex-col"
                  >
                    <h4 id={titleId} className="text-body font-semibold">
                      {project.title}
                    </h4>
                    <p className="text-small text-muted">{project.subtitle}</p>
                    {project.metrics.length > 0 && (
                      <ul aria-label="Key results" className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                        {project.metrics.slice(0, MAX_METRICS).map((metric) => (
                          <li key={metric.label}>
                            <span className="block font-mono text-lead font-medium whitespace-nowrap tabular-nums">
                              {metric.value}
                            </span>
                            <span className="block text-caption text-muted">{metric.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-4 text-small">{project.summary}</p>
                    {(project.role || project.period) && (
                      <p className="mt-3 text-caption text-muted">
                        {project.role}
                        {project.role && project.period && <InlineSep />}
                        {project.period && (
                          <span className="font-mono whitespace-nowrap tabular-nums">
                            {formatPeriod(project.period)}
                          </span>
                        )}
                      </p>
                    )}
                    <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-1.5">
                      {project.tech.map((name) => (
                        <li key={name} className="max-w-full">
                          <Badge>{name}</Badge>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-x-2 pt-4">
                      {project.repo.visibility === "public" ? (
                        <Button variant="ghost" href={project.repo.url} className="-ml-5">
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
                      {project.demoUrl && (
                        <Button variant="ghost" href={project.demoUrl}>
                          Live demo
                          <span className="sr-only"> of {project.title} (opens in a new tab)</span>
                        </Button>
                      )}
                    </div>
                  </Card>
                </m.li>
              );
            })}
          </m.ul>
        </div>
      )}

      {learning.length > 0 && (
        <details className="group mt-10 rounded-lg border border-border bg-surface">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-5 py-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-body font-semibold">
                Learning repositories ({learning.length})
              </span>
              <span className="block text-small text-muted">
                Practice repositories from my studies.
              </span>
            </span>
            <ArrowRightIcon
              size={18}
              className="shrink-0 text-muted group-open:rotate-90 motion-safe:transition-transform"
            />
          </summary>
          <ul className="grid gap-x-8 border-t border-border px-5 py-2 md:grid-cols-2">
            {learning.map((project) => (
              <li key={project.id} className="relative py-3">
                <a
                  href={project.repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-small font-medium after:absolute after:inset-0 hover:text-accent"
                >
                  {project.title}
                  <span className="sr-only"> on GitHub (opens in a new tab)</span>
                </a>
                <p className="mt-0.5 text-small text-muted">{project.summary}</p>
                <p className="mt-1 font-mono text-caption text-muted">{project.tech.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
