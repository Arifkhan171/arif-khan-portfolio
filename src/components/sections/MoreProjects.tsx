import { m } from "motion/react";
import { content } from "@/data/content";
import { revealOnScroll, stagger, useMotionPresets } from "@/lib/animations";
import { getProjectsByTier, projectAnchorId } from "@/lib/projects";
import { Section } from "@/components/ui/Section";
import { ArrowRightIcon, GitHubIcon, LockIcon } from "@/components/ui/icons";

/** How many practice repositories are named in the one-line summary. */
const LEARNING_NAMES = 3;

/** Smaller projects as compact rows (one metric each), plus one line for the practice repositories. */
export function MoreProjects() {
  const { staggerItem } = useMotionPresets();
  const others = getProjectsByTier(content.projects, "other");
  const learning = getProjectsByTier(content.projects, "learning");
  if (others.length === 0 && learning.length === 0) return null;
  const names = learning.slice(0, LEARNING_NAMES).map((p) => p.title);
  const more = learning.length > LEARNING_NAMES ? ", …" : "";

  return (
    <Section id="more-projects" eyebrow="Smaller builds" title="More projects">
      {others.length > 0 && (
        <m.ul variants={stagger} {...revealOnScroll} className="grid lg:grid-cols-2 lg:gap-x-10">
          {others.map((project) => {
            const metric = project.metrics[0];
            return (
              <m.li
                key={project.id}
                id={projectAnchorId(project.id)}
                variants={staggerItem}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-t border-border py-4 first:border-t-0 md:grid-cols-[minmax(0,1fr)_auto_auto] lg:[&:nth-child(2)]:border-t-0"
              >
                <div className="col-start-1 row-start-1">
                  <h3 className="text-body font-semibold">{project.title}</h3>
                  <p className="text-small text-balance text-muted">{project.subtitle}</p>
                </div>
                {metric && (
                  // Phone: one mono line under the subtitle. From 768 px: value, label and method stacked on the right.
                  <p className="col-start-1 row-start-2 mt-1 font-mono text-caption tracking-normal text-muted md:col-start-2 md:row-start-1 md:mt-0 md:text-right">
                    <span className="text-small font-medium whitespace-nowrap text-foreground tabular-nums md:block md:text-body">
                      {metric.value}
                    </span>{" "}
                    <span className="md:block">{metric.label}</span>
                    {metric.method && (
                      <>
                        <span aria-hidden="true" className="md:hidden">
                          {" · "}
                        </span>
                        <span className="whitespace-nowrap md:block">{metric.method}</span>
                      </>
                    )}
                  </p>
                )}
                {project.repo.visibility === "public" ? (
                  <a
                    href={project.repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-start-2 row-span-2 row-start-1 -mr-2.5 inline-flex size-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-foreground md:col-start-3 md:row-span-1"
                  >
                    <GitHubIcon size={20} />
                    <span className="sr-only">
                      {project.title} code on GitHub (opens in a new tab)
                    </span>
                  </a>
                ) : (
                  <span className="col-start-2 row-span-2 row-start-1 -mr-2.5 inline-flex size-11 items-center justify-center text-muted md:col-start-3 md:row-span-1">
                    <LockIcon size={18} />
                    <span className="sr-only">{project.repo.note}</span>
                  </span>
                )}
              </m.li>
            );
          })}
        </m.ul>
      )}
      {learning.length > 0 && (
        <p className="mt-6 border-t border-border pt-3">
          <a
            href={`${content.profile.links.github}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 text-small text-muted transition-colors hover:text-foreground"
          >
            Plus {learning.length} practice repositories ({names.join(", ")}
            {more}) on GitHub
            <ArrowRightIcon size={16} className="ml-1.5 inline align-[-3px]" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      )}
    </Section>
  );
}
