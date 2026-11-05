// Checks the finished build in dist/ (SEO tags, generated files, images, headers, bundle size).
// Run: npm run check:dist (after `npm run build`; `npm run check` does both).
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { content } from "../src/data/content.ts";
import { OG_IMAGE_PATH, absoluteUrl, homeMeta, ogImageAlt, projectMeta } from "../src/lib/meta.ts";
import { getFeaturedProjects } from "../src/lib/projects.ts";

/**
 * Main JS budget in kB gzip (Spec 10). Raise it only on purpose. This script measures plain gzip, which
 * is about 0.9 % below the number "vite build" prints: 102.0 here = the 103.0 kB approved in the plan review.
 */
const MAIN_JS_BUDGET_KB = 102.0;

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const errors: string[] = [];
const check = (ok: boolean, message: string): void => {
  if (!ok) errors.push(`✗ ${message}`);
};
const read = (file: string): string => readFileSync(join(dist, file), "utf8");
const escapeHtml = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Content of `<meta name|property="key" content="…">`, or undefined. */
function metaContent(html: string, key: string): string | undefined {
  const match = new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`).exec(html);
  return match?.[1];
}
const canonical = (html: string): string | undefined =>
  /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
const title = (html: string): string | undefined => /<title>([^<]*)<\/title>/.exec(html)?.[1];

function pngSize(file: string): { width: number; height: number; bytes: number } | undefined {
  if (!existsSync(file)) return undefined;
  const png = readFileSync(file);
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20), bytes: png.length };
}

// ---- Home page tags (R2) ----
const home = read("index.html");
const hm = homeMeta(content);
const image = absoluteUrl(content, OG_IMAGE_PATH);
check(home.includes(`<html lang="${content.site.language}"`), "html lang is not site.language");
check(title(home) === escapeHtml(hm.title), "home <title> differs from content.site.title");
const expected: [string, string][] = [
  ["description", hm.description],
  ["og:type", "website"],
  ["og:site_name", content.profile.name],
  ["og:title", hm.title],
  ["og:description", hm.description],
  ["og:url", absoluteUrl(content, "/")],
  ["og:image", image],
  ["og:image:width", "1200"],
  ["og:image:height", "630"],
  ["og:image:alt", ogImageAlt(content)],
  ["twitter:card", "summary_large_image"],
  ["twitter:title", hm.title],
  ["twitter:description", hm.description],
  ["twitter:image", image],
  ["author", content.profile.name],
  ["theme-color", "#fafaf7"],
];
for (const [key, value] of expected) {
  check(metaContent(home, key) === escapeHtml(value), `home meta "${key}" is wrong or missing`);
}
check(canonical(home) === absoluteUrl(content, "/"), "home canonical is wrong or missing");
check(!/<meta name="robots"/.test(home), "home must not have a robots meta");
check(/rel="apple-touch-icon" href="\/apple-touch-icon\.png"/.test(home), "apple-touch-icon link");
check(/href="\/favicon-32x32\.png" sizes="32x32"/.test(home), "32x32 favicon link");

// ---- JSON-LD (R6) ----
const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(home)?.[1];
try {
  const data = JSON.parse(ld ?? "") as { "@graph": { "@type": string; sameAs?: string[] }[] };
  const person = data["@graph"].find((node) => node["@type"] === "Person");
  check(
    data["@graph"].some((node) => node["@type"] === "WebSite"),
    "JSON-LD has no WebSite",
  );
  check(person?.sameAs?.includes(content.profile.links.github) === true, "JSON-LD sameAs: GitHub");
  check(
    person?.sameAs?.includes(content.profile.links.linkedin) === true,
    "JSON-LD sameAs: LinkedIn",
  );
} catch {
  check(false, "JSON-LD is missing or is not valid JSON");
}

// ---- Case study pages (R4) and 404 ----
const featured = getFeaturedProjects(content.projects);
for (const project of featured) {
  const file = `projects/${project.id}.html`;
  if (!existsSync(join(dist, file))) {
    check(false, `${file} is missing`);
    continue;
  }
  const html = read(file);
  const pm = projectMeta(content, project);
  check(title(html) === escapeHtml(pm.title), `${file}: title`);
  check(metaContent(html, "description") === escapeHtml(pm.description), `${file}: description`);
  check(canonical(html) === absoluteUrl(content, pm.path), `${file}: canonical`);
  check(metaContent(html, "og:type") === "article", `${file}: og:type`);
  check(html.includes('src="/assets/index-'), `${file}: app script missing`);
}
if (existsSync(join(dist, "404.html"))) {
  const html = read("404.html");
  check(/<meta name="robots" content="noindex"/.test(html), "404.html has no noindex");
  check(
    canonical(html) === undefined && !html.includes("og:"),
    "404.html has canonical or OG tags",
  );
} else check(false, "404.html is missing");

// ---- robots.txt and sitemap.xml (R7) ----
const robots = read("robots.txt");
check(/^User-agent: \*\nAllow: \//.test(robots), "robots.txt must allow all");
check(
  robots.includes(`Sitemap: ${absoluteUrl(content, "/sitemap.xml")}`),
  "robots.txt: sitemap line",
);
const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
const wanted = [
  absoluteUrl(content, "/"),
  ...featured.map((p) => absoluteUrl(content, projectMeta(content, p).path)),
];
check(JSON.stringify(locs) === JSON.stringify(wanted), `sitemap URLs differ: ${locs.join(", ")}`);
check(
  sitemap.startsWith("<?xml") &&
    sitemap.includes("</urlset>") &&
    (sitemap.match(/<url>/g)?.length ?? 0) === (sitemap.match(/<\/url>/g)?.length ?? 0),
  "sitemap.xml is not well formed",
);

// ---- Preloads (R10) ----
for (const font of ["inter-latin-wght-normal", "jetbrains-mono-latin-wght-normal"]) {
  const match = new RegExp(
    `<link rel="preload" href="(/assets/${font}-[^"]+\\.woff2)" as="font" type="font/woff2" crossorigin />`,
  ).exec(home);
  check(match !== null && existsSync(join(dist, match[1])), `font preload for ${font}`);
}
const featuresLink =
  /<link rel="modulepreload" crossorigin href="(\/assets\/motionFeatures-[^"]+)"/.exec(home);
