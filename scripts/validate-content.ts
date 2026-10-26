// Checks src/data/content.ts for mistakes TypeScript cannot catch.
// Run: npm run validate:content (also runs first in `npm run build`).
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { content } from "../src/data/content.ts";
import type { Period, Project, YearMonth } from "../src/types/content.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors: string[] = [];
const fail = (where: string, message: string): void => {
  errors.push(`✗ ${where}: ${message}`);
};

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
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
    }
  });

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

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} content error(s) found.`);
  process.exitCode = 1;
} else {
  const imageCount = projects.reduce((sum, project) => sum + project.images.length, 0);
  console.log(`✓ Content is valid (${projects.length} projects, ${imageCount} images)`);
}
