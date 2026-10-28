// Checks src/data/content.ts for mistakes TypeScript cannot catch.
// Run: npm run validate:content (also runs first in `npm run build`).
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { content } from "../src/data/content.ts";
import type { NavItem, Period, Project, YearMonth } from "../src/types/content.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors: string[] = [];
const fail = (where: string, message: string): void => {
  errors.push(`✗ ${where}: ${message}`);
};

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

function checkProject(project: Project, index: number): void {
  const where = `projects[${project.id || index}]`;
  const need = (ok: boolean, what: string): void => {
    if (!ok) fail(where, `${project.tier} project needs ${what}`);
  };

  if (!SLUG.test(project.id)) fail(where, `id "${project.id}" is not a lowercase slug`);

  if (project.tier === "featured") {
    need(project.period !== undefined, "a period");
    need(Boolean(project.problem), "a problem");
    need(Boolean(project.role), "a role");
    need(project.images.length > 0, "at least one image");
    need(project.metrics.length > 0, "at least one metric");
    need(project.video !== undefined, "a video");
    need(project.summary.trim() !== "", "a summary");
  } else if (project.tier === "other") {
    need(Boolean(project.problem), "a problem");
    need(Boolean(project.role), "a role");
  }

  if (project.period) checkPeriod(`${where}.period`, project.period);

  project.images.forEach((image, i) => {
    const at = `${where}.images[${i}]`;
    if (image.alt.trim() === "") fail(at, "alt text is empty");
    const prefix = `/images/projects/${project.id}/`;
    if (!image.src.startsWith(prefix) || !image.src.endsWith(".webp")) {
      fail(at, `src "${image.src}" must start with ${prefix} and end with .webp`);
    } else if (!existsSync(resolve(root, "public", image.src.slice(1)))) {
      fail(at, `file not found: public${image.src}`);
    } else if (Number.isInteger(image.width) && Number.isInteger(image.height)) {
      const real = webpSize(readFileSync(resolve(root, "public", image.src.slice(1))));
      if (real === undefined) {
        fail(at, "not a valid WebP file");
      } else if (real.width !== image.width || real.height !== image.height) {
        fail(
          at,
          `width/height ${image.width}×${image.height} do not match the file (${real.width}×${real.height})`,
        );
      }
    }
    if (!Number.isInteger(image.width) || image.width <= 0) {
      fail(at, `width "${image.width}" must be a positive integer`);
    }
    if (!Number.isInteger(image.height) || image.height <= 0) {
      fail(at, `height "${image.height}" must be a positive integer`);
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

// Hero section (Spec 05): the layout is built for exactly 4 stats; the rest is derived from content.
const stats = content.profile.stats;
if (stats.length !== 4) fail("profile.stats", `must have exactly 4 items (found ${stats.length})`);
stats.forEach((stat, i) => {
  if (stat.value.trim() === "" || stat.label.trim() === "") {
    fail(`profile.stats[${i}]`, "value and label must not be empty");
  }
});
const experienceCount: number = content.experience.length;
if (experienceCount === 0) fail("experience", "must not be empty (hero Currently line)");
const heroProject = projects
  .filter((p) => p.tier === "featured")
  .toSorted((a, b) => a.order - b.order)[0];
if (heroProject === undefined) {
  fail("projects", "needs a featured project (hero pipeline card)");
} else {
  const steps = heroProject.architecture ?? [];
  if (steps.length < 3 || steps.some((step) => step.trim() === "")) {
    fail(
      `projects[${heroProject.id}]`,
      "hero project needs at least 3 non-empty architecture steps",
    );
  }
  if (heroProject.subtitle.trim() === "") fail(`projects[${heroProject.id}]`, "subtitle is empty");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} content error(s) found.`);
  process.exitCode = 1;
} else {
  const imageCount = projects.reduce((sum, project) => sum + project.images.length, 0);
  console.log(
    `✓ Content is valid (${projects.length} projects, ${imageCount} images, ${navigation.length} nav items, CV found)`,
  );
}
