import { useState, type KeyboardEvent } from "react";
import type { Project } from "@/types/content";
import { cn } from "@/lib/cn";
import { projectPath } from "@/lib/projects";
import { ArrowRightIcon } from "@/components/ui/icons";
import { TraceSteps } from "@/components/sections/TraceSteps";

const tabId = (project: Project) => `hero-tab-${project.id}`;
const panelId = (project: Project) => `hero-panel-${project.id}`;

/**
 * Hero "How it works" card: one tab per project. All panels share one grid cell, so the card always has
 * the height of the tallest panel and switching tabs moves nothing. Inactive panels are `invisible`
 * (out of the tab order and the accessibility tree).
 */
export function SystemTrace({ projects }: { projects: readonly Project[] }) {
  const [active, setActive] = useState(0);
  const tabbed = projects.length > 1;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = projects.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % projects.length
        : event.key === "ArrowLeft"
          ? (active - 1 + projects.length) % projects.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : undefined;
    const target = next === undefined ? undefined : projects[next];
    if (target === undefined) return;
    event.preventDefault();
    setActive(next as number);
    document.getElementById(tabId(target))?.focus();
  };

  return (
    <>
      {tabbed && (
        <div
          role="tablist"
          aria-label="How it works"
          onKeyDown={onKeyDown}
          className="flex border-b border-border px-2 md:px-5"
        >
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              id={tabId(project)}
              aria-selected={i === active}
              aria-controls={panelId(project)}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "-mb-px min-h-11 border-b-2 px-3 py-2 text-small font-medium transition-colors motion-reduce:transition-none",
                i === active
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted hover:text-foreground",
              )}
            >
              {project.title}
            </button>
          ))}
        </div>
      )}
      <div className={cn("grid p-5 md:p-8", tabbed && "md:pt-6")}>
        {projects.map((project, i) => (
          <div
            key={project.id}
            role={tabbed ? "tabpanel" : undefined}
            id={panelId(project)}
            aria-labelledby={tabbed ? tabId(project) : undefined}
            className={cn(
              "flex flex-col [grid-area:1/1]",
              i === active
                ? "transition-opacity duration-150 motion-reduce:transition-none"
                : "invisible opacity-0",
            )}
          >
            <p
              aria-hidden="true"
              className="font-mono text-caption tracking-[0.08em] text-muted uppercase"
            >
              How it works
            </p>
            {tabbed ? (
              <h2 className="mt-2 text-body font-semibold">
                <span className="sr-only">How it works: {project.title}, </span>
                {project.subtitle}
              </h2>
            ) : (
              <>
                <h2 className="mt-2 text-body font-semibold">
                  <span className="sr-only">How it works: </span>
                  {project.title}
                </h2>
                <p className="mt-0.5 text-small text-muted">{project.subtitle}</p>
              </>
            )}
            <TraceSteps
              steps={project.architecture ?? []}
              animated={i === 0}
              className="mt-5 mb-5"
            />
            <div className="mt-auto border-t border-border pt-1">
              <a
                href={projectPath(project.id)}
                className="inline-flex h-11 items-center gap-1.5 text-small font-medium text-accent underline-offset-3 hover:underline"
              >
                See the project
                <ArrowRightIcon size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
