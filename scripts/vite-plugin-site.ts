// Build-time SEO files, generated from src/data/content.ts (one source of truth):
// the <head> tags, JSON-LD, font preloads, robots.txt, sitemap.xml, 404.html and projects/<id>.html.
import type { Plugin } from "vite";
import { content } from "../src/data/content.ts";
import {
  OG_IMAGE_PATH,
  OG_IMAGE_SIZE,
  absoluteUrl,
  homeMeta,
  notFoundMeta,
  ogImageAlt,
  projectMeta,
  type PageMeta,
} from "../src/lib/meta.ts";
import { getFeaturedProjects } from "../src/lib/projects.ts";

/** Marker in index.html where the generated head tags go. */
const MARKER = "<!-- site-head -->";

const escapeHtml = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const metaTag = (attr: "name" | "property", key: string, value: string): string =>
  `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;

/** Title, description, canonical, Open Graph and Twitter tags for one page. */
function pageHead(meta: PageMeta, type: "website" | "article"): string {
  const url = absoluteUrl(content, meta.path);
  const image = absoluteUrl(content, OG_IMAGE_PATH);
  const alt = ogImageAlt(content);
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    metaTag("name", "description", meta.description),
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    metaTag("property", "og:type", type),
    metaTag("property", "og:site_name", content.profile.name),
    metaTag("property", "og:title", meta.title),
    metaTag("property", "og:description", meta.description),
    metaTag("property", "og:url", url),
    metaTag("property", "og:image", image),
    metaTag("property", "og:image:width", String(OG_IMAGE_SIZE.width)),
    metaTag("property", "og:image:height", String(OG_IMAGE_SIZE.height)),
    metaTag("property", "og:image:alt", alt),
    metaTag("name", "twitter:card", "summary_large_image"),
    metaTag("name", "twitter:title", meta.title),
    metaTag("name", "twitter:description", meta.description),
    metaTag("name", "twitter:image", image),
    metaTag("name", "twitter:image:alt", alt),
    metaTag("name", "author", content.profile.name),
  ].join("\n    ");
}

/** schema.org Person + WebSite. */
export function jsonLd(): object {
  const { site, profile } = content;
  const personId = absoluteUrl(content, "/#person");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        jobTitle: profile.title,
        description: profile.summary,
        url: absoluteUrl(content, "/"),
        email: `mailto:${profile.email}`,
        sameAs: [profile.links.github, profile.links.linkedin],
        worksFor: content.experience
          .filter((job) => job.period.end === "present")
          .map((job) => ({ "@type": "Organization", name: job.organization })),
        alumniOf: content.education.map((degree) => ({
          "@type": "CollegeOrUniversity",
          name: degree.institution,
        })),
        homeLocation: { "@type": "Place", name: profile.location },
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl(content, "/#website"),
        url: absoluteUrl(content, "/"),
        name: site.title,
        description: site.description,
        inLanguage: site.language,
        author: { "@id": personId },
      },
    ],
  };
}

const jsonLdTag = (): string =>
  `<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, "\u003c")}</script>`;

export function site(): Plugin {
  const featured = getFeaturedProjects(content.projects);
  const homeHead = (): string => `${pageHead(homeMeta(content), "website")}\n    ${jsonLdTag()}`;

  return {
    name: "site-seo",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!html.includes(MARKER)) throw new Error(`index.html is missing ${MARKER}`);
        let head = homeHead();
        if (ctx.bundle) {
          const files = Object.values(ctx.bundle);
          const font = (name: string): string => {
            const file = files.find((f) => f.type === "asset" && f.fileName.includes(name));
            if (!file) throw new Error(`Font ${name} not found in the bundle (preload)`);
            return `<link rel="preload" href="/${file.fileName}" as="font" type="font/woff2" crossorigin />`;
          };
          const features = files.find(
            (f) => f.type === "chunk" && f.facadeModuleId?.endsWith("/src/lib/motionFeatures.ts"),
          );
          if (!features) throw new Error("motionFeatures chunk not found in the bundle (preload)");
          // The features chunk is needed for the first animation: download it in parallel with the main file.
          head += `\n    ${font("inter-latin-wght-normal")}\n    ${font("jetbrains-mono-latin-wght-normal")}`;
          return html
            .replace(MARKER, () => head)
            .replace(
              "</head>",
              () =>
                `  <link rel="modulepreload" crossorigin href="/${features.fileName}" />\n  </head>`,
            );
        }
        return html.replace(MARKER, () => head);
      },
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const index = bundle["index.html"];
        if (index?.type !== "asset" || typeof index.source !== "string") {
          throw new Error("dist/index.html was not found in the bundle");
        }
        const html = index.source;
        const home = homeHead();
        if (!html.includes(home)) throw new Error("Generated head block not found in index.html");
        const emit = (fileName: string, source: string): void => {
          this.emitFile({ type: "asset", fileName, source });
        };

        // Case study pages: the same app, with their own title, description and canonical tags.
        for (const project of featured) {
          const head = `${pageHead(projectMeta(content, project), "article")}\n    ${jsonLdTag()}`;
          emit(
            `projects/${project.id}.html`,
            html.replace(home, () => head),
          );
        }
        // Served by Vercel with status 404 for unknown paths; the app shows its own "not found" view.
        const missing = notFoundMeta(content, "Page", "/");
        emit(
          "404.html",
          html.replace(
            home,
            () =>
              `<title>${escapeHtml(missing.title)}</title>\n    <meta name="robots" content="noindex" />`,
          ),
        );

        emit(
          "robots.txt",
          `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(content, "/sitemap.xml")}\n`,
        );
        const lastmod = new Date().toISOString().slice(0, 10);
        const paths = ["/", ...featured.map((p) => projectMeta(content, p).path)];
        const urls = paths
          .map(
            (path) =>
              `  <url><loc>${escapeHtml(absoluteUrl(content, path))}</loc><lastmod>${lastmod}</lastmod></url>`,
          )
          .join("\n");
        emit(
          "sitemap.xml",
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        );
      },
    },
  };
}
