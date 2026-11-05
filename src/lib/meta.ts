// Page titles, descriptions and URLs. Pure (no DOM, no "@/" alias): used by the build plugin
// (scripts/vite-plugin-site.ts) and by the browser, so both always agree.
import type { Project, SiteContent } from "../types/content.ts";
import { projectPath } from "./projects.ts";

export type PageMeta = { title: string; description: string; path: string };

/** `path` starts with "/"; `site.url` has no trailing slash (the validator checks it). */
export const absoluteUrl = (c: SiteContent, path: string): string => c.site.url + path;

export const homeMeta = (c: SiteContent): PageMeta => ({
  title: c.site.title,
  description: c.site.description,
  path: "/",
});

export const projectMeta = (c: SiteContent, p: Project): PageMeta => ({
  title: `${p.title} — ${c.profile.name}`,
  description: p.summary,
  path: projectPath(p.id),
});

export const notFoundMeta = (c: SiteContent, what: "Page" | "Project", path: string): PageMeta => ({
  title: `${what} not found — ${c.profile.name}`,
  description: c.site.description,
  path,
});

export const OG_IMAGE_PATH = "/og/og-default.png";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** What the Open Graph image shows, as text. */
export const ogImageAlt = (c: SiteContent): string =>
  `${c.profile.name}, ${c.profile.title}. ` +
  c.profile.stats
    .slice(0, 3)
    .map((s) => `${s.value} ${s.label}`)
    .join(" · ");
