// Makes the Open Graph image and the icons with a headless browser (Edge or Chrome), no extra dependency.
// Run: npm run images. Outputs are committed; run it again only when the design or content changes.
// Set BROWSER_PATH to use another browser.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { content } from "../src/data/content.ts";
import { initials } from "../src/lib/format.ts";
import type { Project } from "../src/types/content.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const work = mkdtempSync(join(tmpdir(), "portfolio-images-"));

const browser = [
  process.env.BROWSER_PATH,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((path) => path && existsSync(path));
if (!browser) throw new Error("No Edge or Chrome found. Set BROWSER_PATH to the browser file.");

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fileUrl = (...parts: string[]): string => pathToFileURL(join(root, ...parts)).href;

/** Screenshots an HTML string at the given size into `out` and checks the PNG size. */
function shoot(name: string, html: string, width: number, height: number, out: string): void {
  const page = join(work, `${name}.html`);
  writeFileSync(page, html);
  mkdirSync(dirname(out), { recursive: true });
  execFileSync(
    browser as string,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--default-background-color=00000000",
      `--user-data-dir=${join(work, `profile-${name}`)}`,
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      pathToFileURL(page).href,
    ],
    { stdio: "ignore" },
  );
  const png = readFileSync(out);
  const size = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
  if (size.width !== width || size.height !== height) {
    throw new Error(`${out} is ${size.width}x${size.height}, expected ${width}x${height}`);
  }
  console.log(`✓ ${out.slice(root.length)} ${width}x${height}, ${png.length} bytes`);
}

// ---- Open Graph image (dark look, colors read from the .dark block in index.css) ----
const css = readFileSync(join(root, "src/styles/index.css"), "utf8");
const darkTokens = /\.dark \{([\s\S]*?)\n\}/.exec(css)?.[1];
if (!darkTokens) throw new Error("Could not find the .dark token block in src/styles/index.css");
const { profile } = content;
const stats = profile.stats.slice(0, 3);
const font = (pkg: string, file: string): string =>
  fileUrl("node_modules", "@fontsource-variable", pkg, "files", file);

const chip = (projectId: string | undefined): string => {
  const projects: readonly Project[] = content.projects;
  const project = projects.find((p) => p.id === projectId);
  return project ? `<div class="c">${esc(project.shortTitle ?? project.title)}</div>` : "";
};

const ogHtml = `<!doctype html><html class="dark"><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(${font("inter", "inter-latin-wght-normal.woff2")});font-weight:100 900}
@font-face{font-family:Mono;src:url(${font("jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2")});font-weight:100 800}
.dark{${darkTokens}}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:var(--background);color:var(--foreground);font-family:Inter;position:relative;padding:72px 80px}
.rel{position:relative}
.top{display:flex;align-items:center;gap:16px}
.mono{width:56px;height:56px;border-radius:12px;background:var(--surface);color:var(--foreground);display:grid;place-items:center;font:600 24px Inter,sans-serif;letter-spacing:-.02em;border:1px solid var(--border)}
.host{font:500 22px Mono;color:var(--muted);letter-spacing:.02em}
h1{margin-top:64px;font-size:88px;font-weight:650;letter-spacing:-.04em;line-height:1}
.title{margin-top:16px;font-size:40px;font-weight:500;color:var(--foreground);letter-spacing:-.01em}
.stats{position:absolute;left:80px;right:80px;bottom:64px;display:grid;grid-template-columns:repeat(3,1fr);gap:32px;border-top:1px solid var(--border);padding-top:28px}
.v{font:600 44px Mono;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.c{font:500 16px Mono;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;margin-bottom:8px}
.l{margin-top:6px;font-size:20px;color:var(--muted);line-height:1.35}
</style></head><body>
<div class="rel top"><div class="mono">${esc(initials(profile.name))}</div><div class="host">${esc(profile.availability)}</div></div>
<h1 class="rel">${esc(profile.name)}</h1><p class="rel title">${esc(profile.title)}</p>
<div class="stats">${stats.map((s) => `<div>${chip(s.projectId)}<div class="v">${esc(s.value)}</div><div class="l">${esc(s.label)}</div></div>`).join("")}</div>
</body></html>`;
shoot("og", ogHtml, 1200, 630, join(root, "public/og/og-default.png"));

// ---- Icons: public/favicon.svg is written from the initials of the profile name ----
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#0d7064"/><text x="32" y="43" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="#ffffff">${esc(initials(profile.name))}</text></svg>
`;
writeFileSync(join(root, "public/favicon.svg"), svg);
const iconPage = (markup: string, size: number): string =>
  `<!doctype html><html><head><style>*{margin:0}html,body{width:${size}px;height:${size}px;overflow:hidden}svg{display:block;width:${size}px;height:${size}px}</style></head><body>${markup}</body></html>`;
shoot("favicon", iconPage(svg, 32), 32, 32, join(root, "public/favicon-32x32.png"));
// iOS rounds the corners itself, so the touch icon is a full square.
const square = svg.replace('rx="12"', 'rx="0"');
if (square === svg) throw new Error('favicon.svg has no rx="12" to square off');
shoot("touch", iconPage(square, 180), 180, 180, join(root, "public/apple-touch-icon.png"));
