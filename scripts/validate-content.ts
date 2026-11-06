// Checks src/data/content.ts for mistakes TypeScript cannot catch.
// Run: npm run validate:content (also runs first in `npm run build`).
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { content } from "../src/data/content.ts";
import type {
  Experience,
  NavItem,
  Period,
  Project,
  SkillGroup,
  TimelineItem,
  YearMonth,
} from "../src/types/content.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors: string[] = [];
const fail = (where: string, message: string): void => {
  errors.push(`✗ ${where}: ${message}`);
};

const blank = (s: string): boolean => s.trim() === "";
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

function checkPeriod(where: string, period: Period): void {
  const startOk = YEAR_MONTH.test(period.start);
  const endOk = period.end === "present" || YEAR_MONTH.test(period.end);
  if (!startOk) fail(where, `start "${period.start}" is not YYYY-MM`);
  if (!endOk) fail(where, `end "${period.end}" is not YYYY-MM or "present"`);
  // "YYYY-MM" strings sort correctly, so a plain comparison is enough.
  if (startOk && endOk && period.end !== "present" && period.start > (period.end as YearMonth)) {
    fail(where, `start ${period.start} is after end ${period.end}`);
  }
}

/** Reads the pixel size from a WebP header (lossy "VP8 ", lossless "VP8L" or extended "VP8X"). */
function webpSize(file: Buffer): { width: number; height: number } | undefined {
  if (file.length < 30 || file.toString("ascii", 0, 4) !== "RIFF") return undefined;
  if (file.toString("ascii", 8, 12) !== "WEBP") return undefined;
  const kind = file.toString("ascii", 12, 16);
  if (kind === "VP8 ") {
    return { width: file.readUInt16LE(26) & 0x3fff, height: file.readUInt16LE(28) & 0x3fff };
  }
  if (kind === "VP8L") {
    const bits = file.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (kind === "VP8X") {
    return { width: file.readUIntLE(24, 3) + 1, height: file.readUIntLE(27, 3) + 1 };
  }
  return undefined;
}

/** The file exists under public/, is a WebP, and its real pixel size matches `width`/`height`. */
function checkWebp(at: string, src: string, width: number, height: number): void {
  const file = resolve(root, "public", src.slice(1));
  if (!existsSync(file)) {
    fail(at, `file not found: public${src}`);
  } else if (Number.isInteger(width) && Number.isInteger(height)) {
    const real = webpSize(readFileSync(file));
    if (real === undefined) {
      fail(at, "not a valid WebP file");
    } else if (real.width !== width || real.height !== height) {
      fail(
        at,
        `width/height ${width}×${height} do not match the file (${real.width}×${real.height})`,
      );
    }
  }
  if (!Number.isInteger(width) || width <= 0)
    fail(at, `width "${width}" must be a positive integer`);
  if (!Number.isInteger(height) || height <= 0)
    fail(at, `height "${height}" must be a positive integer`);
}

function checkProject(project: Project, index: number): void {
  const where = `projects[${project.id || index}]`;
  const need = (ok: boolean, what: string): void => {
    if (!ok) fail(where, `${project.tier} project needs ${what}`);
  };

  if (!SLUG.test(project.id)) fail(where, `id "${project.id}" is not a lowercase slug`);

  if (project.tier === "featured") {
    need(project.period !== undefined, "a period");
    need((project.problem ?? "").trim() !== "", "a non-empty problem");
    need(Boolean(project.role), "a role");
    need(
      project.highlights.filter((h) => h.trim() !== "").length >= 2,
      "at least 2 non-empty highlights",
    );
    const steps = project.architecture ?? [];
    need(
      steps.length >= 3 && steps.every((step) => step.trim() !== ""),
      "at least 3 non-empty architecture steps",
    );
    need(project.images.length > 0, "at least one image");
    need(project.metrics.length > 0, "at least one metric");
    need(project.video !== undefined, "a video");
    need(project.summary.trim() !== "", "a summary");
  } else if (project.tier === "other") {
    need(Boolean(project.problem), "a problem");
    need(Boolean(project.role), "a role");
    need(project.metrics.length > 0, "at least one metric");
    need(project.summary.trim() !== "", "a summary");
  } else {
    need(project.repo.visibility === "public", "a public repo");
    need(project.summary.trim() !== "", "a summary");
  }

  if (project.period) checkPeriod(`${where}.period`, project.period);

  project.images.forEach((image, i) => {
    const at = `${where}.images[${i}]`;
    if (image.alt.trim() === "") fail(at, "alt text is empty");
    const prefix = `/images/projects/${project.id}/`;
    if (!image.src.startsWith(prefix) || !image.src.endsWith(".webp")) {
      fail(at, `src "${image.src}" must start with ${prefix} and end with .webp`);
    } else {
      checkWebp(at, image.src, image.width, image.height);
    }
  });
  project.metrics.forEach((metric, i) => {
    const method = metric.method;
    if (method !== undefined && (blank(method) || method.length > 40)) {
      fail(`${where}.metrics[${i}].method`, "must be 1-40 characters");
    }
  });

  if (project.video !== undefined && !YOUTUBE_ID.test(project.video.youtubeId)) {
    fail(
      `${where}.video`,
      `youtubeId "${project.video.youtubeId}" must be 11 characters of A-Z a-z 0-9 _ -`,
    );
  }

  if (project.repo.visibility === "public" && !project.repo.url.startsWith("https://github.com/")) {
    fail(`${where}.repo`, `url "${project.repo.url}" must start with https://github.com/`);
  }
  if (project.repo.visibility === "private" && project.repo.note.trim() === "") {
    fail(`${where}.repo`, "a private repo needs a note");
  }
  if (project.demoUrl !== undefined && !project.demoUrl.startsWith("https://")) {
    fail(where, `demoUrl "${project.demoUrl}" must start with https://`);
  }
}

const projects: readonly Project[] = content.projects;

const ids = new Set<string>();
const orders = new Set<string>();
projects.forEach((project, index) => {
  if (ids.has(project.id)) fail(`projects[${project.id}]`, "duplicate id");
  ids.add(project.id);
  const orderKey = `${project.tier}:${project.order}`;
  if (orders.has(orderKey)) {
    fail(
      `projects[${project.id}]`,
      `order ${project.order} is already used in tier "${project.tier}"`,
    );
  }
  orders.add(orderKey);
  checkProject(project, index);
});

content.experience.forEach((item, i) => {
  checkPeriod(`experience[${i}].period`, item.period);
});
content.education.forEach((item, i) => {
  checkPeriod(`education[${i}].period`, item.period);
});

// Experience, education, timeline and skills (Spec 08).
const experienceItems: readonly Experience[] = content.experience;
experienceItems.forEach((item, i) => {
  const where = `experience[${i}]`;
  for (const key of ["role", "organization", "location", "employmentType"] as const) {
    if (blank(item[key])) fail(where, `${key} is empty`);
  }
  if (item.highlights.length < 1 || item.highlights.length > 4) {
    fail(where, `needs 1-4 highlights (found ${item.highlights.length})`);
  }
  if (item.highlights.some(blank)) fail(where, "has an empty highlight");
  if (item.tech.some(blank)) fail(where, "has an empty tech name");
});
content.education.forEach((item, i) => {
  for (const key of ["degree", "institution", "grade"] as const) {
    if (blank(item[key])) fail(`education[${i}]`, `${key} is empty`);
  }
});

const timeline: readonly TimelineItem[] = content.timeline;
if (timeline.length === 0) fail("timeline", "must not be empty");
timeline.forEach((item, i) => {
  const where = `timeline[${i}]`;
  if (!Number.isInteger(item.year) || item.year < 2000 || item.year > 2100) {
    fail(where, `year ${item.year} must be an integer from 2000 to 2100`);
  }
  const prev = timeline[i - 1];
  if (prev && item.year <= prev.year) {
    fail(where, `year ${item.year} must be after ${prev.year} (sorted, no duplicates)`);
  }
  if (blank(item.title) || blank(item.description)) {
    fail(where, "title and description must not be empty");
  }
});

const skills: readonly SkillGroup[] = content.skills;
const groupNames = new Set<string>();
if (skills.length < 3 || skills.length > 7) {
  fail("skills", `must have 3-7 groups (found ${skills.length})`);
}
const skillGroupOf = new Map<string, string>();
skills.forEach((group, i) => {
  const where = `skills[${group.name || i}]`;
  if (blank(group.name)) fail(where, "name is empty");
  if (groupNames.has(group.name)) fail(where, "duplicate group name");
  groupNames.add(group.name);
  if (group.items.length < 2 || group.items.length > 10) {
    fail(where, `needs 2-10 items (found ${group.items.length})`);
  }
  for (const name of new Set(group.items)) {
    const other = skillGroupOf.get(name);
    if (other !== undefined) fail(where, `"${name}" is already in "${other}"`);
    else skillGroupOf.set(name, group.name);
  }
  if (group.items.some(blank)) fail(where, "has an empty item");
  const dupes = group.items.filter((name, j) => group.items.indexOf(name) !== j);
  if (dupes.length > 0) fail(where, `duplicate item(s): ${dupes.join(", ")}`);
});

const RESERVED_IDS = new Set(["main", "top", "hero"]);
const navigation: readonly NavItem[] = content.navigation;
const navIds = new Set<string>();
if (navigation.length === 0) fail("navigation", "must not be empty");
navigation.forEach((item, i) => {
  const where = `navigation[${item.id || i}]`;
  if (!SLUG.test(item.id)) fail(where, `id "${item.id}" is not a lowercase slug`);
  if (navIds.has(item.id)) fail(where, "duplicate id");
  navIds.add(item.id);
  if (RESERVED_IDS.has(item.id)) fail(where, `id "${item.id}" is reserved`);
  if (item.label.trim() === "") fail(where, "label is empty");
});

if (!navIds.has("projects"))
  fail("navigation", 'needs an item with id "projects" (featured projects)');

const cv = content.profile.links.cv;
if (!cv.href.startsWith("/cv/") || !cv.href.endsWith(".pdf")) {
  fail("profile.links.cv", `href "${cv.href}" must start with /cv/ and end with .pdf`);
} else if (!existsSync(resolve(root, "public", cv.href.slice(1)))) {
  fail("profile.links.cv", `file not found: public${cv.href}`);
}
if (!cv.fileName.endsWith(".pdf") || /[\\/]/.test(cv.fileName)) {
  fail("profile.links.cv", `fileName "${cv.fileName}" must end with .pdf and contain no slash`);
}

// About section (Spec 13).
const about: readonly string[] = content.profile.about;
if (about.length < 2 || about.length > 4) {
  fail("profile.about", `must have 2-4 paragraphs (found ${about.length})`);
}
if (about.some(blank)) fail("profile.about", "has an empty paragraph");
const aboutWords = about.join(" ").split(/\s+/).filter(Boolean).length;
if (aboutWords > 130) fail("profile.about", `must be 130 words or fewer (found ${aboutWords})`);
const photo = content.profile.photo;
if (blank(photo.alt)) fail("profile.photo", "alt text is empty");
if (!photo.src.startsWith("/images/about/") || !photo.src.endsWith(".webp")) {
  fail("profile.photo", `src "${photo.src}" must start with /images/about/ and end with .webp`);
} else {
  checkWebp("profile.photo", photo.src, photo.width, photo.height);
}

// Contact section (Spec 09, heading Spec 13).
const heading: string = content.profile.contactHeading.trim();
if (heading === "" || heading.length > 80) {
  fail("profile.contactHeading", `must be 1-80 characters (found ${heading.length})`);
}
const message: string = content.profile.contactMessage.trim();
if (message === "" || message.length > 200) {
  fail("profile.contactMessage", `must be 1-200 characters (found ${message.length})`);
}

// Hero section (Spec 05): the layout is built for exactly 4 stats; the rest is derived from content.
const stats = content.profile.stats;
if (stats.length !== 4) fail("profile.stats", `must have exactly 4 items (found ${stats.length})`);
stats.forEach((stat, i) => {
  if (stat.value.trim() === "" || stat.label.trim() === "") {
    fail(`profile.stats[${i}]`, "value and label must not be empty");
  }
});
const projectById = new Map<string, Project>(projects.map((p) => [p.id, p]));
const tagline = content.profile.tagline.trim();
if (tagline === "" || tagline.length > 140) {
  fail("profile.tagline", `must be 1-140 characters (found ${tagline.length})`);
}
stats.forEach((stat, i) => {
  if (stat.projectId === undefined) return;
  const project = projectById.get(stat.projectId);
  if (project?.tier !== "featured") {
    fail(`profile.stats[${i}]`, `projectId "${stat.projectId}" is not a featured project`);
  }
});
const heroIds: readonly string[] = content.profile.heroProjects;
if (heroIds.length < 1 || heroIds.length > 3) {
  fail("profile.heroProjects", `must have 1-3 ids (found ${heroIds.length})`);
}
heroIds.forEach((id, i) => {
  if (heroIds.indexOf(id) !== i) fail("profile.heroProjects", `duplicate id "${id}"`);
  const project = projectById.get(id);
  if (project?.tier !== "featured") {
    fail("profile.heroProjects", `"${id}" is not a featured project`);
  } else {
    if ((project.architecture ?? []).length === 0) {
      fail("profile.heroProjects", `"${id}" has no architecture`);
    }
    if (blank(project.subtitle)) fail("profile.heroProjects", `"${id}" has an empty subtitle`);
  }
});
if (!/^UTC[+-]\d{1,2}(:\d{2})?$/.test(content.profile.timezone)) {
  fail("profile.timezone", `"${content.profile.timezone}" must look like UTC+5 or UTC-3:30`);
}
projects.forEach((project) => {
  const short = project.shortTitle;
  if (short !== undefined && (short.trim() === "" || short.length > 12)) {
    fail(`projects[${project.id}].shortTitle`, "must be 1-12 characters");
  }
});
const experienceCount: number = content.experience.length;
if (experienceCount === 0) fail("experience", "must not be empty (hero Currently line)");

// Site meta (Spec 10). The head tags are generated from content, so index.html must not hold a copy.
try {
  const url = new URL(content.site.url);
  if (url.protocol !== "https:") fail("site.url", "must start with https://");
  if (url.pathname !== "/" || url.search || url.hash || content.site.url.endsWith("/")) {
    fail("site.url", "must be an origin without a path or trailing slash");
  }
} catch {
  fail("site.url", `"${content.site.url}" is not a valid URL`);
}
if (blank(content.site.language)) fail("site.language", "is empty");
if (blank(content.site.title) || blank(content.site.description)) {
  fail("site", "title and description must not be empty");
}
const indexHtml = readFileSync(resolve(root, "index.html"), "utf8");
if (!indexHtml.includes("<!-- site-head -->")) fail("index.html", "is missing <!-- site-head -->");
if (/<title|name="description"/.test(indexHtml)) {
  fail("index.html", "must not contain <title> or a description; they come from content.site");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} content error(s) found.`);
  process.exitCode = 1;
} else {
  const imageCount = projects.reduce((sum, project) => sum + project.images.length, 0);
  console.log(
    `✓ Content is valid (${projects.length} projects, ${imageCount} images, ${navigation.length} nav items, ${timeline.length} timeline years, ${skills.length} skill groups, CV found)`,
  );
}