check(
  featuresLink !== null && existsSync(join(dist, featuresLink[1])),
  "motionFeatures modulepreload",
);

// ---- Images (R5, R17) ----
const og = pngSize(join(dist, "og/og-default.png"));
check(og?.width === 1200 && og.height === 630, "OG image must be 1200x630");
check((og?.bytes ?? Infinity) <= 300 * 1024, "OG image is larger than 300 KB");
const touch = pngSize(join(dist, "apple-touch-icon.png"));
check(touch?.width === 180 && touch.height === 180, "apple-touch-icon must be 180x180");
const fav = pngSize(join(dist, "favicon-32x32.png"));
check(fav?.width === 32 && fav.height === 32, "favicon-32x32.png must be 32x32");

// ---- vercel.json (R14, R16) ----
type Rule = { source: string; headers: { key: string; value: string }[] };
const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8")) as {
  cleanUrls?: boolean;
  trailingSlash?: boolean;
  rewrites?: unknown[];
  headers: Rule[];
};
const headerOf = (source: string, key: string): string | undefined =>
  vercel.headers.find((rule) => rule.source === source)?.headers.find((h) => h.key === key)?.value;
check(
  vercel.cleanUrls === true && vercel.trailingSlash === false,
  "vercel.json: cleanUrls/trailingSlash",
);
check(vercel.rewrites === undefined, "vercel.json must have no rewrites (unknown paths get a 404)");
check(headerOf("/(.*)", "X-Content-Type-Options") === "nosniff", "header X-Content-Type-Options");
check(
  headerOf("/(.*)", "Referrer-Policy") === "strict-origin-when-cross-origin",
  "header Referrer-Policy",
);
const permissions = headerOf("/(.*)", "Permissions-Policy") ?? "";
for (const feature of ["camera", "microphone", "geolocation", "payment", "usb"]) {
  check(permissions.includes(`${feature}=()`), `Permissions-Policy: ${feature}`);
}
check(
  headerOf("/(.*)", "Cache-Control") === "public, max-age=0, must-revalidate",
  "header Cache-Control for HTML",
);
check(
  headerOf("/assets/(.*)", "Cache-Control") === "public, max-age=31536000, immutable",
  "header Cache-Control for /assets",
);
check(headerOf("/(images|og)/(.*)", "Cache-Control") === "public, max-age=86400", "images cache");
const csp = headerOf("/(.*)", "Content-Security-Policy") ?? "";
for (const part of [
  "default-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "frame-ancestors 'none'",
]) {
  check(csp.includes(part), `CSP: missing ${part}`);
}
const inline = [...home.matchAll(/<script>([\s\S]*?)<\/script>/g)];
check(inline.length === 1, `expected 1 inline script, found ${inline.length}`);
const hash = createHash("sha256")
  .update(inline[0]?.[1] ?? "")
  .digest("base64");
check(
  csp.includes(`'sha256-${hash}'`),
  `CSP hash is out of date: the theme script is now 'sha256-${hash}' (update vercel.json)`,
);

// ---- Main JS budget (R9) ----
const entry = /<script type="module" crossorigin src="(\/assets\/index-[^"]+\.js)"/.exec(home)?.[1];
if (entry) {
  const kb = gzipSync(readFileSync(join(dist, entry))).length / 1000;
  console.log(
    `Main JS: ${kb.toFixed(2)} kB gzip (budget ${MAIN_JS_BUDGET_KB.toFixed(1)}, "vite build" prints about 1 % more)`,
  );
  check(
    kb <= MAIN_JS_BUDGET_KB,
    `main JS is ${kb.toFixed(2)} kB gzip, budget ${MAIN_JS_BUDGET_KB}`,
  );
} else check(false, "main script tag not found in index.html");

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} dist check(s) failed.`);
  process.exitCode = 1;
} else console.log("✓ dist checks passed");
