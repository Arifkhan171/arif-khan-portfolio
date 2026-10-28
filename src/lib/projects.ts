import type { Project } from "../types/content.ts";

/** Featured projects, in display order. */
export function getFeaturedProjects(projects: readonly Project[]): readonly Project[] {
  return projects.filter((p) => p.tier === "featured").toSorted((a, b) => a.order - b.order);
}

/** Anchor id of a project's card, e.g. "project-neuroai". */
export function projectAnchorId(id: string): string {
  return `project-${id}`;
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/** URL of a featured project's case study page, e.g. "/projects/neuroai". */
export function projectPath(id: string): string {
  return `/projects/${id}`;
}
